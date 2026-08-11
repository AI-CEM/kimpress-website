import { gsap } from 'gsap';

/**
 * KIMPRESS NEURAL KI-OPERATOR — ULTIMATE EDITION V3 (API & n8n READY)
 * Features:
 * - German Operator Branding ("Kimpress KI-Operator")
 * - Live n8n / Gemini 2.5 Flash Webhook Adapter with Offline Fallback
 * - Authentic Founder Story Copywriting for Cem Görül
 * - High-End n8n Canvas Node Blueprint Visualizer
 * - Upgraded 3-Slider Interactive ROI Calculator (with Amortization Days)
 * - Comprehensive FAQ & Objection Knowledge Base (Services 01-06)
 * - GSAP HUD Animations & Neural Canvas Particles
 */

let N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/kimpress-chat'; 

export function initChatbot() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.getElementById('kimpress-bot-root')) {
    createBotDOM();
  }

  const trigger = document.getElementById('bot-trigger');
  const panel = document.getElementById('bot-panel');
  const closeBtn = document.getElementById('bot-close');
  const messagesContainer = document.getElementById('bot-messages');
  const form = document.getElementById('bot-input-form');
  const input = document.getElementById('bot-input-field');
  const quickChipsContainer = document.getElementById('bot-quick-chips');
  const hintPill = document.getElementById('bot-hint-pill');

  let isOpen = false;
  let isTyping = false;
  let hasInteracted = false;

  initHeaderCanvas();
  initContextObserver(hintPill);
  initChatState();

  trigger.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  if (hintPill) {
    hintPill.addEventListener('click', () => {
      if (!isOpen) toggleChat();
    });
  }

  const privacyLink = document.getElementById('bot-privacy-link');
  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      const dsBtn = document.getElementById('open-datenschutz');
      if (dsBtn) dsBtn.click();
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query || isTyping) return;
    input.value = '';
    handleUserMessage(query);
  });

  quickChipsContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.bot-chip');
    if (!chip || isTyping) return;
    const action = chip.dataset.action;
    const text = chip.textContent.trim();
    
    if (action === 'roi') {
      appendUserBubble(text);
      renderROICalculator();
    } else {
      handleUserMessage(text);
    }
  });

  function toggleChat() {
    isOpen = !isOpen;
    hasInteracted = true;
    if (hintPill) hintPill.classList.remove('active');

    if (isOpen) {
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      trigger.classList.add('active');
      const badge = trigger.querySelector('.bot-trigger__badge');
      if (badge) badge.style.display = 'none';

      if (!reduced) {
        gsap.fromTo(panel, 
          { opacity: 0, y: 30, scale: 0.95 }, 
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
        );
      }

      setTimeout(() => input.focus(), 300);
    } else {
      if (!reduced) {
        gsap.to(panel, {
          opacity: 0, y: 20, scale: 0.96, duration: 0.3, ease: 'power2.in',
          onComplete: () => {
            panel.classList.remove('is-open');
            panel.setAttribute('aria-hidden', 'true');
            trigger.classList.remove('active');
          }
        });
      } else {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        trigger.classList.remove('active');
      }
    }
  }

  function initChatState() {
    const history = sessionStorage.getItem('kimpress_chat_history');
    if (history) {
      try {
        const parsed = JSON.parse(history);
        parsed.forEach(msg => {
          if (msg.role === 'user') appendUserBubble(msg.text, false);
          else if (msg.role === 'bot') appendBotBubble(msg.text, false, false);
        });
        scrollToBottom();
        return;
      } catch (e) {
        console.warn('Failed to parse chat history', e);
      }
    }

    appendBotBubble(
      `⚡ **Moin! Ich bin der Kimpress KI-Operator.**\n\nIch liefere dir direkte Antworten zu KI-Automatisierung, n8n Workflows, Festpreisen und wie wir manuelle Routinearbeit in deinem Betrieb eliminieren.\n\nWorüber sprechen wir?`,
      true,
      false
    );
  }

  function saveMessage(role, text) {
    let history = [];
    try {
      history = JSON.parse(sessionStorage.getItem('kimpress_chat_history') || '[]');
    } catch { history = []; }
    history.push({ role, text, time: new Date().toISOString() });
    sessionStorage.setItem('kimpress_chat_history', JSON.stringify(history.slice(-20)));
  }

  async function handleUserMessage(userText) {
    appendUserBubble(userText);
    saveMessage('user', userText);
    showTypingIndicator();

    const intentResult = checkSpecialIntents(userText);
    if (intentResult) {
      removeTypingIndicator();
      if (intentResult.type === 'roi') {
        renderROICalculator();
      } else if (intentResult.type === 'blueprint') {
        appendBotBubble(intentResult.text, true, true);
        renderBlueprintCard();
      }
      saveMessage('bot', intentResult.text || 'ROI Rechner gestartet.');
      return;
    }

    // Try Live n8n / Gemini API if configured
    if (N8N_WEBHOOK_URL) {
      try {
        const res = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText, timestamp: new Date().toISOString() })
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.output || data.message || data.text;
          if (reply) {
            removeTypingIndicator();
            appendBotBubble(reply, true, true);
            saveMessage('bot', reply);
            return;
          }
        }
      } catch (err) {
        console.warn('n8n Webhook connection failed, using local AI engine fallback.', err);
      }
    }

    // Fallback: Local Knowledge Engine
    setTimeout(() => {
      const response = generateAIResponse(userText);
      removeTypingIndicator();
      appendBotBubble(response.text, true, true);
      saveMessage('bot', response.text);
    }, 400 + Math.random() * 300);
  }

  function appendUserBubble(text, save = true) {
    const bubble = document.createElement('div');
    bubble.className = 'bot-msg bot-msg--user';
    bubble.innerHTML = `<div class="bot-bubble">${escapeHTML(text)}</div>`;
    messagesContainer.appendChild(bubble);
    scrollToBottom();
  }

  function appendBotBubble(rawText, animate = true, isTypewriter = true) {
    const bubble = document.createElement('div');
    bubble.className = 'bot-msg bot-msg--bot';
    
    const formatted = formatMarkdown(rawText);
    
    if (animate && isTypewriter && !reduced) {
      bubble.innerHTML = `<div class="bot-bubble"><span class="bot-text"></span><span class="bot-cursor">▌</span></div>`;
      messagesContainer.appendChild(bubble);
      scrollToBottom();
      
      isTyping = true;
      const textSpan = bubble.querySelector('.bot-text');
      const cursor = bubble.querySelector('.bot-cursor');
      
      let index = 0;
      const htmlContent = formatted;
      const timer = setInterval(() => {
        if (index < htmlContent.length) {
          if (htmlContent[index] === '<') {
            const endTag = htmlContent.indexOf('>', index);
            if (endTag !== -1) {
              index = endTag + 1;
            } else {
              index++;
            }
          } else {
            index++;
          }
          textSpan.innerHTML = htmlContent.slice(0, index);
          scrollToBottom();
        } else {
          clearInterval(timer);
          if (cursor) cursor.remove();
          isTyping = false;
        }
      }, 8);
    } else {
      bubble.innerHTML = `<div class="bot-bubble">${formatted}</div>`;
      messagesContainer.appendChild(bubble);
      scrollToBottom();
    }
  }

  function showTypingIndicator() {
    isTyping = true;
    const indicator = document.createElement('div');
    indicator.className = 'bot-msg bot-msg--bot bot-msg--typing';
    indicator.id = 'bot-typing';
    indicator.innerHTML = `
      <div class="bot-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    messagesContainer.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    document.getElementById('bot-typing')?.remove();
    isTyping = false;
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // --- UPGRADED 3-SLIDER INTERACTIVE ROI CALCULATOR ---
  function renderROICalculator() {
    removeTypingIndicator();
    const container = document.createElement('div');
    container.className = 'bot-msg bot-msg--bot bot-msg--custom';
    
    container.innerHTML = `
      <div class="bot-bubble bot-card-roi">
        <div class="bot-card-roi__header">
          <span class="bot-card-roi__badge">⚡ ADVANCED ROI & AMORTISATIONS-RECHNER</span>
          <h4>Berechne deinen Netto-Gewinn durch Automatisierung</h4>
        </div>
        
        <div class="bot-card-roi__slider-group">
          <div class="bot-roi-label">
            <span>Teamgröße:</span>
            <strong id="roi-val-team">4 Personen</strong>
          </div>
          <input type="range" id="roi-slider-team" min="1" max="50" value="4" class="bot-roi-slider" />
        </div>

        <div class="bot-card-roi__slider-group">
          <div class="bot-roi-label">
            <span>Routinearbeit / Woche:</span>
            <strong id="roi-val-hours">10 Std. / Person</strong>
          </div>
          <input type="range" id="roi-slider-hours" min="2" max="35" value="10" class="bot-roi-slider" />
        </div>

        <div class="bot-card-roi__slider-group">
          <div class="bot-roi-label">
            <span>Kosten pro Stunde:</span>
            <strong id="roi-val-rate">65 € / Std.</strong>
          </div>
          <input type="range" id="roi-slider-rate" min="30" max="150" value="65" step="5" class="bot-roi-slider" />
        </div>

        <div class="bot-card-roi__result">
          <div class="bot-roi-res-item">
            <span class="bot-roi-res-lbl">Gesparte Arbeitszeit</span>
            <span class="bot-roi-res-val" id="roi-res-hours">1.440 Std. / Jahr</span>
          </div>
          <div class="bot-roi-res-item bot-roi-res-item--highlight">
            <span class="bot-roi-res-lbl">Jährlicher Netto-Gewinn</span>
            <span class="bot-roi-res-val" id="roi-res-money">93.600 €</span>
          </div>
        </div>

        <div class="bot-roi-amort">
          ⏱️ <span>Typische Amortisationszeit deiner Investition: <strong id="roi-res-days" style="color:#00FF66;">ca. 9 Tage</strong></span>
        </div>

        <button class="btn btn--primary btn--sm bot-roi-cta" id="roi-cta-btn" style="width:100%;margin-top:12px;justify-content:center;">
          Kostenloses Prozess-Audit vereinbaren →
        </button>
      </div>
    `;

    messagesContainer.appendChild(container);
    scrollToBottom();

    const teamSlider = container.querySelector('#roi-slider-team');
    const hoursSlider = container.querySelector('#roi-slider-hours');
    const rateSlider = container.querySelector('#roi-slider-rate');
    const teamVal = container.querySelector('#roi-val-team');
    const hoursVal = container.querySelector('#roi-val-hours');
    const rateVal = container.querySelector('#roi-val-rate');
    const resHours = container.querySelector('#roi-res-hours');
    const resMoney = container.querySelector('#roi-res-money');
    const resDays = container.querySelector('#roi-res-days');
    const ctaBtn = container.querySelector('#roi-cta-btn');

    function updateCalculations() {
      const team = parseInt(teamSlider.value, 10);
      const hours = parseInt(hoursSlider.value, 10);
      const rate = parseInt(rateSlider.value, 10);

      teamVal.textContent = `${team} ${team === 1 ? 'Person' : 'Personen'}`;
      hoursVal.textContent = `${hours} Std. / Person`;
      rateVal.textContent = `${rate} € / Std.`;

      const savedHoursYear = Math.round(team * hours * 48 * 0.75);
      const savedMoneyYear = Math.round(savedHoursYear * rate);
      const amortDays = Math.max(3, Math.round((2500 / (savedMoneyYear / 365))));

      resHours.textContent = `${savedHoursYear.toLocaleString('de-DE')} Std. / Jahr`;
      resMoney.textContent = `${savedMoneyYear.toLocaleString('de-DE')} €`;
      resDays.textContent = `ca. ${amortDays} Tage`;
    }

    teamSlider.addEventListener('input', updateCalculations);
    hoursSlider.addEventListener('input', updateCalculations);
    rateSlider.addEventListener('input', updateCalculations);

    ctaBtn.addEventListener('click', () => {
      const modal = document.getElementById('modal-contact');
      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const msgField = document.getElementById('fm');
        if (msgField) {
          const t = teamSlider.value;
          const h = hoursSlider.value;
          const r = rateSlider.value;
          msgField.value = `Hi Cem, ich habe den ROI-Rechner auf kimpress.de genutzt (${t} Personen, ${h} Std/Woche Routine, ${r}€/Std). Ich möchte eine Prozessanalyse anfragen.`;
        }
      }
    });
  }

  // --- UPGRADED n8n CANVAS BLUEPRINT CARD ---
  function renderBlueprintCard() {
    const container = document.createElement('div');
    container.className = 'bot-msg bot-msg--bot bot-msg--custom';
    container.innerHTML = `
      <div class="bot-bubble bot-card-blueprint">
        <div class="bot-bp-header">
          <div class="bot-bp-tag">⚙️ LIVE n8n WORKFLOW CANVAS</div>
          <span class="bot-bp-status"><span class="bp-dot"></span> Active Engine</span>
        </div>
        <div class="bot-bp-title">Multi-Channel Lead Triage & CRM Sync</div>
        
        <div class="bot-n8n-canvas">
          <div class="n8n-col">
            <div class="n8n-node n8n-node--trigger">
              <span class="n8n-icon">⚡</span>
              <div class="n8n-info">
                <strong>Webhook</strong>
                <small>Form / E-Mail Entry</small>
              </div>
            </div>
          </div>

          <div class="n8n-wire"><span>▶</span></div>

          <div class="n8n-col">
            <div class="n8n-node n8n-node--ai">
              <span class="n8n-icon">🤖</span>
              <div class="n8n-info">
                <strong>Gemini 2.5 Flash</strong>
                <small>Intent & Sentiment</small>
              </div>
            </div>
          </div>

          <div class="n8n-wire"><span>▶</span></div>

          <div class="n8n-col n8n-col--multi">
            <div class="n8n-node n8n-node--crm">
              <span class="n8n-icon">💼</span>
              <div class="n8n-info">
                <strong>HubSpot CRM</strong>
                <small>Auto Lead Create</small>
              </div>
            </div>
            <div class="n8n-node n8n-node--slack">
              <span class="n8n-icon">💬</span>
              <div class="n8n-info">
                <strong>Slack Alert</strong>
                <small>CEO Priority Channel</small>
              </div>
            </div>
          </div>
        </div>

        <div class="bot-bp-footer">
          <span>⚡ Durchlaufzeit: &lt; 850ms &bull; 0% Datenverlust</span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(container);
    scrollToBottom();
  }

  function checkSpecialIntents(query) {
    const q = query.toLowerCase();
    if (q.includes('roi') || q.includes('rechner') || q.includes('lohnt') || q.includes('ersparnis') || q.includes('rechnen') || q.includes('gewinn')) {
      return { type: 'roi' };
    }
    if (q.includes('n8n') || q.includes('make') || q.includes('workflow') || q.includes('automatisierung') || q.includes('prozess') || q.includes('zapier')) {
      return {
        type: 'blueprint',
        text: `**Workflow-Automatisierung mit n8n & Make:**\n\nManuelle Datenübertragung, E-Mail-Verteilung oder Kunden-Onboarding sind Zeitfresser. Wir bauen Backend-Systeme, die deine Tools nahtlos verbinden und KI-Entscheidungen treffen.\n\nHier ist ein realistisches n8n Canvas-Beispiel aus unserer Praxis:`
      };
    }
    return null;
  }

  // --- ENRICHED COMPREHENSIVE KNOWLEDGE BASE ---
  function generateAIResponse(query) {
    const q = query.toLowerCase();

    // 1. Preise & Kosten
    if (q.includes('preis') || q.includes('kosten') || q.includes('budget') || q.includes('pauschale') || q.includes('angebot') || q.includes('paket') || q.includes('geld') || q.includes('stundensatz')) {
      return {
        type: 'text',
        text: `**100% Festpreise ohne Überraschungen:**\n\n- **AI Performance Starter-Kit (ab 119 €):** Schneller Einstieg für KI-Content, Social-Vorlagen oder kompakte Bot-Setups.\n- **Custom Automatisierungs-Systeme:** Festpreisangebot nach kostenloser Prozess-Analyse.\n\nKeine Stunden-Mogelei, kein Knebelvertrag. Du kennst die genaue Investition vor Projektstart.`
      };
    }

    // 2. Authentischer Text über Cem Görül (Behind-the-Scenes)
    if (q.includes('cem') || q.includes('wer') || q.includes('inhaber') || q.includes('gründer') || q.includes('über') || q.includes('team') || q.includes('operator')) {
      return {
        type: 'text',
        text: `**Wer hinter Kimpress steckt:**\n\nCem Görül baut seit über 15 Jahren digitale Systeme – damals noch zeilenweise per Hand. Als der Hype um KI losging, sah er vor allem eines: *Agenturen, die Buzzwords verkaufen und Junioren an Kundenprojekte setzen.*\n\nCem hat Kimpress als pragmatische Gegenbewegung gegründet: **1 Operator, maximale Backend-Power.** Du arbeitest ohne Wasserkopf direkt mit dem Gründer, der deine Systeme persönlich entwickelt und absichert.`
      };
    }

    // 3. Services Deep Dive
    if (q.includes('service') || q.includes('leistung') || q.includes('content') || q.includes('video') || q.includes('website') || q.includes('seo') || q.includes('geo')) {
      return {
        type: 'text',
        text: `**Unsere 6 Kern-Leistungen:**\n\n1️⃣ **KI-Content:** High-converting Ads, Social-Videos & Texte.\n2️⃣ **n8n Workflows:** Daten-Sync, Lead-Routing & KI-Triage.\n3️⃣ **KI-Websites & GEO:** Sichtbarkeit in Perplexity, ChatGPT & Google AI.\n4️⃣ **KI-Chatbots:** Maßgeschneiderte Kunden- & Support-Assistenten.\n5️⃣ **Social Automation:** Automatisierter Publishing-Pipeline.\n6️⃣ **KI-Beratung:** Custom GPTs & Mitarbeiterschulung.`
      };
    }

    // 4. Ablauf & Prozess
    if (q.includes('ablauf') || q.includes('prozess') || q.includes('start') || q.includes('schritte') || q.includes('zusammenarbeit') || q.includes('wie läuft')) {
      return {
        type: 'text',
        text: `**So einfach läuft die Zusammenarbeit:**\n\n1️⃣ **Kostenlose Prozessanalyse (15 Min):** Wir identifizieren deine größten Zeitfresser.\n2️⃣ **Festpreis-Angebot:** Verbindlicher Fahrplan ohne Nebenkosten.\n3️⃣ **Build & Integration:** Wir bauen die n8n/KI-Systeme in 48h bis 7 Tagen.\n4️⃣ **Übergabe & 30 Tage Support:** Schulung deines Teams + Nachbetreuung.`
      };
    }

    // 5. Häufige Fragen / FAQ & Objections
    if (q.includes('faq') || q.includes('frage') || q.includes('verbindung') || q.includes('tools') || q.includes('schnittstelle') || q.includes('api') || q.includes('garantie')) {
      return {
        type: 'text',
        text: `**Häufig gestellte Fragen (FAQ):**\n\n- **Welche Tools werden angebunden?** HubSpot, Airtable, Make, n8n, Slack, WhatsApp, SevDesk/Lexoffice, OpenAI, Gemini, Claude u.v.m.\n- **Brauche ich eigenes Programmierwissen?** Nein! Du erhältst schlüsselfertige Systeme.\n- **Gibt es Garantien?** Ja, 30 Tage Betreuung und Korrektur-Garantie inklusive.`
      };
    }

    // 6. DSGVO & Sicherheit
    if (q.includes('dsgvo') || q.includes('datenschutz') || q.includes('sicher') || q.includes('cookie') || q.includes('server')) {
      return {
        type: 'text',
        text: `**Datenschutz & DSGVO:**\n\nKimpress arbeitet nach höchsten Standards:\n- Keine Cookie-Banner notwendig\n- Schriftarten selbst gehostet\n- Verläufe im \`sessionStorage\` (wird nach Tab-Schließen gelöscht)\n- Einhaltung der EU AI Act Transparenzpflichten.`
      };
    }

    // 7. Kontakt
    if (q.includes('kontakt') || q.includes('termin') || q.includes('anfrage') || q.includes('mail') || q.includes('telefon') || q.includes('buchen')) {
      return {
        type: 'text',
        text: `Du erreichst Cem Görül direkt:\n\n📧 **E-Mail:** hallo@kimpress.de\n📞 **Telefon:** +49 1575 7221636\n📍 **Standort:** Hamburg\n\nKlicke unten auf das Kontaktformular für ein unverbindliches Gespräch.`
      };
    }

    // Default Fallback
    return {
      type: 'text',
      text: `Danke für deine Frage! Ich bin dein **Kimpress KI-Operator**.\n\nFrag mich gerne zu **n8n Workflows**, unseren **Festpreisen**, dem **ROI-Rechner** oder wie **Cem Görül** deinen Betrieb automatisieren kann.`
    };
  }

  // --- NEURAL HEADER CANVAS ---
  function initHeaderCanvas() {
    const canvas = document.getElementById('bot-header-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const nodes = Array.from({ length: 18 }, () => ({
      x: Math.random() * (canvas.width || 300),
      y: Math.random() * (canvas.height || 80),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1.5 + Math.random() * 1.5,
    }));

    function draw() {
      if (reduced || !isOpen) {
        requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255, 0, 0, ${(1 - dist / 60) * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 60, 60, 0.6)';
        ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(draw);
    }
    draw();
  }

  // --- CONTEXT OBSERVER ---
  function initContextObserver(hintEl) {
    if (!hintEl || reduced) return;

    const hints = [
      { section: 'services', text: '⚡ Fragen zu n8n Workflows?' },
      { section: 'proof', text: '📈 Möchtest du deinen ROI berechnen?' },
      { section: 'faq', text: '💡 KI-Operator für deine Fragen da!' }
    ];

    let shownSections = new Set();

    const observer = new IntersectionObserver((entries) => {
      if (isOpen || hasInteracted) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const matched = hints.find(h => h.section === id);
          if (matched && !shownSections.has(id)) {
            shownSections.add(id);
            hintEl.querySelector('.bot-hint-text').textContent = matched.text;
            hintEl.classList.add('active');

            setTimeout(() => {
              hintEl.classList.remove('active');
            }, 6000);
          }
        }
      });
    }, { threshold: 0.4 });

    hints.forEach(h => {
      const el = document.getElementById(h.section);
      if (el) observer.observe(el);
    });
  }
}

