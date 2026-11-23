'use strict';

const fs = require('fs');
const path = require('path');

const AREAS_DIR = path.join(__dirname, '..', 'data', 'areas');
const AREA_ORDER = ['medicina-general', 'broncopulmonar', 'cardiologia', 'gastroenterologia', 'traumatologia', 'dermatologia', 'neurologia', 'otorrino', 'oftalmologia', 'urologia', 'ginecologia', 'pediatria', 'geriatria', 'endocrinologia', 'salud-mental', 'infectologia', 'reumatologia', 'odontologia'];

const areas = AREA_ORDER
  .map((id) => path.join(AREAS_DIR, `${id}.json`))
  .filter((p) => fs.existsSync(p))
  .map((p) => JSON.parse(fs.readFileSync(p, 'utf8')));

const GLOSSARY_PATH = path.join(__dirname, '..', 'data', 'glosario.json');
const glossary = fs.existsSync(GLOSSARY_PATH) ? JSON.parse(fs.readFileSync(GLOSSARY_PATH, 'utf8')) : [];

const ASSISTANT_NAME = 'MEDICONSULTAS';

const DISCLAIMER = 'Orientación general de salud. No reemplaza la evaluación de un médico o profesional de la salud que te examine. En una emergencia llama al 131 (SAMU).';

const STOPWORDS = new Set([
  'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'a', 'en', 'con',
  'para', 'por', 'que', 'como', 'se', 'su', 'sus', 'mi', 'mis', 'me', 'te', 'lo', 'le', 'les',
  'al', 'del', 'es', 'son', 'ser', 'esta', 'este', 'estos', 'estas', 'pero', 'si', 'no', 'ya',
  'quiero', 'necesito', 'puedo', 'quisiera', 'hacer', 'tengo', 'tener', 'hola', 'buenas', 'buenos',
  'porfa', 'favor', 'ayuda', 'ayudame', 'dame', 'saber', 'sobre', 'cual', 'cuales', 'cuando',
  'donde', 'debo', 'deben', 'tiene', 'tienen', 'hay', 'muy', 'mas', 'menos', 'tambien', 'solo',
  'estoy', 'esta', 'fue', 'ahora', 'hace', 'dias', 'dia', 'caso', 'consulta', 'pregunta',
  'doctor', 'doctora', 'medico', 'medica', 'salud', 'chile', 'puede', 'pueden', 'algo', 'eso', 'esto',
  'duele', 'duelen', 'dolor', 'dolores', 'siento', 'sentir', 'molestia', 'molesta', 'poco', 'mucho', 'harto',
  'cosa', 'nos', 'nosotros', 'ellos', 'ella', 'usted', 'ustedes', 'mio', 'mia', 'tu', 'tus',
]);

// Palabras que indican el área médica aunque ninguna frase de ficha calce literalmente.
const AREA_HINTS = Object.fromEntries(areas.map((a) => [a.id, (a.palabras || []).map((w) => normalize(w))]));

const AREA_BROWSE_WORDS = Object.fromEntries(areas.map((a) => [a.id, [normalize(a.titulo), ...normalize(a.titulo).split(/\s+y\s+/)].filter((w) => w.length > 3)]));

// Temas fuera de lo que cubre la base: responder con a dónde acudir.
const OUT_OF_SCOPE = [
  {
    match: ['receta', 'recetame', 'dosis de', 'cuantos mg', 'cuantas pastillas', 'que remedio tomo', 'que medicamento tomo'],
    area: 'indicaciones de medicamentos y dosis personales, que no puedo entregar sin que un profesional te evalúe',
    donde: 'tu médico o el CESFAM; para dudas sobre un medicamento que ya te recetaron, el químico farmacéutico de la farmacia o Salud Responde (600 360 7777).',
  },
];

const GREETINGS = [
  'Entiendo, te oriento con esto.',
  'Gracias por contarme. Esto es lo que te puede estar pasando y qué hacer.',
  'Vamos por partes: qué podría ser, qué hacer ahora y cuándo consultar.',
  'Te oriento paso a paso.',
];

