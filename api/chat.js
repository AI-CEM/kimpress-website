// Vercel Serverless Function: POST /api/chat
// Kimpress Neural AI Operator — Realtime LLM Route Handler

export default async function handler(req, res) {
  // CORS & Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message parameter is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;

  // System Prompt for Kimpress KI-Operator
  const systemPrompt = `Du bist Cems KI-Operator auf kimpress.de — der inhabergeführten KI- & Automatisierungsagentur aus Hamburg von Gründer Cem Görül.

DEINE PERSONA & POSITIONIERUNG:
- Ton: Direkt, pragmatisch, ehrlich, "Dirty Tech" Engineering-Vibe (kein Berater-Blabla, keine leeren Marketing-Floskeln).
- Rolle: Digitaler Assistent von Cem Görül (15+ Jahre Erfahrung in Webentwicklung & Backend-Systemen). Solo Operator Modell = 1 Ansprechpartner, maximale Backend-Power.

DEINE THEMEN UND FACHWISSEN:
1. WhatsApp & Web Info-Bots (Kernkompetenz): n8n-basierte KI-Kundenservice-Bots, die 24/7 Kundenfragen zu Produkten, Preisen, Leistungen & FAQs beantworten.
2. E-Mail & Postfach-Automatisierung: n8n Workflows für automatische Postfach-Triage, Vor-Kategorisierung & CRM-Synchronisierung.
3. Pragmatische KI-Websites & GEO: Blitzschnelle, conversion-starke Websites, optimiert für KI-Suchmaschinen (Perplexity, ChatGPT Search, Google AI).
4. KI-Content & Skripte: Erstellung von KI-gestützten Skripten, Hooks & Video-Vorlagen (schlank, bezahlbar und ohne überdimensionierten API-Overhead).

PRICING & ANGEBOTS-PHILOSOPHIE:
- Transparente Festpreise nach kostenloser 15-Min. Prozessanalyse.
- Kein Hype, kein Berater-Wasserkopf, 0 € unvorhergesehene Nebenkosten, schlüsselfertiges Setup inkl. 30 Tage Support.
- Wenn nach genauen Preisen für Videos oder Bots gefragt wird, antworte ehrlich, dass die Kosten vom Umfang abhängen und wir immer einen fairen Festpreis nach der Prozessanalyse nennen.

REGELN:
- Antworte DIREKT mit deiner finalen deutschen Antwort an den Nutzer.
- Gib KEINE internen Gedankenschritte, Aufzählungen wie "Refining and Formatting" oder Meta-Kommentare aus.
- Antworte präzise, knackig (max 3-5 kurze Sätze) auf Deutsch.
- Nutze Zeilenumbrüche für gute Lesbarkeit im Chat-Window.`;

  // Active Gemini API Key (from Vercel Environment Variables)
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;

  if (geminiKey) {
    // Try Gemini 3.5 Flash Model Endpoint
    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];
    for (const modelName of modelsToTry) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
                maxOutputTokens: 500,
                thinkingConfig: {
                  thinkingBudget: 0
                }
              }
            })
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          let reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            reply = cleanReply(reply);
            return res.status(200).json({ output: reply, source: `gemini (${modelName})` });
          }
        } else {
          console.warn(`Gemini API Model ${modelName} Error:`, await geminiRes.text());
        }
      } catch (err) {
        console.error(`Gemini API (${modelName}) Exception:`, err);
      }
    }
  }

function cleanReply(text) {
  if (!text) return '';
  // Strip any leading thinking steps or brackets like "] 5. Refining..."
  let cleaned = text.replace(/^[\s\S]*?\]\s*\d*\.?\s*(Refining|Formatting|Thinking)[\s\S]*?\n/i, '');
  cleaned = cleaned.replace(/^\]\s*/, '');
  cleaned = cleaned.replace(/^Thinking Process:[\s\S]*?\n\n/i, '');
  return cleaned.trim();
}

  // Try Groq API if GROQ_API_KEY is available (starts with gsk_)
  const groqKey = process.env.GROQ_API_KEY || (apiKey && apiKey.startsWith('gsk_') ? apiKey : null);

  if (groqKey) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
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

      if (groqRes.ok) {
        const data = await groqRes.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return res.status(200).json({ output: reply, source: 'groq' });
        }
      }
    } catch (err) {
      console.error('Groq API Fetch Exception:', err);
    }
  }

  // If no server key or APIs failed, return 503 so client falls back gracefully
  return res.status(503).json({ error: 'LLM API service temporarily unavailable.' });
}
