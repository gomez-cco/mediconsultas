// MEDICONSULTAS - servidor
// Express + IA (Gemini gratis o Claude) en streaming, con base de conocimiento por áreas médicas.
// Proveedor: si existe GEMINI_API_KEY se usa Gemini (plan gratuito de Google, sin tarjeta);
// si existe ANTHROPIC_API_KEY se usa Claude (pagado); si no hay ninguna, modo demostración.

const path = require("path");
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const AREAS = require("./data/areas");

const PORT = process.env.PORT || 3000;
const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";
const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || ""; // opcional: forzar un modelo
// Modelos de respaldo si no se puede consultar la lista a Google.
const GEMINI_RESPALDOS = ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
const PROVEEDOR = GEMINI_KEY ? "gemini" : process.env.ANTHROPIC_API_KEY ? "claude" : "demo";
const HAS_KEY = PROVEEDOR !== "demo";
const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 4.5 * 1024 * 1024; // por imagen, ya en base64 decodificado
const ALLOWED_MEDIA = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const client = PROVEEDOR === "claude" ? new Anthropic() : null;
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "20mb" }));
app.use(express.static(path.join(__dirname, "public"), { maxAge: "1h" }));

// ---------- utilidades ----------

const normalizar = (t) =>
  String(t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Clasificación rápida por palabras clave (respaldo y para el panel lateral).
function clasificarPorPalabras(texto) {
  const t = normalizar(texto);
  let mejor = null;
  let puntaje = 0;
  for (const area of AREAS) {
    let p = 0;
    for (const palabra of area.palabras) {
      if (t.includes(normalizar(palabra))) p += palabra.includes(" ") ? 2 : 1;
    }
    if (p > puntaje) {
      puntaje = p;
      mejor = area.id;
    }
  }
  return mejor;
}

// Detección de emergencias en el servidor (no depende del modelo).
const EMERGENCIAS = [
  { re: /(dolor|opresion|apreton).{0,25}pecho|pecho.{0,25}(dolor|opresion|apretado)/, msg: "Dolor u opresión en el pecho" },
  { re: /no puedo respirar|me ahogo|me falta (mucho )?el aire|dificultad (para|al) respirar|labios morados/, msg: "Dificultad para respirar" },
  { re: /quitarme la vida|suicid|matarme|no quiero vivir|hacerme dano|autolesion/, msg: "Riesgo de hacerse daño", linea: "*4141" },
  { re: /boca (chueca|torcida)|cara (caida|chueca)|no puedo mover (el|la|un|una) (brazo|pierna)|perdi la fuerza/, msg: "Posible ataque cerebral (ACV)" },
  { re: /convulsion|convulsiona/, msg: "Convulsión" },
  { re: /desmay|perdio el conocimiento|perdi el conocimiento|inconsciente/, msg: "Pérdida de conocimiento" },
  { re: /vomit\w* (con )?sangre|deposiciones? negras|sangrado (abundante|que no para)/, msg: "Sangrado importante" },
  { re: /se me hincha(ron)? (la )?(cara|lengua|labios|garganta)|anafilaxia/, msg: "Reacción alérgica grave" },
  { re: /(peor|mas fuerte) dolor de cabeza de mi vida|dolor de cabeza (subito|explosivo)/, msg: "Dolor de cabeza súbito e intenso" },
  { re: /arana de rincon/, msg: "Posible picadura de araña de rincón" },
  { re: /(bebe|guagua|lactante|recien nacido).{0,40}fiebre|fiebre.{0,40}(bebe|guagua|lactante|recien nacido)/, msg: "Fiebre en lactante" }
];

function detectarEmergencia(texto) {
  const t = normalizar(texto);
  for (const e of EMERGENCIAS) if (e.re.test(t)) return e;
  return null;
}

function baseDeConocimiento() {
  return AREAS.map((a) => {
    const afecciones = a.afecciones
      .map(
        (f) =>
          `- ${f.nombre}\n  Síntomas: ${f.sintomas}\n  Autocuidado: ${f.autocuidado}\n  Cuándo consultar: ${f.consultar}`
      )
      .join("\n");
    return `### ${a.nombre} [id: ${a.id}]\n${a.descripcion}\nSeñales de alarma:\n${a.alarmas
      .map((x) => `- ${x}`)
      .join("\n")}\nAfecciones frecuentes:\n${afecciones}`;
  }).join("\n\n");
}

// El prompt de sistema no cambia entre solicitudes -> se puede cachear.
const SYSTEM_PROMPT = `Eres el asistente de orientación de salud de MEDICONSULTAS, una plataforma chilena que organiza la información médica por áreas (como un buscador por especialidad). Respondes en español de Chile, claro y cercano, a personas sin formación médica.

TU ROL
- Orientas: explicas qué podría estar pasando, qué medidas de autocuidado son seguras, qué señales de alarma vigilar y a qué tipo de atención acudir y con qué urgencia.
- NO diagnosticas con certeza, NO recetas medicamentos con dosis específicas para la persona (puedes mencionar grupos generales como "un analgésico común como paracetamol, según las indicaciones del envase"), y NO reemplazas la consulta médica.
- Si la consulta no es de salud, explica amablemente que MEDICONSULTAS solo responde consultas de salud.

CÓMO RESPONDER
1. Primera línea, obligatoria y exacta, con este formato (sin nada más en la línea):
   [[AREA:<id>|URGENCIA:<nivel>]]
   - <id> es uno de: ${AREAS.map((a) => a.id).join(", ")}.
   - <nivel> es uno de: emergencia (ir a urgencia o llamar al 131 ahora), pronto (consultar en 24-72 horas), control (pedir hora con médico general o especialista), autocuidado (manejo en casa con vigilancia).
2. Si la información es insuficiente, haz como máximo 3 preguntas breves y concretas (por ejemplo: desde cuándo, intensidad del 1 al 10, edad, fiebre, síntomas asociados, enfermedades o medicamentos) y entrega igualmente una orientación preliminar.
3. Estructura con estos subtítulos en negrita (omite los que no apliquen):
   **Lo que podría ser** (2 a 4 posibilidades, de la más probable a la menos, en lenguaje simple)
   **Qué puedes hacer ahora**
   **Señales de alarma** (cuándo ir a urgencia)
   **A quién consultar** (especialidad y urgencia; menciona CESFAM, SAPU/SAR o urgencia según corresponda, y GES si aplica)
4. Sé breve: idealmente menos de 250 palabras. Usa viñetas.
5. Si la persona describe una emergencia, empieza (después de la línea de etiqueta) diciendo que llame al 131 (SAMU) o vaya a la urgencia más cercana, antes que cualquier otra cosa. Si hay riesgo de suicidio o autolesión, entrega con empatía la línea *4141 (Prevención del Suicidio, gratuita, 24 horas) y el 131.
6. En niños, embarazadas, adultos mayores y personas con enfermedades crónicas, sé más prudente con el nivel de urgencia.

IMÁGENES
- Si la persona adjunta una foto (por ejemplo un grano, mancha, herida o el ojo), describe objetivamente lo que ves (color, tamaño aproximado, bordes, si hay pus, enrojecimiento alrededor) y úsalo para orientar, aclarando que una foto no reemplaza el examen presencial.
- Si la imagen no se ve bien o no es médica, dilo y pide otra con buena luz y enfoque.
- Si la imagen es una receta o un examen, puedes explicar en términos generales qué significan los valores, sin cambiar indicaciones médicas.

BASE DE CONOCIMIENTO DE MEDICONSULTAS (úsala como referencia principal, complementada con tu conocimiento médico general basado en evidencia):

${baseDeConocimiento()}

TELÉFONOS ÚTILES EN CHILE
- SAMU (ambulancia): 131
- Salud Responde (orientación 24 h): 600 360 7777
- Línea de Prevención del Suicidio: *4141
- CITUC (intoxicaciones): +56 2 2635 3800
- Bomberos: 132`;

// Límite simple de solicitudes por IP para cuidar el costo de la API.
const LIMITE_POR_HORA = Number(process.env.RATE_LIMIT_PER_HOUR || 30);
const contadores = new Map();
function permitido(ip) {
  const ahora = Date.now();
  const r = contadores.get(ip) || { n: 0, desde: ahora };
  if (ahora - r.desde > 3600_000) {
    r.n = 0;
    r.desde = ahora;
  }
  r.n += 1;
  contadores.set(ip, r);
  return r.n <= LIMITE_POR_HORA;
}
setInterval(() => {
  const ahora = Date.now();
  for (const [ip, r] of contadores) if (ahora - r.desde > 3600_000) contadores.delete(ip);
}, 600_000).unref();

// Convierte el historial enviado por el navegador a mensajes de la API.
function construirMensajes(historial) {
  const mensajes = [];
  for (const m of historial.slice(-12)) {
    if (m.role !== "user" && m.role !== "assistant") continue;
    const texto = String(m.text || "").slice(0, 4000);
    if (m.role === "assistant") {
      if (texto) mensajes.push({ role: "assistant", content: texto });
      continue;
    }
    const contenido = [];
    const imagenes = Array.isArray(m.images) ? m.images.slice(0, MAX_IMAGES) : [];
    for (const img of imagenes) {
      if (!img || !ALLOWED_MEDIA.includes(img.mediaType) || typeof img.data !== "string") continue;
      if (Buffer.byteLength(img.data, "base64") > MAX_IMAGE_BYTES) continue;
      contenido.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.data } });
    }
    let t = texto;
    if (m.area) {
      const a = AREAS.find((x) => x.id === m.area);
      if (a) t = `(Área seleccionada por el usuario: ${a.nombre})\n${t}`;
    }
    contenido.push({ type: "text", text: t || "Adjunto una imagen para consultar." });
    mensajes.push({ role: "user", content: contenido });
  }
  // La API exige que el primer mensaje sea del usuario.
  while (mensajes.length && mensajes[0].role !== "user") mensajes.shift();
  return mensajes;
}