// Señales de emergencia. "match": basta una frase; "all": debe aparecer al menos una frase de cada grupo.
const URGENT_PATTERNS = [
  { match: ['dolor de pecho', 'dolor en el pecho', 'duele el pecho', 'opresion en el pecho', 'presion en el pecho', 'apreton en el pecho'], text: 'Dolor u opresión en el pecho: si dura más de 5 minutos, se va al brazo, mandíbula o espalda, o viene con sudor frío, náuseas o falta de aire, llama AHORA al 131 (SAMU). No vayas manejando.' },
  { match: ['no puedo respirar', 'me ahogo', 'me falta el aire', 'dificultad para respirar', 'labios morados', 'se esta ahogando'], text: 'Dificultad para respirar: si es en reposo, no puedes hablar frases completas o los labios se ponen morados, llama al 131 o ve a la urgencia más cercana.' },
  { match: ['suicid', 'quitarme la vida', 'matarme', 'no quiero vivir', 'hacerme dano', 'autolesion', 'cortarme'], text: 'Si estás pensando en hacerte daño, llama ahora a la Línea de Prevención del Suicidio *4141 (gratis, 24 horas) o al 131. No estás solo/a: pedir ayuda funciona.' },
  { match: ['boca chueca', 'boca torcida', 'cara caida', 'cara chueca', 'no puedo mover el brazo', 'no puedo mover la pierna', 'perdi la fuerza', 'no puedo hablar', 'habla raro', 'hablo raro'], text: 'Cara caída, debilidad de un lado o dificultad para hablar pueden ser un ACV (ataque cerebral): llama AHORA al 131 y anota la hora en que empezó. Cada minuto cuenta.' },
  { match: ['convulsion', 'convulsiona', 'convulsiono'], text: 'Convulsión: protege la cabeza, pon a la persona de lado y no le metas nada en la boca. Llama al 131 si dura más de 5 minutos, es la primera vez o no despierta después.' },
  { match: ['desmay', 'perdio el conocimiento', 'perdi el conocimiento', 'inconsciente', 'no reacciona'], text: 'Pérdida de conocimiento: si la persona no reacciona o no respira normal, llama al 131. Si se desmayó durante un esfuerzo o tiene dolor de pecho, también es urgencia.' },
  { match: ['vomito sangre', 'vomitos con sangre', 'deposiciones negras', 'caca negra', 'sangrado abundante', 'tos con sangre', 'toso sangre'], text: 'Sangrado por la boca, deposiciones negras o un sangrado abundante requieren atención de urgencia: acude a la urgencia o llama al 131.' },
  { match: ['se me hincha la cara', 'se me hincharon los labios', 'se me hincha la lengua', 'se me cierra la garganta', 'anafilaxia', 'hinchazon de labios'], text: 'Hinchazón de cara, labios o lengua, sobre todo con ronchas o dificultad para respirar, puede ser una anafilaxia: llama al 131 de inmediato.' },
  { match: ['peor dolor de cabeza', 'dolor de cabeza subito', 'dolor de cabeza explosivo', 'dolor de cabeza como un trueno'], text: 'Un dolor de cabeza súbito y muy intenso ("el peor de tu vida") es una urgencia: acude a urgencia o llama al 131.' },
  { match: ['arana de rincon'], text: 'Posible picadura de araña de rincón: lava la zona, aplica frío y acude a urgencia de inmediato (hay tratamiento específico que funciona mejor en las primeras horas).' },
  { match: ['trago cloro', 'tomo cloro', 'se tomo', 'sobredosis', 'tomo muchas pastillas', 'tome muchas pastillas', 'intoxicacion con'], text: 'Posible intoxicación: llama al CITUC (+56 2 2635 3800, 24 horas) para saber qué hacer, o al 131 si la persona está somnolienta, confusa o le cuesta respirar. No provoques el vómito.' },
  { all: [['raton', 'bodega', 'cabana', 'roedor', 'colilargo', 'casa cerrada'], ['fiebre', 'dolor muscular', 'dolor de cuerpo']], text: 'Fiebre o dolores musculares después de estar en un lugar con ratones o cerrado por mucho tiempo (bodega, cabaña, zona rural) puede ser hantavirus: consulta de urgencia HOY e informa ese antecedente. Si hay dificultad para respirar, llama al 131.' },
  { all: [['viaje', 'volvi de', 'brasil', 'caribe', 'tropical', 'extranjero'], ['fiebre']], text: 'Fiebre después de un viaje a zona tropical: consulta pronto e informa el viaje (puede ser dengue u otra infección). Usa solo paracetamol, no ibuprofeno ni aspirina. Urgencia si hay sangrado, dolor abdominal intenso o vómitos persistentes.' },
  { all: [['fiebre'], ['guagua', 'bebe', 'lactante', 'recien nacido', 'meses']], text: 'Fiebre en un bebé: si tiene menos de 3 meses, llévalo a urgencia aunque se vea bien. A cualquier edad, consulta de urgencia si está decaído, no se alimenta, respira rápido o tiene manchas en la piel.' },
];

