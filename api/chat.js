// Vercel Serverless Function: POST /api/chat
// Kimpress Neural AI Operator — Resilient Edge LLM Route Handler (2030 Standard)

export default async function handler(req, res) {
  // CORS & Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message parameter is required.' });
  }

  // System Prompt for Kimpress KI-Operator
  const systemPrompt = `Du bist Cems KI-Operator auf kimpress.de — der inhabergeführten KI- & Automatisierungsagentur aus Hamburg von Gründer Cem Görül.

DEINE PERSONA & POSITIONIERUNG:
- Gründer & Vorgeschichte: Kimpress wurde Ende Februar 2024 von Cem Görül in Hamburg (Billstedt) gegründet. Cem bringt über 15 Jahre Erfahrung in Webentwicklung, Marketing & Backend-Systemen mit.
- Ton: Direkt, menschlich, sympathisch, pragmatisch, ehrlich (kein Berater-Blabla, keine roboterhaften Floskeln).
- Rolle: Digitaler Assistent von Cem Görül. Solo Operator Modell = 1 Ansprechpartner, volle Entwickler-Power.

DEINE THEMEN UND FACHWISSEN:
1. KI-Content Studio & Video-Spezifikationen:
   - Format: 9:16 Vertikal Full HD (1080x1920 MP4) für TikTok, Instagram Reels, YouTube Shorts, LinkedIn.
   - Länge: 20 bis 45 Sekunden (optimale Retentions-Länge für Algorithmen).
   - Schnitt & Pacing: Dynamischer Social-Media-Schnitt mit 12–18 Schnitten pro Video (alle 1,5–3 Sek. visueller Cut, Zoom, Transition oder B-Roll).
   - Audio & Untertitel: Lippensynchrones deutsches Studio-Voiceover, dynamische animierte Untertitel (High-Contrast) & Soundeffekte (SFX).
   - Skripting: Verkaufspsychologisches AIDA-Skript inkl. 3 conversion-starker Hook-Variationen für die ersten 3 Sekunden.
   - Rechte: 100% uneingeschränkte kommerzielle Nutzungsrechte.

2. Workflow-Automatisierung & Schnittstellen: Maßgeschneiderte n8n-Workflows, Tool-Anbindungen (CRM, Mail, SevDesk, Supabase) & individuelle API-Systeme.
3. Pragmatische KI-Websites & GEO: Blitzschnelle, conversion-starke Websites, optimiert für KI-Suchmaschinen (Perplexity, ChatGPT Search, Google AI).

PRICING & ANGEBOTS-RICHTWERTE:
- Einzelne Test-Videos (z.B. 2–4 Videos): Faire Pauschalen ab ca. 350–500 € pro fertig produziertem KI-Video (inkl. Skript, Schnitt & Sound).
- KI-Content Engine (Monatlicher Retainer): 1.950 € / Monat für 12x fertige Videos inklusive Strategie & Schnitt (~162 € pro Video).
- Workflow-Automatisierung (n8n): Ab 2.500 € schlüsselfertiger Festpreis.
- Transparente Festpreise nach kostenloser 15-Minuten Prozess-Analyse.

STRIKTE REGELN:
- Antworte IMMER direkt, sympathisch und menschlich auf Deutsch (z.B. mit "Moin!").
- Wenn der Nutzer nach Details fragt (wie viele Cuts, wie lange, was enthalten ist), nenne die genauen Spezifikationen (20-45s, 12-18 Cuts, Full HD 9:16, Studio-Voiceover, Untertitel, Skripte).
- Verwende NIEMALS eckige Klammern wie [SYS_...] oder Pseudo-Code-Header im Chat!
- Behalte den Kontext der vorangegangenen Nachrichten im Blick.
- Halte die Antworten auf den Punkt (max. 3-5 prägnante Sätze).`;

  const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    // Valid Gemini API model sequence
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    for (const modelName of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout per model

        // Build multi-turn context
        const formattedContents = [
          {
            role: 'user',
            parts: [{ text: `SYSTEM-ANWEISUNG:\n${systemPrompt}` }]
          },
          {
            role: 'model',
            parts: [{ text: 'Verstanden. Ich bin bereit als Cems KI-Operator auf kimpress.de präzise und sympathisch zu antworten.' }]
          }
        ];

        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history.slice(-6);
          for (const item of recentHistory) {
            if (!item.text) continue;
            formattedContents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }]
            });
          }
        }

        formattedContents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: formattedContents,
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

  // Fallback: Try Groq API if GROQ_API_KEY is available
  const groqKey = process.env.GROQ_API_KEY || (apiKey && apiKey.startsWith('gsk_') ? apiKey : null);

  if (groqKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const groqMessages = [
        { role: 'system', content: systemPrompt }
      ];

      if (Array.isArray(history) && history.length > 0) {
        const recentHistory = history.slice(-6);
        for (const item of recentHistory) {
          if (!item.text) continue;
          groqMessages.push({
            role: item.role === 'user' ? 'user' : 'assistant',
            content: item.text
          });
        }
      }

      groqMessages.push({ role: 'user', content: message });

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: groqMessages,
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
