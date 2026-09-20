/*
  This is the only file you should need to edit.

  Sections, in the order they appear on the page:
    profile        hero: name, tagline, bio, contact links
    selectedWork   "What I've built" carousel, five ranked projects
    publications   papers, essays, and talks, one carousel
    mediaCoverage  "Media/Events" on the page: press mentions, interviews,
                   and notable appointments (e.g. judging, speaking)
    openSource     published tools, card grid
    experience     career timeline, `note` is an optional short fact
    education / affiliations / volunteerAffiliations / certifications
    projects       side projects, under "Beyond Work", last section on purpose

  To add a new paper, essay, or talk: add an object to `publications`.
  Include an `image` if you have one (see "Getting an article's cover
  image" below); leave it as "" if not, the card just renders without one.

  To add to Media/Events (a podcast, a quote in an article, an interview,
  a speaking slot, a judging role): add an object to `mediaCoverage`.

  Getting an article's cover image: open the article on Medium, right-click
  its cover image, "Copy image address". Save that file into
  assets/img/ (a right-click "Save image as" from the same menu works too),
  and point `image` at "assets/img/<the filename you saved>.jpg". Keeping a
  local copy instead of linking Medium's URL directly means the image won't
  break if Medium ever changes how it hosts images. JPEG rather than PNG
  keeps file size down for a photo, PNG is fine too if that's what you saved.

  After editing, commit the change on github.com (or push from your machine)
  and the live site updates automatically within about a minute. No build
  step, nothing else to run.
*/