function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// Singular-ish form of a word so plurals match: "beneficios"→"beneficio", "pensiones"→"pension",
// "deudas"→"deuda", "trabajadores"→"trabajador".
function singular(w) {
  if (w.length < 4) return w;
  if (/[nrldz]es$/.test(w) && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s')) return w.slice(0, -1);
  return w;
}

function canon(text) {
  return normalize(text).split(/[^a-z0-9]+/).filter(Boolean).map(singular).join(' ');
}

// Edit distance capped at 2 (enough to tolerate one typo).
function editDistance(a, b) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 1) return 2;
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    let rowMin = prev[0];
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
      rowMin = Math.min(rowMin, prev[j]);
    }
    if (rowMin > 1) return 2;
  }
  return prev[b.length];
}

function wordMatches(q, a) {
  if (q === a) return true;
  return a.length >= 6 && editDistance(q, a) <= 1;
}

// True if the alias words appear consecutively in the query words (plural- and typo-tolerant).
function containsSeq(queryWords, aliasWords) {
  if (!aliasWords.length || aliasWords.length > queryWords.length) return false;
  for (let i = 0; i + aliasWords.length <= queryWords.length; i++) {
    let ok = true;
    for (let k = 0; k < aliasWords.length; k++) {
      if (!wordMatches(queryWords[i + k], aliasWords[k])) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

function tokenize(query) {
  return normalize(query)
    .split(/[^a-z0-9]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

// Light Spanish "stemming": compare by prefix so "despidieron" ~ "despido", "renuncie" ~ "renuncia".
function stem(word) {
  if (word.length <= 4) return word;
  if (word.length <= 6) return word.slice(0, 4);
  return word.slice(0, 5);
}

function wordsOf(text) {
  return normalize(text).split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
}

const TOPICS = [];
for (const area of areas) {
  for (const t of area.temas) {
    const phrases = (t.temas || []).map(normalize);
    TOPICS.push({
      ...t,
      areaId: area.id,
      areaTitulo: area.titulo,
      phrasesNorm: phrases,
      phrasesWords: phrases.map((p) => canon(p).split(' ').filter(Boolean)),
      titleWords: wordsOf(t.titulo),
      phraseWords: phrases.flatMap((p) => p.split(' ')),
      bodyWords: wordsOf([t.resumen, t.sintomas].join(' ')),
    });
  }
}

const GLOSSARY_INDEX = glossary.map((g) => ({
  ...g,
  aliasNorm: [...new Set([normalize(g.termino.replace(/\(.*?\)/g, '')).trim(), ...(g.alias || []).map(normalize)])].filter(Boolean),
})).map((g) => ({ ...g, aliasWords: g.aliasNorm.map((a) => canon(a).split(' ').filter(Boolean)) }));

function hasPhrase(haystack, phrase) {
  const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${esc}($|[^a-z0-9])`).test(haystack);
}

// Glossary entries whose term or alias appears literally in the query, longest match first.
function findTerms(rawNorm, max = 3) {
  const qWords = canon(rawNorm).split(' ').filter(Boolean);
  const hits = [];
  for (const g of GLOSSARY_INDEX) {
    let best = null;
    g.aliasWords.forEach((words, idx) => {
      if (containsSeq(qWords, words) && (!best || words.join(' ').length > best.length)) {
        best = words.join(' ');
      }
      if (!best && hasPhrase(rawNorm, g.aliasNorm[idx])) best = canon(g.aliasNorm[idx]);
    });
    if (best) hits.push({ g, len: best.length, alias: best });
  }
  hits.sort((a, b) => b.len - a.len);
  // Drop a hit whose matched words are fully contained in a longer hit ("embargo" inside "embargo de bienes").
  const kept = [];
  for (const h of hits) {
    if (!kept.some((k) => k.alias.includes(h.alias) && k.g !== h.g)) kept.push(h);
  }
  return kept.slice(0, max).map((h) => h.g);
}

const DEFINITION_RE = /(^|[^a-z])(que es|que son|que significa|que significan|que quiere decir|definicion|definir|concepto|en que consiste|en que consisten|para que sirve|explicame|diferencia entre)([^a-z]|$)/;

function toDefinitionItem(g) {
  return { type: 'definicion', termino: g.termino, area: g.area, definicion: g.definicion, base: g.base, tema: g.tema };
}

function detectAreas(rawNorm) {
  const hits = new Set();
  for (const [areaId, hints] of Object.entries(AREA_HINTS)) {
    if (hints.some((h) => rawNorm.includes(h))) hits.add(areaId);
  }
  return hits;
}

function countStemHits(words, s) {
  let n = 0;
  for (const w of words) if (w.startsWith(s)) n += 1;
  return n;
}

function scoreTopic(topic, tokens, rawNorm, areaHits, qWords) {
  let score = 0;

  topic.phrasesNorm.forEach((phrase, i) => {
    const words = topic.phrasesWords[i];
    if (phrase.length < 3) return;
    if (rawNorm.includes(phrase)) score += 8 + words.length * 4;
    // Plural/typo-tolerant match counts a bit less than an exact one.
    else if (containsSeq(qWords, words)) score += 6 + words.length * 3;
  });

  for (const tok of tokens) {
    const s = stem(tok);
    if (countStemHits(topic.titleWords, s)) score += 5;
    if (countStemHits(topic.phraseWords, s)) score += 3;
    score += Math.min(countStemHits(topic.bodyWords, s), 3);
  }

  if (areaHits.has(topic.areaId)) score += 4;
  return score;
}

const TOPIC_THRESHOLD = 11;

function searchTopics(query, topN = 3) {
  const tokens = tokenize(query);
  const rawNorm = normalize(query);
  const areaHits = detectAreas(rawNorm);
  const qWords = canon(rawNorm).split(' ').filter(Boolean);
  const scored = TOPICS
    .map((t) => ({ t, score: scoreTopic(t, tokens, rawNorm, areaHits, qWords) }))
    .filter((r) => r.score >= TOPIC_THRESHOLD)
    .sort((a, b) => b.score - a.score);
  if (!scored.length) return [];
  // Drop weak tail results far below the best match, so the answer stays focused.
  const best = scored[0].score;
  return scored.filter((r) => r.score >= best * 0.5).slice(0, topN).map((r) => r.t);
}

function toTopicItem(t) {
  const area = areas.find((a) => a.id === t.areaId) || {};
  return {
    type: 'topic',
    id: t.id,
    area: t.areaTitulo,
    areaId: t.areaId,
    icono: area.icono || '',
    titulo: t.titulo,
    resumen: t.resumen,
    sintomas: t.sintomas || '',
    autocuidado: t.autocuidado || [],
    consultar: t.consultar || [],
    alarmas: t.alarmas || area.alarmas || [],
    dondeAcudir: t.dondeAcudir || [],
    consejo: t.consejo || '',
    alerta: t.alerta || '',
  };
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function findAreaBrowseIntent(rawNorm) {
  const browse = /(temas|que sabes|que ves|que cubres|indice|lista|todo lo|materias|ver todo)/.test(rawNorm)
    || /^derecho\s+\w+\s*\??$/.test(rawNorm.trim());
  if (!browse) return null;
  for (const area of areas) {
    const words = AREA_BROWSE_WORDS[area.id] || [];
    if (words.some((w) => rawNorm.includes(w))) return area;
  }
  return null;
}

// Every topic scored against the query (no threshold), best first.
function scoreAll(query) {
  const tokens = tokenize(query);
  const rawNorm = normalize(query);
  const areaHits = detectAreas(rawNorm);
  const qWords = canon(rawNorm).split(' ').filter(Boolean);
  return TOPICS
    .map((t) => ({ t, score: scoreTopic(t, tokens, rawNorm, areaHits, qWords) }))
    .sort((a, b) => b.score - a.score);
}

// Related topics from the SAME area as the main answer, ordered by closeness to the query
// (so "IVA de un vehículo" suggests crédito fiscal and gastos de vehículos, not random IVA topics).
function relatedTopics(items, query = '') {
  if (!items.length) return [];
  const shown = new Set(items.map((i) => i.id));
  const areaId = items[0].areaId;
  const sameArea = scoreAll(query || items[0].titulo)
    .filter((r) => r.t.areaId === areaId && !shown.has(r.t.id));
  const close = sameArea.filter((r) => r.score > 0).slice(0, 4);
  const pickList = close.length >= 2 ? close : sameArea.slice(0, 4);
  return pickList.map((r) => r.t.titulo);
}

function urgentNotes(rawNorm) {
  return URGENT_PATTERNS.filter((u) => (u.all
    ? u.all.every((grupo) => grupo.some((m) => rawNorm.includes(m)))
    : u.match.some((m) => rawNorm.includes(m)))).map((u) => u.text);
}

function composeAnswer(query) {
  const q = String(query || '').trim().slice(0, 1000);
  if (!q) {
    return {
      greeting: `¡Hola! Soy ${ASSISTANT_NAME}, tu orientador de salud.`,
      body: 'Cuéntame qué sientes con tus palabras —por ejemplo "me duele la rodilla al subir escaleras" o "me salió un grano rojo en el brazo"— y te explico qué podría ser, qué hacer ahora y cuándo consultar.',
      items: [],
      disclaimer: DISCLAIMER,
    };
  }

  const rawNorm = normalize(q);
  const urgent = urgentNotes(rawNorm);

  const browseArea = findAreaBrowseIntent(rawNorm);
  if (browseArea) {
    return {
      greeting: pick(GREETINGS),
      body: `${browseArea.icono || ''} ${browseArea.titulo}: ${browseArea.intro} Estos son los temas que tengo cargados; toca uno o cuéntame tus síntomas directamente.`.trim(),
      items: [],
      urgent: browseArea.alarmas && browseArea.alarmas.length ? [`Acude a urgencia o llama al 131 si: ${browseArea.alarmas.join('; ')}.`] : [],
      topicLinks: browseArea.temas.map((t) => t.titulo),
      leyes: browseArea.fuentes,
      disclaimer: DISCLAIMER,
    };
  }

  if (/^(ver )?(el )?(temario|temario de enfermedades|indice|lista de enfermedades|todas las enfermedades|enfermedades)\s*\??$/.test(rawNorm.trim())) {
    return {
      greeting: '📚 Temario de enfermedades.',
      body: `Este es el temario de MEDICONSULTAS: ${TOPICS.length} enfermedades y síntomas ordenados por área de la medicina. Busca por nombre o toca uno para ver su ficha completa.`,
      items: [],
      temario: true,
      disclaimer: DISCLAIMER,
    };
  }

  if (/^(glosario|glosario medico|diccionario|diccionario medico|conceptos|terminos medicos)\s*\??$/.test(rawNorm.trim())) {
    return {
      greeting: pick(GREETINGS),
      body: `Este es el glosario médico: ${glossary.length} conceptos explicados en lenguaje simple. Toca uno para ver su definición.`,
      items: [],
      topicLinks: glossary.map((g) => `¿Qué es ${g.termino.replace(/\s*\(.*?\)/g, '')}?`),
      disclaimer: DISCLAIMER,
    };
  }

  const terms = findTerms(rawNorm);
  const isDefinition = DEFINITION_RE.test(rawNorm);
  if (terms.length && isDefinition) {
    const defs = terms.map(toDefinitionItem);
    const topicIds = [...new Set(terms.map((g) => g.tema).filter(Boolean))];
    const topics = topicIds.map((id) => TOPICS.find((t) => t.id === id)).filter(Boolean).slice(0, 1).map(toTopicItem);
    return {
      greeting: pick(GREETINGS),
      body: defs.length > 1
        ? 'Te explico cada concepto y, debajo, el trámite relacionado paso a paso:'
        : `Te explico qué es ${defs[0].termino}${topics.length ? ' y, debajo, el trámite relacionado paso a paso' : ''}:`,
      items: [...defs, ...topics],
      urgent,
      related: topics.length ? relatedTopics(topics, q) : [],
      disclaimer: DISCLAIMER,
    };
  }

  const oosFirst = OUT_OF_SCOPE.find((o) => o.match.some((m) => rawNorm.includes(normalize(m))));
  if (oosFirst) {
    return {
      greeting: 'Entiendo.',
      body: `Tu consulta parece corresponder a ${oosFirst.area}. Para este tipo de casos puedes acudir a: ${oosFirst.donde}`,
      items: [],
      urgent,
      disclaimer: DISCLAIMER,
    };
  }

  const matches = searchTopics(q, 3);

  if (!matches.length && terms.length) {
    return {
      greeting: pick(GREETINGS),
      body: 'Encontré estos conceptos en tu consulta. Si me cuentas tu caso concreto, te oriento con los pasos a seguir:',
      items: terms.map(toDefinitionItem),
      urgent,
      disclaimer: DISCLAIMER,
    };
  }

  if (!matches.length && !tokenize(q).length && !urgent.length) {
    return {
      greeting: `¡Hola! Soy ${ASSISTANT_NAME}, tu orientador de salud.`,
      body: 'Cuéntame qué sientes, con tus palabras. Mientras más detalles me des (dónde te duele, desde cuándo, qué tan fuerte del 1 al 10, tu edad y si tienes fiebre), mejor te puedo orientar.',
      items: [],
      topicLinks: areas.map((a) => `Temas de ${a.titulo}`),
      disclaimer: DISCLAIMER,
    };
  }

  if (!matches.length) {
    const oos = OUT_OF_SCOPE.find((o) => o.match.some((m) => rawNorm.includes(normalize(m))));
    if (oos) {
      return {
        greeting: 'Entiendo.',
        body: `Tu consulta parece corresponder a ${oos.area}. Para esto puedes acudir a: ${oos.donde}`,
        items: [],
        urgent,
        disclaimer: DISCLAIMER,
      };
    }
    // No exact topic, but the area is clear (e.g. it mentions IVA, despido, pensión):
    // answer within that same area with its closest topics instead of a dead end.
    const areaIds = [...detectAreas(rawNorm)];
    if (areaIds.length) {
      const ranked = scoreAll(q).filter((r) => areaIds.includes(r.t.areaId) && r.score > 0);
      const primaryArea = (ranked[0] && ranked[0].t.areaId) || areaIds[0];
      const area = areas.find((a) => a.id === primaryArea);
      const closest = ranked.filter((r) => r.t.areaId === primaryArea).slice(0, 2).map((r) => toTopicItem(r.t));
      if (area && closest.length) {
        return {
          noMatch: true,
          greeting: pick(GREETINGS),
          body: `Tu consulta corresponde a ${area.titulo}, pero no tengo una ficha exacta para "${q}". Estos son los temas más cercanos de esa área; si me das más detalles (desde cuándo, qué tan intenso, otros síntomas), puedo orientarte mejor:`,
          items: closest,
          urgent,
          related: relatedTopics(closest, q),
          topicLinks: [`Temas de ${area.titulo}`],
          disclaimer: DISCLAIMER,
        };
      }
    }
    return {
      noMatch: true,
      greeting: urgent.length ? 'Lo primero es tu seguridad.' : pick(GREETINGS),
      body: `No logré identificar con claridad qué te pasa con "${q}". ¿Me cuentas un poco más? Por ejemplo: en qué parte del cuerpo es la molestia, desde cuándo, qué tan intensa (1 a 10), tu edad y si tienes fiebre u otros síntomas.`,
      items: [],
      urgent,
      topicLinks: areas.map((a) => `Temas de ${a.titulo}`),
      disclaimer: DISCLAIMER,
    };
  }

  const items = matches.map(toTopicItem);
  const relatedRaw = relatedTopics(items, q);
  const multiArea = new Set(items.map((i) => i.areaId)).size > 1;

  let body;
  if (items.length === 1) {
    body = `Esto corresponde a ${items[0].area}. Te dejo qué podría ser, qué puedes hacer ahora, cuándo consultar y las señales de alarma:`;
  } else if (multiArea) {
    body = 'Lo que describes puede tener más de una causa, de distintas áreas. Revisa cada ficha: la primera es la que mejor calza.';
  } else {
    body = `Encontré varios temas de ${items[0].area} relacionados con tu consulta. El primero es el que mejor calza:`;
  }

  return {
    greeting: urgent.length ? 'Lo primero es tu seguridad.' : pick(GREETINGS),
    body,
    items,
    urgent,
    related: relatedRaw,
    disclaimer: DISCLAIMER,
  };
}

module.exports = { composeAnswer, searchTopics, findTerms, normalize, areas, glossary, TOPICS, DISCLAIMER };
