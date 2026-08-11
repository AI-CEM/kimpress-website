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
        text: `**100% Transparente Festpreise ohne Stundensatz-Mogelei:**\n\nJede KI- & n8n-Workflow-Automatisierung kalkulieren wir nach einer gemeinsamen Prozessanalyse als verbindliches Pauschalangebot.\n\n- **Kein Stundensatz-Versteckspiel:** Du kennst die Investition auf den Cent genau vor der ersten Zeile Code.\n- **0 € Nebenkosten:** Schlüsselfertiges Setup inklusive 30 Tage Support & Übergabe.\n- **Maximale Flexibilität:** Keine starren Knebelverträge.`
      };
    }

    // 2. Authentischer Text über Cem Görül (Behind-the-Scenes)
    if (q.includes('cem') || q.includes('wer') || q.includes('inhaber') || q.includes('gründer') || q.includes('über') || q.includes('team') || q.includes('operator')) {
      return {
        type: 'text',
        text: `**Operator Identity — Cem Görül:**\n\nCem Görül baut seit über 15 Jahren digitale Backend-Systeme. Als der Hype um KI losging, gründete er Kimpress als pragmatische Gegenbewegung:\n\n⚡ **1 Operator, maximale Backend-Power.** Du sprichst ohne Agentur-Wasserkopf direkt mit dem Entwickler, der deine n8n-Workflows und KI-Systeme persönlich baut und absichert.`
      };
    }

    // 3. Services Deep Dive
    if (q.includes('service') || q.includes('leistung') || q.includes('content') || q.includes('video') || q.includes('website') || q.includes('seo') || q.includes('geo')) {
      return {
        type: 'text',
        text: `**Unsere Kern-Systeme & Infrastruktur:**\n\n1️⃣ **Prozess-Automatisierung:** n8n & Make Workflows, Lead-Triage & CRM-Sync.\n2️⃣ **Deterministische KI-Assistenten:** Chatbots & RAG-Knowledge-Bots ohne Halluzinationen.\n3️⃣ **GEO & KI-Websites:** Optimierte Sichtbarkeit in Perplexity, ChatGPT & Google AI.\n4️⃣ **KI-Content Studio:** Skalierbare Social-Media-Pipelines & Ad-Visuals.\n5️⃣ **Custom GPTs & Training:** Prompt-Bibliotheken & Mitarbeiter-Schulung.`
      };
    }

    // 4. Ablauf & Prozess
    if (q.includes('ablauf') || q.includes('prozess') || q.includes('start') || q.includes('schritte') || q.includes('zusammenarbeit') || q.includes('wie läuft')) {
      return {
        type: 'text',
        text: `**So läuft die Zusammenarbeit ab:**\n\n1️⃣ **Kostenlose Prozessanalyse (15 Min):** Wir identifizieren deine größten Zeitfresser.\n2️⃣ **Festpreis-Blueprint:** Verbindlicher Fahrplan & Systemkarte ohne Nebenkosten.\n3️⃣ **Build & Integration:** Schlüsselfertige n8n/KI-Entwicklung in 3 bis 14 Tagen.\n4️⃣ **Übergabe & 30 Tage Support:** Schulung deines Teams + Hypercare-Nachbetreuung.`
      };
    }

    // 5. Häufige Fragen / FAQ & Objections
    if (q.includes('faq') || q.includes('frage') || q.includes('verbindung') || q.includes('tools') || q.includes('schnittstelle') || q.includes('api') || q.includes('garantie') || q.includes('tech')) {
      return {
        type: 'text',
        text: `**Häufig gestellte Fragen (FAQ):**\n\n- **Welche Tools werden angebunden?** HubSpot, Salesforce, Outlook/Gmail, Notion, n8n, Make, Slack, WhatsApp, SevDesk, Lexoffice, OpenAI, Gemini, Claude, Supabase.\n- **Brauche ich eigenes Programmierwissen?** Nein! Du erhältst ein schlüsselfertiges System.\n- **Gibt es Support?** Ja, 30 Tage Betreuung und Garantie inklusive.`
      };
    }

    // 6. DSGVO & Sicherheit
    if (q.includes('dsgvo') || q.includes('datenschutz') || q.includes('sicher') || q.includes('cookie') || q.includes('server')) {
      return {
        type: 'text',
        text: `**Datenschutz & DSGVO:**\n\nKimpress arbeitet nach höchsten Standards:\n- Keine Cookie-Banner notwendig (keine Tracking-Cookies)\n- Fonts & Libraries 100% selbst gehostet (keine Google-Fonts-Falle)\n- Verläufe im \`sessionStorage\` (wird beim Tab-Schließen gelöscht)\n- Einhaltung der EU AI Act Transparenzpflichten (Art. 50).`
      };
    }

    // 7. Kontakt
    if (q.includes('kontakt') || q.includes('termin') || q.includes('anfrage') || q.includes('mail') || q.includes('telefon') || q.includes('buchen')) {
      return {
        type: 'text',
        text: `Du erreichst Cem Görül direkt:\n\n📧 **E-Mail:** hallo@kimpress.de\n📞 **Telefon:** +49 1575 7221636\n📍 **Standort:** Hamburg\n\nNutze unser Kontaktformular auf der Seite für eine direkte Anfrage.`
      };
    }

    // Default Fallback
    return {
      type: 'text',
      text: `Danke für deine Anfrage! Ich bin Cems **Kimpress KI-Operator**.\n\nFrag mich gerne zu **n8n Workflows**, unseren **Festpreisen**, dem **ROI-Rechner** oder wie **Cem Görül** deine Prozesse automatisiert.`
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
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * (canvas.width || 300),
      y: Math.random() * (canvas.height || 80),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5
    }));

    function anim() {
      if (!canvas.parentElement) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.08)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(anim);
    }
    anim();
  }

  function initContextObserver(hintPill) {
    if (!hintPill) return;
    let timer = setTimeout(() => {
      if (!hasInteracted) hintPill.classList.add('active');
    }, 6000);
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdown(str) {
    let html = escapeHTML(str);
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code class="bot-inline-code">$1</code>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

// Build HTML Structure (IBM Carbon / Industrial Tech Style)
function createBotDOM() {
  const root = document.createElement('div');
  root.id = 'kimpress-bot-root';
  root.innerHTML = `
    <!-- Floating Trigger with Cem Avatar Face -->
    <div id="bot-hint-pill" class="bot-hint-pill" aria-live="polite">
      <span class="bot-hint-dot"></span>
      <span class="bot-hint-text">Moin! Frag den KI-Operator...</span>
    </div>

    <button id="bot-trigger" class="bot-trigger" aria-label="KI-Operator öffnen">
      <div class="bot-trigger__avatar-box">
        <img src="/images/characters/operator-cem.jpg" alt="Cem Görül — Kimpress KI Operator" class="bot-trigger__avatar-img" />
        <span class="bot-trigger__status-dot"></span>
      </div>
      <span class="bot-trigger__text">KI-Operator</span>
      <span class="bot-trigger__badge">⚡</span>
    </button>

    <!-- Chat Panel HUD (IBM Carbon Design Language) -->
    <div id="bot-panel" class="bot-panel bot-panel--ibm" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Kimpress KI-Operator Chat">
      <canvas id="bot-header-canvas" class="bot-panel__canvas"></canvas>
      
      <!-- Panel Header -->
      <div class="bot-panel__header">
        <div class="bot-operator-info">
          <div class="bot-avatar bot-avatar--face">
            <img src="/images/characters/operator-cem.jpg" alt="Cem Görül — Operator Face" class="bot-avatar__face-img" />
            <span class="bot-status-light"></span>
          </div>
          <div>
            <div class="bot-title">KIMPRESS // OPERATOR_ENGINE <span class="bot-ver">BETA</span></div>
            <div class="bot-subtitle">SYS_ID: CEM_GOERUL &middot; REALTIME HUD</div>
          </div>
        </div>
        <button id="bot-close" class="bot-close-btn" aria-label="Schließen">&#x2715;</button>
      </div>

      <!-- System Status Bar -->
      <div class="bot-system-bar">
        <span class="bot-sys-tag">&gt; CONNECTED: n8n Workflow Engine</span>
        <span class="bot-sys-meta">0% Loss</span>
      </div>

      <!-- Messages Stream -->
      <div id="bot-messages" class="bot-panel__messages"></div>

      <!-- Quick Action Chips (IBM Monospace Style) -->
      <div id="bot-quick-chips" class="bot-quick-chips">
        <button class="bot-chip" data-action="roi">[01] ROI_RECHNER</button>
        <button class="bot-chip" data-action="n8n">[02] N8N_WORKFLOWS</button>
        <button class="bot-chip" data-action="preis">[03] FESTPREISE</button>
        <button class="bot-chip" data-action="cem">[04] OPERATOR_CEM</button>
        <button class="bot-chip" data-action="faq">[05] TECH_STACK</button>
        <button class="bot-chip" data-action="dsgvo">[06] DSGVO_INFO</button>
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
}
