# MEDICONSULTAS

Orientación médica por áreas (al estilo de un buscador legal por materias), con IA **gratuita** de Google Gemini (opcionalmente Claude).

- **Áreas médicas:** Medicina General, Broncopulmonar, Cardiología, Gastroenterología, Traumatología, Dermatología, Neurología, Otorrino, Oftalmología, Urología, Ginecología, Pediatría, Geriatría, Endocrinología, Salud Mental, Infectología, Reumatología y Odontología. Cada una tiene una ficha con señales de alarma y afecciones frecuentes.
- **Consultas puntuales:** "tengo dolor en la rodilla", "me salió un grano rojo"… La IA clasifica el área, marca el nivel de urgencia (emergencia / pronto / pedir hora / autocuidado) y orienta.
- **Fotos:** se pueden adjuntar hasta 3 imágenes por consulta (desde el celular abre la cámara).
- **Seguridad:** detección de emergencias en el servidor (dolor de pecho, ACV, ideas suicidas → 131 / *4141), aviso legal y límite de consultas por hora.

## Publicar en Render (una sola vez)

1. Entrar a https://render.com e iniciar sesión con GitHub.
2. **New + → Blueprint** → elegir el repositorio `mediconsultas` (rama `main`).
3. Render lee `render.yaml` y pide el valor de `GEMINI_API_KEY`: pegar la clave gratuita creada en https://aistudio.google.com/apikey (solo requiere cuenta de Google, sin tarjeta).
4. **Apply**. En 2-3 minutos queda la URL pública `https://mediconsultas-xxxx.onrender.com`.

Sin la clave la app funciona en **modo demostración** (muestra las fichas y alarmas, pero sin IA).

> **Costo $0:** Render plan Free + Gemini plan gratuito. Si Google o Render piden tarjeta, no es necesario para estos planes.
> En el plan gratuito de Gemini, Google puede usar las consultas para mejorar sus productos: no pedir a los usuarios datos personales (nombre, RUT).

> Plan gratuito de Render: el servicio "se duerme" tras 15 minutos sin uso y tarda ~50 s en despertar.

## Ejecutar en el computador

```bash
git clone https://github.com/gomez-cco/mediconsultas.git && cd mediconsultas
npm install
GEMINI_API_KEY=tu_clave npm start
# abrir http://localhost:3000
```

## Variables

| Variable | Uso |
|---|---|
| `GEMINI_API_KEY` | Clave gratuita de Google AI Studio (IA sin costo, con límite diario) |
| `GEMINI_MODEL` | Opcional: forzar un modelo de Gemini. Por defecto la app pregunta a Google qué modelos Flash hay y, si uno está saturado, prueba el siguiente |
| `ANTHROPIC_API_KEY` | Opcional, de pago: usar Claude en vez de Gemini (solo si no hay `GEMINI_API_KEY`) |
| `CLAUDE_MODEL` | Modelo de Claude (por defecto `claude-opus-5-5`) |
| `RATE_LIMIT_PER_HOUR` | Consultas por hora por IP (por defecto 30) |

## Ampliar el conocimiento

Editar `data/areas.js`: agregar áreas, afecciones, palabras clave o señales de alarma. Todo se refleja en las fichas y en lo que sabe la IA.
Usar solo contenido propio o de fuentes abiertas (MINSAL, MedlinePlus, OMS); no copiar libros con derechos de autor.

## Aviso

MEDICONSULTAS entrega orientación general y no reemplaza la consulta médica. Las imágenes no se guardan en el servidor.
