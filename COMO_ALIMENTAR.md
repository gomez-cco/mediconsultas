# Cómo alimentar a MEDICONSULTAS con más información

MEDICONSULTAS responde solo con lo que está escrito en `data/`. Para que sepa más, se agregan
**fichas** (síntomas o enfermedades) o **conceptos** (glosario). Todo se puede hacer desde el
navegador en GitHub: al guardar, Render vuelve a publicar la app sola en 2 o 3 minutos.

## 1. Saber qué le falta

En **Render → mediconsultas → Logs** busca:

- `[SIN_RESPUESTA]`: preguntas que no supo responder.
- `[FEEDBACK_NO_UTIL]`: respuestas marcadas con 👎.
- `[FEEDBACK_UTIL]`: respuestas marcadas con 👍.

## 2. Agregar una ficha (síntoma o enfermedad)

Abre el archivo del área en `data/areas/` (por ejemplo `dermatologia.json`), haz clic en el lápiz ✏️
y agrega dentro de `"temas": [ ... ]` (con una coma después de la ficha anterior):

```json
{
  "id": "identificador-unico-sin-espacios",
  "titulo": "Nombre visible de la ficha",
  "temas": ["frases como las escribiria la gente", "me salio tal cosa", "me duele tal parte"],
  "resumen": "Descripción corta en 1 frase.",
  "sintomas": "Síntomas y causas frecuentes, en lenguaje simple.",
  "autocuidado": ["Qué puede hacer en casa", "Otra medida segura"],
  "consultar": ["Cuándo pedir hora", "Cuándo ir a urgencia"],
  "alarmas": ["Señal de alarma 1", "Señal de alarma 2"],
  "dondeAcudir": ["CESFAM o médico general", "Urgencia o SAMU 131 ante señales de alarma"]
}
```

- Lo que más pesa en la búsqueda son las frases de `"temas"`: escríbelas en **minúsculas y sin tildes**,
  como las escribiría una persona ("me pica la piel", "me duele la guata").
- Opcionales: `"consejo"` y `"alerta"` (texto que se muestra destacado).

## 3. Agregar un concepto al glosario

En `data/glosario.json` agrega antes del último `]`:

```json
{
  "termino": "Nombre del concepto",
  "alias": ["como lo escribiria la gente", "sigla"],
  "area": "Área",
  "definicion": "Explicación simple en 2 a 4 frases.",
  "base": "Fuente (MINSAL, MedlinePlus, OMS)",
  "tema": "id-de-una-ficha-relacionada-o-null"
}
```

## 4. Si algo se rompe

Si falta una coma o comilla, el JSON queda inválido y Render mostrará el error (la versión anterior
sigue funcionando). Puedes revisarlo en jsonlint.com o pedirle a Claude que agregue las fichas por ti
con la lista de preguntas de los Logs.

## 5. Antes de publicar contenido nuevo

Verifica cada dato con fuentes oficiales (minsal.cl, medlineplus.gov/spanish, who.int/es) e
idealmente con un profesional de la salud.
