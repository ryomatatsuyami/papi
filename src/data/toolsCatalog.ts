export type ToolPart = 'general' | 'future';

export type ChapterNumber = 1 | 2 | 3 | 4;

export type IconKind =
  | 'pdf'
  | 'send'
  | 'vault'
  | 'chat'
  | 'notes'
  | 'search'
  | 'flashcards'
  | 'sketch'
  | 'graph'
  | 'curriculum'
  | 'algo'
  | 'practice'
  | 'roadmap'
  | 'deploy'
  | 'database'
  | 'agents'
  | 'interview'
  | 'latex'
  | 'treasure'
  | 'backpack';

export interface ToolStop {
  id: string;
  order: number;
  part: ToolPart;
  chapter: ChapterNumber;
  chapterTitle: string;
  partLabel: string;
  islandName: string;
  storyHook: string;
  kittyLine: string;
  title: string;
  tagline: string;
  simpleSummary: string;
  personalNote: string;
  whatItDoes: string;
  whyForHer: string;
  url: string;
  urlLabel: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
  freeBadge: string;
  iconKind: IconKind;
  mapCoords: { x: number; y: number };
}

export const CHAPTER_META: Record<
  ChapterNumber,
  {
    number: ChapterNumber;
    title: string;
    shortTitle: string;
    partLabel: string;
    subtitle: string;
    part: ToolPart;
    startStop: number;
    endStop: number;
    skyClass: string;
    accentColor: string;
    tintBg: string;
    tintBorder: string;
  }
> = {
  1: {
    number: 1,
    title: 'Part 1 · Ch. I · Campus Survival',
    shortTitle: 'Ch. I · Survival',
    partLabel: 'Part 1 · Survival & Study',
    subtitle: 'Fix the daily chaos before writing real code (Stops 1–6)',
    part: 'general',
    startStop: 1,
    endStop: 6,
    skyClass: 'from-[#FDE0D4] via-[#FCE7EE] to-[#DCEBFA]',
    accentColor: '#D95D7B',
    tintBg: 'bg-[#FFF5F7]',
    tintBorder: 'border-[#F2C6D2]',
  },
  2: {
    number: 2,
    title: 'Part 1 · Ch. II · Study Atelier',
    shortTitle: 'Ch. II · Study',
    partLabel: 'Part 1 · Survival & Study',
    subtitle: 'Turn first-year CS lectures into real intuition (Stops 7–12)',
    part: 'general',
    startStop: 7,
    endStop: 12,
    skyClass: 'from-[#D7EFE1] via-[#E5F0FC] to-[#FCE5EE]',
    accentColor: '#488B6E',
    tintBg: 'bg-[#F3FAF6]',
    tintBorder: 'border-[#BFE0CE]',
  },
  3: {
    number: 3,
    title: 'Part 2 · Ch. III · Builder’s Workshop',
    shortTitle: 'Ch. III · Builder',
    partLabel: 'Part 2 · Future Dev',
    subtitle: 'Cross into Starlight Ridge & ship real projects (Stops 13–16)',
    part: 'future',
    startStop: 13,
    endStop: 16,
    skyClass: 'from-[#E2D8FA] via-[#F9DFEA] to-[#FDE6CC]',
    accentColor: '#8B62B8',
    tintBg: 'bg-[#F8F4FD]',
    tintBorder: 'border-[#D5C3EE]',
  },
  4: {
    number: 4,
    title: 'Part 2 · Ch. IV · Horizon Summit',
    shortTitle: 'Ch. IV · Summit',
    partLabel: 'Part 2 · Future Dev',
    subtitle: 'Internships, AI teams & free student perks (Stops 17–20)',
    part: 'future',
    startStop: 17,
    endStop: 20,
    skyClass: 'from-[#D6E0FA] via-[#F6DCEB] to-[#FCE8BE]',
    accentColor: '#C58332',
    tintBg: 'bg-[#FFF9EE]',
    tintBorder: 'border-[#EED29A]',
  },
};

