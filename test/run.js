'use strict';

// Pruebas sin dependencias: node test/run.js
const assert = require('assert');
const { composeAnswer, areas, glossary, TOPICS } = require('../lib/engine');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed += 1; } catch (err) { failed += 1; console.error(`✗ ${name}\n  ${err.message}`); }
}

// Consulta → ficha que debe aparecer primero.
const ROUTING = [
  ['me zumban los oidos', 'zumbido-de-oidos'],
  ['me suenan los oidos', 'zumbido-de-oidos'],
  ['tengo dolor en la rodilla al subir escaleras', 'dolor-de-rodilla'],
  ['me salio un grano rojo que duele', 'grano-rojo'],
  ['tengo dolor en la parte baja del estomago', 'dolor-en-la-parte-baja-del-abdomen'],
  ['tos con flema hace 5 dias', 'bronquitis-aguda'],
  ['me duele el pecho', 'dolor-de-pecho'],
  ['mi guagua tiene fiebre', 'fiebre-en-ninos'],
  ['tengo la presion alta', 'hipertension-arterial'],
  ['me arde al orinar', 'infeccion-urinaria-baja'],
  ['me duele la cabeza todos los dias', 'cefalea-tensional'],
  ['no puedo dormir', 'insomnio'],
  ['tengo dolor de muela', 'dolor-de-muela'],
  ['tengo diarrea y vomitos', 'gastroenteritis-aguda'],
  ['me duele la guata', 'gastritis'],
  ['me torci el tobillo', 'esguince-de-tobillo'],
  ['me duele la espalda', 'lumbago'],
  ['tengo ronchas que pican', 'urticaria'],
  ['ojo rojo con legana', 'conjuntivitis'],
  ['todo me da vueltas', 'vertigo'],
  ['me siento muy triste y sin ganas de nada', 'depresion'],
  ['tengo mucha ansiedad', 'ansiedad'],
  ['tengo la glicemia alta', 'diabetes-tipo-2'],
  ['no me llega la regla', 'atraso-menstrual'],
  ['mi abuelo se cayo', 'caidas'],
  ['me sangran las encias', 'encias-que-sangran'],
  ['dolor de garganta y me duele al tragar', 'faringoamigdalitis'],
  ['tengo un lunar que cambio de color', 'lunares'],
  ['me duele el dedo gordo del pie', 'gota'],
  ['tengo hemorroides', 'hemorroides'],
  ['mi hijo tiene piojos', 'piojos'],
  ['tengo el colesterol alto', 'colesterol-alto'],
  ['quiero dejar de fumar', 'dejar-de-fumar'],
  ['volvi de brasil con fiebre', 'enfermedades-del-viajero'],
  ['limpie una bodega y tengo fiebre', 'hantavirus'],
  ['una pierna hinchada y dolorosa', 'trombosis-venosa-profunda'],
  ['me queme con agua hirviendo', 'quemaduras'],
  ['tengo culebrilla', 'herpes-zoster'],
  ['se rompio el condon', 'anticoncepcion-de-emergencia'],
  ['tengo bochornos', 'menopausia'],
  ['se me hincho la cara por una muela', 'absceso-dental'],
  ['me duele el cuello', 'dolor-de-cuello-y-torticolis'],
  ['no puedo cerrar el ojo y se me cayo la cara', 'paralisis-facial'],
  ['se me sale la orina al toser', 'incontinencia-urinaria'],
  ['me duele un testiculo', 'dolor-de-testiculo'],
  ['mi papa esta confundido de repente', 'confusion-aguda'],
  ['me bajo el azucar', 'hipoglicemia'],
  ['murio mi mama', 'duelo'],
  ['tengo la piel amarilla', 'hepatitis-a'],
  ['me arde al orinar y tengo fiebre y dolor de rinon', 'infeccion-renal'],
  ['me duele el rinon', 'colico-renal'],
];

for (const [q, id] of ROUTING) {
  test(`"${q}" → ${id}`, () => {
    const a = composeAnswer(q);
    const first = (a.items || []).find((i) => i.type === 'topic');
    assert.ok(first, `sin ficha (respuesta: ${a.body})`);
    assert.strictEqual(first.id, id, `primera ficha: ${first.id}`);
  });
}

// Emergencias: siempre deben mostrar aviso urgente.
const URGENTES = [
  'me duele el pecho y sudo frio',
  'no puedo respirar',
  'tengo la boca chueca y no puedo mover el brazo',
  'quiero quitarme la vida',
  'mi guagua de 2 meses tiene fiebre',
  'se me hincharon los labios',
  'el peor dolor de cabeza de mi vida',
  'me pico una arana de rincon',
  'limpie una bodega con ratones y tengo fiebre',
  'volvi del caribe y tengo fiebre',
];
for (const q of URGENTES) {
  test(`urgente: "${q}"`, () => {
    const a = composeAnswer(q);
    assert.ok((a.urgent || []).length > 0, 'no mostró aviso urgente');
  });
}

test('glosario: "que es el ges"', () => {
  const a = composeAnswer('¿Qué es el GES?');
  assert.ok((a.items || []).some((i) => i.type === 'definicion' && /GES/.test(i.termino)));
});

test('saludo sin síntomas pide más detalles', () => {
  const a = composeAnswer('hola');
  assert.strictEqual((a.items || []).length, 0);
  assert.ok(/detalles|cuentame/i.test(a.body.normalize('NFD').replace(/[̀-ͯ]/g, '')));
});

test('dosis de medicamentos: no receta', () => {
  const a = composeAnswer('cuantos mg de ibuprofeno tomo');
  assert.strictEqual((a.items || []).length, 0);
  assert.ok(/medico|CESFAM/i.test(a.body.normalize('NFD').replace(/[̀-ͯ]/g, '')));
});

test('todas las fichas tienen frases, autocuidado y cuándo consultar', () => {
  for (const t of TOPICS) {
    assert.ok(t.temas && t.temas.length >= 3, `${t.id}: pocas frases`);
    assert.ok(t.autocuidado && t.autocuidado.length, `${t.id}: sin autocuidado`);
    assert.ok(t.consultar && t.consultar.length, `${t.id}: sin cuándo consultar`);
  }
});

test('el glosario apunta a fichas que existen', () => {
  const ids = new Set(TOPICS.map((t) => t.id));
  for (const g of glossary) if (g.tema) assert.ok(ids.has(g.tema), `${g.termino} → ${g.tema} no existe`);
});

test('18 áreas cargadas', () => assert.strictEqual(areas.length, 18));

test('temario: "ver temario" abre el índice', () => {
  const a = composeAnswer('ver temario');
  assert.strictEqual(a.temario, true);
});

test('al menos 150 fichas', () => assert.ok(TOPICS.length >= 150, `solo ${TOPICS.length}`));

console.log(`\n${passed} pruebas OK, ${failed} fallidas`);
process.exit(failed ? 1 : 0);
