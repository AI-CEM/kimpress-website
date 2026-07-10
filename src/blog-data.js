/* ===================================================
   KIMPRESS BLOG DATA
   All posts live here — no backend needed.
   Add new posts to the top of the array.
   =================================================== */

export const BLOG_POSTS = [
  {
    slug: 'n8n-workflow-automatisierung-kmu-anleitung',
    title: 'n8n Workflow-Automatisierung: Wie du dein Postfach mit KI sortierst',
    excerpt: 'E-Mail-Chaos bremst dein B2B-Business aus. In dieser Anleitung zeige ich dir Schritt-für-Schritt, wie du ein n8n-Postfach-Setup aufsetzt, das Kundenanfragen vollautomatisch vorsortiert.',
    date: '2026-07-10',
    readTime: 7,
    category: 'Automatisierung',
    featured: true,
    content: `
<p class="blog-lead">Jeder Dienstleister kennt das: Am Morgen wartet ein volles Postfach. Support-Tickets, Neukunden-Anfragen, Rechnungen und Spam liegen ungeordnet nebeneinander. Die manuelle Vorsortierung kostet dich und dein Team täglich wertvolle Zeit. Die Lösung: Ein automatisierter n8n-Workflow gepaart mit künstlicher Intelligenz.</p>

<h2>Warum n8n die beste Wahl für KMU ist</h2>
<p>Im Vergleich zu Zapier oder Make bietet n8n einen unschlagbaren Vorteil: Es kann komplett selbst gehostet werden (Self-Hosting auf einem europäischen Server). Das bedeutet für deutsche Unternehmen absolute DSGVO-Konformität, da keine Daten ungewollt an US-amerikanische Server übertragen werden.</p>

<h2>Die Schritt-für-Schritt-Anleitung für dein Postfach</h2>
<p>Wir bauen eine Pipeline, die jede eingehende E-Mail liest, den Inhalt analysiert, eine passende Kategorisierung vornimmt und dir eine formatierte Benachrichtigung an Slack oder Telegram schickt.</p>

<h3>Schritt 1: Der IMAP Email Trigger</h3>
<p>Der erste Node in unserem n8n-Workflow horcht auf dein Postfach. Sobald eine neue E-Mail eingeht, zieht n8n die Metadaten: Absender, Betreff, Empfangsdatum und den reinen Text-Inhalt der E-Mail.</p>

<h3>Schritt 2: Die KI-Klassifizierung</h3>
<p>Wir leiten den E-Mail-Text an ein LLM (wie Gemini oder Claude) weiter. Der Prompt ist entscheidend und muss klare Regeln definieren:</p>
<blockquote>
Analysiere die folgende E-Mail und weise ihr genau eine der folgenden Kategorien zu:
- NEUKUNDE (Anfragen zu Dienstleistungen oder Preisen)
- SUPPORT (Bestandskunden mit technischen Fragen)
- RECHNUNG (Belege, Mahnungen, Rechnungen)
- SPAM (Werbung, uninteressante Angebote)
Antworte ausschließlich im JSON-Format mit der Kategorie und einer kurzen Zusammenfassung in 2 Sätzen.
</blockquote>

<h3>Schritt 3: Das intelligente Routing</h3>
<p>Ein Switch-Node in n8n liest das JSON-Ergebnis aus:</p>
<ul>
  <li><strong>NEUKUNDE:</strong> Die Anfrage wird sofort in Pipedrive/HubSpot als neuer Lead angelegt und triggert eine Push-Meldung auf dein Smartphone.</li>
  <li><strong>RECHNUNG:</strong> Der Anhang (PDF) wird automatisch in deinen Buchhaltungs-Ordner bei Google Drive oder Microsoft OneDrive hochgeladen.</li>
  <li><strong>SUPPORT:</strong> n8n erstellt ein Ticket im Support-System.</li>
</ul>

<h2>Fazit &amp; Dein nächster Schritt</h2>
<p>Dieses Setup spart in inhabergeführten KMU durchschnittlich 60 bis 90 Minuten administrative Arbeit &mdash; pro Tag. Wenn du dieses System in deinem Unternehmen implementieren möchtest, um dein Postfach auf Autopilot zu stellen, kontaktiere mich direkt für eine kostenlose Prozess-Analyse.</p>
    `,
  },
  {
    slug: 'ki-automatisierung-kmu-2026',
    title: 'KI-Automatisierung für KMU: Was 2026 wirklich funktioniert',
    excerpt: 'Viele Unternehmen reden über KI — nur wenige nutzen sie wirklich gewinnbringend. Ich zeige dir, welche Automatisierungen für KMU im DACH-Raum heute sofort Wirkung bringen.',
    date: '2026-04-01',
    readTime: 8,
    category: 'Automatisierung',
    featured: false,
    content: `
<p class="blog-lead">Ehrliche Frage: Wie viele Stunden hast du diese Woche damit verbracht, Kontaktdaten aus E-Mails in dein CRM zu kopieren, Termine manuell zu bestätigen oder Rechnungen abzugleichen? Zu viele. Genau hier liegt der Fehler: Viele KMU jagen utopischen KI-Projekten nach, während die echten Zeitfresser im operativen Alltag liegen.</p>

<h2>Warum die meisten KI-Projekte im Mittelstand scheitern</h2>
<p>Wenn ich mit inhabergeführten Unternehmen oder Dienstleistern hier in Hamburg spreche, höre ich oft dieselbe Story: "Wir haben viel Geld für eine teure Beratung bezahlt, am Ende haben wir einen Chatbot auf der Webseite, den niemand nutzt." Das frustriert &mdash; und zwar zurecht.</p>
<p>KI-Automatisierung ist kein Selbstzweck. Sie ist erfolgreich, wenn sie dir und deinem Team ab Tag 1 lästige Routinearbeit abnimmt. Und das geht meistens deutlich einfacher, als du denkst.</p>

<h2>Drei Automatisierungen mit sofortigem ROI (Return on Investment)</h2>

<h3>1. Das intelligente Postfach (E-Mail-Klassifizierung)</h3>
<p>Dein Postfach ist wahrscheinlich dein größter Zeitfresser. Mit einer n8n- oder Make-Pipeline und einem smarten LLM im Hintergrund sortieren wir eingehende E-Mails vollautomatisch:</p>
<ul>
  <li>Anfragen werden nach Relevanz klassifiziert (z.B. "Neukunde", "Support", "Spam").</li>
  <li>Die KI entwirft direkt einen passenden Antwortentwurf in deiner persönlichen Brand-Voice.</li>
  <li>Wichtige Leads triggern sofort eine Push-Nachricht auf dein Handy.</li>
</ul>
<p><strong>Zeitersparnis in der Praxis:</strong> Mindestens 60 Minuten pro Tag. Bei einem typischen Stundensatz hat sich dieses Setup oft schon nach 10 Tagen amortisiert.</p>

<h3>2. Die Content-Recycling-Maschine</h3>
<p>Du schreibst einen guten Artikel oder nimmst ein Video auf. Statt es einmal zu posten und zu hoffen, bauen wir eine automatisierte Content-Pipeline:</p>
<ul>
  <li>Dein Rohmaterial (Text oder Video) wird hochgeladen.</li>
  <li>Die KI generiert daraus passgenaue LinkedIn-Beiträge, Instagram-Captions und TikTok-Skripte.</li>
  <li>Alles wird automatisch in deinen Entwürfen bei Buffer oder Later abgelegt.</li>
</ul>
<p>Du steckst einmalig 30 Minuten in den Input &mdash; die KI erledigt die tagelange Formatierungsarbeit für alle Plattformen.</p>

<h3>3. Lead-Qualifizierung über WhatsApp</h3>
<p>WhatsApp hat im DACH-Raum Öffnungsraten von über 95%. Ein einfacher, strukturierter WhatsApp-Assistent nimmt Anfragen von deiner Website entgegen, stellt die wichtigsten Fragen zur Vorqualifizierung (Budget, Projektart) und trägt die Daten sauber in dein CRM ein. Erst wenn der Lead qualifiziert ist, schaltet sich ein Mensch ein.</p>

<h2>Mein Fazit als Solo Operator</h2>
<p>Fang klein an. Versuche nicht, deine gesamte Firma auf einmal zu revolutionieren. Starte mit einem einzigen Workflow, der dir heute 30 Minuten spart. Morgen mit dem nächsten. Wenn du wissen willst, welche Routineaufgabe in deinem Business das größte Potenzial hat &mdash; lass uns einfach 15 Minuten unverbindlich sprechen. Ich schaue mir deine Prozesse an und sage dir direkt, was machbar ist.</p>
    `,
  },
  {
    slug: 'chatgpt-vs-claude-welches-modell',
    title: 'ChatGPT vs. Claude 2026 — Welches KI-Modell für welchen Use Case?',
    excerpt: 'GPT-4o oder Claude 4.6? Die ehrliche Antwort lautet: kommt drauf an. Ich nutze täglich beide — hier ist mein Praxis-Vergleich für Business-Anwendungen.',
    date: '2026-03-25',
    readTime: 6,
    category: 'KI-Tools',
    featured: false,
    content: `
<p class="blog-lead">"Soll ich für mein Unternehmen ChatGPT Plus abonnieren oder lieber Claude Pro?" Diese Frage höre ich fast täglich. Die ehrliche Antwort eines KI-Dienstleisters lautet: Du solltest die Stärken beider Modelle kennen, denn sie sind für völlig unterschiedliche Aufgaben gebaut.</p>

<h2>Mein Praxis-Alltag: Welches Modell macht welchen Job?</h2>
<p>Als Solo Operator arbeite ich täglich mit Gemini, Claude und GPT-Modellen. Ich nutze sie nicht als Spielerei, sondern als harte Produktivitäts-Werkzeuge. Dabei zeigt sich schnell: Die Modelle haben klare Spezialgebiete.</p>

<h2>ChatGPT (OpenAI): Der logische Allrounder</h2>
<p>ChatGPT ist mein Go-To-Tool, wenn es um logische Strukturen, Code und Daten geht:</p>
<ul>
  <li><strong>Code &amp; Debugging:</strong> Wenn ich für meine Kunden Webseiten optimiere oder Scripte schreibe, liefert ChatGPT extrem präzisen Code.</li>
  <li><strong>Strukturierte Ausgaben (JSON):</strong> Perfekt, um unstrukturierte Texte in saubere Tabellen oder Datenbankformate umzuwandeln.</li>
  <li><strong>Tool-Integration:</strong> Die Anbindung von Custom GPTs an externe Tools via Schnittstellen (APIs) funktioniert hier am stabilsten.</li>
</ul>

<h2>Claude (Anthropic): Der kreative Texter</h2>
<p>Claude gewinnt sofort, wenn es um menschliche Sprache, lange Dokumente und konzeptionelles Denken geht:</p>
<ul>
  <li><strong>Natürliches Copywriting:</strong> Claude schreibt Texte, die sich nicht nach "KI" anfühlen. Der Tonfall ist wärmer, abwechslungsreicher und verzichtet auf typische Floskeln.</li>
  <li><strong>Lange Dokumente analysieren:</strong> Du kannst Claude komplette Verträge oder Handbücher hochladen &mdash; das Modell findet Details in Sekunden, ohne wichtige Zusammenhänge zu vergessen.</li>
  <li><strong>Konzeptioneller Partner:</strong> Perfekt, um Marketingstrategien zu brainstormen oder komplexe Texte zu redigieren.</li>
</ul>

<h2>Meine Empfehlung für dein Business</h2>
<p>Wenn du primär **Marketingtexte, Blogartikel und E-Mails** schreibst: Wähle **Claude**. Wenn du primär **Daten auswertest, Code benötigst oder Workflows baust**: Wähle **ChatGPT**. Am besten ist es jedoch, beide im Verbund zu nutzen &mdash; genau das tun wir bei Kimpress, um für jedes Projekt das optimale Ergebnis zu garantieren.</p>
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
<p class="blog-lead">Täglich posten auf LinkedIn, TikTok und Instagram, während du dich voll auf deine Kunden konzentrierst? Viele Agenturen verlangen dafür vierstellige Retainer im Monat. Ich zeige dir, wie wir diese Social-Media-Workflows mit KI automatisieren &mdash; ohne Qualitätsverlust.</p>

<h2>Die drei Säulen einer automatisierten Content-Pipeline</h2>
<p>Damit eine Automatisierung funktioniert und nicht nach seelenlosem Spam aussieht, bauen wir sie in drei Schritten auf:</p>
<ol>
  <li><strong>Der Input (Deine Expertise):</strong> Wir saugen dein Wissen ab. Das kann ein kurzes Sprachmemo von dir sein, ein Blogartikel oder ein Kundenfeedback. Das ist die menschliche Basis.</li>
  <li><strong>Die KI-Verarbeitung (Die Formatierung):</strong> Gemini oder Claude transformieren deinen Input in plattformgerechte Beiträge. Sie schreiben die Hooks für LinkedIn, die Captions für Instagram und die Skripte für TikTok.</li>
  <li><strong>Die Verteilung (Der Autopilot):</strong> n8n oder Make schieben die fertigen Beiträge direkt in dein Social-Media-Planungstool (z.B. Buffer). Dort liegen sie als Entwurf bereit. Du musst nur noch auf "Freigeben" klicken.</li>
</ol>

<h2>Warum das "Human-in-the-Loop"-Prinzip entscheidend ist</h2>
<p>Ich rate jedem Kunden dringend davon ab, KI-Posts vollautomatisch und ungeprüft live zu schalten. Warum? Weil künstliche Intelligenz deine persönliche Note nicht zu 100% kopieren kann. Der echte Hebel liegt darin, dass die KI dir 90% der Schreib- und Formatierungsarbeit abnimmt. Die letzten 10% &mdash; das kurze Gegenlesen und Freigeben &mdash; bleiben bei dir. So bleibt dein Content authentisch und gewinnt echtes Vertrauen.</p>

<h2>Wie du heute starten kannst</h2>
<p>Wenn du manuell Zeit sparen willst, erstelle dir ein Dokument mit deinen besten LinkedIn-Posts und füttere damit ein Sprachmodell deiner Wahl als Tonalitäts-Vorlage. Wenn du jedoch eine vollautomatisierte Pipeline haben willst, die im Hintergrund für dich arbeitet, lass uns sprechen. Wir bauen dir ein System, das sich ab dem ersten Monat bezahlt macht.</p>
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
  <li><strong>Kunden-Onboarding-Assistent</strong> — Beantwortet die 20 häufigsten Fragen neuer Kunden</li>
</ol>

<h2>Ein Beispiel aus der Praxis</h2>
<p>Für einen meiner Kunden (Coaching-Business) habe ich einen Custom GPT gebaut, der neue Klienten durch einen strukturierten Onboarding-Fragebogen führt. Ergebnis: 70% weniger Onboarding-E-Mails, und die ersten Antworten der coaches sind deutlich detaillierter weil der GPT schon alle Grundinfos gesammelt hat.</p>
    `,
  },
  {
    slug: 'seo-mit-ki-2026',
    title: 'SEO mit KI 2026: Wie du Google-Rankings aufbaust ohne stundenlang Content zu schreiben',
    excerpt: 'KI-gestützter SEO ist kein Trick — es ist eine strategische Pipeline. Ich zeige dir, wie du mit KI-Tools systematisch Suchmaschinenrankings aufbaust, ohne jeden Artikel manuell zu schreiben.',
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
<p>Claude is hier stark. Prompt: "Analysiere die Top-10-Artikel zu [Keyword] und erstelle eine Outline, die alle wichtigen Unterthemen abdeckt aber einen einzigartigen Winkel bietet." Das gibt dir eine Struktur, die für User und Google funktioniert.</p>

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