// ---------- Gemini (Google, plan gratuito) ----------

// Convierte los mensajes (formato interno) al formato de Gemini.
function aGemini(mensajes) {
  return mensajes.map((m) => {
    const bloques = typeof m.content === "string" ? [{ type: "text", text: m.content }] : m.content;
    const parts = bloques.map((b) =>
      b.type === "image"
        ? { inline_data: { mime_type: b.source.media_type, data: b.source.data } }
        : { text: b.text }
    );
    return { role: m.role === "assistant" ? "model" : "user", parts };
  });
}

async function llamarGemini(modelo, cuerpo, signal) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:streamGenerateContent?alt=sse`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY },
    body: JSON.stringify(cuerpo),
    signal
  });
}

// Pregunta a Google qué modelos Flash (gratuitos) están disponibles para esta clave.
let modelosCache = null;
let modelosCacheEn = 0;
async function modelosGemini() {
  if (modelosCache && Date.now() - modelosCacheEn < 6 * 3600_000) return modelosCache;
  let lista = [];
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000", {
      headers: { "x-goog-api-key": GEMINI_KEY },
      signal: AbortSignal.timeout(10_000)
    });
    if (r.ok) {
      const j = await r.json();
      lista = (j.models || [])
        .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
        .map((m) => m.name.replace(/^models\//, ""))
        .filter((n) => /^gemini.*flash/.test(n) && !/image|tts|audio|live|embed|robotics|computer|exp/.test(n));
    } else {
      console.warn("No se pudo listar modelos de Gemini:", r.status);
    }
  } catch (e) {
    console.warn("No se pudo listar modelos de Gemini:", e.message);
  }
  // Orden: alias "latest" primero, luego versiones más nuevas; "lite" después del normal.
  const puntaje = (n) =>
    (n.endsWith("-latest") ? 1000 : 0) +
    (parseFloat((n.match(/gemini-(\d+(?:\.\d+)?)/) || [])[1]) || 0) * 10 -
    (n.includes("lite") ? 5 : 0) -
    (n.includes("preview") ? 3 : 0);
  lista.sort((a, b) => puntaje(b) - puntaje(a));
  const orden = [...new Set([GEMINI_MODEL, ...lista, ...GEMINI_RESPALDOS].filter(Boolean))];
  if (lista.length) {
    modelosCache = orden;
    modelosCacheEn = Date.now();
  }
  console.log("Modelos Gemini a usar:", orden.slice(0, 6).join(", "));
  return orden;
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function responderGemini(mensajes, alTexto, signal) {
  const cuerpo = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: aGemini(mensajes),
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.4,
      // Sin "pensamiento" previo: respuestas rápidas y sin gastar el límite de tokens.
      thinkingConfig: { thinkingBudget: 0 }
    }
  };
  // Límite de espera total para no dejar al usuario esperando para siempre.
  const senal = AbortSignal.any([signal, AbortSignal.timeout(90_000)]);
  // Prueba los modelos en orden: si uno no existe (404), está saturado (503/500)
  // o sin cupo (429), pasa al siguiente.
  const candidatos = (await modelosGemini()).slice(0, 5);
  let resp;
  let modelo;
  let ultimoDetalle = "";
  for (let intento = 0; intento < candidatos.length; intento++) {
    modelo = candidatos[intento];
    resp = await llamarGemini(modelo, cuerpo, senal);
    // 400: si no es la clave, reintentar el mismo modelo con configuración mínima.
    if (resp.status === 400) {
      const detalle = await resp.clone().text().catch(() => "");
      if (/API_KEY_INVALID|API key not valid/i.test(detalle)) break;
      console.warn(`Gemini ${modelo} 400: ${detalle.slice(0, 400).replace(/\s+/g, " ")}`);
      resp = await llamarGemini(modelo, { ...cuerpo, generationConfig: { maxOutputTokens: 8192 } }, senal);
    }
    if (resp.ok || ![400, 404, 429, 500, 503].includes(resp.status)) break;
    const detalle = await resp.text().catch(() => "");
    ultimoDetalle = detalle;
    console.warn(`Gemini ${modelo} respondió ${resp.status}; probando otro modelo. ${detalle.slice(0, 120).replace(/\s+/g, " ")}`);
    if (resp.status === 404) modelosCache = null; // la lista puede estar desactualizada
    if (intento < candidatos.length - 1) await esperar(resp.status === 404 ? 0 : 800);
  }
  if (!resp.ok || !resp.body) {
    const detalle = resp.bodyUsed ? ultimoDetalle : await resp.text().catch(() => "");
    const e = new Error(`Gemini ${resp.status}: ${detalle.slice(0, 500)}`);
    e.status = resp.status;
    e.detalle = detalle;
    throw e;
  }
  const lector = resp.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let bloqueado = false;
  let fin = "";
  let caracteres = 0;
  for (;;) {
    const { value, done } = await lector.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const linea = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!linea.startsWith("data:")) continue;
      let d;
      try {
        d = JSON.parse(linea.slice(5));
      } catch {
        continue;
      }
      const cand = d.candidates?.[0];
      for (const part of cand?.content?.parts || []) {
        if (part.text && !part.thought) {
          caracteres += part.text.length;
          alTexto(part.text);
        }
      }
      if (cand?.finishReason) fin = cand.finishReason;
      if (d.promptFeedback?.blockReason || ["SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST"].includes(cand?.finishReason)) bloqueado = true;
    }
  }
  console.log(`Gemini OK modelo=${modelo} fin=${fin || "-"} caracteres=${caracteres}`);
  if (bloqueado || caracteres === 0) {
    alTexto(
      (caracteres ? "\n\n" : "") +
        "No pude completar esta respuesta. Por favor reformula tu consulta con más detalle o llama a Salud Responde: 600 360 7777."
    );
  }
}

// ---------- rutas ----------

app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.get("/api/areas", (_req, res) => res.json({ areas: AREAS, iaActiva: HAS_KEY }));

app.post("/api/consulta", async (req, res) => {
  const historial = Array.isArray(req.body?.historial) ? req.body.historial : [];
  const ultimo = [...historial].reverse().find((m) => m.role === "user");
  if (!ultimo) return res.status(400).json({ error: "Escribe tu consulta." });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
  if (!permitido(ip)) {
    return res.status(429).json({ error: "Has alcanzado el límite de consultas por hora. Intenta más tarde." });
  }

  const emergencia = detectarEmergencia(ultimo.text);
  const areaSugerida = ultimo.area || clasificarPorPalabras(ultimo.text);

  // Respuesta en streaming (texto plano por líneas de eventos SSE).
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
  const enviar = (evento, datos) => res.write(`event: ${evento}\ndata: ${JSON.stringify(datos)}\n\n`);

  enviar("meta", {
    emergencia: emergencia ? { msg: emergencia.msg, linea: emergencia.linea || null } : null,
    areaSugerida
  });

  if (!HAS_KEY) {
    const a = AREAS.find((x) => x.id === areaSugerida) || AREAS[0];
    enviar("delta", {
      text:
        `[[AREA:${a.id}|URGENCIA:${emergencia ? "emergencia" : "control"}]]\n` +
        `**Modo demostración:** la IA aún no está activada (falta configurar GEMINI_API_KEY en Render).\n\n` +
        `Mientras tanto, revisa la ficha del área **${a.nombre}** en el panel izquierdo.\n\n` +
        `**Señales de alarma**\n${a.alarmas.map((x) => `- ${x}`).join("\n")}`
    });
    enviar("fin", {});
    return res.end();
  }

  const mensajes = construirMensajes(historial);
  if (!mensajes.length) {
    enviar("error", { error: "No se pudo leer la consulta." });
    return res.end();
  }

  let cerrado = false;
  res.on("close", () => {
    cerrado = true;
  });

  if (PROVEEDOR === "gemini") {
    const control = new AbortController();
    res.on("close", () => {
      if (!res.writableEnded) control.abort();
    });
    // Mantiene viva la conexión mientras la IA responde.
    const latido = setInterval(() => !cerrado && res.write(": ping\n\n"), 15_000);
    try {
      await responderGemini(mensajes, (t) => !cerrado && enviar("delta", { text: t }), control.signal);
      if (!cerrado) {
        enviar("fin", {});
        res.end();
      }
    } catch (err) {
      if (cerrado) return;
      console.error("Error Gemini:", err.name, err.status, err.message);
      let mensaje = `Hubo un problema al procesar tu consulta (código ${err.status || err.name}). Intenta nuevamente.`;
      if (err.name === "TimeoutError") mensaje = "La IA tardó demasiado en responder. Intenta nuevamente.";
      else if (err.status === 429) mensaje = "Se alcanzó el límite gratuito de consultas de la IA. Espera un minuto e intenta de nuevo.";
      else if (err.status === 503 || err.status === 500) mensaje = "La IA gratuita de Google está saturada en este momento. Intenta nuevamente en unos minutos.";
      else if (/API_KEY_INVALID|API key not valid/i.test(err.detalle || "")) mensaje = "La clave de la IA no es válida. Revisa GEMINI_API_KEY en Render.";
      else if (err.status === 403) mensaje = "La clave de la IA no tiene permiso para Gemini. Revisa GEMINI_API_KEY en Render.";
      else {
        // Mostrar el motivo que entrega Google para poder diagnosticar.
        let motivo = "";
        try {
          motivo = JSON.parse(err.detalle || "{}").error?.message || "";
        } catch {}
        if (motivo) mensaje += ` Detalle: ${motivo.slice(0, 200)}`;
      }
      enviar("error", { error: mensaje });
      res.end();
    } finally {
      clearInterval(latido);
    }
    return;
  }

  try {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: mensajes
    });

    res.on("close", () => {
      if (!res.writableEnded) stream.abort();
    });

    for await (const event of stream) {
      if (cerrado) break;
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        enviar("delta", { text: event.delta.text });
      }
    }
    if (!cerrado) {
      const final = await stream.finalMessage();
      if (final.stop_reason === "refusal") {
        enviar("delta", {
          text: "\n\nNo pude completar esta respuesta. Por favor reformula tu consulta o llama a Salud Responde: 600 360 7777."
        });
      }
      enviar("fin", {});
      res.end();
    }
  } catch (err) {
    if (cerrado) return;
    let mensaje = "Hubo un problema al procesar tu consulta. Intenta nuevamente.";
    if (err instanceof Anthropic.AuthenticationError) mensaje = "La clave de la IA no es válida. Revisa ANTHROPIC_API_KEY en Render.";
    else if (err instanceof Anthropic.RateLimitError) mensaje = "El servicio está ocupado. Intenta en un minuto.";
    else if (err instanceof Anthropic.BadRequestError) mensaje = "No se pudo procesar la consulta (¿imagen demasiado grande o en formato no soportado?).";
    console.error("Error Claude:", err?.status, err?.message);
    enviar("error", { error: mensaje });
    res.end();
  }
});

app.listen(PORT, () => {
  if (PROVEEDOR === "gemini") modelosGemini().catch(() => {});
  console.log(`MEDICONSULTAS escuchando en puerto ${PORT} (IA: ${PROVEEDOR})`);
});
