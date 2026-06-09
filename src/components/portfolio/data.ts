export const PERSON = {
  fullName: "Ryali Harsha Srinatth",
  shortName: "Harsha",
  initials: "RHS",
  tagline:
    "Building scalable MERN-stack systems — full-stack development, real-time communication, and data-driven product workflows.",
  taglineContext:
    "A Computer Science & Business Systems undergraduate at SRKR Engineering College, Bhimavaram.",
  about: [
    "I'm Harsha Srinatth Ryali, a passionate developer who enjoys turning ideas into practical software and continuously exploring how technology can solve real-world problems. My interests span Full Stack Development, System Design, and Artificial Intelligence, where I focus on building applications that are scalable, user-centric, and impactful.",
    "I primarily work with React, Node.js, Express.js, MongoDB, and modern web technologies while expanding my knowledge in Machine Learning and intelligent systems. Having successfully completed a 99-hour Data Science, Machine Learning, Deep Learning, and NLP Bootcamp, I am driven by curiosity, continuous learning, and the challenge of building technology that creates meaningful value.",
  ],
  email: "harshasrinatth18@gmail.com",
  phone: "+91 8179831468",
  location: "Bhimavaram, Andhra Pradesh",
  education: "B.Tech CSBS (Computer Science & Business Systems) — 8.75 / 10 CGPA",
  also: "Music · Lo-fi · Ambient · Instrumental",
  resumeUrl: "/harsha_res.pdf",
  socials: [
    { label: "GitHub", handle: "@Harsha-Srinatth", url: "https://github.com/Harsha-Srinatth" },
    {
      label: "LinkedIn",
      handle: "in/harsha-srinatth-ryali",
      url: "https://www.linkedin.com/in/harsha-srinatth-ryali",
    },
  ],
};

export const GITHUB = {
  username: "Harsha-Srinatth",
  totalContributions: 290,
  year: 2025,
  repoCount: 12,
};

export type Achievement = {
  year: string;
  title: string;
  detail: string;
  badge?: "udemy";
  certificateUrl?: string;
  certificateLabel?: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    year: "2025",
    title: "Complete Data Science, Machine Learning, DL, NLP Bootcamp",
    detail:
      "Successfully completed a 99-hour Udemy bootcamp covering data science, machine learning, deep learning, and natural language processing.",
    badge: "udemy",
    certificateUrl: "/Udemy-Ml-Certificate-Harsha.pdf",
    certificateLabel: "View Certificate",
  },
  {
    year: "2025",
    title: "College-level hackathon shortlisted",
    detail:
      "Shortlisted at the college-level hackathon among 300+ competing teams for presenting an innovative software solution.",
  },
  {
    year: "2025",
    title: "End-to-end full-stack platform",
    detail:
      "Recognized for designing and implementing an end-to-end scalable full-stack platform demonstrating strong problem-solving and software engineering skills.",
  },
];

export const LEARNING_PATH = [
  "Code",
  "Algorithms",
  "Systems",
  "Scale",
  "Data",
  "Intelligence",
  "Learning",
  "Reasoning",
  "Autonomy",
  "Emergence",
];

export const BUILD_LOG = [
  {
    month: "March 2026",
    entries: [
      {
        challenge: "Auth edge cases across roles",
        solution: "Stricter RBAC middleware + audit logging",
        outcome: "Fewer permission bugs in staging",
      },
      {
        challenge: "Deploy drift between services",
        solution: "Docker compose + pinned image tags",
        outcome: "Reproducible environments for the team",
      },
      {
        challenge: "API abuse on public routes",
        solution: "Rate limiting + stricter validation",
        outcome: "Safer public surface area",
      },
    ],
  },
  {
    month: "April 2026",
    entries: [
      {
        challenge: "Cold-start latency on AI endpoints",
        solution: "Warm pool + streamed responses",
        outcome: "P95 down from 4.2s to 900ms",
      },
      {
        challenge: "Vector search recall drop",
        solution: "Re-embedded with domain-tuned model + hybrid BM25",
        outcome: "Recall@10 +18%",
      },
    ],
  },
  {
    month: "May 2026",
    entries: [
      {
        challenge: "Costly LLM calls on every keystroke",
        solution: "Debounce + semantic cache in Redis",
        outcome: "LLM spend −62% with no UX loss",
      },
    ],
  },
];

