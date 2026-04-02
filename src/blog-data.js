/* ===================================================
   KIMPRESS BLOG DATA
   All posts live here — no backend needed.
   Add new posts to the top of the array.
   =================================================== */

export const BLOG_POSTS = [
  {
    slug: 'ki-automatisierung-kmu-2026',
    title: 'KI-Automatisierung für KMU: Was 2026 wirklich funktioniert',
    excerpt: 'Viele Unternehmen reden über KI — nur wenige nutzen sie wirklich gewinnbringend. Ich zeige dir, welche Automatisierungen für KMU im DACH-Raum heute sofort Wirkung bringen.',
    date: '2026-04-01',
    readTime: 8,
    category: 'Automatisierung',
    featured: true,
    content: `
<p class="blog-lead">Der Hype um KI ist real. Die Ergebnisse für die meisten KMU bisher noch nicht. Das liegt nicht an der Technologie — sondern daran, dass die falschen Dinge automatisiert werden.</p>

<h2>Das Problem mit den meisten KI-Projekten</h2>
<p>In der Praxis sehe ich täglich dasselbe Muster: Unternehmen starten mit einem riesigen Chatbot-Projekt, verbrennen Budget und Zeit, und am Ende läuft das Ding auf einer Landing Page, die niemand besucht. Zurück bleibt Ernüchterung.</p>
<p>Dabei ist KI-Automatisierung eigentlich verblüffend einfach — wenn man beim Richtigen anfängt.</p>

<h2>Die drei Automatisierungen mit dem sofortigen ROI</h2>

<h3>1. E-Mail-Klassifizierung und -Antworten</h3>
<p>Dein Postfach ist das größte Zeitfresser-System das du hast. Mit einem einfachen n8n-Workflow + GPT-4o lassen sich:</p>
<ul>
  <li>Anfragen automatisch kategorisieren (Neukunde / Bestandskunde / Support / Spam)</li>
  <li>Erste Antwort-Entwürfe in deiner Tonalität generieren</li>
  <li>Dringende Anfragen per Slack oder Telegram sofort signalisieren</li>
</ul>
<p>Zeitersparnis in der Praxis: 45–90 Minuten täglich. Bei einem Stundensatz von 80€ amortisiert sich das Setup in unter zwei Wochen.</p>

<h3>2. Content-Recycling-Pipeline</h3>
<p>Du schreibst einen Blog-Artikel (wie diesen). Statt ihn einmal zu veröffentlichen und dann zu vergessen, baust du eine Pipeline:</p>
<ul>
  <li>Artikel → LinkedIn-Post (Zusammenfassung + Hook)</li>
  <li>Artikel → 3 Instagram-Captions</li>
  <li>Artikel → TikTok-Skript (60 Sekunden, direkt formuliert)</li>
  <li>Artikel → E-Mail-Newsletter-Snippet</li>
</ul>
<p>Mit Make oder n8n + Claude 3.7 ist das ein vollautomatischer Workflow — du lädst den Artikel hoch, alles andere passiert von selbst.</p>

<h3>3. Lead-Qualifizierung via WhatsApp-Bot</h3>
<p>Der unterschätzte Kanal. WhatsApp hat im DACH-Raum eine Öffnungsrate von über 95%. Ein einfacher Bot, der Erstanfragen von deiner Website entgegennimmt, die richtigen Fragen stellt und qualifizierte Leads direkt in dein CRM schreibt — das ist der schnellste Return, den ich in der Praxis gesehen habe.</p>

<h2>Was du vermeiden solltest</h2>
<p>Fang nicht mit Custom GPTs für interne Wissensdatenbanken an. Nicht mit KI-gestütztem Recruiting. Nicht mit vollautomatisierten Social-Media-Accounts ohne Human-in-the-Loop. Das sind alles sinnvolle Projekte — aber sie brauchen Zeit, Daten und Feintuning, die du am Anfang nicht hast.</p>

<h2>Fazit</h2>
<p>KI-Automatisierung ist kein Moonshot-Projekt. Die beste erste Investition ist ein Workflow, der dir heute 30 Minuten spart. Dann der nächste. Nach sechs Monaten arbeitest du in einem fundamental anderen Unternehmen.</p>
<p>Wenn du wissen willst, wo in deinem Business die schnellsten Gewinne liegen — schreib mir. Das herausfinden dauert 15 Minuten.</p>
    `,
  },
  {
    slug: 'chatgpt-vs-claude-welches-modell',
    title: 'ChatGPT vs. Claude 2026 — Welches KI-Modell für welchen Use Case?',
    excerpt: 'GPT-4o oder Claude 3.7? Die ehrliche Antwort lautet: kommt drauf an. Ich nutze täglich beide — hier ist mein Praxis-Vergleich für Business-Anwendungen.',
    date: '2026-03-25',
    readTime: 6,
    category: 'KI-Tools',
    featured: false,
    content: `
<p class="blog-lead">Die Frage "Welches KI-Modell ist das beste?" ist falsch gestellt. Die richtige Frage ist: Für welche Aufgabe brauche ich welches Modell?</p>

<h2>Mein Alltag mit beiden Modellen</h2>
<p>Ich arbeite täglich mit GPT-4o, Claude 3.7 und verschiedenen spezialisierten Modellen. Was ich gelernt habe: Kein Modell ist in allem besser. Jedes hat Stärken, die für bestimmte Business-Anwendungen entscheidend sind.</p>

<h2>GPT-4o: Stärken in der Praxis</h2>
<ul>
  <li><strong>Code generieren und debuggen</strong> — OpenAI hat hier nach wie vor die Nase vorne, besonders bei komplexen Multi-File-Projekten</li>
  <li><strong>Strukturierte Datenextraktion</strong> — JSON-Output aus unstrukturierten Texten, perfekt für Automatisierungen</li>
  <li><strong>DALL-E Integration</strong> — Bilder direkt aus dem Chat, ohne separate API</li>
  <li><strong>Tool-Ökosystem</strong> — Custom GPTs, Actions, breite API-Unterstützung in fast allen No-Code-Tools</li>
</ul>

<h2>Claude 3.7: Wo es klar gewinnt</h2>
<ul>
  <li><strong>Lange Dokumente analysieren</strong> — 200k Token Context Window, Claude liest komplette Jahresberichte ohne zu halluzinieren</li>
  <li><strong>Copywriting in Tonalität</strong> — Texte, die sich nicht nach KI lesen. Für Marketing-Copy mein klarer Favorit</li>
  <li><strong>Reasoning bei komplexen Problemen</strong> — Claude 3.7 Sonnet mit Extended Thinking ist im strategischen Denken ungeschlagen</li>
  <li><strong>Weniger Halluzinationen bei Faktenchecks</strong> — Wenn es auf Genauigkeit ankommt</li>
</ul>

<h2>Meine Empfehlung nach Use Case</h2>
<p><strong>Für Automatisierungen (Make, n8n):</strong> GPT-4o — bessere API-Unterstützung, vorhersehbarere Outputs</p>
<p><strong>Für Content-Produktion:</strong> Claude 3.7 — natürlichere Texte, bessere Tonalität</p>
<p><strong>Für Code:</strong> GPT-4o (oder Cursor AI als Wrapper)</p>
<p><strong>Für Analyse und Research:</strong> Claude 3.7 mit langen Dokumenten</p>
<p><strong>Für Custom Chatbots:</strong> Je nach Anwendungsfall — teste beide</p>

<h2>Was ich keinem empfehle</h2>
<p>Sich auf ein Modell zu fixieren. Die Landschaft ändert sich schnell. Wer 2024 nur auf ChatGPT gesetzt hat, hat Claude's Durchbruch bei Coding verpasst. Wer nur Claude nutzt, verpasst GPT-4o's Tool-Integration. Die Lösung: Beide kennen, beide nutzen, das Richtige für den Job wählen.</p>
    `,
  },
  {
    slug: 'social-media-autopilot-ki',
    title: 'Social Media auf Autopilot: Täglich posten ohne einen Finger zu rühren',
    excerpt: 'Vollautomatisierte Content-Pipelines für TikTok, Instagram und LinkedIn — wie ich das für Kunden baue und was du heute schon umsetzen kannst.',
    date: '2026-03-18',
    readTime: 9,
    category: 'Social Media',
    featured: false,
    content: `
<p class="blog-lead">Was wäre, wenn du morgens aufwachst und bereits drei Posts für heute fertig sind — mit Bild, Caption und dem richtigen Hashtag-Set für jeden Kanal? Das ist kein Traum. Das ist eine Automatisierung.</p>

<h2>Die Anatomie einer Content-Pipeline</h2>
<p>Bevor ich technische Details zeige, möchte ich das Grundprinzip erklären. Eine KI-gestützte Content-Pipeline hat typischerweise vier Schichten:</p>
<ol>
  <li><strong>Input-Layer:</strong> Woher kommen die Ideen? (RSS-Feeds, manuelle Eingabe, Branchen-News)</li>
  <li><strong>Produktions-Layer:</strong> KI generiert Text, Bild, ggf. Audio</li>
  <li><strong>Qualitäts-Layer:</strong> Human-in-the-Loop oder automatischer Filter</li>
  <li><strong>Distribution-Layer:</strong> Automatisches Posting auf allen Plattformen</li>
</ol>

<h2>Tool-Stack den ich nutze</h2>
<p>Für die meisten meiner Kunden baue ich folgende Kombination:</p>
<ul>
  <li><strong>n8n</strong> als Orchestrierung — kostenlos, self-hosted möglich, flexibler als Make</li>
  <li><strong>Claude 3.7</strong> für Caption-Texte und Hooks — klingt am wenigsten wie KI</li>
  <li><strong>Midjourney v6 / DALL-E 3</strong> für Bildgenerierung je nach Style-Anforderung</li>
  <li><strong>ElevenLabs</strong> wenn Voice-Overs benötigt werden</li>
  <li><strong>Buffer oder Publer</strong> für automatisches Scheduling</li>
</ul>

<h2>Konkrete Pipeline: TikTok-Kanal für KI-Agentur</h2>
<p>Ich zeige dir wie diese Pipeline für eine KI-Agentur aussehen könnte:</p>
<ol>
  <li>Jeden Montag trägt der Kunde 5 Topic-Keywords in ein Airtable-Sheet ein</li>
  <li>n8n liest das Sheet und sendet jeden Morgen um 6h einen Prompt an Claude</li>
  <li>Claude generiert: Hook-Satz, Hauptaussage (3 Punkte), Call-to-Action, 15 Hashtags</li>
  <li>DALL-E generiert passendes Visual mit konsistentem Brand-Style</li>
  <li>Buffer plant den Post für 11h (Peak-Zeit im DACH-Raum)</li>
  <li>Ergebnis landet zur Review in einem Telegram-Channel</li>
</ol>
<p>Setup-Zeit: ca. 4–6 Stunden. Danach: täglich 30 Sekunden für Qualitätskontrolle.</p>

<h2>Was du ohne KI-Agentur sofort machen kannst</h2>
<p>Nutze ChatGPT Custom GPTs. Erstelle einen GPT der deine Brand-Voice kennt, deine Zielgruppe versteht und Posts in deinem Stil schreibt. Kostet keine Setup-Zeit und ist sofort produktiv.</p>
<p>Das Limit: Kein Auto-Posting, kein Bildgenerierung-Loop. Aber es spart dir 80% der Schreibzeit.</p>

<h2>Der entscheidende Faktor</h2>
<p>Die Technologie ist nicht das Problem. Das Problem ist immer die Brand-Voice. KI generiert Inhalte — aber sie müssen nach DIR klingen. Das Feintuning der Prompts auf deinen spezifischen Stil ist das, was den Unterschied macht zwischen generischen Posts und Content, der wirklich konvertiert.</p>
    `,
  },
  {
    slug: 'custom-gpt-bauen-anleitung',
    title: 'Custom GPT in 30 Minuten: Dein persönlicher KI-Assistent',
    excerpt: 'Custom GPTs sind das unterschätzte Feature von OpenAI. Ich zeige dir Schritt für Schritt, wie du deinen eigenen Assistenten für dein Business baust — ohne eine Zeile Code.',
    date: '2026-03-10',
    readTime: 7,
    category: 'KI-Tools',
    featured: false,
    content: `
<p class="blog-lead">Custom GPTs sind keine KI-Spielerei. Gut gebaut sind sie ein echtes Business-Tool, das dir täglich Stunden spart. Hier ist meine Anleitung.</p>

<h2>Was ein Custom GPT kann (und was nicht)</h2>
<p>Ein Custom GPT ist ein angepasster Chatbot auf Basis von GPT-4o, den du über OpenAI's GPT Builder erstellen kannst. Du brauchst dafür einen ChatGPT Plus Account (20€/Monat).</p>
<p>Er kann:</p>
<ul>
  <li>Dokumente, PDFs, Excel-Dateien analysieren die du hochlädst</li>
  <li>In einer bestimmten Tonalität und nach bestimmten Regeln antworten</li>
  <li>Externe APIs aufrufen (mit etwas Setup)</li>
  <li>Spezifisches Wissen über dein Unternehmen, deine Kunden, deine Produkte haben</li>
</ul>
<p>Er kann nicht (ohne Pro-Setup): Eigenständig im Web surfen, auf externe Datenbanken zugreifen, automatisch Aufgaben ausführen.</p>

<h2>Schritt-für-Schritt: Dein erster Custom GPT</h2>

<h3>Schritt 1: GPT Builder öffnen</h3>
<p>Geh auf chat.openai.com → Explore GPTs → Create → Configure. Du siehst jetzt den GPT Builder.</p>

<h3>Schritt 2: Den Kern definieren</h3>
<p>Im "Instructions"-Feld beschreibst du, wer dein GPT ist. Template:</p>
<blockquote>
Du bist [Name], ein KI-Assistent für [Unternehmen]. Du hilfst [Zielgruppe] mit [Aufgabe]. Du antwortest immer auf Deutsch, in einem [Tonalität]-Stil. Du weißt folgendes über unser Unternehmen: [wichtige Infos]. Du antwortest nie mit mehr als [X] Sätzen pro Antwort, außer du wirst explizit nach mehr gefragt.
</blockquote>

<h3>Schritt 3: Wissensdaten hochladen</h3>
<p>Erstelle ein Dokument mit allem was dein GPT wissen soll: Produkte, Preise, FAQ, Prozesse. Als PDF hochladen. Der GPT liest es und nutzt es als Referenz.</p>

<h3>Schritt 4: Conversation Starters</h3>
<p>Definiere 4 Starter-Prompts, die häufige Use Cases abdecken. Das leitet Nutzer direkt zum Wert.</p>

<h3>Schritt 5: Testen und verfeinern</h3>
<p>Teste 10–20 realistische Anfragen. Dort wo die Antworten nicht passen: Instructions anpassen. Das ist der wichtigste Schritt und braucht meistens 2–3 Iterationen.</p>

<h2>Die 3 Custom GPTs die ich jedem empfehle</h2>
<ol>
  <li><strong>Angebots-Assistent</strong> — kennt deine Leistungen und Preise, erstellt Angebots-Entwürfe</li>
  <li><strong>Content-Assistent</strong> — kennt deine Brand-Voice, schreibt Posts in deinem Stil</li>
  <li><strong>Kunden-Onboarding-Assistent</strong> — beantwortet die 20 häufigsten Fragen neuer Kunden</li>
</ol>

<h2>Ein Beispiel aus der Praxis</h2>
<p>Für einen meiner Kunden (Coaching-Business) habe ich einen Custom GPT gebaut, der neue Klienten durch einen strukturierten Onboarding-Fragebogen führt. Ergebnis: 70% weniger Onboarding-E-Mails, und die ersten Antworten der Coaches sind deutlich detaillierter weil der GPT schon alle Grundinfos gesammelt hat.</p>
    `,
  },
  {
    slug: 'seo-mit-ki-2026',
    title: 'SEO mit KI 2026: Wie du Google-Rankings aufbaust ohne stundenlang Content zu schreiben',
    excerpt: 'KI-gestützter SEO ist kein Trick — es ist eine Strategie. Ich zeige dir, wie du mit KI-Tools systematisch Suchmaschinenrankings aufbaust, ohne jeden Artikel manuell zu schreiben.',
    date: '2026-03-03',
    readTime: 10,
    category: 'SEO',
    featured: false,
    content: `
<p class="blog-lead">Google hat 2024 klargestellt: KI-generierter Content ist nicht verboten. Schlechter Content ist verboten. Der Unterschied liegt nicht im Autor, sondern in der Qualität.</p>

<h2>Die neue SEO-Realität</h2>
<p>Wer heute SEO macht wie 2020 — Keyword stuffing, dünner Content, gekaufte Links — wird 2026 nicht ranken. Googles Helpful Content Update hat das Spielfeld verändert. Aber es hat auch neue Möglichkeiten für clevere KI-Nutzung eröffnet.</p>

<h2>Was mit KI funktioniert</h2>

<h3>Content-Briefing und Keyword-Recherche</h3>
<p>Perplexity AI ist mein bevorzugtes Tool für initiale Recherche. Es zeigt nicht nur Keywords, sondern erklärt die Suchintention dahinter. Kombiniert mit Ahrefs oder Semrush für Volume-Daten hast du ein Briefing in 20 Minuten statt 3 Stunden.</p>

<h3>Content-Struktur und Outline</h3>
<p>Claude ist hier stark. Prompt: "Analysiere die Top-10-Artikel zu [Keyword] und erstelle eine Outline, die alle wichtigen Unterthemen abdeckt aber einen einzigartigen Winkel bietet." Das gibt dir eine Struktur, die für User und Google funktioniert.</p>

<h3>First Draft + Expertenwissen</h3>
<p>KI schreibt den Erstentwurf. Du fügst echte Erfahrung, Zahlen, Beispiele ein. Das ist der entscheidende Schritt: Dein spezifisches Wissen macht den Artikel unique. Ohne diesen Schritt hast du KI-Content wie alle anderen — und das rankt nicht.</p>

<h3>On-Page-Optimierung</h3>
<p>Meta-Titel, Meta-Description, Alt-Texte, interne Verlinkung — alles Aufgaben für KI. Schema-Markup für Artikel, FAQ, How-To — wenige Minuten mit GPT-4o.</p>

<h2>Was nicht funktioniert</h2>
<p><strong>Bulk-Content ohne Qualitätskontrolle:</strong> 100 KI-Artikel zum gleichen Thema-Cluster ohne menschliche Review erzeugen Cannibalisation und schaden dem ganzen Domain. </p>
<p><strong>KI-Content ohne eigene Perspektive:</strong> Google erkennt generischen Content. E-E-A-T (Experience, Expertise, Authoritativeness, Trust) braucht echte Erfahrung. Die muss von dir kommen.</p>

<h2>Meine KI-SEO-Workflow in der Praxis</h2>
<ol>
  <li>Keyword-Cluster definieren (Ahrefs + Perplexity): 1h/Monat</li>
  <li>Für jeden Artikel: Briefing mit Claude erstellen: 20 Min</li>
  <li>First Draft: GPT-4o oder Claude: 15 Min</li>
  <li>Eigene Perspektive, Beispiele, Daten einfügen: 45 Min</li>
  <li>On-Page-Optimierung: GPT-4o: 10 Min</li>
  <li>Publish und intern verlinken: 10 Min</li>
</ol>
<p>Total: 2h pro Artikel. Vorher: 6–8h. Das ist der echte ROI von KI-SEO.</p>

<h2>Quick Win für heute</h2>
<p>Geh in Google Search Console und schau welche Artikel auf Position 5–15 ranken. Das sind deine niedrig hängenden Früchte. Aktualisiere diese Artikel mit KI-Unterstützung — mehr Tiefe, aktuellere Daten, bessere Struktur. In 2–4 Wochen siehst du eine Bewegung.</p>
    `,
  },
];

export const CATEGORIES = ['Alle', 'Automatisierung', 'KI-Tools', 'Social Media', 'SEO'];

export function getPostBySlug(slug) {
  return BLOG_POSTS.find(p => p.slug === slug) || null;
}

export function getRelatedPosts(currentSlug, limit = 3) {
  return BLOG_POSTS
    .filter(p => p.slug !== currentSlug)
    .slice(0, limit);
}