// Helpers
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, match => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return map[match];
  });
}

function formatMarkdown(str) {
  let html = escapeHTML(str);
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="bot-inline-code">$1</code>');
  html = html.replace(/\n/g, '<br>');
  return html;
}

// Build HTML Structure
function createBotDOM() {
  const root = document.createElement('div');
  root.id = 'kimpress-bot-root';
  root.innerHTML = `
    <!-- Floating Trigger -->
    <div id="bot-hint-pill" class="bot-hint-pill" aria-live="polite">
      <span class="bot-hint-dot"></span>
      <span class="bot-hint-text">Moin! Frag den KI-Operator...</span>
    </div>

    <button id="bot-trigger" class="bot-trigger" aria-label="KI-Operator öffnen">
      <span class="bot-trigger__icon">🤖</span>
      <span class="bot-trigger__text">KI-Operator</span>
      <span class="bot-trigger__badge">⚡</span>
    </button>

    <!-- Chat Panel HUD -->
    <div id="bot-panel" class="bot-panel" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Kimpress KI-Operator Chat">
      <canvas id="bot-header-canvas" class="bot-panel__canvas"></canvas>
      
      <!-- Panel Header -->
      <div class="bot-panel__header">
        <div class="bot-operator-info">
          <div class="bot-avatar">
            <span class="bot-avatar__img">🤖</span>
            <span class="bot-status-light"></span>
          </div>
          <div>
            <div class="bot-title">Kimpress KI-Operator <span class="bot-ver">BETA</span></div>
            <div class="bot-subtitle">AUTOMATISIERTER KI-ASSISTENT &middot; TESTBETRIEB</div>
          </div>
        </div>
        <button id="bot-close" class="bot-close-btn" aria-label="Schließen">&#x2715;</button>
      </div>

      <!-- Messages Stream -->
      <div id="bot-messages" class="bot-panel__messages"></div>

      <!-- Quick Action Chips -->
      <div id="bot-quick-chips" class="bot-quick-chips">
        <button class="bot-chip" data-action="roi">🧮 Advanced ROI-Rechner</button>
        <button class="bot-chip" data-action="n8n">⚙️ n8n Workflows</button>
        <button class="bot-chip" data-action="preis">💰 Festpreise</button>
        <button class="bot-chip" data-action="cem">👤 Über Cem</button>
        <button class="bot-chip" data-action="ablauf">🤝 Wie läuft's ab?</button>
        <button class="bot-chip" data-action="faq">❓ Häufige Fragen</button>
      </div>

      <!-- Input Bar -->
      <form id="bot-input-form" class="bot-panel__input-bar">
        <input 
          type="text" 
          id="bot-input-field" 
          class="bot-input" 
          placeholder="Frage zu n8n, Preisen oder Ablauf..." 
          autocomplete="off"
          required
        />
        <button type="submit" class="bot-send-btn" aria-label="Senden">
          ➔
        </button>
      </form>

      <!-- Transparency & DSGVO Legal Disclaimer Footer -->
      <div class="bot-panel__footer">
        <span>🤖 Automatisierter KI-Assistent (EU AI Act Art. 50). Bitte keine sensiblen Daten eingeben. Es gilt unsere <a href="#" id="bot-privacy-link" style="color:#FF4D4D;text-decoration:underline;">Datenschutzerklärung</a>.</span>
      </div>
    </div>
  `;
  document.body.appendChild(root);
}