const SITE_DATA = {
  profile: {
    name: "Deep Sehgal",
    // Short positioning line, shown as a small label above the name and
    // used for document.title / meta tags / JSON-LD jobTitle.
    title: "Evaluation for Generative Systems",
    // The italic line under the name. Keep this short, one or two plain
    // sentences, it is the first thing anyone reads.
    tagline:
      "Engineering Architect for AI Quality | Engineering Manager, Quality at Amazon",
    location: "Sunnyvale, CA",
    // Path to a square-ish headshot, e.g. "assets/img/headshot.jpg". Leave ""
    // to show the initials avatar instead.
    photo: "assets/img/headshot.jpg",
    // Each array entry renders as its own paragraph. Keep sentences short,
    // this is read by a stranger in a few seconds, not studied.
    bio: [
      "Shipping an AI product to millions of users leaves no room for guesswork. Every response has to " +
        "be tested against real standards before it ever reaches them. I build the systems that decide " +
        "whether it's actually good enough to ship.",
      "I also write about AI quality, judge hackathons like NASA's Space Apps Challenge, and mentor " +
        "other engineers. Volunteering at local community centers is part of how I give back."
    ],
    // No public email, on purpose: LinkedIn is the contact channel, since it
    // has its own spam filtering and an email address in a page's source is
    // one of the first things harvesting bots scrape. `primary: true` gives
    // a link the filled-button treatment instead of the plain outline style.
    links: [
      { label: "Message me on LinkedIn", href: "https://www.linkedin.com/in/deep-sehgal-850865a1", primary: true },
      { label: "Medium", href: "https://medium.com/@dmsehgal" },
      { label: "GitHub", href: "https://github.com/dmsehgal" }
    ]
  },

  // "What I've built": five ranked projects, carousel, short copy, since
  // each card gets read in a few seconds while it scrolls past.
  selectedWork: [
    {
      number: "01",
      label: "Gate",
      title: "Grading every release before it ships",
      body:
        "An AI grading system that checks thousands of test cases across four quality measures before " +
        "every Alexa+ release. Cut release time by 30% while keeping 99.99% uptime for over 10 million " +
        "users."
    },
    {
      number: "02",
      label: "Instrument",
      title: "Scoring the scorer",
      body:
        "A study testing whether AI graders agree with real people. Four AI models, 374 human-scored " +
        "examples. Under review at an IEEE Computer Society magazine."
    },
    {
      number: "03",
      label: "Set",
      title: "Kasauti: a voice hallucination benchmark",
      body:
        "500 real voice questions tested across four AI models. Found that models often contradict " +
        "their own facts. Under review at NAACL 2027."
    },
    {
      number: "04",
      label: "Intake",
      title: "From field failure to test case",
      body:
        "Four years testing Alexa hardware in the real world: software updates, on-device debugging, " +
        "and turning failures into tickets engineers can actually fix."
    },
    {
      number: "05",
      label: "Tool",
      title: "Cutting a three-day task to ten minutes",
      body:
        "Built an AI tool that speeds up requirements analysis from about three days to under ten " +
        "minutes. Amazon teams adopted it on their own, no mandate required."
    }
  ],

  // Papers, essays, and talks, one carousel. `image` is optional, see the
  // note at the top of this file. Add new entries at the top.
  publications: [
    {
      title: "Kasauti: a voice hallucination benchmark",
      status: "Under review, NAACL 2027",
      description:
        "500 utterances, four models, time-constrained evaluation. Models contradict themselves on " +
        "factual data.",
      href: "",
      image: ""
    },
    {
      title: "LLM-as-a-judge calibration",
      status: "Under review, IEEE Computer Society magazine",
      description:
        "Four LLM graders scored 374 human-labelled statements under matched and unmatched " +
        "information, measured against a two-annotator human baseline.",
      href: "",
      image: ""
    },
    {
      title: "Your Test Suite Is Lying to You: Why Static Validation Can’t Catch What Generative AI Breaks",
      status: "AI Quality Engineer, Medium, 2026",
      description: "Why deterministic QA fails for LLMs, and how semantic evaluation and guardrails prevent hallucinations.",
      href: "https://medium.com/ai-in-quality-assurance/your-test-suite-is-lying-to-you-why-static-validation-cant-catch-what-generative-ai-breaks-ff2354e21344",
      image: "assets/img/pub-test-suite-lying.jpg"
    },
    {
      title: "Why QA Engineers Are the New Guardians of AI Trust",
      status: "Medium and LinkedIn, 2025",
      description: "Reached 1,471 LinkedIn impressions and 729 members.",
      href: "https://medium.com/@dmsehgal/why-qa-engineers-are-the-new-guardians-of-ai-trust-2c51c7b8a004",
      image: "assets/img/pub-guardians-of-ai-trust.jpg"
    },
    {
      title: "The Next Step in AI Maturity: Rethinking Human-in-the-Loop",
      status: "Medium, 2026",
      description: "",
      href: "https://medium.com/@dmsehgal/the-next-step-in-ai-maturity-rethinking-human-in-the-loop-d9491b6b5f51",
      image: "assets/img/pub-human-in-the-loop.jpg"
    },
    {
      title: "Cubic Test Automation",
      status: "Presentation, International Software Testing Conference, Nov 17, 2011",
      description: "",
      href: "",
      image: ""
    }
  ],

  // "Media/Events" on the page. Add an entry whenever you're quoted,
  // interviewed, featured, or take on a notable role like judging or
  // speaking. `image` is optional, see the note at the top of this file
  // for how to add one. Add new entries at the top.
  mediaCoverage: [
    {
      outlet: "NASA Space Apps Challenge, Los Angeles",
      title: "Selected as an official judge for the 2026 NASA Space Apps Challenge, LA",
      date: "Nov 14-15, 2026",
      href: "",
      image: "assets/img/media-nasa-space-apps-judge.jpg"
    }
  ],

  // Published tools, card grid, same shape as `projects` below. Add new
  // entries at the top.
  openSource: [
    {
      title: "aiexpect",
      body:
        "Assertions for testing non-deterministic AI text, built for pytest. Generates a Trust Score " +
        "and HTML report. Free-first: starts with rules and local embeddings before reaching for an " +
        "LLM judge. MIT licensed.",
      href: "https://github.com/dmsehgal/aiexpect"
    }
  ],

  // Career spine: roles, dates, places. `note` is optional, a short factual
  // line (not an achievement claim, those live in `selectedWork`).
  experience: [
    {
      company: "Amazon",
      title: "Quality Assurance Manager, L6",
      location: "Sunnyvale, CA",
      dates: "June 2022 to Present",
      note: "Organization of engineers and vendor partners in the United States and India."
    },
    {
      company: "FINRA",
      title: "Quality Assurance Manager",
      location: "Reston, VA",
      dates: "October 2017 to May 2022",
      note: "Regulated financial systems, where a missed defect was a compliance finding."
    },
    {
      company: "Gartner",
      title: "Senior Software Developer, Java",
      location: "",
      dates: "September 2013 to October 2017"
    },
    {
      company: "QA Infotech (Adobe)",
      title: "Senior Software Engineer in Test",
      location: "Noida, India",
      dates: "November 2010 to August 2013"
    }
  ],

  education: {
    degree: "Bachelor of Engineering, Information Technology",
    school: "Bharati Vidyapeeth University, Pune, India",
    year: "2010"
  },

  affiliations: ["IEEE Member"],

  volunteerAffiliations: [
    "NASA Space Apps Challenge Judge, Los Angeles (2026)",
    "Tracy Community Connections Center",
    "Amazon Volunteer Programs"
  ],

  certifications: [
    "AWS Certified Associate",
    "Shift-Left Security Engineering",
    "Quality Control Foundations, Test Engineering (QCFLTE)",
    "Microsoft Enterprise Product Management Fundamentals"
  ],

  // "Beyond Work": side projects. Last section on the page, on purpose.
  projects: [
    {
      title: "ICC Cricket Watchface",
      body: "A WatchOS face that puts live cricket scores on the wrist.",
      href: "https://github.com/dmsehgal/ICC-watchface"
    },
    {
      title: "FinPulse Watchface",
      body: "A WatchOS health-tracking face with step metrics and a live leaderboard.",
      href: "https://github.com/dmsehgal"
    }
  ]
};
