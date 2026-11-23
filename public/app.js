// MEDICONSULTAS - lógica del navegador
(() => {
  const $ = (s) => document.querySelector(s);
  const listaAreas = $("#listaAreas");
  const filtro = $("#filtroAreas");
  const inicio = $("#inicio");
  const ficha = $("#fichaArea");
  const chat = $("#chat");
  const form = $("#form");
  const texto = $("#texto");
  const enviarBtn = $("#enviar");
  const archivo = $("#archivo");
  const previews = $("#previews");
  const areaElegidaEl = $("#areaElegida");

  let AREAS = [];
  let areaElegida = null; // id de área seleccionada para la consulta
  let imagenes = []; // { mediaType, data, url }
  const historial = []; // { role, text, images?, area? }
  let ocupado = false;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Markdown mínimo y seguro (escapa primero).
  function md(src) {
    const lineas = esc(src).split("\n");
    let html = "";
    let lista = null;
    const inline = (t) =>
      t.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<i>$2</i>");
    const cerrar = () => {
      if (lista) html += `</${lista}>`;
      lista = null;
    };
    for (const l of lineas) {
      let m;
      if ((m = l.match(/^\s*[-•*]\s+(.*)/))) {
        if (lista !== "ul") { cerrar(); html += "<ul>"; lista = "ul"; }
        html += `<li>${inline(m[1])}</li>`;
      } else if ((m = l.match(/^\s*\d+[.)]\s+(.*)/))) {
        if (lista !== "ol") { cerrar(); html += "<ol>"; lista = "ol"; }
        html += `<li>${inline(m[1])}</li>`;
      } else if ((m = l.match(/^#{1,4}\s+(.*)/))) {
        cerrar();
        html += `<h4>${inline(m[1])}</h4>`;
      } else if (l.trim() === "") {
        cerrar();
      } else {
        cerrar();
        html += `<p>${inline(l)}</p>`;
      }
    }
    cerrar();
    return html;
  }

  const NIVELES = {
    emergencia: "🚨 Emergencia",
    pronto: "⏱️ Consultar pronto",
    control: "📅 Pedir hora",
    autocuidado: "🏠 Autocuidado"
  };

  // ---------- áreas ----------
  function pintarAreas() {
    const q = filtro.value.toLowerCase();
    listaAreas.innerHTML = "";
    for (const a of AREAS) {
      if (q && !(a.nombre.toLowerCase().includes(q) || a.descripcion.toLowerCase().includes(q))) continue;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "area-btn";
      b.innerHTML = `<span class="ico">${a.icono}</span><span>${esc(a.nombre)}</span>`;
      b.setAttribute("aria-current", String(a.id === areaElegida));
      b.onclick = () => mostrarFicha(a.id);
      listaAreas.appendChild(b);
    }
  }

  function mostrarFicha(id) {
    const a = AREAS.find((x) => x.id === id);
    if (!a) return;
    elegirArea(id);
    inicio.hidden = true;
    ficha.hidden = false;
    ficha.innerHTML = `
      <div class="ficha-head"><span class="ico">${a.icono}</span><h2>${esc(a.nombre)}</h2></div>
      <p class="desc">${esc(a.descripcion)}</p>
      <div class="alarmas"><h3>🚨 Acude a urgencia o llama al 131 si:</h3>
        <ul>${a.alarmas.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div class="afecciones">
        ${a.afecciones
          .map(
            (f) => `<details class="afeccion"><summary>${esc(f.nombre)}</summary><div>
              <p><b>Síntomas:</b> ${esc(f.sintomas)}</p>
              <p><b>Qué hacer:</b> ${esc(f.autocuidado)}</p>
              <p><b>Cuándo consultar:</b> ${esc(f.consultar)}</p></div></details>`
          )
          .join("")}
      </div>
      <div class="acciones"><button type="button" class="btn-sec" id="cerrarFicha">Ocultar ficha</button></div>`;
    $("#cerrarFicha").onclick = () => {
      ficha.hidden = true;
      if (!historial.length) inicio.hidden = false;
    };
    texto.placeholder = `Consulta sobre ${a.nombre.toLowerCase()}…`;
    texto.focus();
  }

  function elegirArea(id) {
    areaElegida = id;
    const a = AREAS.find((x) => x.id === id);
    if (a) {
      areaElegidaEl.hidden = false;
      areaElegidaEl.innerHTML = `Consultando en: <b>${a.icono} ${esc(a.nombre)}</b> <button type="button" aria-label="Quitar área">✕</button>`;
      areaElegidaEl.querySelector("button").onclick = () => {
        areaElegida = null;
        areaElegidaEl.hidden = true;
        texto.placeholder = "Describe tu síntoma…";
        pintarAreas();
      };
    }
    pintarAreas();
  }

  // ---------- imágenes ----------
  function redimensionar(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const max = 1568;
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        const dataUrl = c.toDataURL("image/jpeg", 0.85);
        URL.revokeObjectURL(url);
        resolve({ mediaType: "image/jpeg", data: dataUrl.split(",")[1], url: dataUrl });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo leer la imagen"));
      };
      img.src = url;
    });
  }

  archivo.addEventListener("change", async () => {
    for (const f of archivo.files) {
      if (imagenes.length >= 3) {
        alert("Puedes adjuntar hasta 3 imágenes por consulta.");
        break;
      }
      if (!f.type.startsWith("image/")) continue;
      try {
        imagenes.push(await redimensionar(f));
      } catch (e) {
        alert(e.message);
      }
    }
    archivo.value = "";
    pintarPreviews();
  });

  function pintarPreviews() {
    previews.innerHTML = "";
    imagenes.forEach((im, i) => {
      const d = document.createElement("div");
      d.className = "prev";
      d.innerHTML = `<img src="${im.url}" alt="Imagen adjunta ${i + 1}"><button type="button" aria-label="Quitar imagen">✕</button>`;
      d.querySelector("button").onclick = () => {
        imagenes.splice(i, 1);
        pintarPreviews();
      };
      previews.appendChild(d);
    });
  }

  // ---------- chat ----------
  function agregarUsuario(t, imgs) {
    const d = document.createElement("div");
    d.className = "msg user";
    d.innerHTML = imgs.map((im) => `<img src="${im.url}" alt="Imagen enviada">`).join("") + `<div>${esc(t)}</div>`;
    chat.appendChild(d);
    d.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  function alertaEmergencia(e) {
    const d = document.createElement("div");
    d.className = "alerta";
    const linea = e.linea
      ? `Llama a la <a href="tel:*4141">Línea de Prevención del Suicidio *4141</a> (gratis, 24 h) o al <a href="tel:131">131</a>. No estás solo/a.`
      : `Si es grave o empeora, llama ahora al <a href="tel:131">131 (SAMU)</a> o ve a la urgencia más cercana.`;
    d.innerHTML = `🚨 ${esc(e.msg)}. ${linea}`;
    return d;
  }

  function renderBot(el, crudo) {
    const m = crudo.match(/^\s*\[\[AREA:([\w-]+)\|URGENCIA:(\w+)\]\]\s*/);
    let cuerpo = crudo;
    let etiquetas = "";
    if (m) {
      cuerpo = crudo.slice(m[0].length);
      const a = AREAS.find((x) => x.id === m[1]);
      const nivel = m[2].toLowerCase();
      if (a) etiquetas += `<button type="button" class="tag" data-area="${a.id}">${a.icono} ${esc(a.nombre)}</button>`;
      if (NIVELES[nivel]) etiquetas += `<span class="tag ${nivel}">${NIVELES[nivel]}</span>`;
    } else if (/^\s*\[\[/.test(crudo) && !crudo.includes("]]")) {
      cuerpo = ""; // etiqueta aún incompleta durante el streaming
    }
    el.innerHTML = (etiquetas ? `<div class="etiquetas">${etiquetas}</div>` : "") + md(cuerpo);
    el.querySelectorAll("[data-area]").forEach((b) => (b.onclick = () => mostrarFicha(b.dataset.area)));
    return cuerpo;
  }

  async function consultar(t) {
    if (ocupado) return;
    t = t.trim();
    if (!t && !imagenes.length) return;
    ocupado = true;
    enviarBtn.disabled = true;
    inicio.hidden = true;
    ficha.hidden = true;

    const imgs = imagenes;
    imagenes = [];
    pintarPreviews();
    agregarUsuario(t || "(imagen adjunta)", imgs);
    historial.push({
      role: "user",
      text: t,
      area: areaElegida || undefined,
      images: imgs.map(({ mediaType, data }) => ({ mediaType, data }))
    });
    texto.value = "";
    autoAlto();

    const burbuja = document.createElement("div");
    burbuja.className = "msg bot escribiendo";
    chat.appendChild(burbuja);
    burbuja.scrollIntoView({ behavior: "smooth", block: "end" });

    let crudo = "";
    try {
      const resp = await fetch("/api/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historial })
      });
      if (!resp.ok || !resp.body) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error || "No se pudo conectar con el servidor.");
      }
      const lector = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await lector.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n\n")) >= 0) {
          const bloque = buf.slice(0, i);
          buf = buf.slice(i + 2);
          const ev = (bloque.match(/^event: (.*)$/m) || [])[1];
          const dat = (bloque.match(/^data: (.*)$/m) || [])[1];
          if (!ev || !dat) continue;
          const d = JSON.parse(dat);
          if (ev === "meta" && d.emergencia) chat.insertBefore(alertaEmergencia(d.emergencia), burbuja);
          if (ev === "delta") {
            crudo += d.text;
            renderBot(burbuja, crudo);
          }
          if (ev === "error") throw new Error(d.error);
        }
      }
      if (!crudo.trim()) throw new Error("No llegó respuesta de la IA. Intenta nuevamente en unos segundos.");
      // Imágenes ya enviadas: no reenviarlas en cada turno (ahorra costo).
      historial[historial.length - 1].images = [];
      historial.push({ role: "assistant", text: crudo });
    } catch (e) {
      historial.pop();
      burbuja.innerHTML = `<p class="error">⚠️ ${esc(e.message)}</p>`;
    } finally {
      burbuja.classList.remove("escribiendo");
      ocupado = false;
      enviarBtn.disabled = false;
      texto.focus();
    }
  }

  function autoAlto() {
    texto.style.height = "auto";
    texto.style.height = Math.min(texto.scrollHeight, 160) + "px";
  }

  texto.addEventListener("input", autoAlto);
  texto.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    consultar(texto.value);
  });
  $("#ejemplos").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") consultar(e.target.textContent);
  });
  filtro.addEventListener("input", pintarAreas);

  fetch("/api/areas")
    .then((r) => r.json())
    .then((j) => {
      AREAS = j.areas;
      pintarAreas();
    })
    .catch(() => (listaAreas.textContent = "No se pudieron cargar las áreas."));
})();
