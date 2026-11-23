(() => {
  'use strict';

  const messagesEl = document.getElementById('messages');
  const form = document.getElementById('composerForm');
  const input = document.getElementById('composerInput');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const menuToggle = document.getElementById('menuToggle');
  const newChatBtn = document.getElementById('newChatBtn');
  const fontUp = document.getElementById('fontUp');
  const fontDown = document.getElementById('fontDown');
  const themeToggle = document.getElementById('themeToggle');
  const areaList = document.getElementById('areaList');

  const tplTopic = document.getElementById('tpl-topic-card');
  const tplPhones = document.getElementById('tpl-phones-card');
  const tplDef = document.getElementById('tpl-def-card');
  const openGlossaryBtn = document.getElementById('openGlossaryBtn');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  // ---------- Accessibility: font scale ----------
  const MIN_SCALE = 0.85, MAX_SCALE = 1.45, STEP = 0.075;
  function currentScale() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-scale')) || 1;
  }
  function applyFontScale(scale) {
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
    document.documentElement.style.setProperty('--font-scale', clamped.toFixed(3));
    store.set('mediconsultas:fontScale', String(clamped));
  }
  applyFontScale(parseFloat(store.get('mediconsultas:fontScale')) || 1);
  fontUp.addEventListener('click', () => applyFontScale(currentScale() + STEP));
  fontDown.addEventListener('click', () => applyFontScale(currentScale() - STEP));

  // ---------- Theme ----------
  const savedTheme = store.get('mediconsultas:theme');
  document.documentElement.setAttribute('data-theme',
    savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    store.set('mediconsultas:theme', next);
  });

  // ---------- Sidebar (mobile) ----------
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarBackdrop.classList.add('show');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  menuToggle.addEventListener('click', () => (sidebar.classList.contains('open') ? closeSidebar() : openSidebar()));
  sidebarBackdrop.addEventListener('click', closeSidebar);

  // ---------- Helpers ----------
  function scrollToBottom() { messagesEl.scrollTop = messagesEl.scrollHeight; }

  function fillList(root, role, values, wrapRole) {
    const wrap = root.querySelector(`[data-role="${wrapRole}"]`);
    if (!values || !values.length) { wrap.remove(); return; }
    const list = root.querySelector(`[data-role="${role}"]`);
    values.forEach((v) => {
      const li = document.createElement('li');
      li.textContent = v;
      list.appendChild(li);
    });
  }

  function fillText(root, role, value, wrapRole) {
    if (!value) { root.querySelector(`[data-role="${wrapRole}"]`).remove(); return; }
    root.querySelector(`[data-role="${role}"]`).textContent = value;
  }

  function chips(labels, className) {
    const wrap = document.createElement('div');
    wrap.className = `chips ${className || ''}`;
    labels.forEach((label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = label;
      b.addEventListener('click', () => ask(label));
      wrap.appendChild(b);
    });
    return wrap;
  }

  const fmt = (n) => `$${Math.round(n).toLocaleString('es-CL')}`;

  // ---------- Messages ----------
  function addUserMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'msg user';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    scrollToBottom();
  }

  function buildTopicCard(t) {
    const node = tplTopic.content.cloneNode(true);
    const root = node.querySelector('.card-topic');
    root.dataset.area = t.areaId || '';
    root.querySelector('[data-role="area"]').textContent = t.area || '';
    root.querySelector('[data-role="titulo"]').textContent = t.titulo;
    root.querySelector('[data-role="resumen"]').textContent = t.resumen || '';
    root.querySelector('[data-role="area"]').textContent = `${t.icono || ''} ${t.area || ''}`.trim();
    root.querySelector('[data-role="sintomas"]').textContent = t.sintomas || '';
    fillList(root, 'autocuidado', t.autocuidado, 'autocuidadoWrap');
    fillList(root, 'consultar', t.consultar, 'consultarWrap');
    fillList(root, 'alarmas', t.alarmas, 'alarmasWrap');
    fillList(root, 'donde', t.dondeAcudir, 'dondeWrap');
    fillText(root, 'consejo', t.consejo, 'consejoWrap');
    fillText(root, 'alerta', t.alerta, 'alertaWrap');
    return root;
  }

  function buildDefinitionCard(d) {
    const node = tplDef.content.cloneNode(true);
    const root = node.querySelector('.card-def');
    root.querySelector('[data-role="termino"]').textContent = d.termino;
    root.querySelector('[data-role="area"]').textContent = d.area || '';
    root.querySelector('[data-role="definicion"]').textContent = d.definicion;
    fillText(root, 'base', d.base, 'baseWrap');
    return root;
  }

  function feedbackBar(question, answer) {
    const bar = document.createElement('div');
    bar.className = 'feedback';
    const label = document.createElement('span');
    label.textContent = '¿Te sirvió esta respuesta?';
    bar.appendChild(label);
    const temas = (answer.items || []).map((i) => i.id || i.termino);
    [['👍 Sí', true], ['👎 No', false]].forEach(([text, util]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = text;
      b.addEventListener('click', () => {
        fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: question, util, temas }) }).catch(() => {});
        bar.textContent = util ? '¡Gracias! 🙌' : 'Gracias, lo usaremos para mejorar la base de conocimiento médico.';
      });
      bar.appendChild(b);
    });
    return bar;
  }

  function addAssistantAnswer(answer, question) {
    const wrap = document.createElement('div');
    wrap.className = 'msg assistant';
    const stack = document.createElement('div');
    stack.className = 'assistant-stack';

    (answer.urgent || []).forEach((u) => {
      const urgent = document.createElement('div');
      urgent.className = 'urgent-note';
      urgent.setAttribute('role', 'alert');
      urgent.textContent = u;
      stack.appendChild(urgent);
    });

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = `${answer.greeting || ''} ${answer.body || ''}`.trim();
    stack.appendChild(bubble);

    if (answer.leyes && answer.leyes.length) {
      const leyes = document.createElement('details');
      leyes.className = 'card card-details laws';
      leyes.innerHTML = '<summary>📚 Fuentes de referencia de esta área</summary>';
      const ul = document.createElement('ul');
      answer.leyes.forEach((l) => { const li = document.createElement('li'); li.textContent = l; ul.appendChild(li); });
      leyes.appendChild(ul);
      stack.appendChild(leyes);
    }

    if (answer.items && answer.items.length) {
      const cards = document.createElement('div');
      cards.className = 'cards';
      answer.items.forEach((item) => cards.appendChild(item.type === 'definicion' ? buildDefinitionCard(item) : buildTopicCard(item)));
      stack.appendChild(cards);
    }

    if (answer.temario) buildTemario().then((card) => stack.insertBefore(card, stack.querySelector('.disclaimer')));

    if (answer.topicLinks && answer.topicLinks.length) stack.appendChild(chips(answer.topicLinks));

    if (answer.related && answer.related.length) {
      const label = document.createElement('p');
      label.className = 'related-label';
      label.textContent = 'También te puede servir:';
      stack.appendChild(label);
      stack.appendChild(chips(answer.related, 'chips-soft'));
    }

    if (question && answer.items && answer.items.length) stack.appendChild(feedbackBar(question, answer));

    if (answer.disclaimer) {
      const d = document.createElement('p');
      d.className = 'disclaimer';
      d.textContent = answer.disclaimer;
      stack.appendChild(d);
    }

    wrap.appendChild(stack);
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  // ---------- Herramientas ----------
  function showCard(card) {
    closeSidebar();
    const wrap = document.createElement('div');
    wrap.className = 'msg assistant';
    const stack = document.createElement('div');
    stack.className = 'assistant-stack';
    stack.appendChild(card);
    wrap.appendChild(stack);
    messagesEl.appendChild(wrap);
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.getElementById('openPhonesBtn').addEventListener('click', () => showCard(tplPhones.content.cloneNode(true).querySelector('.card')));

  // Temario: todas las fichas ordenadas por área, con buscador.
  const tplTemario = document.getElementById('tpl-temario-card');
  const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let temarioData = null;
  async function buildTemario() {
    const card = tplTemario.content.cloneNode(true).querySelector('.card');
    const list = card.querySelector('[data-role="list"]');
    const count = card.querySelector('[data-role="count"]');
    const search = card.querySelector('.temario-search');
    list.textContent = 'Cargando temario…';
    try {
      if (!temarioData) temarioData = (await (await fetch('/api/temario')).json()).areas;
    } catch {
      list.textContent = 'No pude cargar el temario. Revisa tu conexión e intenta de nuevo.';
      return card;
    }
    const render = () => {
      const q = norm(search.value.trim());
      list.innerHTML = '';
      let total = 0;
      temarioData.forEach((a) => {
        const temas = a.temas.filter((t) => !q || norm(`${t.titulo} ${t.resumen} ${a.titulo}`).includes(q));
        if (!temas.length) return;
        total += temas.length;
        const det = document.createElement('details');
        det.className = 'temario-area';
        det.open = Boolean(q);
        const sum = document.createElement('summary');
        sum.textContent = `${a.icono || ''} ${a.titulo} (${temas.length})`;
        det.appendChild(sum);
        const ul = document.createElement('ul');
        temas.forEach((t) => {
          const li = document.createElement('li');
          const b = document.createElement('button');
          b.type = 'button';
          const strong = document.createElement('strong');
          strong.textContent = t.titulo;
          const span = document.createElement('span');
          span.textContent = t.resumen;
          b.append(strong, span);
          b.addEventListener('click', () => ask(t.titulo));
          li.appendChild(b);
          ul.appendChild(li);
        });
        det.appendChild(ul);
        list.appendChild(det);
      });
      count.textContent = q ? `${total} resultado(s) para "${search.value.trim()}"` : `${total} enfermedades y síntomas en ${temarioData.length} áreas`;
      if (!total) list.textContent = 'Sin resultados. Prueba con otra palabra o escribe tu síntoma en el chat.';
    };
    search.addEventListener('input', render);
    render();
    return card;
  }
  async function showTemario() { showCard(await buildTemario()); }
  document.getElementById('openTemarioBtn').addEventListener('click', showTemario);
  openGlossaryBtn.addEventListener('click', () => ask('Glosario'));

  // ---------- Ask ----------
  function addAssistantTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'msg assistant';
    wrap.innerHTML = '<div class="bubble">Buscando en la base médica…</div>';
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  // Render's free tier sleeps after inactivity; wake it as soon as the page loads.
  fetch('/api/health', { cache: 'no-store' }).catch(() => {});

  async function ask(message) {
    closeSidebar();
    addUserMessage(message);
    const typing = addAssistantTyping();
    const slowNotice = setTimeout(() => {
      const b = typing.querySelector('.bubble');
      if (b) b.textContent = 'Buscando en la base médica… el servidor estaba dormido y está despertando, puede tardar hasta un minuto la primera vez.';
    }, 6000);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      typing.remove();
      const node = addAssistantAnswer(data.answer, message);
      if (data.answer.items && data.answer.items.length) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      typing.remove();
      addAssistantAnswer({
        greeting: 'Ups.',
        body: err && err.name === 'AbortError'
          ? 'El servidor está tardando más de lo normal (puede estar despertando). Espera unos segundos y vuelve a enviar tu consulta.'
          : 'Tuve un problema de conexión para responder. Revisa tu internet e intenta de nuevo.',
      });
    } finally {
      clearTimeout(slowNotice);
      clearTimeout(timeoutId);
    }
  }

  function submitComposer() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';
    ask(text);
  }
  form.addEventListener('submit', (e) => { e.preventDefault(); submitComposer(); });
  // requestSubmit() isn't available on older iOS Safari; handle Enter directly.
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComposer(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 136) + 'px';
  });

  // ---------- Sidebar content ----------
  async function loadAreas() {
    try {
      const res = await fetch('/api/areas');
      const data = await res.json();
      data.areas.forEach((a) => {
        const det = document.createElement('details');
        det.className = 'area-group';
        det.dataset.area = a.id;
        const sum = document.createElement('summary');
        sum.textContent = `${a.icono || ''} ${a.titulo}`.trim();
        det.appendChild(sum);
        const ul = document.createElement('ul');
        ul.className = 'topic-list';
        a.temas.forEach((t) => {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.textContent = t.titulo;
          btn.addEventListener('click', () => ask(t.titulo));
          li.appendChild(btn);
          ul.appendChild(li);
        });
        det.appendChild(ul);
        areaList.appendChild(det);
      });
    } catch { /* the sidebar is a convenience; leave it empty on failure */ }
  }
  loadAreas();

  // ---------- Welcome ----------
  function showWelcome() {
    messagesEl.innerHTML = '';
    addAssistantAnswer({
      greeting: '¡Hola! Soy MEDICONSULTAS, tu orientador de salud.',
      body: 'Cuéntame qué sientes con tus palabras y te explico qué podría ser, qué puedes hacer ahora, cuándo consultar y qué señales de alarma vigilar. La información está ordenada por áreas de la medicina: puedes verlas en el menú.',
      topicLinks: [
        'Me duele la rodilla al subir escaleras',
        'Me salió un grano rojo que duele',
        'Tengo dolor en la parte baja del estómago',
        'Me zumban los oídos',
        'Tos con flema hace 5 días',
        'Mi guagua tiene fiebre',
        'Tengo la presión alta',
        'Me arde al orinar',
        'Me duele la cabeza todos los días',
        'No puedo dormir',
        'Tengo dolor de muela',
        '¿Qué es el GES?',
        'Ver temario',
      ],
      disclaimer: 'Orientación general. No reemplaza la evaluación de un médico. En una emergencia llama al 131.',
    });
  }
  newChatBtn.addEventListener('click', () => {
    showWelcome();
    input.value = '';
    input.style.height = 'auto';
    input.focus();
    closeSidebar();
  });
  showWelcome();
})();