export const TOOLS_CATALOG: ToolStop[] = [
  // =========================================================================
  // CHAPTER 1: CAMPUS SURVIVAL (PART 1)
  // =========================================================================
  {
    id: 'stirling-pdf',
    order: 1,
    part: 'general',
    chapter: 1,
    chapterTitle: 'Part 1 · Ch. I · Campus Survival',
    partLabel: 'Part 1 · Ch. I · Campus Survival',
    islandName: 'Paper Mill Cloud',
    storyHook: 'Step 1 of getting your digital life together before deadlines hit.',
    kittyLine: 'bye-bye sketchy PDF websites!',
    title: 'Stirling-PDF',
    tagline: 'Private, all-in-one PDF workshop',
    simpleSummary:
      'Lets you merge, split, compress, or convert PDF files offline on your own laptop without sketchy pop-up websites.',
    personalNote:
      'I figured you’d rather not spend 20 minutes on sketchy PDF sites covered in fake download buttons. You owe me a coffee for saving you from that.',
    whatItDoes:
      'Stirling-PDF is a free, open-source PDF toolkit that runs locally. Merge, split, compress, rotate, convert, and OCR files without uploading anything to random servers.',
    whyForHer:
      'When a prof asks for one merged PDF of your lab sheet plus cover page at 11:57 PM, this handles it in ten seconds flat.',
    url: 'https://github.com/Stirling-Tools/Stirling-PDF',
    urlLabel: 'GitHub · Stirling-PDF',
    freeBadge: 'Free & Open Source',
    iconKind: 'pdf',
    mapCoords: { x: 130, y: 390 },
  },
  {
    id: 'bitwarden-send',
    order: 2,
    part: 'general',
    chapter: 1,
    chapterTitle: 'Part 1 · Ch. I · Campus Survival',
    partLabel: 'Part 1 · Ch. I · Campus Survival',
    islandName: 'Whisper Post',
    storyHook: 'Now that your files are tidy, here’s how to send them safely.',
    kittyLine: 'self-destructing notes? fancy.',
    title: 'Bitwarden & Send',
    tagline: 'Encrypted, self-destructing file & note sharing',
    simpleSummary:
      'Creates private one-time links for files, passwords, or notes that automatically delete themselves after being opened.',
    personalNote:
      'Consider this my polite intervention so you stop sending important files and notes to yourself in random chats.',
    whatItDoes:
      'Built on Bitwarden’s open-source server, Bitwarden Send creates end-to-end encrypted links for files and notes that auto-expire after a set time or view limit.',
    whyForHer:
      'Clean way to move lab zips, keys, or private notes between devices or teammates without leaving copies everywhere.',
    url: 'https://bitwarden.com/products/send/',
    urlLabel: 'Bitwarden Send',
    secondaryUrl: 'https://github.com/bitwarden/server',
    secondaryLabel: 'GitHub · bitwarden/server',
    freeBadge: 'Open Source · Free Tier',
    iconKind: 'send',
    mapCoords: { x: 245, y: 270 },
  },
  {
    id: 'vaultwarden',
    order: 3,
    part: 'general',
    chapter: 1,
    chapterTitle: 'Part 1 · Ch. I · Campus Survival',
    partLabel: 'Part 1 · Ch. I · Campus Survival',
    islandName: 'Ironwood Lockbox',
    storyHook: 'Next up: locking down the forty logins college throws at you.',
    kittyLine: 'no more "password123", okay?',
    title: 'Vaultwarden',
    tagline: 'Lightweight open-source password sanctuary',
    simpleSummary:
      'A free password vault that safely saves and autofills all your college portal, GitHub, and personal logins in one place.',
    personalNote:
      'If I catch you using the same password + "123" for college Wi-Fi and your GitHub account, we are having words. Use this.',
    whatItDoes:
      'Vaultwarden is a fast, community-trusted open-source server compatible with Bitwarden apps, giving you full password autofill and 2FA storage with zero subscription cost.',
    whyForHer:
      'Stores every campus portal, SSH key passphrase, and account login safely across Windows and your phone.',
    url: 'https://github.com/dani-garcia/vaultwarden',
    urlLabel: 'GitHub · Vaultwarden',
    freeBadge: 'Free & Open Source',
    iconKind: 'vault',
    mapCoords: { x: 365, y: 420 },
  },
  {
    id: 'searxng',
    order: 4,
    part: 'general',
    chapter: 1,
    chapterTitle: 'Part 1 · Ch. I · Campus Survival',
    partLabel: 'Part 1 · Ch. I · Campus Survival',
    islandName: 'Spyglass Perch',
    storyHook: 'With your vault set, let’s fix how you search for answers.',
    kittyLine: 'zero ads, straight to the code!',
    title: 'SearXNG',
    tagline: 'Private metasearch without ad clutter',
    simpleSummary:
      'A clean search engine with zero ads or tracking that pulls answers straight from docs, coding forums, and study sites.',
    personalNote:
      'Looking up a C compiler error shouldn’t feel like walking through a digital billboard alley. Way cleaner results, zero tracking.',
    whatItDoes:
      'SearXNG is an open-source metasearch engine that pulls results from dozens of search providers without ads, tracking cookies, or algorithmic spam.',
    whyForHer:
      'Gets you straight to Stack Overflow threads, official docs, and university notes when debugging.',
    url: 'https://github.com/searxng/searxng',
    urlLabel: 'GitHub · SearXNG',
    secondaryUrl: 'https://docs.searxng.org',
    secondaryLabel: 'Documentation',
    freeBadge: 'Free & Open Source',
    iconKind: 'search',
    mapCoords: { x: 485, y: 265 },
  },
  {
    id: 'anytype',
    order: 5,
    part: 'general',
    chapter: 1,
    chapterTitle: 'Part 1 · Ch. I · Campus Survival',
    partLabel: 'Part 1 · Ch. I · Campus Survival',
    islandName: 'Linen Desk',
    storyHook: 'Somewhere calm to catch everything you find and take notes.',
    kittyLine: 'pretty notes that work offline too~',
    title: 'Anytype',
    tagline: 'Local-first, private Notion replacement',
    simpleSummary:
      'An aesthetic workspace for class notes, deadlines, and to-do lists that saves directly to your device and works offline.',
    personalNote:
      'I know you like an aesthetic workspace, and this one actually works offline when campus Wi-Fi decides to take a nap.',
    whatItDoes:
      'Anytype is an open-source, peer-to-peer workspace for notes, tasks, and databases. Everything lives locally on your device first, encrypted and fast.',
    whyForHer:
      'Great for organizing semester syllabi, assignment trackers, and reading lists without paywalls or cloud lag.',
    url: 'https://anytype.io',
    urlLabel: 'Anytype.io',
    secondaryUrl: 'https://github.com/anyproto/anytype-ts',
    secondaryLabel: 'GitHub · Anytype',
    freeBadge: 'Open Source · Free Local-First',
    iconKind: 'notes',
    mapCoords: { x: 605, y: 405 },
  },
  {
    id: 'librechat',
    order: 6,
    part: 'general',
    chapter: 1,
    chapterTitle: 'Part 1 · Ch. I · Campus Survival',
    partLabel: 'Part 1 · Ch. I · Campus Survival',
    islandName: 'Midnight Tea House',
    storyHook: 'Final survival piece: a quiet AI desk for 2 AM concept checks.',
    kittyLine: '2 AM debugging buddy unlocked',
    title: 'LibreChat',
    tagline: 'One clean open-source home for AI chats',
    simpleSummary:
      'Puts all your AI study chats and coding help inside one tidy, searchable app instead of dozens of messy browser tabs.',
    personalNote:
      'For the nights when a pointer bug makes you question your life choices and I’m asleep—keep all your study threads tidy here.',
    whatItDoes:
      'LibreChat is an open-source, customizable AI chat workspace supporting multiple models, conversation search, and code artifacts in one clean UI.',
    whyForHer:
      'Lets you separate chats by subject, search old explanations, and customize prompts without bouncing between ten tabs.',
    url: 'https://www.librechat.ai',
    urlLabel: 'LibreChat.ai',
    secondaryUrl: 'https://github.com/LibreChat-AI/LibreChat',
    secondaryLabel: 'GitHub · LibreChat',
    freeBadge: 'Free & Open Source',
    iconKind: 'chat',
    mapCoords: { x: 725, y: 275 },
  },

  // =========================================================================
  // CHAPTER 2: THE STUDY ATELIER (PART 1 CONTINUED)
  // =========================================================================
  {
    id: 'excalidraw',
    order: 7,
    part: 'general',
    chapter: 2,
    chapterTitle: 'Part 1 · Ch. II · Study Atelier',
    partLabel: 'Part 1 · Ch. II · Study Atelier',
    islandName: 'Sketchbook Terrace',
    storyHook: 'Survival kit complete. Now let’s make CS concepts click visually.',
    kittyLine: 'doodle those binary trees!',
    title: 'Excalidraw',
    tagline: 'Hand-drawn whiteboard for CS thinking',
    simpleSummary:
      'A free digital sketchpad for quickly drawing diagrams, flowcharts, and memory trees right in your browser.',
    personalNote:
      'Watching you draw little diagrams when explaining things is kinda cute, not gonna lie. This makes sketching trees and pointers effortless.',
    whatItDoes:
      'Excalidraw is a completely free, open-source infinite canvas whiteboard with a warm hand-drawn look—works instantly in your browser or offline.',
    whyForHer:
      'Trace memory pointers, sketch recursion trees, and map flowcharts before writing a single line of lab code.',
    url: 'https://excalidraw.com',
    urlLabel: 'Excalidraw.com',
    secondaryUrl: 'https://github.com/excalidraw/excalidraw',
    secondaryLabel: 'GitHub · Excalidraw',
    freeBadge: 'Free & Open Source',
    iconKind: 'sketch',
    mapCoords: { x: 855, y: 415 },
  },
  {
    id: 'anki',
    order: 8,
    part: 'general',
    chapter: 2,
    chapterTitle: 'Part 1 · Ch. II · Study Atelier',
    partLabel: 'Part 1 · Ch. II · Study Atelier',
    islandName: 'Clover Deck',
    storyHook: 'Once you understand an idea, lock it in so exams feel easy.',
    kittyLine: '10 mins a day > 3 AM panic',
    title: 'Anki',
    tagline: 'Spaced-repetition flashcards that stick',
    simpleSummary:
      'Smart flashcards that figure out what you’re about to forget and quiz you right in time so formulas stick for exams.',
    personalNote:
      'Ten minutes on this beats panic-cramming at 3 AM before midterms—which means more time for us to actually hang out.',
    whatItDoes:
      'Anki is a free, open-source flashcard engine that schedules reviews right before your brain forgets a concept using spaced repetition.',
    whyForHer:
      'Clutch for Linux commands, C/Python quirks, Big-O complexities, and discrete math definitions.',
    url: 'https://apps.ankiweb.net',
    urlLabel: 'AnkiWeb',
    secondaryUrl: 'https://github.com/ankitects/anki',
    secondaryLabel: 'GitHub · Anki',
    freeBadge: 'Free & Open Source',
    iconKind: 'flashcards',
    mapCoords: { x: 975, y: 265 },
  },
  {
    id: 'logseq',
    order: 9,
    part: 'general',
    chapter: 2,
    chapterTitle: 'Part 1 · Ch. II · Study Atelier',
    partLabel: 'Part 1 · Ch. II · Study Atelier',
    islandName: 'Willow Archive',
    storyHook: 'Connect those flashcards and lecture notes into a living web.',
    kittyLine: 'your brain’s cozy little wiki',
    title: 'Logseq',
    tagline: 'Connected study wiki + built-in recall',
    simpleSummary:
      'Links all your lecture notes, PDF highlights, and flashcards together into a personal offline study wiki on your laptop.',
    personalNote:
      'Think of it like a second brain stored as plain Markdown files on your own laptop—no company can ever lock you out of your notes.',
    whatItDoes:
      'Logseq is an open-source, local-first outliner and knowledge graph with bidirectional linking, PDF highlighting, and built-in flashcards.',
    whyForHer:
      'Links how discrete math connects to algorithms and systems across semesters without losing anything.',
    url: 'https://logseq.com',
    urlLabel: 'Logseq.com',
    secondaryUrl: 'https://github.com/logseq/logseq',
    secondaryLabel: 'GitHub · Logseq',
    freeBadge: 'Free & Open Source',
    iconKind: 'graph',
    mapCoords: { x: 1095, y: 425 },
  },
  {
    id: 'visualgo',
    order: 10,
    part: 'general',
    chapter: 2,
    chapterTitle: 'Part 1 · Ch. II · Study Atelier',
    partLabel: 'Part 1 · Ch. II · Study Atelier',
    islandName: 'Clockwork Conservatory',
    storyHook: 'Now watch static textbook algorithms come alive in motion.',
    kittyLine: 'watch the sorting bars dance!',
    title: 'VisuAlgo',
    tagline: 'Animated sorting, trees & graph explorer',
    simpleSummary:
      'Animates tricky coding algorithms like sorting, linked lists, and trees step-by-step so you can actually see how they work.',
    personalNote:
      'Data structures sound dry until you watch them rearrange themselves step by step like clockwork. Try QuickSort on here once—you’ll get hooked.',
    whatItDoes:
      'Created by CS faculty at NUS, VisuAlgo animates sorting, linked lists, binary trees, and graph traversals alongside live pseudocode.',
    whyForHer:
      'Turns confusing Data Structures & Algorithms labs into something you can literally watch happen.',
    url: 'https://visualgo.net',
    urlLabel: 'VisuAlgo.net',
    freeBadge: 'Free Educational Tool',
    iconKind: 'algo',
    mapCoords: { x: 1215, y: 280 },
  },
  {
    id: 'exercism',
    order: 11,
    part: 'general',
    chapter: 2,
    chapterTitle: 'Part 1 · Ch. II · Study Atelier',
    partLabel: 'Part 1 · Ch. II · Study Atelier',
    islandName: 'Stepping Stones',
    storyHook: 'Reading code isn’t enough—time to get your hands on the keyboard.',
    kittyLine: 'real human mentors for free!',
    title: 'Exercism',
    tagline: '100% free coding practice + real mentors',
    simpleSummary:
      'Gives you fun coding exercises in Python, C, Java, and more with free feedback from real programmers.',
    personalNote:
      'Zero annoying paywalls, zero grindset vibes—just clean coding puzzles and actual human mentors giving tips on your style.',
    whatItDoes:
      'Exercism is a non-profit, open-source coding practice platform across 60+ languages with automated tests and free volunteer mentor code reviews.',
    whyForHer:
      'Builds real fluency in C, Python, or Java through small, satisfying wins after class.',
    url: 'https://exercism.org',
    urlLabel: 'Exercism.org',
    freeBadge: '100% Free & Open Source',
    iconKind: 'practice',
    mapCoords: { x: 1335, y: 410 },
  },
  {
    id: 'ossu',
    order: 12,
    part: 'general',
    chapter: 2,
    chapterTitle: 'Part 1 · Ch. II · Study Atelier',
    partLabel: 'Part 1 · Ch. II · Study Atelier',
    islandName: 'Cloud Gate Library',
    storyHook: 'The final milestone of Part 1 before crossing the Cloud Gate.',
    kittyLine: 'MIT & Harvard classes, free?!',
    title: 'OSSU Computer Science',
    tagline: 'A complete, free CS university blueprint',
    simpleSummary:
      'A free checklist of the best MIT, Harvard, and Princeton CS lectures organized in order whenever class lectures feel rushed.',
    personalNote:
      'Whenever a college lecture feels rushed or half-baked, peek inside here—it’s the best MIT, Harvard, and Princeton CS classes organized for free.',
    whatItDoes:
      'Open Source Society University (OSSU) is a community-maintained GitHub curriculum mapping a full CS degree using free online university courses.',
    whyForHer:
      'Your secret backup tutor whenever you want a crystal-clear second explanation of core CS.',
    url: 'https://github.com/ossu/computer-science',
    urlLabel: 'GitHub · OSSU CS',
    freeBadge: 'Free & Open Source',
    iconKind: 'curriculum',
    mapCoords: { x: 1455, y: 295 },
  },

  // =========================================================================
  // CHAPTER 3: THE BUILDER'S WORKSHOP (PART 2 — STARLIGHT RIDGE)
  // =========================================================================
  {
    id: 'roadmap-sh',
    order: 13,
    part: 'future',
    chapter: 3,
    chapterTitle: 'Part 2 · Ch. III · Builder’s Workshop',
    partLabel: 'Part 2 · Ch. III · Builder’s Workshop',
    islandName: 'Starlight Compass',
    storyHook: 'Welcome across the Cloud Gate. First: pick where you want to build.',
    kittyLine: 'ooh, look at all the stars!',
    title: 'roadmap.sh',
    tagline: 'Visual skill maps for any developer path',
    simpleSummary:
      'Clear step-by-step visual maps showing exactly what to learn first for web dev, Python, backend, or AI.',
    personalNote:
      'Okay, welcome to the serious-builder side of the map. Whenever tech Twitter makes you feel like you need to learn 90 frameworks, open this and breathe.',
    whatItDoes:
      'roadmap.sh is a massive open-source project offering interactive step-by-step guides for Frontend, Backend, AI, Python, SQL, and Systems paths.',
    whyForHer:
      'Shows the exact order to learn things when you’re ready to build web apps, backends, or AI tools.',
    url: 'https://roadmap.sh',
    urlLabel: 'roadmap.sh',
    secondaryUrl: 'https://github.com/kamranahmedse/developer-roadmap',
    secondaryLabel: 'GitHub · developer-roadmap',
    freeBadge: 'Free & Open Source',
    iconKind: 'roadmap',
    mapCoords: { x: 1605, y: 420 },
  },
  {
    id: 'nocodb',
    order: 14,
    part: 'future',
    chapter: 3,
    chapterTitle: 'Part 2 · Ch. III · Builder’s Workshop',
    partLabel: 'Part 2 · Ch. III · Builder’s Workshop',
    islandName: 'Honeycomb Spire',
    storyHook: 'Every real app needs data—make databases painless.',
    kittyLine: 'SQL that doesn’t bite!',
    title: 'NocoDB',
    tagline: 'Turn any SQL database into a smart spreadsheet',
    simpleSummary:
      'Turns complex app databases into easy, colorful spreadsheets so managing project data feels effortless.',
    personalNote:
      'Raw SQL tables look intimidating at first, so here’s a neat trick that turns them into clean spreadsheets with instant APIs.',
    whatItDoes:
      'NocoDB is an open-source Airtable alternative that connects to Postgres, MySQL, or SQLite and gives you instant spreadsheet views and REST APIs.',
    whyForHer:
      'Saves hours during hackathons and college team projects when you need a working backend view fast.',
    url: 'https://nocodb.com',
    urlLabel: 'NocoDB.com',
    secondaryUrl: 'https://github.com/nocodb/nocodb',
    secondaryLabel: 'GitHub · NocoDB',
    freeBadge: 'Free & Open Source',
    iconKind: 'database',
    mapCoords: { x: 1725, y: 270 },
  },
  {
    id: 'coolify',
    order: 15,
    part: 'future',
    chapter: 3,
    chapterTitle: 'Part 2 · Ch. III · Builder’s Workshop',
    partLabel: 'Part 2 · Ch. III · Builder’s Workshop',
    islandName: 'Observatory Launchpad',
    storyHook: 'You built it and gave it data—now put it live on the internet.',
    kittyLine: '3.. 2.. 1.. deployed live!',
    title: 'Coolify',
    tagline: 'Open-source self-hostable deployment platform',
    simpleSummary:
      'Lets you put your own websites, bots, and coding projects live online without paying expensive hosting bills.',
    personalNote:
      'Nothing beats the rush of sending someone a live link to something you coded yourself. This lets you deploy apps and APIs without crazy cloud bills.',
    whatItDoes:
      'Coolify is an open-source alternative to Heroku, Netlify, and Vercel. Connect a Git repo and deploy websites, APIs, and databases effortlessly.',
    whyForHer:
      'Lets you host hackathon projects, Discord bots, and portfolios on your own terms.',
    url: 'https://coolify.io',
    urlLabel: 'Coolify.io',
    secondaryUrl: 'https://github.com/coollabsio/coolify',
    secondaryLabel: 'GitHub · Coolify',
    freeBadge: 'Free & Open Source',
    iconKind: 'deploy',
    mapCoords: { x: 1845, y: 405 },
  },
  {
    id: 'overleaf',
    order: 16,
    part: 'future',
    chapter: 3,
    chapterTitle: 'Part 2 · Ch. III · Builder’s Workshop',
    partLabel: 'Part 2 · Ch. III · Builder’s Workshop',
    islandName: 'Quill & Velvet Arch',
    storyHook: 'Now package your work cleanly for papers, labs, and resumes.',
    kittyLine: 'crispy LaTeX resume incoming',
    title: 'Overleaf',
    tagline: 'Crisp LaTeX papers, lab reports & resumes',
    simpleSummary:
      'An online editor that typesets math formulas, lab reports, and clean one-page tech resumes without formatting headaches.',
    personalNote:
      'Microsoft Word moving an image by 1 pixel and ruining a whole page should be illegal. Use LaTeX here when you want your resume looking sharp.',
    whatItDoes:
      'Overleaf is an open-source collaborative LaTeX editor with a generous free tier—write clean math, IEEE lab reports, and crisp single-page resumes.',
    whyForHer:
      'Makes your future engineering resume and technical papers look unmistakably polished.',
    url: 'https://www.overleaf.com',
    urlLabel: 'Overleaf.com',
    secondaryUrl: 'https://github.com/overleaf/overleaf',
    secondaryLabel: 'GitHub · Overleaf',
    freeBadge: 'Open Source · Free Tier',
    iconKind: 'latex',
    mapCoords: { x: 1965, y: 270 },
  },

  // =========================================================================
  // CHAPTER 4: HORIZON SUMMIT (PART 2 FINALE)
  // =========================================================================
  {
    id: 'metagpt',
    order: 17,
    part: 'future',
    chapter: 4,
    chapterTitle: 'Part 2 · Ch. IV · Horizon Summit',
    partLabel: 'Part 2 · Ch. IV · Horizon Summit',
    islandName: 'Automata Loft',
    storyHook: 'Entering the summit: orchestrate AI agents like your own team.',
    kittyLine: 'a tiny squad of AI bots!',
    title: 'MetaGPT',
    tagline: 'Multi-agent AI framework acting like a dev team',
    simpleSummary:
      'Lets multiple AI agents act like tiny teammates—planning, coding, and reviewing a software idea from one prompt.',
    personalNote:
      'Once Python feels like second nature to you, play around with this repo—watching multiple AI agents debate architecture like tiny coworkers is wild.',
    whatItDoes:
      'MetaGPT is an open-source multi-agent framework where specialized AI roles collaborate from a single prompt to draft specs, designs, and code.',
    whyForHer:
      'A super cool open-source project to study and tinker with when you explore agentic AI engineering.',
    url: 'https://github.com/FoundationAgents/MetaGPT',
    urlLabel: 'GitHub · MetaGPT',
    freeBadge: 'Free & Open Source',
    iconKind: 'agents',
    mapCoords: { x: 2085, y: 405 },
  },
  {
    id: 'coding-interview-university',
    order: 18,
    part: 'future',
    chapter: 4,
    chapterTitle: 'Part 2 · Ch. IV · Horizon Summit',
    partLabel: 'Part 2 · Ch. IV · Horizon Summit',
    islandName: 'Summit Beacon',
    storyHook: 'Getting ready for the dream internships ahead.',
    kittyLine: 'future software engineer energy',
    title: 'Coding Interview University',
    tagline: 'The classic open-source CS & interview plan',
    simpleSummary:
      'A calm, well-organized study checklist covering data structures, coding patterns, and core CS topics for future internships.',
    personalNote:
      'Bookmark this for internship season. You’re already sharper than you give yourself credit for—this just keeps the prep calm and structured.',
    whatItDoes:
      'John Washam’s legendary open-source GitHub study plan covering algorithms, data structures, complexity, OS fundamentals, and system design.',
    whyForHer:
      'A clear, zero-hype checklist you can follow smoothly before technical interviews.',
    url: 'https://github.com/jwasham/coding-interview-university',
    urlLabel: 'GitHub · Coding Interview Univ.',
    freeBadge: 'Free & Open Source',
    iconKind: 'interview',
    mapCoords: { x: 2205, y: 275 },
  },
  {
    id: 'free-for-dev',
    order: 19,
    part: 'future',
    chapter: 4,
    chapterTitle: 'Part 2 · Ch. IV · Horizon Summit',
    partLabel: 'Part 2 · Ch. IV · Horizon Summit',
    islandName: 'Treasure Ledger',
    storyHook: 'Before building your dream stack, grab the map to every free tier online.',
    kittyLine: 'a giant list of free dev gear!',
    title: 'Free for Developers',
    tagline: 'Huge curated index of free cloud & SaaS tiers',
    simpleSummary:
      'A massive community directory of free databases, hosting, APIs, and tools so you never pay out of pocket for side projects.',
    personalNote:
      'Anytime you need free database hosting, email APIs, auth, or monitoring for a project—check this open-source goldmine before paying a cent.',
    whatItDoes:
      'free-for.dev is a massive community-maintained GitHub directory listing hundreds of cloud hosting, database, CI/CD, API, and dev tools with generous free tiers.',
    whyForHer:
      'Saves you hours hunting for free deployment, DB, and backend tiers whenever you launch side projects.',
    url: 'https://free-for.dev',
    urlLabel: 'free-for.dev',
    secondaryUrl: 'https://github.com/ripienaar/free-for-dev',
    secondaryLabel: 'GitHub · free-for-dev',
    freeBadge: 'Free & Open Source',
    iconKind: 'treasure',
    mapCoords: { x: 2325, y: 405 },
  },
  {
    id: 'github-student-pack',
    order: 20,
    part: 'future',
    chapter: 4,
    chapterTitle: 'Part 2 · Ch. IV · Horizon Summit',
    partLabel: 'Part 2 · Ch. IV · Horizon Summit',
    islandName: 'Crown Pavilion',
    storyHook: 'The final treasure waiting right at the top of the ridge.',
    kittyLine: 'free pro gear!! claim it!!',
    title: 'GitHub Student Developer Pack',
    tagline: 'Free pro dev tools, domains & cloud credits',
    simpleSummary:
      'Use your college email to claim dozens of paid pro coding apps, custom website domains, and cloud credits completely free.',
    personalNote:
      'Last stop! Verify your college email here and claim every free domain, IDE, and cloud credit they offer. Go build cool stuff—and yes, you still owe me that coffee.',
    whatItDoes:
      'GitHub’s official student bundle unlocks dozens of paid developer tools, JetBrains IDEs, custom domains, and cloud hosting credits completely free.',
    whyForHer:
      'Gives you real-world pro tools on day one without spending a single rupee or dollar.',
    url: 'https://education.github.com/pack',
    urlLabel: 'GitHub Student Pack',
    freeBadge: '100% Free for Students',
    iconKind: 'backpack',
    mapCoords: { x: 2445, y: 295 },
  },
];

export const FINALE_ISLAND = {
  id: 'siddu-finale-note',
  order: 21,
  islandName: 'Starlight Keepsake',
  subtitle: 'One Last Little Note',
  mapCoords: { x: 2605, y: 235 },
};

