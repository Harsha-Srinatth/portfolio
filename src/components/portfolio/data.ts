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
    id: "tideline",
    codename: "TDL-04",
    title: "Tideline",
    year: "2024",
    kind: "Climate Sonification",
    blurb: "Twenty years of Atlantic tide data, performed nightly as a string quartet.",
    detail:
      "Tideline ingests NOAA buoy archives, fits each station to a harmonic basis, and renders the residuals — what the model failed to predict — as a chamber piece. It has played at Pier 5 every full moon since 2024.",
    signal: 0.71,
    hue: 198,
    metrics: [
      { label: "Stations", value: "182" },
      { label: "Hours played", value: "3,902" },
      { label: "Audience", value: "Mostly seabirds" },
    ],
  },
  {
    id: "marginalia",
    codename: "MRG-09",
    title: "Marginalia",
    year: "2024",
    kind: "Reading Instrument",
    blurb: "A second cursor for your books that reads beside you and argues politely.",
    detail:
      "An e-ink companion that pairs with any EPUB. It underlines what you skim, asks one question per chapter, and refuses to answer questions you have not earned. Closed beta; 1,400 readers; one minor schism.",
    signal: 0.83,
    hue: 312,
    metrics: [
      { label: "Annotations", value: "412k" },
      { label: "Books finished", value: "+38%" },
      { label: "Returns", value: "0" },
    ],
  },
  {
    id: "fold",
    codename: "FLD-02",
    title: "Fold",
    year: "2023",
    kind: "Origami CAD",
    blurb: "CAD software that designs the crease pattern by watching you crumple paper.",
    detail:
      "Fold tracks paper deformation through a single camera, solves for the dual graph, and proposes a flat-foldable pattern that approximates your intent. Used by two aerospace teams and one extremely patient pastry chef.",
    signal: 0.65,
    hue: 145,
    metrics: [
      { label: "Crease accuracy", value: "0.6mm" },
      { label: "Patterns shipped", value: "1,109" },
      { label: "Paper wasted", value: "Reasonable" },
    ],
  },
  {
    id: "nocturne",
    codename: "NCT-07",
    title: "Nocturne",
    year: "2023",
    kind: "Offline-first OS shell",
    blurb: "A desktop environment that refuses to connect to the internet between 10pm and 6am.",
    detail:
      "Nocturne is a window manager and notification mediator built around circadian boundaries. Networking is hard-suspended at the kernel level overnight; emergencies require a passphrase your past-self chose.",
    signal: 0.88,
    hue: 268,
    metrics: [
      { label: "Sleep recovered", value: "47min / night" },
      { label: "Installs", value: "9,210" },
      { label: "Apologies received", value: "Many" },
    ],
  },
  {
    id: "verdigris",
    codename: "VRD-11",
    title: "Verdigris",
    year: "2022",
    kind: "Material Memory",
    blurb: "An archive of every patina on every public sculpture in three cities, updated weekly.",
    detail:
      "Verdigris uses citizen-submitted photographs and a custom spectral model to map oxidation over time on bronze monuments. It is, accidentally, also a record of which statues people stop touching.",
    signal: 0.58,
    hue: 168,
    metrics: [
      { label: "Sculptures", value: "2,841" },
      { label: "Submissions", value: "61k" },
      { label: "Cities", value: "3 — for now" },
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
  "07:42 · tideline picked up a chord nobody wrote",
  "12:03 · marginalia disagreed with itself in 4 languages",
  "16:21 · fold solved a crease pattern in 11 steps; the pastry chef approved",
  "19:55 · nocturne refused a calendar invite. politely.",
  "23:08 · verdigris recorded the first frost on a bronze hand",
];