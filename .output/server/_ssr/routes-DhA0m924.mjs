import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as Download, n as Heart, r as FileText, t as X } from "../_libs/lucide-react.mjs";
import { n as motion, r as AnimatePresence, t as useReducedMotion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DhA0m924.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Cursor() {
	const dotRef = (0, import_react.useRef)(null);
	const ringRef = (0, import_react.useRef)(null);
	const [mode, setMode] = (0, import_react.useState)("idle");
	const [hidden, setHidden] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const pos = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2
		};
		const ring = {
			x: pos.x,
			y: pos.y
		};
		const move = (e) => {
			pos.x = e.clientX;
			pos.y = e.clientY;
			setHidden(false);
			const t = e.target;
			if (t.closest("[data-cursor='link']")) setMode("link");
			else if (t.closest("[data-cursor='drag']")) setMode("drag");
			else setMode("idle");
		};
		const leave = () => setHidden(true);
		let raf = 0;
		const tick = () => {
			ring.x += (pos.x - ring.x) * .18;
			ring.y += (pos.y - ring.y) * .18;
			if (dotRef.current) dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
			if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
			raf = requestAnimationFrame(tick);
		};
		tick();
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseleave", leave);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseleave", leave);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-0 z-[100] hidden md:block",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: ringRef,
			className: "fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,border-color,opacity] duration-300 ease-out",
			style: {
				width: mode === "link" ? 64 : mode === "drag" ? 80 : 28,
				height: mode === "link" ? 64 : mode === "drag" ? 80 : 28,
				borderColor: "var(--color-primary)",
				opacity: hidden ? 0 : .85,
				mixBlendMode: "difference",
				marginLeft: mode === "link" ? -32 : mode === "drag" ? -40 : -14,
				marginTop: mode === "link" ? -32 : mode === "drag" ? -40 : -14
			},
			children: mode === "drag" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 grid place-items-center text-[10px] font-mono uppercase tracking-[0.25em] text-primary",
				children: "drag"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: dotRef,
			className: "fixed top-0 left-0 rounded-full",
			style: {
				width: 4,
				height: 4,
				marginLeft: -2,
				marginTop: -2,
				background: "var(--color-primary)",
				opacity: hidden ? 0 : 1
			}
		})]
	});
}
function ThemeToggle() {
	const [dark, setDark] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("kael-theme");
		const initial = saved ? saved === "dark" : true;
		setDark(initial);
		document.documentElement.classList.toggle("dark", initial);
	}, []);
	const toggle = () => {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("kael-theme", next ? "dark" : "light");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		"data-cursor": "link",
		onClick: toggle,
		className: "group relative h-9 overflow-hidden rounded-full border border-border bg-background/40 px-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground",
		"aria-label": "Toggle theme",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative z-10 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-block h-2 w-2 rounded-full transition-colors",
				style: { background: dark ? "var(--color-primary)" : "var(--color-accent)" }
			}), dark ? "nocturne" : "diurne"]
		})
	});
}
var SECTIONS = [
	{
		id: "index",
		label: "Index"
	},
	{
		id: "about",
		label: "About"
	},
	{
		id: "constellation",
		label: "Projects"
	},
	{
		id: "strata",
		label: "Evolution"
	},
	{
		id: "frequencies",
		label: "Frequencies"
	},
	{
		id: "achievements",
		label: "Achievements & Certifications"
	},
	{
		id: "learning",
		label: "Learning Vector"
	},
	{
		id: "build-log",
		label: "Build Log"
	},
	{
		id: "transmissions",
		label: "Contact"
	}
];
function Dock() {
	const [active, setActive] = (0, import_react.useState)("index");
	(0, import_react.useEffect)(() => {
		const observed = /* @__PURE__ */ new Set();
		const obs = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) setActive(e.target.id);
			});
		}, {
			rootMargin: "-40% 0px -55% 0px",
			threshold: 0
		});
		const observeSections = () => {
			SECTIONS.forEach((s) => {
				const el = document.getElementById(s.id);
				if (el && !observed.has(el)) {
					obs.observe(el);
					observed.add(el);
				}
			});
		};
		observeSections();
		const retry = window.setTimeout(observeSections, 300);
		const retryAgain = window.setTimeout(observeSections, 1e3);
		return () => {
			window.clearTimeout(retry);
			window.clearTimeout(retryAgain);
			obs.disconnect();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "fixed top-0 left-0 right-0 z-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-5 md:px-12 lg:px-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#index",
					"data-cursor": "link",
					className: "flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-7 w-7 place-items-center rounded-full border border-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary anim-glow" })
					}), "Harsha · RHS"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground",
						children: "an observatory, not a résumé"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:flex",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-3 rounded-full border border-border bg-background/40 px-2 py-3 backdrop-blur-md",
			children: SECTIONS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: `#${s.id}`,
				"data-cursor": "link",
				className: "group relative flex items-center gap-3 rounded-full px-2 py-1",
				"aria-label": s.label,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid h-7 w-7 place-items-center font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${active === s.id ? "text-primary" : "text-muted-foreground"}`,
						children: String(i + 1).padStart(2, "0")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 ${active === s.id ? "text-foreground" : "text-muted-foreground"}`,
						children: s.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block h-px transition-all duration-300",
						style: {
							width: active === s.id ? 28 : 12,
							background: active === s.id ? "var(--color-primary)" : "var(--color-border)"
						}
					})
				]
			}) }, s.id))
		})
	})] });
}
var PERSON = {
	fullName: "Ryali Harsha Srinatth",
	shortName: "Harsha",
	initials: "RHS",
	tagline: "Building scalable MERN-stack systems — full-stack development, real-time communication, and data-driven product workflows.",
	taglineContext: "A Computer Science & Business Systems undergraduate at SRKR Engineering College, Bhimavaram.",
	about: ["I'm Harsha Srinatth Ryali, a passionate developer who enjoys turning ideas into practical software and continuously exploring how technology can solve real-world problems. My interests span Full Stack Development, System Design, and Artificial Intelligence, where I focus on building applications that are scalable, user-centric, and impactful.", "I primarily work with React, Node.js, Express.js, MongoDB, and modern web technologies while expanding my knowledge in Machine Learning and intelligent systems. Having successfully completed a 99-hour Data Science, Machine Learning, Deep Learning, and NLP Bootcamp, I am driven by curiosity, continuous learning, and the challenge of building technology that creates meaningful value."],
	email: "harshasrinatth18@gmail.com",
	phone: "+91 8179831468",
	location: "Bhimavaram, Andhra Pradesh",
	education: "B.Tech CSBS (Computer Science & Business Systems) — 8.75 / 10 CGPA",
	also: "Music · Lo-fi · Ambient · Instrumental",
	resumeUrl: "/harsha_res.pdf",
	socials: [{
		label: "GitHub",
		handle: "@Harsha-Srinatth",
		url: "https://github.com/Harsha-Srinatth"
	}, {
		label: "LinkedIn",
		handle: "in/harsha-srinatth-ryali",
		url: "https://www.linkedin.com/in/harsha-srinatth-ryali"
	}]
};
var GITHUB = {
	username: "Harsha-Srinatth",
	totalContributions: 290,
	year: 2025,
	repoCount: 12
};
var ACHIEVEMENTS = [
	{
		year: "2025",
		title: "Complete Data Science, Machine Learning, DL, NLP Bootcamp",
		detail: "Successfully completed a 99-hour Udemy bootcamp covering data science, machine learning, deep learning, and natural language processing.",
		badge: "udemy",
		certificateUrl: "/Udemy-Ml-Certificate-Harsha.pdf",
		certificateLabel: "View Certificate"
	},
	{
		year: "2025",
		title: "College-level hackathon shortlisted",
		detail: "Shortlisted at the college-level hackathon among 300+ competing teams for presenting an innovative software solution."
	},
	{
		year: "2025",
		title: "End-to-end full-stack platform",
		detail: "Recognized for designing and implementing an end-to-end scalable full-stack platform demonstrating strong problem-solving and software engineering skills."
	}
];
var LEARNING_PATH = [
	"Code",
	"Algorithms",
	"Systems",
	"Scale",
	"Data",
	"Intelligence",
	"Learning",
	"Reasoning",
	"Autonomy",
	"Emergence"
];
var BUILD_LOG = [
	{
		month: "March 2026",
		entries: [
			{
				challenge: "Auth edge cases across roles",
				solution: "Stricter RBAC middleware + audit logging",
				outcome: "Fewer permission bugs in staging"
			},
			{
				challenge: "Deploy drift between services",
				solution: "Docker compose + pinned image tags",
				outcome: "Reproducible environments for the team"
			},
			{
				challenge: "API abuse on public routes",
				solution: "Rate limiting + stricter validation",
				outcome: "Safer public surface area"
			}
		]
	},
	{
		month: "April 2026",
		entries: [{
			challenge: "Cold-start latency on AI endpoints",
			solution: "Warm pool + streamed responses",
			outcome: "P95 down from 4.2s to 900ms"
		}, {
			challenge: "Vector search recall drop",
			solution: "Re-embedded with domain-tuned model + hybrid BM25",
			outcome: "Recall@10 +18%"
		}]
	},
	{
		month: "May 2026",
		entries: [{
			challenge: "Costly LLM calls on every keystroke",
			solution: "Debounce + semantic cache in Redis",
			outcome: "LLM spend −62% with no UX loss"
		}]
	}
];
var BEYOND_CODE = [
	{
		icon: "🎧",
		label: "Music",
		note: "Lo-fi · Ambient · Instrumental"
	},
	{
		icon: "🏸",
		label: "Badminton",
		note: "Competitive"
	},
	{
		icon: "🏏",
		label: "Cricket",
		note: "Kohli fan"
	},
	{
		icon: "◎",
		label: "Carrom",
		note: "Precision"
	}
];
var PROJECTS = [
	{
		id: "college360",
		codename: "C36-01",
		title: "College360X",
		year: "2025",
		kind: "Academic & Skill Platform",
		url: "https://student-frontend-phi.vercel.app",
		blurb: "A centralized MERN + ML platform unifying academic tracking, real-time communication, and peer skill exchange across an entire institution.",
		detail: "College360X is a scalable full-stack platform with dedicated Student, Faculty, and HOD portals for attendance, achievements, and institutional workflows. JWT-based authentication and role-based authorization secure every layer. Socket.IO powers live notifications, threaded doubt discussions, and activity updates. The Skill Exchange module enables peer-to-peer learning through course creation and structured feedback. Python ML APIs predict student outcomes, placement readiness tiers, and participation trends from academic and engagement data.",
		signal: .96,
		hue: 22,
		metrics: [
			{
				label: "Portals",
				value: "Student · Faculty · HOD"
			},
			{
				label: "Stack",
				value: "MERN + ML"
			},
			{
				label: "APIs",
				value: "40+ RESTful APIs"
			}
		]
	},
	{
		id: "notes-bookmarks",
		codename: "NBK-02",
		title: "Personal Notes & Bookmark Manager",
		year: "2025",
		kind: "Full-Stack Productivity",
		blurb: "A full-stack personal productivity app for managing notes and bookmarks with secure authentication, smart search, tagging, and an animated modern UI.",
		detail: "Production-style monorepo built with Next.js, Express, and MongoDB. JWT-secured accounts with per-user data isolation. Full CRUD on notes and bookmarks, server-side search and tag filtering, and automatic bookmark title fetching via Axios and Cheerio metadata scraping. MongoDB indexes optimize text and compound queries. Responsive UI with Framer Motion, modals, tag chips, and glassmorphism navigation.",
		signal: .89,
		hue: 198,
		metrics: [
			{
				label: "API",
				value: "12 REST endpoints"
			},
			{
				label: "Models",
				value: "User · Note · Bookmark"
			},
			{
				label: "Stack",
				value: "Next.js · Express · MongoDB"
			}
		]
	},
	{
		id: "habitiq",
		codename: "HIQ-03",
		title: "HabitIQ",
		year: "2025",
		kind: "Predictive Intelligence System",
		url: "https://studyhabit-backend.onrender.com",
		blurb: "A full-stack machine learning product that predicts student study outcomes from daily behavioral signals and delivers actionable, personalized coaching in real time.",
		detail: "End-to-end ML platform with a React 19 six-step intake wizard collecting 14 behavioral features — sleep, study time, environment, motivation, and technique. A tuned RandomForestClassifier (200 estimators) is served through a FastAPI inference API with Pydantic validation and ColumnTransformer preprocessing (OneHot, StandardScaler, Ordinal). Stateless microservice deployed on Render with joblib-serialized artifacts and tier-based coaching recommendations on the frontend.",
		signal: .92,
		hue: 312,
		metrics: [
			{
				label: "Features",
				value: "14 behavioral inputs"
			},
			{
				label: "ML",
				value: "Random Forest · 200 trees"
			},
			{
				label: "Deploy",
				value: "FastAPI on Render"
			}
		]
	},
	{
		id: "agrisense",
		codename: "AGR-04",
		title: "AgriSense AI",
		year: "2025",
		kind: "AgriTech · Generative AI",
		blurb: "An AI-powered, multilingual farming companion that turns soil, weather, and crop images into actionable recommendations farmers can read or hear.",
		detail: "Full-stack AgriTech platform for Indian farmers combining React 19 with a modular Flask backend powered by Google Gemini 2.5 Flash. Four AI workflows: crop recommendation, vision-based disease detection, pre-planting risk analysis, and fertilizer guidance. Four-language i18n (English, Hindi, Telugu, Tamil), Web Speech API audio playback, geolocation and WeatherAPI auto-fill, explainable AI panels, and progressive multi-step forms — designed for low-literacy, field-ready use.",
		signal: .87,
		hue: 145,
		metrics: [
			{
				label: "AI modules",
				value: "4 workflows"
			},
			{
				label: "Languages",
				value: "EN · HI · TE · TA"
			},
			{
				label: "API",
				value: "4 REST endpoints"
			}
		]
	},
	{
		id: "verve",
		codename: "VRV-05",
		title: "Verve",
		year: "2025",
		kind: "Campus Engagement System",
		blurb: "A campus-wide social ecosystem designed to transform student participation into a connected digital experience for clubs, sports, culture, and peer communities.",
		detail: "MERN-stack platform enabling clubs, cultural organizations, sports teams, and learners to share updates, build communities, and foster collaboration. JWT authentication and authorization, post creation with likes and comments, follow/follower graph, profile management, and community discovery — all backed by a RESTful API architecture built for secure, scalable campus engagement.",
		signal: .84,
		hue: 268,
		metrics: [
			{
				label: "Communities",
				value: "Clubs · Sports · Culture"
			},
			{
				label: "Engagement",
				value: "Posts · Likes · Comments"
			},
			{
				label: "Stack",
				value: "React · Node · MongoDB · JWT"
			}
		]
	}
];
var STRATA = [
	{
		era: "2024 — Present",
		role: "Computer Science & Business Systems",
		org: "Foundations",
		arc: "Learning the foundations of software engineering, data structures, algorithms, and system thinking.",
		artifacts: [
			"DSA",
			"Full Stack Development",
			"Problem Solving"
		],
		depthLabel: "growing"
	},
	{
		era: "2024 — Present",
		role: "Full-Stack Systems",
		org: "Application building",
		arc: "Building complete applications from frontend interfaces to backend infrastructure.",
		artifacts: [
			"React",
			"Node.js",
			"MongoDB",
			"JWT",
			"Socket.IO"
		],
		depthLabel: "expanding"
	},
	{
		era: "2025 — Present",
		role: "Machine Learning",
		org: "Adaptive software",
		arc: "Exploring how software learns, predicts, and adapts.",
		artifacts: [
			"Python",
			"Data Analysis",
			"Machine Learning",
			"Model Building"
		],
		depthLabel: "accelerating"
	}
];
var FREQUENCIES = [
	{
		band: "Architecture",
		weight: .94,
		notes: "React • Node • System Design • JavaScript • Next.js • HTML5 • CSS3 • Redux • Context API"
	},
	{
		band: "Intelligence",
		weight: .88,
		notes: "ML • Prediction • Analytics • Python • Java"
	},
	{
		band: "Communication",
		weight: .9,
		notes: "Socket.IO • Realtime Systems • JWT Authentication • REST APIs"
	},
	{
		band: "Infrastructure",
		weight: .86,
		notes: "Docker • Redis • Deployment • Git • Express.js"
	},
	{
		band: "Data",
		weight: .92,
		notes: "MongoDB • SQL • Modeling • C++"
	},
	{
		band: "Algorithms",
		weight: .91,
		notes: "DSA • Optimization • Problem Solving"
	}
];
var SIGNALS = [
	"00:14 · college360x broadcast a placement readiness tier update campus-wide",
	"07:42 · notes-bookmarks auto-fetched 12 bookmark titles overnight",
	"12:03 · habitiq scored a study session from 14 behavioral signals",
	"16:21 · agrisense diagnosed crop disease from a field photo in Telugu",
	"19:55 · verve connected three campus clubs in one engagement feed"
];
function formatLocalTime() {
	const d = /* @__PURE__ */ new Date();
	return d.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	}) + " UTC" + (-d.getTimezoneOffset() / 60 >= 0 ? "+" : "") + -d.getTimezoneOffset() / 60;
}
function Observatory() {
	const ref = (0, import_react.useRef)(null);
	const [t, setT] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [time, setTime] = (0, import_react.useState)(formatLocalTime);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setTime(formatLocalTime()), 1e3);
		return () => clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const onMove = (e) => {
			const r = el.getBoundingClientRect();
			setT({
				x: (e.clientX - r.left) / r.width - .5,
				y: (e.clientY - r.top) / r.height - .5
			});
		};
		el.addEventListener("mousemove", onMove);
		return () => el.removeEventListener("mousemove", onMove);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref,
		id: "index",
		className: "relative min-h-[100svh] w-full overflow-hidden grid-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent anim-scan opacity-60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerMarks, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-6 pt-28 pb-16 md:px-12 lg:px-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Subject",
								value: PERSON.shortName + " · " + PERSON.initials
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Designation",
								value: "OBS-2026.06"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Local time",
								value: time
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Coordinates",
								value: "Bhimavaram · 16.54N 81.52E"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-16 grid flex-1 grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-7 flex flex-col justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
								style: { transform: `translate3d(${t.x * -10}px, ${t.y * -10}px, 0)` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs uppercase tracking-[0.45em] text-primary",
										children: "Specimen no. 001 — Living"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "font-display mt-6 text-[clamp(2.8rem,9.5vw,8.5rem)] leading-[0.88] tracking-[-0.04em] text-balance",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block",
												children: "Ryali"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block",
												children: "Harsha"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block italic font-light",
												children: "Srinatth"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-10 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl",
										children: [
											PERSON.tagline,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: PERSON.taglineContext
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: "↓ start drifting"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"or press ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
												className: "rounded border border-border px-1.5 py-0.5",
												children: "K"
											}),
											" for the index"
										] })]
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-5 relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecimenPlate, { tilt: t })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Status",
								value: "Composing",
								pulse: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Open work",
								value: "College360X · MERN + ML"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Reading",
								value: "Lispector · Stoppard"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Listening",
								value: "Hiroshi Yoshimura"
							})
						]
					})
				]
			})
		]
	});
}
function Meta({ label, value, pulse }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground/70",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-foreground flex items-center gap-2",
			children: [pulse && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary anim-glow" }), value]
		})]
	});
}
function CornerMarks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: [
		"top-6 left-6",
		"top-6 right-6 rotate-90",
		"bottom-6 left-6 -rotate-90",
		"bottom-6 right-6 rotate-180"
	].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `pointer-events-none absolute h-6 w-6 ${c}`,
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 h-full w-px bg-foreground/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 h-px w-full bg-foreground/30" })]
	}, i)) });
}
function SpecimenPlate({ tilt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative aspect-square w-full max-w-[520px] mx-auto",
		style: {
			transform: `perspective(1400px) rotateX(${tilt.y * 8}deg) rotateY(${tilt.x * -8}deg)`,
			transformStyle: "preserve-3d",
			transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border border-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-6 rounded-full border border-dashed border-border anim-orbit" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-16 rounded-full border border-border/60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 anim-orbit",
				style: { animationDuration: "60s" },
				children: [
					0,
					60,
					120,
					180,
					240,
					300
				].map((deg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary",
					style: { transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-50%) translateY(12px)` }
				}, deg))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-6 anim-orbit",
				style: {
					animationDuration: "120s",
					animationDirection: "reverse"
				},
				children: [
					0,
					45,
					90,
					135,
					180,
					225,
					270,
					315
				].map((deg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/60",
					style: { transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-50%) translateY(8px)` }
				}, deg))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-[28%] rounded-full bg-gradient-to-br from-primary to-accent opacity-90 blur-xl anim-glow" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-[34%] rounded-full bg-gradient-to-br from-primary to-accent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-[34%] rounded-full ring-1 ring-foreground/40 grid place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center font-mono text-[9px] uppercase tracking-[0.35em] text-primary-foreground/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "RHS · live" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "opacity-60 mt-1",
						children: "obs-26"
					})]
				})
			}),
			[
				{
					t: "systems",
					a: 12
				},
				{
					t: "interfaces",
					a: 72
				},
				{
					t: "signal",
					a: 144
				},
				{
					t: "form",
					a: 216
				},
				{
					t: "field",
					a: 288
				}
			].map(({ t, a }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-1/2 top-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
				style: { transform: `translate(-50%,-50%) rotate(${a}deg) translateY(-200%) rotate(${-a}deg)` },
				children: t
			}, t))
		]
	});
}
function Ticker() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative overflow-hidden border-y border-border bg-background/40 py-2 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex anim-ticker whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground",
			children: [...SIGNALS, ...SIGNALS].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mx-8 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-1 w-1 rounded-full bg-primary anim-glow" }), s]
			}, i))
		})
	});
}
function PdfViewer({ open, onClose, src, title, downloadName }) {
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKeyDown = (event) => {
			if (event.key === "Escape") onClose();
		};
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [open, onClose]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-4 border-b border-border bg-card/80 px-4 py-3 md:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-sm text-foreground",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
				children: "PDF preview — scroll or use viewer controls"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: src,
					download: downloadName,
					className: "inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Download"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close document viewer",
					className: "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-hidden p-3 md:p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				src: `${src}#toolbar=1&navpanes=0`,
				title,
				className: "h-full w-full rounded-2xl border border-border bg-white shadow-2xl"
			})
		})]
	});
}
function ResumeViewer({ open, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfViewer, {
		open,
		onClose,
		src: PERSON.resumeUrl,
		title: "harsha_res.pdf",
		downloadName: "harsha_res.pdf"
	});
}
function RevealOnScroll({ children, className, delay = 0 }) {
	if (useReducedMotion()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className,
		initial: {
			opacity: 0,
			y: 28
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			amount: .12,
			margin: "0px 0px -10% 0px"
		},
		transition: {
			duration: .75,
			delay,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		children
	});
}
function Constellation() {
	const [active, setActive] = (0, import_react.useState)(PROJECTS[0]);
	const positions = (0, import_react.useMemo)(() => {
		return PROJECTS.map((_, i) => {
			const angle = i / PROJECTS.length * Math.PI * 2 - Math.PI / 2;
			return {
				x: 50 + Math.cos(angle) * 36,
				y: 50 + Math.sin(angle) * 36
			};
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "constellation",
		className: "relative w-full overflow-hidden border-t border-border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
			index: "02",
			title: "Projects",
			subtitle: "Selected builds. Hover to explore."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RevealOnScroll, {
			delay: .06,
			className: "mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 pb-32 md:px-12 lg:grid-cols-12 lg:gap-8 lg:px-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative lg:col-span-7",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-card/30 grid-paper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "absolute inset-0 h-full w-full",
							viewBox: "0 0 100 100",
							preserveAspectRatio: "none",
							children: positions.map((p, i) => {
								if (PROJECTS[i].id === active.id) return null;
								const ap = positions[PROJECTS.findIndex((x) => x.id === active.id)];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: p.x,
									y1: p.y,
									x2: ap.x,
									y2: ap.y,
									stroke: "currentColor",
									strokeWidth: .15,
									className: "text-foreground/30",
									strokeDasharray: "0.6 0.6"
								}, i);
							})
						}),
						[
							20,
							30,
							40
						].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute rounded-full border border-border/60",
							style: {
								width: `${r * 2}%`,
								height: `${r * 2}%`,
								left: `${50 - r}%`,
								top: `${50 - r}%`
							}
						}, r)),
						PROJECTS.map((p, i) => {
							const pos = positions[i];
							const isActive = p.id === active.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"data-cursor": "link",
								onMouseEnter: () => setActive(p),
								onFocus: () => setActive(p),
								onClick: () => setActive(p),
								className: "group absolute -translate-x-1/2 -translate-y-1/2",
								style: {
									left: `${pos.x}%`,
									top: `${pos.y}%`
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative grid place-items-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute rounded-full transition-all duration-500",
											style: {
												width: isActive ? 84 : 36,
												height: isActive ? 84 : 36,
												background: `conic-gradient(from ${p.hue}deg, var(--color-primary), var(--color-accent), transparent 70%)`,
												opacity: isActive ? .45 : .15,
												filter: "blur(8px)"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "relative grid place-items-center rounded-full border bg-background transition-all duration-300",
											style: {
												width: isActive ? 22 : 14,
												height: isActive ? 22 : 14,
												borderColor: isActive ? "var(--color-primary)" : "var(--color-border)"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-1.5 w-1.5 rounded-full",
												style: { background: isActive ? "var(--color-primary)" : "var(--color-muted-foreground)" }
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `absolute top-full mt-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`,
											children: p.codename
										})
									]
								})
							}, p.id);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground",
								children: "signal strength"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-5xl text-foreground tabular-nums",
								children: [(active.signal * 100).toFixed(0), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base text-muted-foreground",
									children: "%"
								})]
							})]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-5 flex flex-col justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "wait",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -8
						},
						transition: {
							duration: .4,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-primary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: active.codename }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: active.year
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display mt-6 text-5xl md:text-6xl leading-[0.95] tracking-tight",
								children: active.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: active.url,
									target: "_blank",
									rel: "noreferrer",
									"data-cursor": "link",
									className: "transition-colors hover:text-primary",
									children: active.title
								}) : active.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground",
								children: active.kind
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-8 text-lg leading-relaxed text-foreground/90",
								children: active.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-base leading-relaxed text-muted-foreground",
								children: active.detail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
								className: "mt-10 grid grid-cols-3 gap-4",
								children: active.metrics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground",
										children: m.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-2 font-display text-xl text-foreground",
										children: m.value
									})]
								}, m.label))
							})
						]
					}, active.id)
				})
			})]
		})]
	});
}
function SectionLabel({ index, title, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-6 pt-28 pb-12 md:px-12 lg:px-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-[10px] uppercase tracking-[0.4em] text-primary",
				children: ["§", index]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-4xl md:text-6xl tracking-tight",
				children: title
			})]
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hidden md:block max-w-xs text-right font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
			children: subtitle
		})]
	});
}
function useContributionGrid(total) {
	return (0, import_react.useMemo)(() => {
		const weeks = 53;
		const days = 7;
		const cells = new Array(weeks * days).fill(0);
		let s = 1337;
		const rnd = () => {
			s = (s * 1664525 + 1013904223) % 4294967295;
			return s / 4294967295;
		};
		let remaining = total;
		while (remaining > 0) {
			const i = Math.floor(rnd() * cells.length);
			if (i % days === 0 && rnd() < .7) continue;
			const add = 1 + Math.floor(rnd() * Math.min(4, remaining));
			cells[i] = Math.min(cells[i] + add, 9);
			remaining -= add;
		}
		return {
			cells,
			weeks,
			days
		};
	}, [total]);
}
function level(v) {
	if (v === 0) return "bg-muted/40";
	if (v <= 1) return "bg-primary/25";
	if (v <= 3) return "bg-primary/50";
	if (v <= 6) return "bg-primary/75";
	return "bg-primary";
}
function About() {
	const [resumeOpen, setResumeOpen] = (0, import_react.useState)(false);
	const { cells, weeks, days } = useContributionGrid(GITHUB.totalContributions);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "about",
		className: "relative w-full overflow-hidden border-t border-border bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
				index: "01",
				title: "About",
				subtitle: "The basics, on the record."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RevealOnScroll, {
				delay: .06,
				className: "mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-3xl space-y-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg",
						children: PERSON.about.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, paragraph.slice(0, 32)))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCol, {
								label: "Location",
								value: PERSON.location
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCol, {
								label: "Education",
								value: PERSON.education
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCol, {
								label: "Also",
								value: PERSON.also
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setResumeOpen(true),
							"data-cursor": "link",
							className: "inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 font-mono text-sm tracking-wide transition-colors hover:border-primary hover:text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), "View Resume"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-14 overflow-hidden rounded-3xl border border-border bg-card/40 p-6 md:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground",
									children: [
										GITHUB.totalContributions,
										" contributions in ",
										GITHUB.year
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://github.com/Harsha-Srinatth",
									target: "_blank",
									rel: "noreferrer",
									"data-cursor": "link",
									className: "font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground hover:text-primary",
									children: "@Harsha-Srinatth ↗"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-[3px]",
									style: {
										gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
										gridAutoFlow: "column",
										gridTemplateRows: `repeat(${days}, 12px)`,
										minWidth: weeks * 15
									},
									children: cells.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-3 w-3 rounded-[3px] ${level(v)}`,
										title: `${v} contribution${v === 1 ? "" : "s"}`
									}, i))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"JavaScript · Python · ",
									GITHUB.repoCount,
									" repos"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [
										"less",
										[
											0,
											1,
											3,
											6,
											9
										].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2.5 w-2.5 rounded-[2px] ${level(n)}` }, n)),
										"more"
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground",
							children: "Beyond code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4",
							children: BEYOND_CODE.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card/40 px-5 py-6 text-center transition-colors hover:border-primary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl",
										children: b.icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 font-display text-lg tracking-tight",
										children: b.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
										children: b.note
									})
								]
							}, b.label))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeViewer, {
				open: resumeOpen,
				onClose: () => setResumeOpen(false)
			})
		]
	});
}
function MetaCol({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "font-mono text-[10px] uppercase tracking-[0.4em] text-primary",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 text-base text-foreground md:text-lg",
		children: value
	})] });
}
function UdemyBadge() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[#A435F0] px-1.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white",
		children: "U"
	});
}
function Achievements() {
	const [certificate, setCertificate] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "achievements",
		className: "relative w-full overflow-hidden border-t border-border bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
				index: "05",
				title: "Achievements And Certifications",
				subtitle: "What shipped, what moved the needle."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevealOnScroll, {
				delay: .06,
				className: "mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "relative space-y-6 border-l border-border pl-8",
					children: ACHIEVEMENTS.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -left-[37px] top-2 grid h-4 w-4 place-items-center rounded-full border border-primary bg-background",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary anim-glow" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [a.badge === "udemy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UdemyBadge, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-display text-2xl tracking-tight",
											children: a.title
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[10px] uppercase tracking-[0.35em] text-primary",
										children: a.year
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-muted-foreground",
									children: a.detail
								}),
								a.certificateUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-cursor": "link",
									onClick: () => setCertificate({
										src: a.certificateUrl,
										title: "Udemy-Ml-Certificate-Harsha.pdf",
										downloadName: "Udemy-Ml-Certificate-Harsha.pdf"
									}),
									className: "mt-5 inline-flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-primary hover:text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), a.certificateLabel ?? "View Certificate"]
								})
							]
						})]
					}, i))
				})
			}),
			certificate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfViewer, {
				open: Boolean(certificate),
				onClose: () => setCertificate(null),
				src: certificate.src,
				title: certificate.title,
				downloadName: certificate.downloadName
			})
		]
	});
}
function Stratum() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "strata",
		className: "relative w-full overflow-hidden border-t border-border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
			index: "03",
			title: "Evolution",
			subtitle: "Knowledge accumulated through curiosity and building."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevealOnScroll, {
			delay: .06,
			className: "mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-3xl border border-border",
				children: STRATA.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, {
					s,
					i,
					total: STRATA.length
				}, s.era))
			})
		})]
	});
}
function Layer({ s, i, total }) {
	const depth = i / Math.max(1, total - 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-cursor": "link",
		className: "group relative grid grid-cols-12 items-center gap-6 border-b border-border/60 px-6 py-10 md:px-10 md:py-14 last:border-b-0 transition-[padding] duration-500 hover:py-20",
		style: { background: `color-mix(in oklab, var(--color-card) ${88 - depth * 30}%, var(--color-primary) ${depth * 30}%)` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-span-12 md:col-span-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
				children: s.era
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-span-12 md:col-span-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-3xl md:text-4xl leading-tight tracking-tight",
					children: s.role
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-primary",
					children: s.org
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-span-12 md:col-span-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base leading-relaxed text-foreground/90",
					children: s.arc
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: s.artifacts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
						children: a
					}, a))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70",
				children: ["depth · ", s.depthLabel]
			})
		]
	});
}
function Frequencies() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "frequencies",
		className: "relative w-full overflow-hidden border-t border-border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
			index: "04",
			title: "Frequencies",
			subtitle: "Skills as radio signals — waves, overlap, and evolution."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevealOnScroll, {
			delay: .06,
			className: "mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-10 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-card/30 grid-paper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 800 500",
							className: "absolute inset-0 h-full w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "osc",
								x1: "0",
								x2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0",
									stopColor: "var(--color-primary)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "var(--color-accent)"
								})]
							}) }), FREQUENCIES.map((f, i) => {
								const amp = 30 + f.weight * 90;
								const freq = .012 + i * .004;
								const phase = i * .7;
								const y = 60 + i * 60;
								let d = `M 0 ${y}`;
								for (let x = 0; x <= 800; x += 4) d += ` L ${x} ${y + Math.sin(x * freq + phase) * amp * (1 - Math.abs(x - 400) / 1200)}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d,
									fill: "none",
									stroke: "url(#osc)",
									strokeWidth: 1.2,
									opacity: .55 + f.weight * .45
								}, f.band);
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-background/60 via-transparent to-background/60" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
							children: "osc · 6-band · live"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "lg:col-span-5 divide-y divide-border rounded-3xl border border-border",
					children: FREQUENCIES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						"data-cursor": "link",
						className: "group grid grid-cols-12 items-center gap-3 px-5 py-4 transition-colors hover:bg-card/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-3 font-display text-lg",
								children: f.band
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-[2px] w-full bg-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent",
										style: { width: `${f.weight * 100}%` }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 flex justify-between",
										children: Array.from({ length: 11 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-px -translate-y-1/2 bg-border/80" }, i))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: f.notes
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-3 text-right font-mono text-sm tabular-nums text-foreground",
								children: [(f.weight * 100).toFixed(1), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: " dB"
								})]
							})
						]
					}, f.band))
				})]
			})
		})]
	});
}
function Learning() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "learning",
		className: "relative w-full overflow-hidden border-t border-border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
			index: "06",
			title: "Learning Vector",
			subtitle: "A progression from code to emergence."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevealOnScroll, {
			delay: .06,
			className: "mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-dashed border-border bg-card/30 p-6 md:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-primary",
					children: "Learning vector →"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: LEARNING_PATH.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-xl border border-border bg-background px-4 py-2 font-mono text-xs tracking-wide",
							children: step
						}), i < LEARNING_PATH.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-muted-foreground",
							children: "→"
						})]
					}, step))
				})]
			})
		})]
	});
}
function BuildLog() {
	const [active, setActive] = (0, import_react.useState)(BUILD_LOG[0].month);
	const current = BUILD_LOG.find((m) => m.month === active) ?? BUILD_LOG[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "build-log",
		className: "relative w-full overflow-hidden border-t border-border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
			index: "07",
			title: "Build Log",
			subtitle: "Engineering journal — challenge → solution → outcome."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevealOnScroll, {
			delay: .06,
			className: "mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-3xl border border-border bg-card/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border bg-background/50 px-5 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-destructive/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-primary/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-accent/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-4 font-mono text-[11px] text-muted-foreground",
							children: "~/notes/build.log"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-[200px_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "border-b border-border p-4 md:border-b-0 md:border-r",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1",
							children: BUILD_LOG.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"data-cursor": "link",
								onClick: () => setActive(m.month),
								className: `w-full rounded-lg px-3 py-2 text-left font-mono text-xs transition-colors ${active === m.month ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`,
								children: m.month
							}) }, m.month))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 font-mono text-sm leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground",
							children: [
								"$ ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: "tail -f build.log"
								}),
								" — ",
								current.month
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-6",
							children: [current.entries.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-muted-foreground",
									children: ["#", String(i + 1).padStart(2, "0")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "challenge:"
									}),
									" ",
									e.challenge
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "solution:"
									}),
									" ",
									e.solution
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-primary",
									children: ["→ ", e.outcome]
								})
							] }, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "inline-block h-4 w-2 animate-pulse bg-foreground" })]
						})]
					})]
				})]
			})
		})]
	});
}
function Transmissions() {
	const [copied, setCopied] = (0, import_react.useState)(null);
	const copy = (v) => {
		navigator.clipboard?.writeText(v);
		setCopied(v);
		setTimeout(() => setCopied(null), 1400);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "transmissions",
		className: "relative w-full overflow-hidden border-t border-border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
			index: "08",
			title: "Transmissions",
			subtitle: "Open channels. Send something interesting."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RevealOnScroll, {
			delay: .06,
			className: "mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 pb-32 md:px-12 lg:grid-cols-12 lg:px-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-[clamp(2rem,5.5vw,5rem)] leading-[0.95] tracking-tight text-balance",
						children: [
							"Let's talk about",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "innovative ideas"
							}),
							",",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "italic",
								children: "challenging problems"
							}),
							",",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: "impactful products"
							}),
							", or",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "opportunities to build something meaningful together."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Channel, {
							label: "Email",
							value: PERSON.email,
							copied,
							onCopy: copy
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Channel, {
							label: "Cipher / signal",
							value: PERSON.phone,
							copied,
							onCopy: copy
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 flex flex-wrap gap-2",
						children: PERSON.socials.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: s.url,
							target: "_blank",
							rel: "noreferrer",
							"data-cursor": "link",
							className: "group inline-flex items-center gap-3 rounded-full border border-border bg-card/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary anim-glow" }),
								s.label,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground/60 group-hover:text-foreground",
									children: s.handle
								})
							]
						}, s.label))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "lg:col-span-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-3xl border border-border bg-card/50 p-8 grid-paper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-[0.4em] text-primary",
							children: "transmission card"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 font-display text-3xl leading-tight tracking-tight",
							children: PERSON.fullName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-8 space-y-3 font-mono text-[11px] uppercase tracking-[0.3em]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "located",
									v: PERSON.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "education",
									v: PERSON.education
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "response",
									v: "≤ 24h, usually faster"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "open to",
									v: "Backend · Full-stack · AI roles"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex items-end justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
								children: "signed"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-3xl italic tracking-tight text-primary",
								children: ["— ", PERSON.shortName]
							})]
						})
					]
				})
			})]
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-6 border-b border-dashed border-border pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-foreground",
			children: v
		})]
	});
}
function Channel({ label, value, copied, onCopy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		"data-cursor": "link",
		onClick: () => onCopy(value),
		className: "group relative flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/40 px-5 py-4 text-left transition-colors hover:border-primary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-mono text-base leading-snug tracking-[0.04em] text-foreground md:text-lg",
			children: value
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-[10px] uppercase tracking-[0.3em] text-primary opacity-0 transition-opacity group-hover:opacity-100",
			children: copied === value ? "copied ✓" : "copy ↵"
		})]
	});
}
async function parseStatsResponse(res) {
	if (!res.ok) throw new Error(`Stats request failed (${res.status})`);
	return await res.json();
}
async function fetchStats() {
	return parseStatsResponse(await fetch("/api/stats", {
		method: "GET",
		headers: { accept: "application/json" },
		cache: "no-store"
	}));
}
async function recordVisitor() {
	return parseStatsResponse(await fetch("/api/stats", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			accept: "application/json"
		},
		body: JSON.stringify({ action: "visitor" })
	}));
}
async function recordLike() {
	return parseStatsResponse(await fetch("/api/stats", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			accept: "application/json"
		},
		body: JSON.stringify({ action: "like" })
	}));
}
var VISITED_KEY = "rhs.visited";
var LIKED_KEY = "rhs.liked";
var STATS_VERSION_KEY = "rhs.stats.version";
var STATS_VERSION = "3";
function ordinal(n) {
	const s = [
		"th",
		"st",
		"nd",
		"rd"
	];
	const v = n % 100;
	return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}
function SiteFooter() {
	const [visitor, setVisitor] = (0, import_react.useState)(null);
	const [hearts, setHearts] = (0, import_react.useState)(0);
	const [liked, setLiked] = (0, import_react.useState)(false);
	const [burst, setBurst] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const init = async () => {
			if (localStorage.getItem(STATS_VERSION_KEY) !== STATS_VERSION) {
				localStorage.removeItem(VISITED_KEY);
				localStorage.removeItem(LIKED_KEY);
				localStorage.setItem(STATS_VERSION_KEY, STATS_VERSION);
			}
			setLiked(localStorage.getItem(LIKED_KEY) === "1");
			const alreadyVisited = localStorage.getItem(VISITED_KEY) === "1";
			try {
				if (!alreadyVisited) {
					const updated = await recordVisitor();
					localStorage.setItem(VISITED_KEY, "1");
					setVisitor(updated.visitors);
					setHearts(updated.likes);
					return;
				}
				const stats = await fetchStats();
				setVisitor(stats.visitors);
				setHearts(stats.likes);
			} catch (error) {
				console.error("[stats] Failed to load portfolio counters", error);
				setVisitor(null);
			}
		};
		init();
	}, []);
	const toggleHeart = async () => {
		if (liked) return;
		try {
			setHearts((await recordLike()).likes);
		} catch (error) {
			console.error("[stats] Failed to record like", error);
			setHearts((count) => count + 1);
		}
		setLiked(true);
		setBurst(true);
		localStorage.setItem(LIKED_KEY, "1");
		setTimeout(() => setBurst(false), 700);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "relative w-full border-t border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RevealOnScroll, {
			className: "mx-auto max-w-[1600px] px-6 py-16 md:px-12 lg:px-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[11px] uppercase tracking-[0.4em] text-primary",
					children: "if this portfolio impressed you"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl",
					children: "Leave a quiet, professional applause. One tap — it counts as a standing ovation in my book."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void toggleHeart(),
					"data-cursor": "link",
					disabled: liked,
					className: `group relative flex items-center gap-4 rounded-2xl border px-6 py-5 transition-all ${liked ? "border-primary bg-primary/10" : "border-border bg-card/40 hover:border-primary"}`,
					"aria-label": "Appreciate this portfolio",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `relative grid h-12 w-12 place-items-center rounded-full border transition-colors ${liked ? "border-primary bg-primary/20" : "border-border"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-5 w-5 transition-all ${liked ? "fill-primary text-primary scale-110" : "text-foreground"} ${burst ? "scale-150" : ""}` }), burst && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-0 animate-ping rounded-full border-2 border-primary" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-3xl tracking-tight",
							children: hearts
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
							children: liked ? "thank you ✦" : "hearts · tap once"
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 flex flex-col gap-6 border-t border-border pt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl text-sm normal-case tracking-normal text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "italic text-foreground",
						children: "\"The best way to predict the future is to invent it.\""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2",
						children: "— Alan Kay"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"You are the",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: visitor !== null ? ordinal(visitor) : "—"
							}),
							" ",
							"visitor"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary anim-glow" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 Ryali Harsha Srinatth · built by hand" })
					]
				})]
			})]
		})
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-screen w-full bg-background text-foreground antialiased",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cursor, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dock, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Observatory, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticker, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Constellation, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stratum, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frequencies, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Achievements, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Learning, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuildLog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transmissions, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Index as component };