export const BEYOND_CODE = [
  { icon: "🎧", label: "Music", note: "Lo-fi · Ambient · Instrumental" },
  { icon: "🏸", label: "Badminton", note: "Competitive" },
  { icon: "🏏", label: "Cricket", note: "Kohli fan" },
  { icon: "◎", label: "Carrom", note: "Precision" },
];

export type Project = {
  id: string;
  codename: string;
  title: string;
  year: string;
  kind: string;
  blurb: string;
  detail: string;
  url?: string;
  signal: number; // 0..1 for ring intensity
  hue: number; // visual ring orientation
  metrics: { label: string; value: string }[];
};

export const PROJECTS: Project[] = [
  {
    id: "college360",
    codename: "C36-01",
    title: "College360X",
    year: "2025",
    kind: "Academic & Skill Platform",
    url: "https://student-frontend-phi.vercel.app",
    blurb:
      "A centralized MERN + ML platform unifying academic tracking, real-time communication, and peer skill exchange across an entire institution.",
    detail:
      "College360X is a scalable full-stack platform with dedicated Student, Faculty, and HOD portals for attendance, achievements, and institutional workflows. JWT-based authentication and role-based authorization secure every layer. Socket.IO powers live notifications, threaded doubt discussions, and activity updates. The Skill Exchange module enables peer-to-peer learning through course creation and structured feedback. Python ML APIs predict student outcomes, placement readiness tiers, and participation trends from academic and engagement data.",
    signal: 0.96,
    hue: 22,
    metrics: [
      { label: "Portals", value: "Student · Faculty · HOD" },
      { label: "Stack", value: "MERN + ML" },
      { label: "APIs", value: "40+ RESTful APIs" },
    ],
  },
  {
    id: "notes-bookmarks",
    codename: "NBK-02",
    title: "Personal Notes & Bookmark Manager",
    year: "2025",
    kind: "Full-Stack Productivity",
    url: "https://note-vault-green.vercel.app",
    blurb:
      "A full-stack personal productivity app for managing notes and bookmarks with secure authentication, smart search, tagging, and an animated modern UI.",
    detail:
      "Production-style monorepo built with Next.js, Express, and MongoDB. JWT-secured accounts with per-user data isolation. Full CRUD on notes and bookmarks, server-side search and tag filtering, and automatic bookmark title fetching via Axios and Cheerio metadata scraping. MongoDB indexes optimize text and compound queries. Responsive UI with Framer Motion, modals, tag chips, and glassmorphism navigation.",
    signal: 0.89,
    hue: 198,
    metrics: [
      { label: "API", value: "12 REST endpoints" },
      { label: "Models", value: "User · Note · Bookmark" },
      { label: "Stack", value: "Next.js · Express · MongoDB" },
    ],
  },
  {
    id: "habitiq",
    codename: "HIQ-03",
    title: "HabitIQ",
    year: "2025",
    kind: "Predictive Intelligence System",
    url: "https://study-habit-backend-oerf.vercel.app",
    blurb:
      "A full-stack machine learning product that predicts student study outcomes from daily behavioral signals and delivers actionable, personalized coaching in real time.",
    detail:
      "End-to-end ML platform with a React 19 six-step intake wizard collecting 14 behavioral features — sleep, study time, environment, motivation, and technique. A tuned RandomForestClassifier (200 estimators) is served through a FastAPI inference API with Pydantic validation and ColumnTransformer preprocessing (OneHot, StandardScaler, Ordinal). Stateless microservice deployed on Render with joblib-serialized artifacts and tier-based coaching recommendations on the frontend.",
    signal: 0.92,
    hue: 312,
    metrics: [
      { label: "Features", value: "14 behavioral inputs" },
      { label: "ML", value: "Random Forest · 200 trees" },
      { label: "Deploy", value: "FastAPI on Render" },
    ],
  },
  {
    id: "agrisense",
    codename: "AGR-04",
    title: "AgriSense AI",
    year: "2025",
    kind: "AgriTech · Generative AI",
    blurb:
      "An AI-powered, multilingual farming companion that turns soil, weather, and crop images into actionable recommendations farmers can read or hear.",
    detail:
      "Full-stack AgriTech platform for Indian farmers combining React 19 with a modular Flask backend powered by Google Gemini 2.5 Flash. Four AI workflows: crop recommendation, vision-based disease detection, pre-planting risk analysis, and fertilizer guidance. Four-language i18n (English, Hindi, Telugu, Tamil), Web Speech API audio playback, geolocation and WeatherAPI auto-fill, explainable AI panels, and progressive multi-step forms — designed for low-literacy, field-ready use.",
    signal: 0.87,
    hue: 145,
    metrics: [
      { label: "AI modules", value: "4 workflows" },
      { label: "Languages", value: "EN · HI · TE · TA" },
      { label: "API", value: "4 REST endpoints" },
    ],
  },
  {
    id: "verve",
    codename: "VRV-05",
    title: "Verve",
    year: "2025",
    kind: "Campus Engagement System",
    url: "https://my-frontend-kohl.vercel.app",
    blurb:
      "A campus-wide social ecosystem designed to transform student participation into a connected digital experience for clubs, sports, culture, and peer communities.",
    detail:
      "MERN-stack platform enabling clubs, cultural organizations, sports teams, and learners to share updates, build communities, and foster collaboration. JWT authentication and authorization, post creation with likes and comments, follow/follower graph, profile management, and community discovery — all backed by a RESTful API architecture built for secure, scalable campus engagement.",
    signal: 0.84,
    hue: 268,
    metrics: [
      { label: "Communities", value: "Clubs · Sports · Culture" },
      { label: "Engagement", value: "Posts · Likes · Comments" },
      { label: "Stack", value: "React · Node · MongoDB · JWT" },
    ],
  },
];

