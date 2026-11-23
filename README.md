# MEDICONSULTAS by JJ

Orientador de salud **sin costo y sin API externa**, con la misma dinámica que BUSCALEGAL y ALLEXCEL:
un motor de búsqueda propio (`lib/engine.js`) que responde con fichas escritas en `data/`.

- **18 áreas de la medicina** (Medicina General, Broncopulmonar, Cardiología, Gastroenterología, Traumatología,
  Dermatología, Neurología, Otorrino, Oftalmología, Urología, Ginecología, Pediatría, Geriatría, Endocrinología,
  Salud Mental, Infectología, Reumatología, Odontología) con 71 fichas.
- Cada ficha: qué podría ser, qué puedes hacer ahora, cuándo consultar, señales de alarma y dónde atenderte.
- **Emergencias**: detecta dolor de pecho, ACV, dificultad para respirar, ideas suicidas, fiebre en guaguas, etc.,
  y muestra primero el 131 / *4141.
- **Glosario médico** ("¿qué es la TSH?", "¿qué es el GES?") y **teléfonos de emergencia**.
- Botones de **actualizar, A−, A+ y modo claro/oscuro**; se puede instalar en el celular (PWA).
- Tolera errores de tipeo, plurales y tildes. No guarda datos personales.

## Publicar en Render

Ya está conectado por `render.yaml` (plan Free). Cada cambio en la rama `main` se publica solo en 2-3 minutos.
No necesita ninguna clave ni variable de entorno.

## Ejecutar en el computador

```bash
npm start      # http://localhost:3000
npm test       # pruebas: cada pregunta típica debe llegar a la ficha correcta
```

## Ampliar el conocimiento

Ver [COMO_ALIMENTAR.md](COMO_ALIMENTAR.md).

## Aviso

Orientación general de salud basada en guías del MINSAL (GES), MedlinePlus en español y la OMS.
No reemplaza la evaluación de un médico. En una emergencia: 131.
