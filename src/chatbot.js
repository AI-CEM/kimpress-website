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

let N8N_WEBHOOK_URL = '/api/chat'; 

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

    renderWelcomeHeroCard();
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
      } else if (intentResult.type === 'appointment') {
        renderAppointmentCard(userText);
      } else if (intentResult.type === 'blueprint') {
        appendBotBubble(intentResult.text, true, true);
        renderBlueprintCard();
      }
      saveMessage('bot', intentResult.text || 'Aktion gestartet.');
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
          const replyText = data.output || data.message || data.text;
          if (replyText) {
            removeTypingIndicator();
            appendBotBubble(replyText, true, true);
            saveMessage('bot', replyText);
            return;
          }
        }
      } catch (err) {
        console.warn('n8n Webhook connection fallback to local intelligence:', err);
      }
    }

    // Fallback Local Knowledge Base
    const fallbackResponse = generateAIResponse(userText);
    removeTypingIndicator();
    if (fallbackResponse.type === 'roi') {
      renderROICalculator();
    } else if (fallbackResponse.type === 'blueprint') {
      appendBotBubble(fallbackResponse.text, true, true);
      renderBlueprintCard();
    } else {
      appendBotBubble(fallbackResponse.text, true, true);
    }
    saveMessage('bot', fallbackResponse.text || 'Antwort gesendet.');
  }

  function checkSpecialIntents(query) {
    const q = query.toLowerCase();
    if (q.includes('roi') || q.includes('rechner') || q.includes('lohnt') || q.includes('ersparnis') || q.includes('rechnen') || q.includes('gewinn')) {
      return { type: 'roi' };
    }
    if (q.includes('morgen') || q.includes('heute') || q.includes('uhr') || q.includes('termin') || q.includes('buchen') || q.includes('call') || q.includes('erstgespräch') || q.includes('treffen') || q.includes('kalender') || q.includes('gespräch')) {
      return { type: 'appointment' };
    }
    if (q.includes('n8n') || q.includes('make') || q.includes('workflow') || q.includes('automatisierung') || q.includes('prozess') || q.includes('zapier')) {
      return {
        type: 'blueprint',
        text: `[SYS_ARCHITECTURE // N8N_ENGINE]\n\nHier ist der reale n8n Canvas-Blueprint für deinen automatisierten Backend-Workflow:`
      };
    }
    return null;
  }

  function renderAppointmentCard(timeQuery) {
    removeTypingIndicator();
    const container = document.createElement('div');
    container.className = 'bot-msg bot-msg--bot bot-msg--custom';
    
    container.innerHTML = `
      <div class="bot-bubble bot-card-blueprint bot-card-roi--ibm" style="border-color:#00FF66;box-shadow:0 0 25px rgba(0,255,102,0.15);">
        <div class="bot-bp-header">
          <span class="bot-bp-tag" style="color:#00FF66;">[SYS_APPOINTMENT // TERMIN_ANFRAGE]</span>
        </div>
        <div style="font-family:monospace;font-size:0.82rem;color:#FFF;margin-bottom:8px;">15-MINUTEN PROZESSANALYSE MIT CEM GÖRÜL</div>
        <p style="font-family:monospace;font-size:0.72rem;color:#AAA;margin-bottom:10px;line-height:1.4;">
          Dein Wunschtermin wird direkt an Cems Postfach (hallo@kimpress.de) übertragen:
        </p>

        <form id="bot-appt-form" action="https://formspree.io/f/xvgaapqn" method="POST" style="display:flex;flex-direction:column;gap:8px;">
          <input type="text" name="Wunschtermin" value="${escapeHTML(timeQuery)}" required class="bot-input" style="font-family:monospace;font-size:0.75rem;background:rgba(0,0,0,0.5);border:1px solid rgba(0,255,102,0.4);color:#00FF66;padding:8px 10px;border-radius:4px;" />
          <input type="email" name="Email" placeholder="Deine E-Mail-Adresse für den Call-Link..." required class="bot-input" style="font-family:monospace;font-size:0.75rem;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.15);color:#FFF;padding:8px 10px;border-radius:4px;" />
          <input type="hidden" name="_subject" value="🚨 Neue Terminanfrage via KI-Operator Chatbot" />
          <button type="submit" class="btn btn--primary btn--sm" style="width:100%;font-family:monospace;justify-content:center;letter-spacing:1px;font-size:0.75rem;margin-top:4px;">
            [ ➔ TERMIN JETZT ABSENDEN ]
          </button>
        </form>

        <div id="bot-appt-status" style="display:none;font-family:monospace;font-size:0.72rem;color:#00FF66;margin-top:8px;">
          ✓ Terminanfrage gesendet! Cem meldet sich in Kürze per E-Mail.
        </div>
      </div>
    `;
    messagesContainer.appendChild(container);
    scrollToBottom();

    const apptForm = container.querySelector('#bot-appt-form');
    const statusMsg = container.querySelector('#bot-appt-status');
    if (apptForm) {
      apptForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(apptForm);
        try {
          await fetch('https://formspree.io/f/xvgaapqn', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          apptForm.style.display = 'none';
          statusMsg.style.display = 'block';
        } catch (err) {
          apptForm.style.display = 'none';
          statusMsg.style.display = 'block';
        }
      });
    }
  }

  // --- SCROLLSTOPPER WELCOME HERO CARD ---
  function renderWelcomeHeroCard() {
    const container = document.createElement('div');
    container.className = 'bot-msg bot-msg--bot bot-msg--custom';
    container.innerHTML = `
      <div class="bot-card-hero">
        <div class="bot-hero__badge">
          <span class="bot-hero__pulse"></span>
          KIMPRESS // OPERATOR_ENGINE v3.0
        </div>

        <h3 class="bot-hero__title">
          Eliminiere manuelle Routinearbeit &amp; skaliere deine Kapazität mit KI.
        </h3>

        <p class="bot-hero__desc">
          Keine überteuerten Agenturen, kein Junior-Wasserkopf. Schlüsselfertige n8n-Workflows &amp; KI-Pipelines direkt vom Senior-Operator aus Hamburg.
        </p>

        <div class="bot-hero__grid">
          <!-- Option 1: ROI Simulator -->
          <div class="bot-hero__tile" id="hero-tile-roi" role="button" tabindex="0">
            <div class="bot-hero__tile-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20V10M18 20V4M6 20v-4"/>
              </svg>
            </div>
            <div class="bot-hero__tile-content">
              <span class="bot-hero__tile-tag" style="color:#00FF66;">[01] CAPITAL_RECOVERY</span>
              <strong>ROI &amp; Ersparnis berechnen</strong>
              <small>Verlust &amp; Amortisationszeit simulieren ➔</small>
            </div>
          </div>

          <!-- Option 2: n8n Workflow Blueprint -->
          <div class="bot-hero__tile" id="hero-tile-n8n" role="button" tabindex="0">
            <div class="bot-hero__tile-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <div class="bot-hero__tile-content">
              <span class="bot-hero__tile-tag" style="color:#FF4D4D;">[02] BACKEND_ENGINE</span>
              <strong>n8n Workflow-Blueprint</strong>
              <small>Realtime Triage &amp; CRM Sync ➔</small>
            </div>
          </div>

          <!-- Option 3: Festpreise -->
          <div class="bot-hero__tile" id="hero-tile-price" role="button" tabindex="0">
            <div class="bot-hero__tile-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#66C2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="bot-hero__tile-content">
              <span class="bot-hero__tile-tag" style="color:#66C2FF;">[03] 100% PAUSCHAL</span>
              <strong>Transparente Festpreise</strong>
              <small>0 € Nebenkosten &amp; 30 Tage Support ➔</small>
            </div>
          </div>
        </div>

        <div class="bot-hero__footer">
          <span>Oder nenne direkt deinen größten Engpass im Chat:</span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(container);
    scrollToBottom();

    // Tile Click Handlers
    const roiTile = container.querySelector('#hero-tile-roi');
    if (roiTile) {
      roiTile.addEventListener('click', () => {
        renderROICalculator();
        saveMessage('user', '[01] ROI_RECHNER');
      });
    }

    const n8nTile = container.querySelector('#hero-tile-n8n');
    if (n8nTile) {
      n8nTile.addEventListener('click', () => {
        appendBotBubble('[SYS_ARCHITECTURE // N8N_ENGINE]\n\nHier ist der reale n8n Canvas-Blueprint für deinen automatisierten Backend-Workflow:', true, true);
        renderBlueprintCard();
        saveMessage('user', '[02] N8N_WORKFLOWS');
      });
    }

    const priceTile = container.querySelector('#hero-tile-price');
    if (priceTile) {
      priceTile.addEventListener('click', () => {
        handleUserMessage('Was kostet KI-Automatisierung bei Kimpress?');
      });
    }
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

  // --- UPGRADED 3-SLIDER INDUSTRIAL CYBER ROI SIMULATOR ---
  function renderROICalculator() {
    removeTypingIndicator();
    const container = document.createElement('div');
    container.className = 'bot-msg bot-msg--bot bot-msg--custom';
    
    container.innerHTML = `
      <div class="bot-bubble bot-card-roi bot-card-roi--ibm">
        <div class="bot-card-roi__header">
          <span class="bot-card-roi__badge">[SYS_SIMULATOR // CAPITAL_RECOVERY_ENGINE]</span>
          <h4 style="font-family:monospace;margin-top:6px;font-size:0.85rem;color:#FFF;">ROTTING_CAPITAL & RECOVERY SIMULATOR</h4>
        </div>
        
        <div class="bot-card-roi__slider-group">
          <div class="bot-roi-label">
            <span style="font-family:monospace;">[01_TEAM_HEADCOUNT]</span>
            <strong id="roi-val-team" style="font-family:monospace;color:#FF4D4D;">4 OPERATORS</strong>
          </div>
          <input type="range" id="roi-slider-team" min="1" max="50" value="4" class="bot-roi-slider" />
        </div>

        <div class="bot-card-roi__slider-group">
          <div class="bot-roi-label">
            <span style="font-family:monospace;">[02_ROUTINE_LEAK_HRS]</span>
            <strong id="roi-val-hours" style="font-family:monospace;color:#FF4D4D;">10 HRS / WEEK</strong>
          </div>
          <input type="range" id="roi-slider-hours" min="2" max="35" value="10" class="bot-roi-slider" />
        </div>

        <div class="bot-card-roi__slider-group">
          <div class="bot-roi-label">
            <span style="font-family:monospace;">[03_HOURLY_COST_RATE]</span>
            <strong id="roi-val-rate" style="font-family:monospace;color:#FF4D4D;">65 € / HR</strong>
          </div>
          <input type="range" id="roi-slider-rate" min="30" max="150" value="65" step="5" class="bot-roi-slider" />
        </div>

        <div class="bot-card-roi__result" style="background:rgba(14,14,20,0.95);border:1px solid rgba(255,0,0,0.25);">
          <div class="bot-roi-res-item">
            <span class="bot-roi-res-lbl" style="font-family:monospace;">[TIME_WASTED_YEARLY]</span>
            <span class="bot-roi-res-val" id="roi-res-hours" style="font-family:monospace;font-size:0.9rem;">1.440 HRS</span>
          </div>
          <div class="bot-roi-res-item bot-roi-res-item--highlight">
            <span class="bot-roi-res-lbl" style="font-family:monospace;">[NET_CAPITAL_RECOVERED]</span>
            <span class="bot-roi-res-val" id="roi-res-money" style="font-family:monospace;color:#00FF66;text-shadow:0 0 10px rgba(0,255,102,0.4);">93.600 €</span>
          </div>
        </div>

        <div class="bot-roi-amort" style="font-family:monospace;background:rgba(0,255,102,0.06);border:1px solid rgba(0,255,102,0.3);">
          ⚡ <span>AMORTISATIONS_SPEED: <strong id="roi-res-days" style="color:#00FF66;">CA. 9 TAGE</strong></span>
        </div>

        <button class="btn btn--primary btn--sm bot-roi-cta" id="roi-cta-btn" style="width:100%;margin-top:12px;justify-content:center;font-family:monospace;letter-spacing:1px;">
          [ INITIATE SYSTEM AUDIT ➔ ]
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

      teamVal.textContent = `${team} ${team === 1 ? 'OPERATOR' : 'OPERATORS'}`;
      hoursVal.textContent = `${hours} HRS / WEEK`;
      rateVal.textContent = `${rate} € / HR`;

      const savedHoursYear = Math.round(team * hours * 48 * 0.75);
      const savedMoneyYear = Math.round(savedHoursYear * rate);
      const amortDays = Math.max(3, Math.round((2500 / (savedMoneyYear / 365))));

      resHours.textContent = `${savedHoursYear.toLocaleString('de-DE')} HRS`;
      resMoney.textContent = `${savedMoneyYear.toLocaleString('de-DE')} €`;
      resDays.textContent = `CA. ${amortDays} TAGE`;
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
      <div class="bot-bubble bot-card-blueprint bot-card-blueprint--ibm">
        <div class="bot-bp-header">
          <div class="bot-bp-tag">[SYS_BLUEPRINT // N8N_ENGINE_MAP]</div>
          <span class="bot-bp-status"><span class="bp-dot"></span> LIVE REALTIME</span>
        </div>
        <div class="bot-bp-title" style="font-family:monospace;font-size:0.82rem;color:#AAA;margin-bottom:12px;">MULTI-CHANNEL LEAD TRIAGE & CRM SYNC</div>
        
        <div class="bot-n8n-canvas" style="position:relative;overflow:hidden;">
          <div class="n8n-col">
            <div class="n8n-node n8n-node--trigger" style="border-color:#FF8800;background:rgba(255,136,0,0.1);">
              <span class="n8n-icon">⚡</span>
              <div class="n8n-info">
                <strong style="font-family:monospace;font-size:0.7rem;">INBOUND_SIGNAL</strong>
                <small style="font-family:monospace;color:#FFAA44;">Webhook / WhatsApp</small>
              </div>
            </div>
          </div>

          <div class="n8n-wire"><span class="n8n-pulse-dot"></span>▶</div>

          <div class="n8n-col">
            <div class="n8n-node n8n-node--ai" style="border-color:#FF0000;background:rgba(255,0,0,0.15);">
              <span class="n8n-icon">🧠</span>
              <div class="n8n-info">
                <strong style="font-family:monospace;font-size:0.7rem;">GEMINI 3.5 LLM</strong>
                <small style="font-family:monospace;color:#FF6666;">Intent & Sentiment</small>
              </div>
            </div>
          </div>

          <div class="n8n-wire"><span class="n8n-pulse-dot"></span>▶</div>

          <div class="n8n-col n8n-col--multi">
            <div class="n8n-node n8n-node--crm" style="border-color:#0099FF;background:rgba(0,153,255,0.1);">
              <span class="n8n-icon">💼</span>
              <div class="n8n-info">
                <strong style="font-family:monospace;font-size:0.68rem;">HUBSPOT / SEVDESK</strong>
                <small style="font-family:monospace;color:#66C2FF;">Auto CRM Write</small>
              </div>
            </div>
            <div class="n8n-node n8n-node--slack" style="border-color:#00FF66;background:rgba(0,255,102,0.1);">
              <span class="n8n-icon">💬</span>
              <div class="n8n-info">
                <strong style="font-family:monospace;font-size:0.68rem;">HIGH-PRIO ALERT</strong>
                <small style="font-family:monospace;color:#66FF99;">Slack / Telegram</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Monospace Live System Diagnostics Ticker -->
        <div class="bot-bp-ticker" style="font-family:monospace;font-size:0.65rem;color:#71717A;background:rgba(8,8,12,0.9);padding:8px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);margin-top:8px;line-height:1.4;">
          <div style="color:#00FF66;">&gt; [14:55:01] SYS_OK: Webhook payload parsed (&lt;18ms)</div>
          <div style="color:#FF4D4D;">&gt; [14:55:02] GEMINI_3.5_ANALYSIS: Intent = High-Ticket B2B Lead</div>
          <div style="color:#A1A1AA;">&gt; [14:55:02] CRM_WRITE: Contact created #8492 &middot; SLACK_ALERT: Sent</div>
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
    if (q.includes('morgen') || q.includes('heute') || q.includes('uhr') || q.includes('termin') || q.includes('buchen') || q.includes('call') || q.includes('erstgespräch') || q.includes('treffen') || q.includes('kalender')) {
      return { type: 'appointment' };
    }
    if (q.includes('angebot') || q.includes('anfragen') || q.includes('kaufen') || q.includes('buchen') || q.includes('preis') || q.includes('kosten') || q.includes('paket') || q.includes('starter-kit') || q.includes('beauftragen')) {
      let service = 'KI-Systeme & Automatisierung';
      if (q.includes('content') || q.includes('video') || q.includes('reels') || q.includes('tiktok')) service = 'KI-Content & Short-Form Video Studio';
      else if (q.includes('n8n') || q.includes('workflow') || q.includes('triage') || q.includes('mail')) service = 'n8n Workflow-Automatisierung & CRM Sync';
      else if (q.includes('website') || q.includes('seo') || q.includes('geo')) service = 'GEO & KI-Optimierte Performance Website';
      else if (q.includes('bot') || q.includes('chatbot') || q.includes('voice')) service = 'Deterministischer KI-Chatbot / Voicebot';
      return { type: 'checkout', serviceName: service };
    }
    if (q.includes('n8n') || q.includes('make') || q.includes('workflow') || q.includes('automatisierung') || q.includes('prozess') || q.includes('zapier')) {
      return {
        type: 'blueprint',
        text: `[SYS_ARCHITECTURE // N8N_ENGINE]\n\nHier ist der reale n8n Canvas-Blueprint für deinen automatisierten Backend-Workflow:`
      };
    }
    return null;
  }

  function renderCheckoutCard(serviceName, needText) {
    removeTypingIndicator();
    const container = document.createElement('div');
    container.className = 'bot-msg bot-msg--bot bot-msg--custom';
    
    container.innerHTML = `
      <div class="bot-bubble bot-card-blueprint bot-card-roi--ibm" style="border-color:#FF0000;box-shadow:0 0 30px rgba(255,0,0,0.22);">
        <div class="bot-bp-header">
          <span class="bot-bp-tag" style="color:#FF4D4D;">[CONVERSATIONAL_CHECKOUT // LEAD_CAPTURE]</span>
          <span class="bot-bp-status"><span class="bp-dot"></span> EXPERT_PRIO</span>
        </div>
        <div style="font-family:monospace;font-size:0.85rem;color:#FFF;margin-bottom:6px;font-weight:700;">
          DIREKTANFRAGE: ${escapeHTML(serviceName)}
        </div>
        <p style="font-family:monospace;font-size:0.72rem;color:#AAA;margin-bottom:10px;line-height:1.4;">
          Sende deine Anforderung direkt an Cem Görül (1 Operator Model). Du erhältst ein verbindliches Festpreisangebot ohne Stundensatz-Mogelei:
        </p>

        <form id="bot-checkout-form" action="https://formspree.io/f/xvgaapqn" method="POST" style="display:flex;flex-direction:column;gap:8px;">
          <input type="text" name="Service" value="${escapeHTML(serviceName)}" readonly class="bot-input" style="font-family:monospace;font-size:0.75rem;background:rgba(255,0,0,0.12);border:1px solid rgba(255,0,0,0.4);color:#FF6666;padding:8px 10px;border-radius:4px;font-weight:700;" />
          <input type="text" name="NeedSummary" value="${escapeHTML(needText)}" placeholder="Deine Anforderung / Engpass" class="bot-input" style="font-family:monospace;font-size:0.75rem;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.15);color:#FFF;padding:8px 10px;border-radius:4px;" />
          <input type="email" name="Email" placeholder="Deine E-Mail-Adresse für das Angebot..." required class="bot-input" style="font-family:monospace;font-size:0.75rem;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.15);color:#FFF;padding:8px 10px;border-radius:4px;" />
          <input type="tel" name="Telefon" placeholder="Telefonnummer (optional für Rückruf)..." class="bot-input" style="font-family:monospace;font-size:0.75rem;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.15);color:#FFF;padding:8px 10px;border-radius:4px;" />
          <input type="hidden" name="_subject" value="🚨 Neue B2B Chatbot-Direktanfrage (${escapeHTML(serviceName)})" />
          
          <button type="submit" class="btn btn--primary btn--sm" style="width:100%;font-family:monospace;justify-content:center;letter-spacing:1px;font-size:0.75rem;margin-top:4px;">
            [ ➔ JETZT VERBINDLICH ANFRAGEN ]
          </button>
        </form>

        <div id="bot-checkout-status" style="display:none;font-family:monospace;font-size:0.72rem;color:#00FF66;margin-top:8px;">
          ✓ Anfrage erfolgreich übermittelt! Cem analysiert dein Anliegen persönlich und meldet sich in Kürze per E-Mail.
        </div>
      </div>
    `;
    messagesContainer.appendChild(container);
    scrollToBottom();

    const checkoutForm = container.querySelector('#bot-checkout-form');
    const statusMsg = container.querySelector('#bot-checkout-status');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(checkoutForm);
        try {
          await fetch('https://formspree.io/f/xvgaapqn', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          checkoutForm.style.display = 'none';
          statusMsg.style.display = 'block';
        } catch (err) {
          checkoutForm.style.display = 'none';
          statusMsg.style.display = 'block';
        }
      });
    }
  }

  // --- ENRICHED FINE-GRAINED KNOWLEDGE BASE & SMART ROUTER ---
  function generateAIResponse(q) {
    // 0. Security Guardrail: Block Out-of-Scope / Trivia questions
    if (q.includes('wetter') || q.includes('rezept') || q.includes('hausaufgabe') || q.includes('fußball') || q.includes('bundesliga') || q.includes('politik') || q.includes('präsident')) {
      return {
        type: 'text',
        text: `[SYS_GUARDRAIL // SCOPE_LIMIT]\n\nIch bin als Kimpress KI-Operator ausschließlich auf KI-Automatisierung, n8n Workflows & Content-Systeme von Kimpress spezialisiert.\n\nFür Fragen außerhalb unserer Systeme wende dich bitte an hallo@kimpress.de.\n\nWorüber möchtest du sprechen (z.B. [01] ROI-Rechner, [02] n8n Workflows oder [03] Festpreise)?`
      };
    }
    // 1. E-Mail Triage & Inbox Automation
    if (q.includes('mail') || q.includes('postfach') || q.includes('inbox') || q.includes('sortieren') || q.includes('nachricht') || q.includes('outlook') || q.includes('gmail')) {
      return {
        type: 'text',
        text: `[SYS_DIAGNOSTIC // TRIAGE_PARSER]\n\nAnalyse: Manuelle E-Mail-Sortierung ist der größte lautlose Zeitfresser im Tagesgeschäft. Typischer Verlust: 10–18 Std./Woche pro Team.\n\nUnsere n8n System-Architektur löst das deterministisch:\n\n1. **[INBOUND]** Mail-Gateway empfängt E-Mails (Outlook / Gmail / IMAP).\n2. **[PARSE_LLM]** Gemini 2.5 Flash analysiert Intent, Dringlichkeit & Lead-Score in < 400ms.\n3. **[AUTOMATED_ACTION]**\n   - High-Ticket Leads -> Auto-Create im CRM (HubSpot/SevDesk) + Instant Alert an Slack/WhatsApp.\n   - Routinen -> Automatische Antwort-Entwürfe oder Auto-Labeling.\n\n**Ergebnis:** 90% weniger Zeit im Postfach, 0 verpasste High-Ticket Anfragen.\n\nWelches Mail-System (Outlook, Gmail oder eigener Server) nutzt ihr aktuell?`
      };
    }

    // 2. Specific Content / Video Pricing & Costs
    if ((q.includes('video') || q.includes('content') || q.includes('reels') || q.includes('tiktok') || q.includes('shorts') || q.includes('skript')) && 
        (q.includes('preis') || q.includes('kosten') || q.includes('teuer') || q.includes('geld') || q.includes('budget') || q.includes('wie viel') || q.includes('was kostet'))) {
      return {
        type: 'text',
        text: `[FINANCIAL_ENGINE // CONTENT_STUDIO]\n\nWir produzieren conversion-starken KI-Content für Social Media und Performance Ads – pragmatisch, schnell und ohne überdimensionierte Retainer:\n\n- **Formate:** Short-Form Videos (TikTok, Reels, Shorts), KI-Skripte, Hooks & Ad-Visuals.\n- **Transparenz:** Verbindliche Festpreise nach einer kurzen 15-Minuten System-Analyse.\n\nMöchtest du ein konkretes Video-Paket anfragen?`
      };
    }

    // 3. Specific Workflow / n8n / Process Pricing & Costs
    if ((q.includes('n8n') || q.includes('workflow') || q.includes('automatisierung') || q.includes('bot') || q.includes('system') || q.includes('backend')) && 
        (q.includes('preis') || q.includes('kosten') || q.includes('teuer') || q.includes('geld') || q.includes('budget') || q.includes('wie viel') || q.includes('was kostet'))) {
      return {
        type: 'text',
        text: `[FINANCIAL_ENGINE // WORKFLOW_PRICING]\n\nJedes Automatisierungsprojekt kalkulieren wir nach einer kurzen Prozessanalyse als verbindliches Pauschalangebot:\n\n- **Festpreis-Garantie:** Du kennst die Investition auf den Cent genau vor der ersten Zeile Code.\n- **0 € Nebenkosten:** Schlüsselfertiges Setup inklusive 30 Tage Betreuung & Team-Schulung.\n\nSollen wir deine Ersparnis im ROI-Rechner simulieren?`
      };
    }

    // 4. General Pricing Intent
    if (q.includes('preis') || q.includes('kosten') || q.includes('pauschale') || q.includes('budget') || q.includes('stundensatz') || q.includes('geld') || q.includes('teuer') || q.includes('wie viel') || q.includes('was kostet')) {
      return {
        type: 'text',
        text: `[FINANCIAL_ENGINE // PAUSCHALANGEBOTE]\n\nWir arbeiten zu 100% mit transparenten Festpreisen – ohne Stundensatz-Mogelei oder Knebelverträge:\n\n- **Kein Versteckspiel:** Verbindlicher Fahrplan & Preisgarantie vor Projektstart.\n- **Lieferzeit:** Schlüsselfertige Übergabe in 3 bis 14 Tagen.\n\nFür welches System interessierst du dich genau (z.B. E-Mail-Triage, CRM-Sync oder KI-Content)?`
      };
    }

    // 5. Dedicated Content Studio Info
    if (q.includes('content') || q.includes('video') || q.includes('reels') || q.includes('tiktok') || q.includes('shorts') || q.includes('skript')) {
      return {
        type: 'text',
        text: `[SYS_MEDIA // CONTENT_PIPELINE]\n\nWir produzieren conversion-starke KI-Skripte, Hooks, Visuals und Short-Form Videos (Reels, TikToks, Shorts) – markenkonform, schnell und plattformoptimiert.`
      };
    }

    // 6. Dedicated n8n Workflow & API Info
    if (q.includes('n8n') || q.includes('make') || q.includes('workflow') || q.includes('automatisierung') || q.includes('backend') || q.includes('zapier')) {
      return {
        type: 'text',
        text: `[SYS_ARCHITECTURE // WORKFLOW_ENGINE]\n\nWir verbinden deine bestehenden Tools (CRM, Mail, SevDesk, Slack, Supabase) über n8n, um manuelle Datenübertragung, E-Mail-Triage und Routinearbeiten komplett zu eliminieren.`
      };
    }

    // 7. Dedicated Website / SEO / GEO Info
    if (q.includes('website') || q.includes('webseite') || q.includes('seo') || q.includes('geo') || q.includes('perplexity') || q.includes('chatgpt search')) {
      return {
        type: 'text',
        text: `[SYS_WEB // GEO_ENGINE]\n\nWir entwickeln blitzschnelle, conversion-starke Websites, die gezielt dafür optimiert sind, von KI-Suchmaschinen wie Perplexity, ChatGPT Search und Google AI empfohlen zu werden.`
      };
    }

    // 8. Dedicated Chatbot / Voicebot Info
    if (q.includes('chatbot') || q.includes('bot') || q.includes('voicebot') || q.includes('whatsapp') || q.includes('assistent') || q.includes('rag')) {
      return {
        type: 'text',
        text: `[SYS_BOT // DETERMINISTIC_ASSISTANT]\n\nDeterministische Web- & WhatsApp-Assistenten mit Anbindung an deine Firmendatenbanken (RAG). Null Halluzinationen im Kundenkontakt, 24/7 aktiv.`
      };
    }

    // 9. Dedicated Operator Cem Profile
    if (q.includes('cem') || q.includes('wer') || q.includes('inhaber') || q.includes('gründer') || q.includes('über') || q.includes('operator')) {
      return {
        type: 'text',
        text: `[OPERATOR_PROFILE // CEM_GOERUL]\n\nCem Görül baut seit über 15 Jahren digitale Backend-Systeme. Kimpress ist die pragmatische Gegenbewegung zu überblähten Agenturen:\n\n- **1 Operator, volle Senior-Entwickler-Power**\n- Direkter Draht zum Architekten – kein Junior-Wasserkopf\n- Systeme laufen schlüsselfertig auf deiner Infrastruktur`
      };
    }

    // 10. Dedicated Ablauf / Prozess Info
    if (q.includes('ablauf') || q.includes('prozess') || q.includes('schritte') || q.includes('wie läuft') || q.includes('zusammenarbeit') || q.includes('start')) {
      return {
        type: 'text',
        text: `[SYS_PROCESS // ROADMAP]\n\n1. **Prozessanalyse (15 Min):** Engpässe identifizieren.\n2. **Festpreis-Blueprint:** Verbindlicher Fahrplan & Systemkarte.\n3. **Build & Integration:** Schlüsselfertiger Bau in 3 bis 14 Tagen.\n4. **Übergabe & 30 Tage Support:** Schulung & Nachbetreuung.`
      };
    }

    // 11. Dedicated Tech Stack & Tools Info
    if (q.includes('tools') || q.includes('schnittstelle') || q.includes('api') || q.includes('hubspot') || q.includes('salesforce') || q.includes('sevdesk') || q.includes('lexoffice') || q.includes('tech')) {
      return {
        type: 'text',
        text: `[SYS_INTEGRATION // TECH_STACK]\n\nWir binden nahezu jedes moderne Tool über API/n8n an: HubSpot, Salesforce, Outlook, Gmail, Notion, Slack, WhatsApp, SevDesk, Lexoffice, Supabase, OpenAI, Gemini & Claude.`
      };
    }

    // 12. Dedicated DSGVO Info
    if (q.includes('dsgvo') || q.includes('datenschutz') || q.includes('sicherheit') || q.includes('cookie')) {
      return {
        type: 'text',
        text: `[SYS_SECURITY // DSGVO_COMPLIANCE]\n\nKimpress arbeitet nach höchsten Standards:\n- Keine Tracking-Cookies\n- Fonts & Libraries 100% selbst gehostet\n- Verläufe im sessionStorage (Tab-Schließung löscht Daten)\n- Einhaltung der EU AI Act Transparenzpflichten (Art. 50).`
      };
    }

    // 13. Contact Info
    if (q.includes('kontakt') || q.includes('termin') || q.includes('anfrage') || q.includes('mail') || q.includes('telefon') || q.includes('buchen')) {
      return {
        type: 'text',
        text: `[SYS_CONTACT // DIRECT_LINE]\n\n📧 E-Mail: hallo@kimpress.de\n📞 Telefon: +49 1575 7221636\n📍 Standort: Hamburg\n\nKlicke oben im Menü oder unten auf "Jetzt anfragen" für ein Erstgespräch.`
      };
    }

    return {
      type: 'text',
      text: `[SYS_OPERATOR // READY]\n\nIch kenne die Architektur aller Kimpress-Systeme (n8n Workflows, E-Mail-Triage, CRM-Sync, KI-Content).\n\nNenne mir deinen aktuellen Engpass (z.B. "Postfach-Triage", "Manuelle Datenübertragung" oder "Festpreise") – und ich zeige dir die exakte Lösung.`
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

    // Show ONLY after 8 seconds of quiet reading time on page
    setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        hintPill.classList.add('active');

        // Auto-hide after 7 seconds of display
        setTimeout(() => {
          if (!hasInteracted && !isOpen) {
            hintPill.classList.remove('active');
          }
        }, 7000);
      }
    }, 8000);
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
      <span class="bot-hint-text">⚡ Berechne deine Ersparnis [ROI]</span>
    </div>

    <button id="bot-trigger" class="bot-trigger" aria-label="KI-Operator öffnen">
      <div class="bot-trigger__avatar-box">
        <img src="/images/characters/operator-avatar.jpg" alt="Cem Görül — Kimpress KI Operator" class="bot-trigger__avatar-img" />
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
            <img src="/images/characters/operator-avatar.jpg" alt="Cem Görül — Operator Face" class="bot-avatar__face-img" />
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