export type Stratum = {
  era: string;
  role: string;
  org: string;
  arc: string;
  artifacts: string[];
  depthLabel: string;
};

export const STRATA: Stratum[] = [
  {
    era: "2024 — Present",
    role: "Computer Science & Business Systems",
    org: "Foundations",
    arc: "Learning the foundations of software engineering, data structures, algorithms, and system thinking.",
    artifacts: ["DSA", "Full Stack Development", "Problem Solving"],
    depthLabel: "growing",
  },
  {
    era: "2024 — Present",
    role: "Full-Stack Systems",
    org: "Application building",
    arc: "Building complete applications from frontend interfaces to backend infrastructure.",
    artifacts: ["React", "Node.js", "MongoDB", "JWT", "Socket.IO"],
    depthLabel: "expanding",
  },
  {
    era: "2025 — Present",
    role: "Machine Learning",
    org: "Adaptive software",
    arc: "Exploring how software learns, predicts, and adapts.",
    artifacts: ["Python", "Data Analysis", "Machine Learning", "Model Building"],
    depthLabel: "accelerating",
  },
];

export const FREQUENCIES = [
  {
    band: "Architecture",
    weight: 0.94,
    notes: "React • Node • System Design • JavaScript • Next.js • HTML5 • CSS3 • Redux • Context API",
  },
  {
    band: "Intelligence",
    weight: 0.88,
    notes: "ML • Prediction • Analytics • Python • Java",
  },
  {
    band: "Communication",
    weight: 0.9,
    notes: "Socket.IO • Realtime Systems • JWT Authentication • REST APIs",
  },
  {
    band: "Infrastructure",
    weight: 0.86,
    notes: "Docker • Redis • Deployment • Git • Express.js",
  },
  {
    band: "Data",
    weight: 0.92,
    notes: "MongoDB • SQL • Modeling • C++",
  },
  {
    band: "Algorithms",
    weight: 0.91,
    notes: "DSA • Optimization • Problem Solving",
  },
];

export const SIGNALS = [
  "00:14 · college360x broadcast a placement readiness tier update campus-wide",
  "07:42 · notes-bookmarks auto-fetched 12 bookmark titles overnight",
  "12:03 · habitiq scored a study session from 14 behavioral signals",
  "16:21 · agrisense diagnosed crop disease from a field photo in Telugu",
  "19:55 · verve connected three campus clubs in one engagement feed",
];