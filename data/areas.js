// Base de conocimiento de MEDICONSULTAS.
// Contenido de orientación general redactado para el proyecto (no copiado de libros).
// Cada área: id, nombre, icono, descripción, palabras clave para clasificar,
// señales de alarma y afecciones frecuentes con síntomas, autocuidado y cuándo consultar.

module.exports = [
  {
    id: "medicina-general",
    nombre: "Medicina General",
    icono: "🩺",
    descripcion: "Primer punto de consulta: fiebre, malestar general, cansancio, chequeos preventivos y síntomas que no encajan en un área específica.",
    palabras: ["fiebre", "cansancio", "fatiga", "malestar", "decaimiento", "escalofrios", "chequeo", "examen preventivo", "baje de peso", "sudor nocturno", "gripe", "resfrio"],
    alarmas: [
      "Fiebre sobre 39,5 °C que no baja con antipiréticos o dura más de 3 días",
      "Rigidez de nuca con fiebre y dolor de cabeza intenso",
      "Confusión, somnolencia extrema o desmayo",
      "Baja de peso no intencional de más del 5 % en 6 meses"
    ],
    afecciones: [
      {
        nombre: "Resfrío común",
        sintomas: "Congestión y secreción nasal, estornudos, dolor de garganta leve, tos seca, a veces fiebre baja. Dura 7 a 10 días.",
        autocuidado: "Reposo, abundante líquido, lavados nasales con suero fisiológico, paracetamol para molestias. Los antibióticos no sirven para virus.",
        consultar: "Si la fiebre supera 3 días, hay dificultad para respirar, dolor de oído intenso o los síntomas empeoran después de mejorar."
      },
      {
        nombre: "Influenza (gripe)",
        sintomas: "Inicio brusco con fiebre alta, dolor muscular intenso, dolor de cabeza, tos y gran cansancio.",
        autocuidado: "Reposo, hidratación, antipiréticos. Vacunación anual (campaña de invierno), en especial mayores de 65, embarazadas, niños y enfermos crónicos.",
        consultar: "Personas de riesgo en las primeras 48 horas (puede indicarse antiviral), o ante dificultad respiratoria, dolor torácico o confusión."
      },
      {
        nombre: "Fiebre sin causa clara",
        sintomas: "Temperatura axilar sobre 37,5 °C. Puede acompañarse de escalofríos y malestar.",
        autocuidado: "Ropa liviana, líquidos, paracetamol según dosis indicada. Registrar temperatura y síntomas asociados.",
        consultar: "Fiebre de más de 3 días, mayor a 39,5 °C, en lactantes menores de 3 meses, o con manchas en la piel, rigidez de cuello o dolor al orinar."
      },
      {
        nombre: "Cansancio persistente",
        sintomas: "Fatiga que no mejora con descanso por más de 2 a 4 semanas.",
        autocuidado: "Revisar sueño, alimentación, actividad física y estrés.",
        consultar: "Para exámenes básicos (hemograma, tiroides, glicemia, hierro). Antes si hay baja de peso, palidez marcada, sudoración nocturna o falta de aire."
      }
    ]
  },
  {
    id: "broncopulmonar",
    nombre: "Broncopulmonar",
    icono: "🫁",
    descripcion: "Pulmones y vías respiratorias: tos, falta de aire, silbidos al respirar, asma, bronquitis, neumonía, EPOC.",
    palabras: ["tos", "flema", "expectoracion", "falta de aire", "ahogo", "disnea", "silbido", "pecho apretado", "asma", "bronquitis", "neumonia", "pulmon", "respirar", "epoc", "fumador", "sangre al toser"],
    alarmas: [
      "Dificultad para respirar en reposo o labios/uñas morados",
      "Tos con sangre",
      "Dolor de pecho al respirar con fiebre alta",
      "Crisis de asma que no mejora con el inhalador de rescate"
    ],
    afecciones: [
      {
        nombre: "Bronquitis aguda",
        sintomas: "Tos con o sin flema que puede durar 2 a 3 semanas, molestia en el pecho, a veces fiebre baja. Suele ser viral.",
        autocuidado: "Hidratación, miel (en mayores de 1 año), evitar humo de tabaco, reposo relativo.",
        consultar: "Si la tos dura más de 3 semanas, hay fiebre alta persistente, falta de aire o tos con sangre."
      },
      {
        nombre: "Neumonía",
        sintomas: "Fiebre, tos con flema, dolor al respirar en un costado, respiración rápida, decaimiento importante.",
        autocuidado: "No es para manejo en casa sin evaluación médica.",
        consultar: "Siempre requiere evaluación médica pronto; en mayores de 65 o con dificultad respiratoria, acudir a urgencia."
      },
      {
        nombre: "Asma",
        sintomas: "Silbidos al respirar, pecho apretado, tos nocturna o con ejercicio, falta de aire en crisis.",
        autocuidado: "Usar el tratamiento de mantención como fue indicado, identificar desencadenantes (polvo, frío, humo, alérgenos), tener plan de acción.",
        consultar: "Control periódico con broncopulmonar o médico general. Urgencia si el inhalador de rescate no alivia o no puede hablar frases completas."
      },
      {
        nombre: "EPOC",
        sintomas: "Falta de aire progresiva al esfuerzo, tos crónica con flema, generalmente en fumadores o ex fumadores.",
        autocuidado: "Dejar de fumar es lo más importante. Vacunas de influenza y neumococo, actividad física adaptada.",
        consultar: "Para espirometría y tratamiento. Urgencia si aumenta mucho la falta de aire o cambia el color de la flema con fiebre."
      }
    ]
  },
  {
    id: "cardiologia",
    nombre: "Cardiología",
    icono: "❤️",
    descripcion: "Corazón y circulación: dolor de pecho, palpitaciones, presión alta, hinchazón de piernas.",
    palabras: ["dolor de pecho", "pecho", "palpitaciones", "taquicardia", "presion alta", "hipertension", "presion", "corazon", "arritmia", "piernas hinchadas", "colesterol", "infarto", "desmayo"],
    alarmas: [
      "Dolor u opresión en el pecho de más de 5 minutos, que puede irradiarse al brazo izquierdo, mandíbula o espalda, con sudor frío o náuseas: LLAMAR AL 131",
      "Falta de aire súbita",
      "Desmayo durante el esfuerzo",
      "Presión arterial sobre 180/120 con dolor de cabeza intenso, visión borrosa o dolor de pecho"
    ],
    afecciones: [
      {
        nombre: "Hipertensión arterial",
        sintomas: "Generalmente no da síntomas. A veces dolor de cabeza en la nuca, zumbido de oídos, mareo.",
        autocuidado: "Reducir sal, mantener peso adecuado, actividad física regular, limitar alcohol, no fumar, tomar medicamentos a diario.",
        consultar: "Si la presión es igual o mayor a 140/90 en varias mediciones. Programa cardiovascular (PSCV) en CESFAM."
      },
      {
        nombre: "Palpitaciones",
        sintomas: "Sensación de latidos rápidos, fuertes o irregulares.",
        autocuidado: "Reducir cafeína, alcohol, energéticas; dormir bien; manejar estrés.",
        consultar: "Si son frecuentes, duran varios minutos, o se acompañan de mareo, desmayo, dolor de pecho o falta de aire (urgencia)."
      },
      {
        nombre: "Insuficiencia cardíaca",
        sintomas: "Falta de aire al esfuerzo o al acostarse, hinchazón de tobillos, aumento rápido de peso, cansancio.",
        autocuidado: "Controlar peso diario, limitar sal y líquidos según indicación médica, adherencia a tratamiento.",
        consultar: "Evaluación médica. Urgencia si la falta de aire aparece en reposo."
      }
    ]
  },
  {
    id: "gastroenterologia",
    nombre: "Gastroenterología",
    icono: "🫃",
    descripcion: "Estómago, intestinos e hígado: dolor abdominal, acidez, diarrea, estreñimiento, náuseas.",
    palabras: ["estomago", "guata", "abdomen", "barriga", "panza", "dolor abdominal", "acidez", "reflujo", "agruras", "diarrea", "estrenimiento", "colon", "nauseas", "vomito", "gases", "hinchazon", "higado", "hemorroides", "sangre en las deposiciones", "parte baja del estomago", "boca del estomago"],
    alarmas: [
      "Dolor abdominal intenso y continuo, abdomen duro como tabla",
      "Vómitos con sangre o como 'borra de café', deposiciones negras o con sangre abundante",
      "Dolor en la parte baja derecha con fiebre (posible apendicitis)",
      "Piel u ojos amarillos",
      "Signos de deshidratación: boca seca, poca orina, mareo"
    ],
    afecciones: [
      {
        nombre: "Gastroenteritis aguda",
        sintomas: "Diarrea, vómitos, dolor tipo cólico, a veces fiebre. Dura 2 a 5 días.",
        autocuidado: "Sales de rehidratación oral en sorbos frecuentes, dieta liviana, lavado de manos.",
        consultar: "Si hay sangre en las deposiciones, fiebre alta, más de 48 horas de vómitos, deshidratación, o en lactantes y adultos mayores."
      },
      {
        nombre: "Gastritis / dispepsia",
        sintomas: "Ardor o dolor en la 'boca del estómago', llenura precoz, náuseas.",
        autocuidado: "Evitar antiinflamatorios (ibuprofeno, ketoprofeno), alcohol, tabaco, comidas muy condimentadas; comer en horarios regulares.",
        consultar: "Si dura más de 2 semanas, en mayores de 40 años con síntomas nuevos, o con baja de peso, vómitos o anemia (puede requerir endoscopía y estudio de Helicobacter pylori)."
      },
      {
        nombre: "Reflujo gastroesofágico",
        sintomas: "Ardor detrás del esternón que sube hacia la garganta, regurgitación ácida, peor al acostarse.",
        autocuidado: "Cenar 3 horas antes de acostarse, elevar cabecera, bajar de peso, evitar café, chocolate, alcohol y frituras.",
        consultar: "Si persiste pese a medidas, hay dificultad para tragar o baja de peso."
      },
      {
        nombre: "Apendicitis",
        sintomas: "Dolor que suele empezar alrededor del ombligo y se mueve a la parte baja derecha, empeora al caminar o toser, con náuseas y fiebre.",
        autocuidado: "No tomar laxantes ni analgésicos potentes que oculten el dolor.",
        consultar: "URGENCIA: requiere evaluación inmediata."
      },
      {
        nombre: "Dolor en la parte baja del abdomen",
        sintomas: "Puede originarse en intestino (colon, apéndice), vejiga (infección urinaria) o, en mujeres, útero y ovarios.",
        autocuidado: "Observar si hay ardor al orinar, fiebre, relación con la menstruación o con las deposiciones.",
        consultar: "Si es intenso, progresivo, con fiebre, vómitos o, en mujeres, con atraso menstrual (descartar embarazo ectópico: urgencia)."
      },
      {
        nombre: "Colon irritable",
        sintomas: "Dolor abdominal recurrente que alivia al evacuar, alternancia de diarrea y estreñimiento, hinchazón.",
        autocuidado: "Fibra gradual, agua, actividad física, manejo del estrés, identificar alimentos gatillantes.",
        consultar: "Para confirmar diagnóstico, sobre todo si hay sangre, baja de peso o inicio después de los 50 años."
      }
    ]
  },
  {
    id: "traumatologia",
    nombre: "Traumatología",
    icono: "🦴",
    descripcion: "Huesos, articulaciones, músculos y tendones: dolor de rodilla, espalda, hombro, esguinces, fracturas.",
    palabras: ["rodilla", "espalda", "lumbago", "columna", "cuello", "hombro", "tobillo", "esguince", "torcedura", "fractura", "hueso", "golpe", "caida", "musculo", "tendon", "cadera", "muneca", "codo", "ciatica", "articulacion", "menisco"],
    alarmas: [
      "Deformidad evidente o hueso expuesto tras un golpe",
      "Imposibilidad de apoyar o mover la extremidad",
      "Dolor de espalda con pérdida de control de orina o deposiciones, o adormecimiento en la zona genital",
      "Articulación roja, caliente e hinchada con fiebre",
      "Golpe en la cabeza o cuello con dolor intenso de columna"
    ],
    afecciones: [
      {
        nombre: "Dolor de rodilla",
        sintomas: "Puede deberse a sobrecarga, desgaste (artrosis), lesión de menisco o ligamentos, o tendinitis. Dolor al subir escaleras sugiere problema de rótula; bloqueo o 'chasquido' con dolor sugiere menisco.",
        autocuidado: "Reposo relativo, hielo 15-20 minutos 3 veces al día las primeras 48 horas, elevar la pierna, evitar arrodillarse; si es crónico, fortalecer cuádriceps y bajar de peso.",
        consultar: "Si hubo torsión con hinchazón rápida, inestabilidad ('se me va'), bloqueo, no puede apoyar, o dolor que no mejora en 2 semanas."
      },
      {
        nombre: "Lumbago (dolor lumbar)",
        sintomas: "Dolor en la parte baja de la espalda, a veces irradiado a glúteo. Si baja por la pierna bajo la rodilla con hormigueo: ciática.",
        autocuidado: "Mantenerse activo (el reposo prolongado empeora), calor local, analgésicos simples, buena postura al levantar peso.",
        consultar: "Si dura más de 4-6 semanas, hay debilidad en la pierna, fiebre, antecedente de cáncer, o pérdida de control de esfínteres (urgencia)."
      },
      {
        nombre: "Esguince de tobillo",
        sintomas: "Dolor e hinchazón tras torcedura, moretón.",
        autocuidado: "Reposo, hielo, compresión con venda elástica, elevación las primeras 48-72 horas.",
        consultar: "Si no puede dar 4 pasos, hay dolor al presionar el hueso del tobillo o deformidad (radiografía)."
      },
      {
        nombre: "Hombro doloroso",
        sintomas: "Dolor al levantar el brazo o dormir sobre ese lado; frecuente por tendinitis del manguito rotador.",
        autocuidado: "Evitar movimientos repetidos sobre la cabeza, hielo o calor, ejercicios suaves de movilidad.",
        consultar: "Si no puede levantar el brazo, hubo caída, o no mejora en 2-3 semanas."
      },
      {
        nombre: "Artrosis",
        sintomas: "Dolor articular mecánico (empeora con el uso), rigidez matinal breve, crujidos. Frecuente en rodillas, caderas y manos.",
        autocuidado: "Ejercicio de bajo impacto (natación, bicicleta), control de peso, calor local.",
        consultar: "Para manejo del dolor y kinesioterapia. Artrosis de cadera/rodilla leve-moderada en mayores de 55 años tiene cobertura GES."
      }
    ]
  },
  {
    id: "dermatologia",
    nombre: "Dermatología",
    icono: "🧴",
    descripcion: "Piel, pelo y uñas: granos, manchas, ronchas, picazón, lunares, acné, hongos.",
    palabras: ["piel", "grano", "granito", "espinilla", "mancha", "roncha", "picazon", "comezon", "lunar", "acne", "hongo", "sarpullido", "alergia en la piel", "eczema", "herpes", "verruga", "caida del pelo", "una", "quemadura", "rojo", "erupcion"],
    alarmas: [
      "Ronchas con hinchazón de labios, lengua o dificultad para respirar (anafilaxia): URGENCIA",
      "Zona roja, caliente y dolorosa que se expande rápido, con fiebre (celulitis)",
      "Manchas rojo-violáceas que no desaparecen al presionarlas con un vaso, con fiebre: URGENCIA",
      "Ampollas extensas o descamación de piel con mucosas comprometidas",
      "Lunar que cambia de tamaño, forma o color, o sangra"
    ],
    afecciones: [
      {
        nombre: "Grano rojo / foliculitis / forúnculo",
        sintomas: "Lesión roja, a veces con pus en el centro, dolorosa. La foliculitis es la inflamación de un folículo piloso; el forúnculo es más profundo y grande.",
        autocuidado: "Compresas tibias 3-4 veces al día, no exprimir, higiene con jabón neutro, no compartir toallas.",
        consultar: "Si crece rápido, tiene más de 1-2 cm, hay fiebre, línea roja que se extiende, está en la cara (zona nariz-labio) o se repite."
      },
      {
        nombre: "Picadura de insecto",
        sintomas: "Roncha roja con picazón, a veces con punto central. Pueden aparecer varias en línea (chinches, pulgas).",
        autocuidado: "Lavar, frío local, no rascar, antihistamínico oral si hay mucha picazón.",
        consultar: "Si aparece hinchazón de cara o dificultad respiratoria (urgencia), o la lesión se infecta. Considerar picadura de araña de rincón si hay dolor intenso y mancha violácea: urgencia."
      },
      {
        nombre: "Acné",
        sintomas: "Espinillas, puntos negros, granos con pus en cara, pecho y espalda.",
        autocuidado: "Lavado suave 2 veces al día, productos 'no comedogénicos', no manipular las lesiones.",
        consultar: "Si deja cicatrices, es muy inflamatorio o afecta la autoestima: hay tratamientos efectivos."
      },
      {
        nombre: "Urticaria",
        sintomas: "Ronchas elevadas que pican, cambian de lugar y desaparecen en menos de 24 horas.",
        autocuidado: "Antihistamínico oral, identificar desencadenante (alimentos, medicamentos, infecciones).",
        consultar: "Urgencia si hay hinchazón de cara o dificultad para respirar. Control si dura más de 6 semanas."
      },
      {
        nombre: "Dermatitis / eczema",
        sintomas: "Piel seca, roja, con picazón, a veces con descamación o pequeñas vesículas.",
        autocuidado: "Hidratar la piel varias veces al día, duchas cortas con agua tibia, evitar jabones perfumados y ropa de lana.",
        consultar: "Si no mejora en 2 semanas, se infecta o afecta el sueño."
      },
      {
        nombre: "Hongos de piel (tiña) y pie de atleta",
        sintomas: "Manchas redondeadas con borde rojo que avanza y centro más claro; entre los dedos: piel blanca, agrietada, con picazón.",
        autocuidado: "Secar bien la piel, ropa de algodón, no compartir toallas ni calzado.",
        consultar: "Para confirmar y tratar; si compromete uñas o cuero cabelludo necesita tratamiento oral."
      },
      {
        nombre: "Lunares (nevus)",
        sintomas: "Regla ABCDE para vigilar: Asimetría, Bordes irregulares, Color variado, Diámetro mayor a 6 mm, Evolución (cambios).",
        autocuidado: "Protector solar diario, autoexamen mensual, evitar quemaduras solares.",
        consultar: "Si cumple algún criterio ABCDE, pica, sangra o es nuevo después de los 30 años."
      }
    ]
  },
  {
    id: "neurologia",
    nombre: "Neurología",
    icono: "🧠",
    descripcion: "Cerebro y nervios: dolor de cabeza, mareo, hormigueos, convulsiones, problemas de memoria.",
    palabras: ["cabeza", "dolor de cabeza", "cefalea", "jaqueca", "migrana", "mareo", "vertigo", "hormigueo", "adormecimiento", "convulsion", "temblor", "memoria", "desmayo", "paralisis", "boca chueca", "debilidad"],
    alarmas: [
      "Cara caída, debilidad de un brazo o pierna, dificultad para hablar: posible ACV, LLAMAR AL 131 (cada minuto cuenta)",
      "Peor dolor de cabeza de su vida, de inicio súbito ('como un trueno')",
      "Dolor de cabeza con fiebre y rigidez de nuca",
      "Convulsión que dura más de 5 minutos o primera convulsión",
      "Dolor de cabeza tras golpe en la cabeza con vómitos o somnolencia"
    ],
    afecciones: [
      {
        nombre: "Cefalea tensional",
        sintomas: "Dolor de cabeza como 'cintillo' apretado, en ambos lados, leve a moderado, relacionado con estrés y mala postura.",
        autocuidado: "Descanso, hidratación, pausas de pantalla, analgésicos simples (no más de 2-3 días por semana para evitar cefalea por abuso de medicamentos).",
        consultar: "Si es diaria, cambia de patrón o no responde a analgésicos."
      },
      {
        nombre: "Migraña",
        sintomas: "Dolor pulsátil, generalmente de un lado, con náuseas y molestia con la luz y ruido; a veces precedido de destellos visuales (aura).",
        autocuidado: "Reposo en lugar oscuro, analgésico al inicio, registrar gatillantes (sueño irregular, ayuno, alcohol, ciertos alimentos).",
        consultar: "Si tiene más de 4 crisis al mes (puede requerir tratamiento preventivo) o el aura dura más de 1 hora."
      },
      {
        nombre: "Vértigo",
        sintomas: "Sensación de que todo gira. El vértigo posicional (al girar en la cama o mirar hacia arriba) dura segundos y es benigno en general.",
        autocuidado: "Movimientos lentos, evitar conducir durante las crisis, hidratación.",
        consultar: "Urgencia si se acompaña de dificultad para hablar, visión doble, debilidad o no puede caminar."
      },
      {
        nombre: "Hormigueo o adormecimiento",
        sintomas: "En manos (túnel carpiano, más de noche), pies (neuropatía, frecuente en diabetes) o un lado del cuerpo (alarma).",
        autocuidado: "Evitar posturas mantenidas de muñeca; en diabéticos, revisar los pies a diario.",
        consultar: "Urgencia si es súbito en un lado del cuerpo o cara. Control si es progresivo o persistente."
      }
    ]
  },
  {
    id: "otorrino",
    nombre: "Otorrinolaringología",
    icono: "👂",
    descripcion: "Oído, nariz y garganta: dolor de oído, sinusitis, amigdalitis, ronquera, pérdida de audición.",
    palabras: ["oido", "oreja", "sordera", "zumbido", "tinnitus", "suenan los oidos", "suena el oido", "pito en el oido", "pitido", "escucho mal", "oido tapado", "cerumen", "garganta", "amigdalas", "anginas", "ronquera", "disfonia", "nariz", "sinusitis", "sangrado de nariz", "epistaxis", "congestion", "rinitis", "tragar"],
    alarmas: [
      "Dificultad para tragar la saliva o abrir la boca, con voz 'de papa caliente'",
      "Pérdida súbita de audición en un oído (urgencia dentro de 72 horas)",
      "Sangrado de nariz que no se detiene tras 20 minutos de presión",
      "Hinchazón detrás de la oreja con fiebre"
    ],
    afecciones: [
      {
        nombre: "Faringoamigdalitis",
        sintomas: "Dolor de garganta, dolor al tragar, fiebre. Si hay placas de pus, fiebre alta y sin tos, puede ser bacteriana (estreptococo).",
        autocuidado: "Líquidos tibios o fríos, gárgaras con agua con sal, analgésicos.",
        consultar: "Si hay fiebre alta con placas, no puede tragar o dura más de 5 días (puede requerir antibiótico)."
      },
      {
        nombre: "Otitis",
        sintomas: "Dolor de oído, sensación de oído tapado, fiebre (otitis media) o dolor al tocar la oreja tras piscina (otitis externa).",
        autocuidado: "Analgésicos, no introducir cotonitos ni objetos, mantener el oído seco.",
        consultar: "Si hay secreción, fiebre alta, dolor intenso, o en niños menores de 2 años."
      },
      {
        nombre: "Sinusitis",
        sintomas: "Congestión, secreción espesa, dolor o presión en la cara (frente, mejillas) que aumenta al agacharse.",
        autocuidado: "Lavados nasales con suero, vapor, hidratación. La mayoría es viral y mejora en 10 días.",
        consultar: "Si dura más de 10 días, empeora tras mejorar, o hay hinchazón alrededor del ojo (urgencia)."
      },
      {
        nombre: "Zumbido de oídos (tinnitus)",
        sintomas: "Sensación de pito, zumbido o 'sonido de mar' en uno o ambos oídos sin fuente externa. Causas frecuentes: tapón de cera, exposición a ruido fuerte, pérdida de audición por edad, presión alta, estrés o algunos medicamentos.",
        autocuidado: "Evitar ruidos fuertes y audífonos a alto volumen, reducir cafeína y alcohol, un ruido de fondo suave (ventilador, música baja) ayuda a dormir. No introducir cotonitos.",
        consultar: "Si es solo en un oído, aparece con pérdida de audición, mareo o vértigo, late al ritmo del pulso, o dura más de 2 semanas. Urgencia si hubo pérdida súbita de audición."
      },
      {
        nombre: "Tapón de cera",
        sintomas: "Oído tapado, disminución de audición, a veces zumbido o picazón, frecuente tras ducharse o usar cotonitos.",
        autocuidado: "No usar cotonitos (empujan la cera). Gotas de aceite de oliva o vaselina líquida 2-3 días pueden ablandarla.",
        consultar: "Para lavado de oídos si no mejora; no hacerlo en casa si ha tenido perforación del tímpano."
      },
      {
        nombre: "Sangrado de nariz",
        sintomas: "Sangrado generalmente de la parte anterior de la nariz, por sequedad o rascado.",
        autocuidado: "Sentarse inclinado hacia ADELANTE (no hacia atrás) y apretar la parte blanda de la nariz 10-15 minutos sin soltar.",
        consultar: "Si no se detiene en 20 minutos, es frecuente, o la persona usa anticoagulantes o tiene presión alta."
      }
    ]
  },
  {
    id: "oftalmologia",
    nombre: "Oftalmología",
    icono: "👁️",
    descripcion: "Ojos y visión: ojo rojo, visión borrosa, picazón, cuerpo extraño, orzuelo.",
    palabras: ["ojo", "ojos", "vista", "vision borrosa", "ojo rojo", "conjuntivitis", "orzuelo", "parpado", "lagrimeo", "legana", "manchas en la vista", "moscas volantes", "destellos"],
    alarmas: [
      "Pérdida súbita de visión, total o parcial",
      "Ojo rojo con dolor intenso, visión borrosa y halos alrededor de las luces",
      "Destellos de luz con aparición de 'cortina' o muchas manchas nuevas (posible desprendimiento de retina)",
      "Químico o golpe fuerte en el ojo: lavar con abundante agua 15 minutos y acudir a urgencia"
    ],
    afecciones: [
      {
        nombre: "Conjuntivitis",
        sintomas: "Ojo rojo, sensación de arenilla, legaña. Viral: secreción acuosa, muy contagiosa. Bacteriana: secreción espesa amarilla. Alérgica: mucha picazón, en ambos ojos.",
        autocuidado: "Lavado con suero fisiológico, compresas frías, no compartir toallas, lavado de manos frecuente.",
        consultar: "Si hay dolor intenso, baja de visión, molestia con la luz, o usa lentes de contacto."
      },
      {
        nombre: "Orzuelo",
        sintomas: "Bulto rojo y doloroso en el borde del párpado.",
        autocuidado: "Compresas tibias 10 minutos, 4 veces al día. No exprimir.",
        consultar: "Si no mejora en 1-2 semanas o la hinchazón se extiende a todo el párpado con fiebre."
      },
      {
        nombre: "Ojo seco",
        sintomas: "Ardor, sensación de cuerpo extraño, cansancio visual, peor con pantallas.",
        autocuidado: "Lágrimas artificiales, regla 20-20-20 (cada 20 minutos mirar a 6 metros por 20 segundos), parpadear conscientemente.",
        consultar: "Si persiste pese a lágrimas artificiales."
      }
    ]
  },
  {
    id: "urologia",
    nombre: "Urología y Nefrología",
    icono: "💧",
    descripcion: "Riñones, vejiga y próstata: ardor al orinar, sangre en la orina, cálculos renales, problemas de próstata.",
    palabras: ["orina", "orinar", "pipi", "ardor al orinar", "cistitis", "infeccion urinaria", "rinon", "calculo", "piedra", "colico renal", "prostata", "sangre en la orina", "testiculo", "incontinencia"],
    alarmas: [
      "Dolor intenso en un testículo de inicio súbito (posible torsión: urgencia en horas)",
      "Fiebre con dolor en la zona lumbar y escalofríos (infección renal)",
      "No poder orinar con vejiga llena y dolorosa",
      "Cólico renal con fiebre o en riñón único"
    ],
    afecciones: [
      {
        nombre: "Infección urinaria baja (cistitis)",
        sintomas: "Ardor al orinar, ganas frecuentes de orinar, dolor sobre el pubis, orina turbia o con olor fuerte.",
        autocuidado: "Abundante agua, no aguantar las ganas de orinar, higiene de adelante hacia atrás.",
        consultar: "Para examen de orina y antibiótico. Urgente si hay fiebre, dolor lumbar, embarazo, o es hombre."
      },
      {
        nombre: "Cólico renal (cálculos)",
        sintomas: "Dolor muy intenso en la zona lumbar de un lado que baja hacia la ingle, en oleadas; puede haber náuseas y sangre en la orina.",
        autocuidado: "Hidratación. El dolor suele requerir analgesia indicada por médico.",
        consultar: "Atención médica para manejar el dolor; urgencia si hay fiebre o vómitos persistentes."
      },
      {
        nombre: "Hiperplasia prostática",
        sintomas: "En hombres mayores de 50: chorro débil, levantarse de noche a orinar, sensación de vaciado incompleto.",
        autocuidado: "Reducir líquidos en la noche, limitar cafeína y alcohol.",
        consultar: "Para evaluación con urólogo y control de antígeno prostático según indicación."
      }
    ]
  },
  {
    id: "ginecologia",
    nombre: "Ginecología y Obstetricia",
    icono: "🌸",
    descripcion: "Salud de la mujer: menstruación, flujo vaginal, embarazo, anticoncepción, menopausia, mamas.",
    palabras: ["menstruacion", "regla", "periodo", "atraso", "embarazo", "embarazada", "flujo", "vaginal", "ovario", "utero", "mama", "pecho bulto", "menopausia", "anticonceptivo", "colicos menstruales", "sangrado vaginal", "papanicolau"],
    alarmas: [
      "Embarazo con sangrado, dolor abdominal intenso, pérdida de líquido o disminución de movimientos del bebé",
      "Dolor abdominal intenso con atraso menstrual (posible embarazo ectópico)",
      "Embarazo con dolor de cabeza intenso, visión borrosa o hinchazón brusca (posible preeclampsia)",
      "Sangrado vaginal muy abundante (empapa más de una toalla por hora)"
    ],
    afecciones: [
      {
        nombre: "Dolor menstrual (dismenorrea)",
        sintomas: "Dolor tipo cólico en la parte baja del abdomen los primeros días de la regla.",
        autocuidado: "Calor local, actividad física, antiinflamatorios al inicio del dolor si no hay contraindicación.",
        consultar: "Si el dolor es incapacitante, empeora con los años o hay dolor en las relaciones sexuales (descartar endometriosis)."
      },
      {
        nombre: "Flujo vaginal anormal",
        sintomas: "Cambio de color, olor o cantidad; picazón o ardor. Blanco grumoso con picazón: hongos. Gris con olor a pescado: vaginosis.",
        autocuidado: "Ropa interior de algodón, evitar duchas vaginales y jabones perfumados.",
        consultar: "Para diagnóstico y tratamiento correcto; si hay fiebre, dolor pélvico o posible infección de transmisión sexual."
      },
      {
        nombre: "Atraso menstrual",
        sintomas: "Ausencia de menstruación en la fecha esperada.",
        autocuidado: "Test de embarazo en orina desde el primer día de atraso.",
        consultar: "Si el test es positivo (control prenatal precoz), o si hay atrasos repetidos sin embarazo."
      },
      {
        nombre: "Prevención",
        sintomas: "Papanicolau cada 3 años entre 25 y 64 años. Mamografía según edad y riesgo (desde los 50, o antes según indicación).",
        autocuidado: "Autoexamen de mamas mensual.",
        consultar: "Ante bulto en la mama, secreción por el pezón o retracción de la piel."
      }
    ]
  },
  {
    id: "pediatria",
    nombre: "Pediatría",
    icono: "🧸",
    descripcion: "Salud de niños y adolescentes: fiebre infantil, diarrea, tos, erupciones, vacunas, crecimiento.",
    palabras: ["bebe", "guagua", "nino", "nina", "hijo", "hija", "lactante", "recien nacido", "infantil", "pediatra", "vacuna", "colicos del bebe", "dentición"],
    alarmas: [
      "Lactante menor de 3 meses con fiebre (38 °C o más): URGENCIA",
      "Respiración rápida, quejido, hundimiento de costillas al respirar",
      "Niño decaído que no responde, muy somnoliento o irritable sin consuelo",
      "Manchas en la piel que no desaparecen al presionar, con fiebre",
      "Signos de deshidratación: no moja pañales en 6-8 horas, llanto sin lágrimas, fontanela hundida"
    ],
    afecciones: [
      {
        nombre: "Fiebre en niños",
        sintomas: "Temperatura sobre 37,5 °C axilar. Lo más importante es cómo se ve el niño entre las fiebres.",
        autocuidado: "Ropa liviana, líquidos, paracetamol en dosis según PESO (no según edad). No usar aspirina. No baños con alcohol.",
        consultar: "Menores de 3 meses siempre. Mayores: si dura más de 48-72 horas, el niño se ve decaído entre fiebres o hay alarmas."
      },
      {
        nombre: "Bronquiolitis / síndrome bronquial obstructivo",
        sintomas: "En lactantes, en invierno: tos, mocos, silbido al respirar, respiración rápida.",
        autocuidado: "Aseo nasal con suero antes de alimentar, alimentación fraccionada, posición semisentada.",
        consultar: "Si respira rápido, se le hunden las costillas, rechaza alimentación o tiene pausas respiratorias (urgencia)."
      },
      {
        nombre: "Diarrea infantil",
        sintomas: "Deposiciones líquidas frecuentes, a veces con vómitos.",
        autocuidado: "Sales de rehidratación oral en pequeñas cantidades frecuentes, mantener lactancia materna.",
        consultar: "Si hay sangre, deshidratación, vómitos que impiden hidratar, o es menor de 6 meses."
      }
    ]
  },
  {
    id: "geriatria",
    nombre: "Geriatría",
    icono: "👵",
    descripcion: "Salud del adulto mayor: caídas, pérdida de memoria, múltiples medicamentos, incontinencia, fragilidad.",
    palabras: ["adulto mayor", "abuelo", "abuela", "anciano", "tercera edad", "caidas", "demencia", "alzheimer", "olvido", "confusion", "incontinencia", "polifarmacia", "muchos medicamentos", "fragilidad"],
    alarmas: [
      "Confusión o agitación de inicio brusco (puede ser infección, deshidratación o efecto de medicamentos)",
      "Caída con golpe en la cabeza en persona que usa anticoagulantes",
      "Caída con dolor de cadera y no puede apoyar la pierna (posible fractura)",
      "Dejar de comer o beber por más de 24 horas"
    ],
    afecciones: [
      {
        nombre: "Caídas",
        sintomas: "Factores de riesgo: mala visión, debilidad muscular, medicamentos para dormir o presión, alfombras sueltas, poca luz.",
        autocuidado: "Barras en el baño, luz nocturna, calzado firme, ejercicios de equilibrio y fuerza.",
        consultar: "Después de cualquier caída para revisar causas y medicamentos."
      },
      {
        nombre: "Deterioro de memoria",
        sintomas: "Olvidos que afectan la vida diaria: perderse en lugares conocidos, repetir preguntas, dificultad para manejar dinero.",
        autocuidado: "Estimulación cognitiva, actividad física y social, control de presión y diabetes.",
        consultar: "Para evaluación; el Alzheimer y otras demencias tienen cobertura GES. Descartar causas tratables (tiroides, vitamina B12, depresión)."
      },
      {
        nombre: "Polifarmacia",
        sintomas: "Uso de 5 o más medicamentos aumenta riesgo de interacciones, mareos y caídas.",
        autocuidado: "Mantener lista actualizada de todos los medicamentos, incluidas hierbas y vitaminas.",
        consultar: "Revisión anual de medicamentos con su médico."
      }
    ]
  },
  {
    id: "endocrinologia",
    nombre: "Endocrinología",
    icono: "⚖️",
    descripcion: "Hormonas y metabolismo: diabetes, tiroides, obesidad, colesterol.",
    palabras: ["diabetes", "azucar", "glicemia", "insulina", "tiroides", "hipotiroidismo", "hipertiroidismo", "obesidad", "sobrepeso", "peso", "colesterol", "trigliceridos", "mucha sed", "orino mucho"],
    alarmas: [
      "Diabético con glicemia bajo 70 mg/dl con sudor, temblor o confusión: dar azúcar de inmediato",
      "Mucha sed, orina abundante, vómitos, respiración rápida y aliento a fruta (posible cetoacidosis)",
      "Glicemia mayor a 300 mg/dl con malestar"
    ],
    afecciones: [
      {
        nombre: "Diabetes tipo 2",
        sintomas: "A menudo sin síntomas. Puede haber mucha sed, orinar mucho, cansancio, visión borrosa, heridas que demoran en sanar.",
        autocuidado: "Alimentación con menos azúcares y harinas refinadas, actividad física 150 minutos semanales, control de peso, revisión diaria de pies.",
        consultar: "Para diagnóstico (glicemia en ayunas ≥ 126 mg/dl en 2 ocasiones). Tiene cobertura GES y programa en CESFAM."
      },
      {
        nombre: "Hipotiroidismo",
        sintomas: "Cansancio, frío, aumento de peso, piel seca, estreñimiento, caída de pelo, ánimo bajo.",
        autocuidado: "Tomar la levotiroxina en ayunas, separada de otros medicamentos y alimentos.",
        consultar: "Para medir TSH; control periódico si ya está en tratamiento."
      },
      {
        nombre: "Hipertiroidismo",
        sintomas: "Palpitaciones, baja de peso con apetito aumentado, temblor, calor, nerviosismo, insomnio.",
        autocuidado: "Evitar estimulantes.",
        consultar: "Evaluación médica para exámenes."
      }
    ]
  },
  {
    id: "salud-mental",
    nombre: "Salud Mental",
    icono: "🧘",
    descripcion: "Ánimo, ansiedad, sueño, estrés y bienestar emocional.",
    palabras: ["ansiedad", "angustia", "depresion", "triste", "tristeza", "estres", "panico", "insomnio", "no puedo dormir", "suicidio", "quitarme la vida", "matarme", "morir", "autolesion", "llorar", "nervios", "burnout"],
    alarmas: [
      "Ideas de quitarse la vida o hacerse daño: llamar a *4141 (Línea de Prevención del Suicidio, gratis, 24/7) o al 131",
      "Escuchar voces o ver cosas que otros no ven, con conducta peligrosa",
      "Ataque de pánico con dolor de pecho en persona con factores de riesgo cardiovascular (descartar causa cardíaca)"
    ],
    afecciones: [
      {
        nombre: "Ansiedad",
        sintomas: "Preocupación excesiva, inquietud, tensión muscular, palpitaciones, dificultad para dormir o concentrarse.",
        autocuidado: "Respiración lenta (inhalar 4 segundos, exhalar 6), actividad física, reducir cafeína, rutina de sueño, hablar con alguien de confianza.",
        consultar: "Si interfiere con el trabajo, estudios o relaciones. Hay tratamientos efectivos (psicoterapia y/o medicamentos)."
      },
      {
        nombre: "Crisis de pánico",
        sintomas: "Episodio súbito de miedo intenso con palpitaciones, falta de aire, temblor, sensación de muerte inminente; dura 10-30 minutos.",
        autocuidado: "Respiración lenta, recordar que la crisis pasa, técnica 5-4-3-2-1 (nombrar 5 cosas que ve, 4 que toca…).",
        consultar: "Si se repiten; la primera vez conviene descartar causas físicas."
      },
      {
        nombre: "Depresión",
        sintomas: "Tristeza o pérdida de interés la mayor parte del día por más de 2 semanas, alteración del sueño y apetito, cansancio, culpa, dificultad para concentrarse.",
        autocuidado: "Mantener rutinas, actividad física, contacto social, evitar alcohol.",
        consultar: "Siempre conviene evaluación: la depresión en mayores de 15 años tiene cobertura GES. Urgente si hay ideas de muerte."
      },
      {
        nombre: "Insomnio",
        sintomas: "Dificultad para conciliar o mantener el sueño, despertar muy temprano, cansancio diurno.",
        autocuidado: "Horarios fijos, sin pantallas 1 hora antes, evitar cafeína después del mediodía, dormitorio oscuro y fresco, no quedarse en cama despierto más de 20 minutos.",
        consultar: "Si dura más de 3 meses o afecta el funcionamiento diario. Evitar automedicarse con pastillas para dormir."
      }
    ]
  },
  {
    id: "infectologia",
    nombre: "Infectología",
    icono: "🦠",
    descripcion: "Infecciones: virus, bacterias, infecciones de transmisión sexual, viajes, vacunas.",
    palabras: ["infeccion", "virus", "bacteria", "contagio", "ets", "its", "transmision sexual", "vih", "sifilis", "herpes genital", "viaje", "dengue", "covid", "hepatitis", "parasitos"],
    alarmas: [
      "Fiebre con manchas en la piel que no desaparecen al presionar",
      "Fiebre en persona con defensas bajas (quimioterapia, trasplante, VIH no controlado)",
      "Fiebre tras viaje a zona tropical (descartar malaria o dengue)"
    ],
    afecciones: [
      {
        nombre: "Infecciones de transmisión sexual",
        sintomas: "Secreción genital, ardor al orinar, úlceras o verrugas genitales; muchas veces sin síntomas.",
        autocuidado: "Uso de condón, test periódico si hay riesgo, informar a parejas.",
        consultar: "Ante cualquier síntoma o exposición de riesgo. El test de VIH es gratuito y confidencial en la red pública. Tras exposición de riesgo, acudir antes de 72 horas (profilaxis post exposición)."
      },
      {
        nombre: "COVID-19",
        sintomas: "Fiebre, tos, dolor de garganta, cansancio, pérdida de olfato o gusto.",
        autocuidado: "Aislamiento mientras tenga síntomas, hidratación, ventilación.",
        consultar: "Si hay dificultad respiratoria o la persona es de riesgo."
      }
    ]
  },
  {
    id: "reumatologia",
    nombre: "Reumatología",
    icono: "🤲",
    descripcion: "Enfermedades inflamatorias de articulaciones y autoinmunes: artritis, gota, lupus, fibromialgia.",
    palabras: ["artritis", "gota", "acido urico", "lupus", "fibromialgia", "articulaciones hinchadas", "rigidez", "dedos hinchados", "reumatismo", "dolor en todo el cuerpo"],
    alarmas: [
      "Articulación muy roja, caliente e hinchada con fiebre (posible artritis séptica: urgencia)"
    ],
    afecciones: [
      {
        nombre: "Gota",
        sintomas: "Dolor muy intenso de inicio brusco, muchas veces de noche, en el dedo gordo del pie, con enrojecimiento e hinchazón.",
        autocuidado: "Reposo de la articulación, hielo, hidratación, reducir alcohol (especialmente cerveza), carnes rojas, mariscos y bebidas azucaradas.",
        consultar: "Para tratamiento de la crisis y prevención si se repite."
      },
      {
        nombre: "Artritis reumatoide",
        sintomas: "Dolor e hinchazón de varias articulaciones pequeñas (manos, muñecas) en ambos lados, rigidez matinal de más de 1 hora.",
        autocuidado: "Mantenerse activo, no fumar.",
        consultar: "Pronto: el tratamiento precoz evita daño articular. Tiene cobertura GES."
      },
      {
        nombre: "Fibromialgia",
        sintomas: "Dolor generalizado por más de 3 meses, cansancio, sueño no reparador, dificultades de concentración.",
        autocuidado: "Ejercicio aeróbico gradual, higiene del sueño, manejo del estrés.",
        consultar: "Para diagnóstico y descartar otras causas."
      }
    ]
  },
  {
    id: "odontologia",
    nombre: "Odontología",
    icono: "🦷",
    descripcion: "Dientes y encías: dolor de muelas, encías que sangran, abscesos, sensibilidad.",
    palabras: ["diente", "muela", "dolor de muela", "encia", "encias", "caries", "absceso", "flemon", "boca", "llaga", "afta", "mal aliento", "sensibilidad dental", "bruxismo"],
    alarmas: [
      "Hinchazón de cara o cuello con fiebre por infección dental, sobre todo si cuesta tragar o respirar: URGENCIA"
    ],
    afecciones: [
      {
        nombre: "Dolor de muela",
        sintomas: "Dolor con frío/dulce que pasa rápido (caries inicial) o dolor espontáneo, pulsátil y que despierta de noche (pulpitis).",
        autocuidado: "Analgésico, higiene cuidadosa, evitar alimentos muy fríos o calientes. No poner aspirina sobre la encía.",
        consultar: "Al dentista lo antes posible; urgencia dental si hay hinchazón o fiebre."
      },
      {
        nombre: "Encías que sangran (gingivitis)",
        sintomas: "Encías rojas, inflamadas, que sangran al cepillar.",
        autocuidado: "Cepillado 3 veces al día con técnica suave, uso de hilo dental diario.",
        consultar: "Si no mejora en 2 semanas o hay dientes con movilidad."
      },
      {
        nombre: "Aftas",
        sintomas: "Úlceras pequeñas, blanquecinas con borde rojo y dolorosas en la boca; sanan en 7-14 días.",
        autocuidado: "Evitar alimentos ácidos o picantes, enjuagues suaves.",
        consultar: "Si duran más de 3 semanas, son muy grandes o se repiten con frecuencia."
      }
    ]
  }
];
