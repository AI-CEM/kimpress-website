// Vercel Serverless Function: POST /api/chat
// Kimpress Neural AI Operator — Resilient Edge LLM Route Handler (2030 Standard)

export default async function handler(req, res) {
  // CORS & Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message parameter is required.' });
  }

  // System Prompt for Kimpress KI-Operator
  const systemPrompt = `Du bist Cems KI-Operator auf kimpress.de — der inhabergeführten KI- & Automatisierungsagentur aus Hamburg von Gründer Cem Görül.

DEINE PERSONA & POSITIONIERUNG:
- Gründer & Vorgeschichte: Kimpress wurde Ende Februar 2024 von Cem Görül in Hamburg (Billstedt) gegründet. Cem bringt über 15 Jahre Erfahrung in Webentwicklung, Marketing & Backend-Systemen mit.
- Ton: Direkt, pragmatisch, ehrlich, "Dirty Tech" Engineering-Vibe (kein Berater-Blabla, keine leeren Marketing-Floskeln).
- Rolle: Digitaler Assistent von Cem Görül. Solo Operator Modell = 1 Ansprechpartner, maximale Backend-Power.

DEINE THEMEN UND FACHWISSEN:
1. KI-Content Studio & Marketing-Pipelines (Haupt-Kernstärke): Erstellung von KI-gestützten Short-Form Videos (TikTok, Reels, Shorts), Hooks, KI-Skripten, Ad-Visuals & Social-Media-Pipelines.
2. Workflow-Automatisierung & API-Schnittstellen: Maßgeschneiderte n8n-Workflows, Tool-Anbindungen (CRM, Mail, SevDesk, Supabase) & individuelle API-Systeme.
3. Pragmatische KI-Websites & GEO: Blitzschnelle, conversion-starke Websites, optimiert für KI-Suchmaschinen (Perplexity, ChatGPT Search, Google AI).

PRICING & ANGEBOTS-PHILOSOPHIE (HIGH-TICKET B2B):
- KI-Content Engine (Retainer): 1.950 € / Monat (12x KI-Videos, Skripte, automatische Pipeline).
- Workflow-Automatisierung (n8n Sprints): Ab 2.500 € (Festpreis für maßgeschneiderte Workflows).
- KI-Assistenten & Bots: Ab 3.500 € (Festpreis für RAG & Voicebots).
- Kostenlose 15-Minuten Prozess-Analyse zur Qualifizierung.

REGELN:
- Antworte DIREKT mit deiner finalen deutschen Antwort an den Nutzer.
- Gib KEINE internen Gedankenschritte, Aufzählungen wie "Refining and Formatting" oder Meta-Kommentare aus.
- Antworte präzise, knackig (max 3-5 kurze Sätze) auf Deutsch.
- Nutze Zeilenumbrüche für gute Lesbarkeit im Chat-Window.`;

  const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    // Valid 2026/2030 Gemini API model sequence
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    for (const modelName of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout per model

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: `${systemPrompt}\n\nFrage des Nutzers: ${message}` }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500
              }
            })
          }
        );

        clearTimeout(timeoutId);

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          let reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            reply = cleanReply(reply);
            return res.status(200).json({ output: reply, source: `gemini (${modelName})` });
          }
        }
      } catch (err) {
        console.warn(`Gemini API (${modelName}) exception/timeout:`, err.message || err);
      }
    }
  }

  // Fallback: Try Groq API if GROQ_API_KEY is available (starts with gsk_ or GROQ_API_KEY)
  const groqKey = process.env.GROQ_API_KEY || (apiKey && apiKey.startsWith('gsk_') ? apiKey : null);

  if (groqKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      clearTimeout(timeoutId);

      if (groqRes.ok) {
        const data = await groqRes.json();
        let reply = data.choices?.[0]?.message?.content;
        if (reply) {
          reply = cleanReply(reply);
          return res.status(200).json({ output: reply, source: 'groq (llama-3.3-70b)' });
        }
      }
    } catch (err) {
      console.warn('Groq API Fetch Exception:', err.message || err);
    }
  }

  // Fallback response if all API endpoints fail or are unconfigured
  return res.status(503).json({ error: 'LLM API service temporarily unavailable.' });
}

function cleanReply(text) {
  if (!text) return '';
  let cleaned = text.replace(/^[\s\S]*?\]\s*\d*\.?\s*(Refining|Formatting|Thinking)[\s\S]*?\n/i, '');
  cleaned = cleaned.replace(/^\]\s*/, '');
  cleaned = cleaned.replace(/^Thinking Process:[\s\S]*?\n\n/i, '');
  return cleaned.trim();
}
