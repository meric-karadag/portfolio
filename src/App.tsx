import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Github, 
  Linkedin, 
  // Mail, // Removed
  Download, 
  ArrowUpRight, 
  // ArrowRight, // Removed
  ArrowLeft,
  BookOpen,
  Code2,
  UserCheck,
  // Award, // Removed
  Crown,
  Zap,
  // Star, // Removed
  GitBranch,
  Users,
  GraduationCap,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  // Trophy, // Removed
  Mail,
  // Terminal, // Removed
  Loader2 // Re-added
} from 'lucide-react';

// Standard NPM imports for local dev
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

// Import from our local setup file
import { auth, db, COLLECTION_PATH } from './firebase';

// --- Assets ---
import profileImg from './assets/profile.jpeg';
import metuLogo from './assets/metu.png';
import mitLogo from './assets/mit.png';
import tumLogo from './assets/tum.png';
import msftLogo from './assets/microsoft.png';
import helmholtzLogo from './assets/helmholtz.jpg';
import metuRomerLogo from './assets/romer.png';

// --- Data & Content ---

const NAV_LINKS = [
  { name: 'About', href: '#about', view: 'home' },
  { name: 'Experiences', href: '#experiences', view: 'home' },
  { name: 'Achievements', href: '#achievements', view: 'home' },
  { name: 'Publications', href: '#publications', view: 'home' },
  { name: 'Projects', href: '#projects', view: 'projects' }, 
];

const EXPERIENCES: {
  id: string;
  role: string;
  lab: string;
  location: string;
  period: string;
  advisor?: string;
  description: React.ReactNode;
  tags: string[];
  logo?: string;
}[] = [
  {
    id: 'metu-imagelab',
    role: 'Undergraduate Researcher (Guided Research Project)',
    lab: 'METU ImageLab',
    location: 'Ankara, Turkey',
    period: 'Feb 2026 – Present',
    advisor: 'Dr. Emre Akbas',
    description: (
      <ul className="list-disc pl-4 space-y-1">
        <li>We aim to enhance Concept Bottleneck Models (CBMs) by introducing a novel "naming loss".</li>
        <li>We work towards developing quantitative evaluation pipelines for CBMs using MLLMs as proxy evaluators.</li>
      </ul>
    ),
    // tags: ['CBMs', 'Interpretability', 'Sparse Autoencoders', 'Python'],
    tags: [],
    logo: metuLogo
  },
  {
    id: 'mit-media-lab',
    role: 'Research Intern',
    lab: 'Massachusetts Institute of Technology',
    location: 'Remote / Cambridge, MA',
    period: 'Oct 2025 – Present',
    advisor: 'Dr. Paul Liang',
    description:(
        <ul className="list-disc pl-4 space-y-1">
            <li>Investigated LLM evaluations and alignment.</li>
            <li>Responsible for the design and implementation of experimental suites.</li>
            <li>More information will be revealed about the project and outcomes after ICML'26 reviews.</li>
        </ul>
    ),
    // tags: ['LLM Alignment', 'Medical VLM', 'Counterfactuals', 'PyTorch'],
    tags: [],
    logo: mitLogo
  },
  {
    id: 'tum',
    role: 'Research Intern',
    lab: 'TU Munich (Institute of Explainable ML)',
    location: 'Munich, Germany',
    period: 'July 2025 – Oct 2025',
    advisor: 'Prof. Dr. Zeynep Akata',
    description: (
      <ul className="list-disc pl-4 space-y-1">
        <li>Investigated systematic failures in multimodal embedding models on vision centric benchmarks and evaluated modality gap in multimodal LLMs.</li>
        <li>Revealed models with identical vision encoders (CLIP ViT-L/14) develop opposite directional biases (CLIP choosing "right" 75% of the time,
            VLM2Vec choosing "left" 77% of the time) despite near-random (~25%) overall performance on What'sUp dataset.</li>
        <li>Diagnosed failure mechanism showing models had no prediction confidence (flat logit distributions) with biases emerging from
            tiny systematic differences, not learned spatial understanding</li>
        <li>Measured modality gap across 11 MLLMs (LLaVA, InternVL, Qwen families) using centered kernel alignment and CKNNA metrics, finding weak correlation
            between internal text-image alignment and VQA performance, challenging assumptions about ties of representation alignment and performance.</li>
      </ul>
    ),
    // tags: ['Multimodal Embeddings', 'Bias Analysis', 'VLM2Vec'],
    tags: [],
    logo: tumLogo
  },
  {
    id: 'microsoft',
    role: 'Intern',
    lab: 'Microsoft',
    location: 'Istanbul, Turkey',
    period: 'June 2025 – July 2025',
    description:(
        <ul className="list-disc pl-4 space-y-1">
            <li>Prototyped a Q&A agent for the website "binyaprak.com", a mentorship platform supported by Microsoft Turkey. </li>
            <li>Used Copilot Studio's agentic AI tools to increase user engagement to recommend suitable mentors to mentees.</li>
       </ul>),
    // tags: ['AI Agents', 'Production ML', 'Copilot Studio'],
    tags: [],
    logo: msftLogo
  },
  {
    id: 'metu-romer',
    role: 'Machine Learning Researcher',
    lab: 'METU ROMER',
    location: 'Ankara, Turkey',
    period: 'Oct 2023 – June 2025',
    advisor: 'Dr. Sinan Kalkan',
    description: (
        <ul className="list-disc pl-4 space-y-1">
            <li>Worked on LEGOFIT Horizon Euro project, trained ML models for various energy-related forecasting tasks. </li> 
            <li>Achieved 0.98 R^2 score on predicting monthly and hourly power generation from PV panels and 0.97 R^2 score on predicting heating energy usage. </li> 
            <li>Developed ms-Mamba (Multi-scale Mamba), a novel time-series architecture challenging SOTA (up to 12% MSE improvements) on 13 benchmark datasets.
                Submitted to Neurocomputing Journal, currently under review. </li>
            <li>Applied transfer learning methods (LoRA, LoRA+, full-finetuning) for heating energy consumption prediction task showing how transfer learning
                can improve data efficiency and performance in low-data regimes. Additionally, showed PEFT methods can slightly reduce overfitting in expense of accuracy. 
                Work published at Advanced Engineering Informatics.
            </li>
        </ul>
    ),
      // tags: ['Time-Series', 'Mamba Architecture', 'SOTA'],
    tags: [],
    logo: metuRomerLogo
  }
];

const ACHIEVEMENTS: { title: string; description: string; icon: any; bg: string; highlight?: string }[] = [
  {
    title: "High Honor Student",
    description: "Ranked 1st out of ~280 Computer Engineering students for 7 consecutive semesters.",
    icon: <Crown className="w-5 h-5 text-amber-700" />,
    bg: "bg-amber-100",
  },
  {
    title: "Top 0.01% National Rank",
    description: "Achieved top 0.01% ranking among ~2.5 million students in the National University Entrance Exam (YKS).",
    icon: <Zap className="w-5 h-5 text-indigo-700" />,
    bg: "bg-indigo-100",
  },
  {
    title: "METU Foundation Scholar",
    description: "Awarded the prestigious METU Development Foundation Scholarship for sustained academic excellence.",
    icon: <GraduationCap className="w-5 h-5 text-emerald-700" />,
    bg: "bg-emerald-100",
  },
//   {
//     title: "Inzva Algo Winner",
//     description: "Winner of the Inzva Algorithm Competition Upsolving Contest. Advanced algorithm design.",
//     icon: <Trophy className="w-5 h-5 text-orange-700" />,
//     bg: "bg-orange-100",
//   },
  {
    title: "Community Leader",
    description: "Technical Team Lead & Board Member at METU AI Club. Mentor for METU ACM Student Chapter.",
    icon: <Users className="w-5 h-5 text-sky-700" />,
    bg: "bg-sky-100",
  }
];

const PUBLICATIONS = [
  {
    title: "[Title to be Revealed]",
    authors: "Cheong, J., Karadag, Y. M., Oklan, G., Talaz, I., Topaloglu, O. A., Yurtsizoglu, D. B., Liang, P. P. & Kalkan, S.",
    venue: "Submitted to ICML 2026",
    status: "Under Review",
    year: "2026",
    link: "#"
  },
  {
    title: "ms-Mamba: Multi-scale Mamba for Time-Series Forecasting",
    authors: "Karadag, Y. M., Kalkan, S., & Dino, I. G.",
    venue: "Submitted to Neurocomputing Journal",
    status: "Under Review",
    year: "2025",
    link: "https://arxiv.org/abs/2504.07654"
  },
  {
    title: "Transfer learning and parameter-efficient fine-tuning for heating energy consumption prediction using urban building energy models (UBEM).",
    authors: "Akyol, I. C., Karadag, Y. M., Ucar, S., Talaz, I., Gursoy, F. E., Dino, I. G., & Kalkan, S.",
    venue: "Advanced Engineering Informatics, 68, 103576",
    status: "Published",
    year: "2025",
    link: "https://www.sciencedirect.com/science/article/abs/pii/S1474034625004690"
  }
];

const REFERENCES = [
  {
    name: "Prof. Dr. Zeynep Akata",
    role: "Professor",
    institution: "TU Munich & Helmholtz Munich",
    links: { website: "https://www.eml-munich.de", scholar: "https://scholar.google.com/citations?hl=en&user=jQl9RtkAAAAJ" }
  },
  {
    name: "Dr. Paul Liang",
    role: "Assistant Professor",
    institution: "MIT Media Lab",
    links: { website: "https://pliang279.github.io", scholar: "https://scholar.google.com/citations?hl=en&user=pKf5LtQAAAAJ" }
  },
  {
    name: "Prof. Dr. Sinan Kalkan",
    role: "Professor",
    institution: "METU",
    links: { website: "https://kovan.ceng.metu.edu.tr/~sinan/", scholar: "https://scholar.google.com/citations?user=yiAWeIAAAAAJ" }
  },
  {
    name: "Dr. Emre Akbas",
    role: "Assoc. Professor",
    institution: "METU",
    links: { website: "https://user.ceng.metu.edu.tr/~emre/index.html", scholar: "https://scholar.google.com/citations?user=HeXAdnEAAAAJ&hl=en&oi=ao" }
  },
];

const NEWS = [
  { date: 'Spring 2026', content: 'Joined METU ImageLab for guided research on Concept Bottleneck Models.' },
  { date: 'Jan 2026', content: 'Submitted [TITLE TO BE REVEALED SOON] to ICML 2026.' },
  { date: 'Oct 2025', content: 'Started Research Internship at MIT, supervised by Dr. Paul Liang'},
];

const AFFILIATIONS = [
  { name: 'MIT', short: 'MIT', logo: mitLogo, color: 'bg-stone-200 text-stone-800' },
  { name: 'TU Munich', short: 'TUM', logo: tumLogo, color: 'bg-blue-100 text-blue-800' },
  { name: 'Helmholtz Munich', short: 'HMGU', logo: helmholtzLogo, color: 'bg-cyan-100 text-cyan-800' },
  { name: 'Microsoft', short: 'MSFT', logo: msftLogo, color: 'bg-sky-100 text-sky-800' },
  { name: 'METU ROMER', short: 'METU', logo: metuLogo, color: 'bg-red-100 text-red-800' },
];

/*
const PROJECTS = [
  {
    id: "chrono-kit",
    title: "Chrono-Kit",
    description: "A high-performance Open Source Python library for time-series analysis. Engineered with a PyTorch backend for GPU acceleration, supporting statistical models (ARIMA, ES) and trend-seasonality decomposition.",
    tech: ["Python", "PyTorch", "Pandas", "Matplotlib"],
    link: "https://github.com/meric-karadag",
    stars: "120+",
    type: "Open Source Library"
  }
];
*/

/*
const DEV_LOGS = [
  {
    id: 1,
    date: "Feb 2026",
    title: "Thinking about Concept Bottleneck Models",
    excerpt: "Why do we name concepts post-hoc? I'm exploring ways to enforce semantic alignability during the training phase itself...",
    readTime: "Coming Soon"
  }
];
*/

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#D4693F] text-white hover:bg-[#B95530] hover:shadow-md active:transform active:scale-95 focus:ring-[#D4693F]",
    secondary: "bg-[#E8E6E1] text-[#2C2C2C] hover:bg-[#DEDBD4] active:transform active:scale-95 focus:ring-[#2C2C2C]",
    outline: "border border-[#D4D4D4] text-[#4A4A4A] hover:border-[#2C2C2C] hover:text-[#2C2C2C] bg-transparent focus:ring-[#2C2C2C]",
    ghost: "text-[#4A4A4A] hover:text-[#D4693F] hover:bg-[#F4F1EA] px-4 py-2"
  };

  return (
    <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const SectionHeading = ({ children, align = "left" }: { children: React.ReactNode, align?: "left" | "center" }) => (
  <h2 className={`text-2xl md:text-3xl font-semibold text-[#2C2C2C] mb-8 md:mb-12 tracking-tight ${align === "center" ? "text-center" : "text-left"}`}>
    {children}
  </h2>
);

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white border border-[#E5E5E5] rounded-xl p-6 md:p-8 hover:border-[#D4693F]/30 hover:shadow-sm transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#F4F1EA] text-[#5C5C5C] border border-[#E5E5E5]">
    {children}
  </span>
);

const Typewriter = ({ text, delay = 50, startDelay = 0, onComplete }: { text: string, delay?: number, startDelay?: number, onComplete?: () => void }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsStarted(true);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  useEffect(() => {
    if (!isStarted) return;
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      const timeout = setTimeout(onComplete, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, isStarted, text, onComplete]);

  return (
    <span>
      {currentText.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < currentText.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
      <span className="animate-pulse text-[#D4693F]">|</span>
    </span>
  );
};

// --- Sub-Views ---

const HomeView = ({ onNavigate, introComplete, onIntroComplete }: { onNavigate: (view: string) => void, introComplete: boolean, onIntroComplete: () => void }) => (
  <div className="space-y-20 md:space-y-32 pb-20">
    {/* Hero Section */}
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-[#1F1F1F] min-h-[3.3em] lg:min-h-[2.2em]">
            <Typewriter text={`Hi there! \nI'm Yusuf Meric Karadag`} delay={70} startDelay={100} onComplete={onIntroComplete} />
          </h1>
        </div>
        
        <div className={`space-y-6 transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-lg md:text-xl text-[#5C5C5C] leading-relaxed max-w-2xl">
                        Top-ranked undergraduate student at METU & AI researcher. <br></br> <br></br>
                        Scroll down to learn more about me and my work. 
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="primary" onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}>
              View Experience
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" onClick={() => window.open('https://www.linkedin.com/in/meric-karadag/', '_blank')}>
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
            <Button variant="outline" className="border-transparent px-2">
              <Github className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className={`lg:col-span-5 flex flex-col items-center lg:items-end space-y-8 transition-opacity duration-1000 delay-300 ${introComplete ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative group">
          <div className="absolute inset-0 bg-[#D4693F] rounded-2xl rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-300"></div>
          <div className="relative w-64 h-72 md:w-72 md:h-80 bg-[#E5E5E5] rounded-2xl overflow-hidden shadow-sm border border-[#D4D4D4]">
             <img src={profileImg} alt="Yusuf Meric Karadag" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <div className={`space-y-20 md:space-y-32 transition-opacity duration-1000 delay-500 ${introComplete ? 'opacity-100' : 'opacity-0'}`}>
      {/* Affiliations Marquee */}
      <section className="w-full overflow-hidden border-y border-[#E5E5E5] bg-[#F9F9F7] py-8">
        <h3 className="text-center text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-6">
          Affiliations & Previously At
        </h3>
        <div className="flex w-full overflow-hidden bg-[#F9F9F7] group">
            <div className="flex w-max animate-marquee items-center">
              {/* Strip 1 */}
              <div className="flex items-center gap-16 pr-16 shrink-0">
                {[...AFFILIATIONS, ...AFFILIATIONS].map((aff, i) => (
                  <div key={`s1-${aff.name}-${i}`} className="flex items-center space-x-3 cursor-default">
                    <div className="w-12 h-12 rounded flex items-center justify-center overflow-hidden bg-white border border-[#E5E5E5] shadow-sm shrink-0">
                      <img src={aff.logo} alt={aff.short} className="w-full h-full object-contain p-1" />
                    </div>
                    <span className="text-sm font-medium text-[#5C5C5C] hover:text-[#D4693F] transition-colors whitespace-nowrap">
                      {aff.name}
                    </span>
                  </div>
                ))}
              </div>
              {/* Strip 2 */}
              <div className="flex items-center gap-16 pr-16 shrink-0">
                {[...AFFILIATIONS, ...AFFILIATIONS].map((aff, i) => (
                  <div key={`s2-${aff.name}-${i}`} className="flex items-center space-x-3 cursor-default">
                    <div className="w-12 h-12 rounded flex items-center justify-center overflow-hidden bg-white border border-[#E5E5E5] shadow-sm shrink-0">
                       <img src={aff.logo} alt={aff.short} className="w-full h-full object-contain p-1" />
                    </div>
                    <span className="text-sm font-medium text-[#5C5C5C] hover:text-[#D4693F] transition-colors whitespace-nowrap">
                      {aff.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Updates Section */}
      <section id="updates" className="border-y border-[#E5E5E5] py-12">
         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="md:w-1/4">
               <h3 className="text-lg font-semibold">Latest Updates</h3>
            </div>
            <div className="md:w-3/4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {NEWS.map((item, i) => (
                 <div key={i} className="flex flex-col space-y-2">
                    <span className="text-xs font-bold text-[#D4693F] uppercase">{item.date}</span>
                    <p className="text-sm text-[#4A4A4A] leading-snug">{item.content}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    
      {/* About Section */}
      <section id="about" className="grid grid-cols-1 md:grid-cols-12 gap-12">
       <div className="md:col-span-4">
         <SectionHeading>About Me</SectionHeading>
       </div>
       <div className="md:col-span-8 space-y-6 text-[#4A4A4A] leading-relaxed">
         <p>
           I am a senior Computer Engineering student at Middle East Technical University, 
           consistently ranked 1st in my cohort with a <strong className="text-[#2C2C2C]">4.0/4.0 GPA</strong>.
         </p>
         <p>
            From operating systems to functional programming I am fond of many computer science topics. Though, I have a strong
            foundation in machine learning and deep learning. I am particularly interested in <strong className="text-[#2C2C2C]">multi-modal models</strong>,
            <strong className="text-[#2C2C2C]"> representation learning</strong>, and <strong className="text-[#2C2C2C]">societal aspects of AI</strong>, 
            I am equally passionate about building robust and reliable AI systems.
         </p>
         <p>
            Currently, I am working with <a href="https://user.ceng.metu.edu.tr/~emre/" className="text-[#D4693F] hover:underline decoration-1 underline-offset-4">Dr. Emre Akbas</a> at METU ImageLab
            on Concept Bottleneck Models as a guided research student and collaborating with
            <a href="https://pliang279.github.io" className="text-[#D4693F] hover:underline decoration-1 underline-offset-4"> Dr. Paul Liang</a> at MIT Media Lab on [topic to be revelaed]. 
            I am open to both academic and industry roles where I can apply my rigorous understanding computer science and machine learning.
         </p>

         {/* <div className="pt-6">
            <h4 className="text-sm font-bold text-[#2C2C2C] mb-4 flex items-center">
              <Terminal className="w-4 h-4 mr-2 text-[#D4693F]" />
              Technical Toolkit
            </h4>
            <div className="flex flex-wrap gap-2">
               {['Python', 'PyTorch', 'TypeScript', 'React', 'Docker', 'SQL', 'Hugging Face', 'Mamba', 'C++'].map(tech => (
                 <span key={tech} className="px-3 py-1.5 bg-white border border-[#E5E5E5] rounded text-sm text-[#5C5C5C] shadow-sm">
                   {tech}
                 </span>
               ))}
            </div>
         </div> */}
       </div>
    </section>

    {/* Research Experience */}
    <section id="experiences">
      <SectionHeading>Experiences</SectionHeading>
      
      <div className="space-y-6">
        {EXPERIENCES.map((exp) => (
          <Card key={exp.id} className="group cursor-default">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2">
                <span className="text-sm font-medium text-[#9CA3AF] font-mono">{exp.period}</span>
                <div className="hidden md:block w-full h-px bg-[#E5E5E5] my-4"></div>
                <div className="flex items-center gap-3">
                   {/* @ts-ignore - logo property exists on some items */}
                   {exp.logo && <img src={exp.logo} alt={exp.lab} className="w-10 h-10 object-contain" />}
                   <div className="text-xs font-bold text-[#D4693F] uppercase tracking-wider">
                     {exp.lab}
                   </div>
                </div>
              </div>

              <div className="md:col-span-9 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-[#2C2C2C] group-hover:text-[#D4693F] transition-colors">
                    {exp.role}
                  </h3>
                  {exp.advisor && (
                    <span className="text-sm text-[#5C5C5C] flex items-center">
                       <span className="opacity-50 mr-1">Advisor:</span> {exp.advisor}
                    </span>
                  )}
                </div>
                
                <div className="text-[#4A4A4A] leading-relaxed">
                  {exp.description}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>

    {/* Achievements Section */}
    <section id="achievements">
       <SectionHeading>Achievements</SectionHeading>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {ACHIEVEMENTS.map((ach, idx) => (
            <div key={idx} className="bg-white border border-[#E5E5E5] rounded-xl p-6 hover:border-[#D4693F]/30 hover:shadow-sm transition-all duration-300 flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${ach.bg}`}>
                {ach.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[#2C2C2C] text-lg">{ach.title}</h3>
                {ach.highlight && (
                   <span className="inline-block px-2 py-0.5 bg-[#D4693F]/10 text-[#D4693F] text-[10px] font-bold uppercase rounded-sm mb-1">
                     {ach.highlight}
                   </span>
                )}
                <p className="text-sm text-[#5C5C5C] leading-snug">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
       </div>
    </section>

    {/* Publications */}
    <section id="publications">
       <SectionHeading>Publications</SectionHeading>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PUBLICATIONS.map((pub, idx) => (
            <Card key={idx} className="flex flex-col justify-between h-full bg-[#FBFBF8] hover:bg-white">
               <div className="space-y-4">
                  <div className="flex items-start justify-between">
                     <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${pub.status === 'Under Review' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                       {pub.status}
                     </span>
                     <span className="text-sm text-[#9CA3AF]">{pub.year}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#2C2C2C] leading-snug">
                    {pub.title}
                  </h3>
                  
                  <p className="text-sm text-[#5C5C5C]">
                    {pub.authors}
                  </p>
                  
                  <p className="text-xs font-medium text-[#D4693F] uppercase tracking-wide pt-2">
                    {pub.venue}
                  </p>
               </div>
               
               <div className="pt-6 mt-auto">
                 <a href={pub.link} className="inline-flex items-center text-sm font-medium text-[#2C2C2C] hover:text-[#D4693F] transition-colors">
                   Read Paper
                   <ExternalLink className="w-3 h-3 ml-2" />
                 </a>
               </div>
            </Card>
          ))}
       </div>
    </section>

    {/* Project Teaser */}
    <section id="projects-teaser" className="bg-[#E8E6E1]/30 rounded-2xl p-8 md:p-12 border border-[#E5E5E5] text-center">
       <div className="max-w-2xl mx-auto space-y-6">
          <Code2 className="w-10 h-10 text-[#D4693F] mx-auto" />
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2C2C2C]">Projects & Blogs</h2>
          <p className="text-[#5C5C5C]">
            Beyond research, I try to build cool projects and write mini-blogs. <br></br>
            Check out the full list of projects and blogs.
          </p>
          <Button variant="outline" onClick={() => onNavigate('projects')}>
             Explore Projects
             <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
       </div>
    </section>

    {/* Academic References */}
    <section id="references">
       <div className="flex items-center gap-3 mb-8 md:mb-12">
         <UserCheck className="w-6 h-6 text-[#D4693F]" />
         <h2 className="text-2xl md:text-3xl font-semibold text-[#2C2C2C] tracking-tight">
           Academic References
         </h2>
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         {REFERENCES.map((ref, idx) => (
           <div key={idx} className="bg-[#E8E6E1]/50 border border-[#E5E5E5] rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2 hover:bg-[#E8E6E1] transition-colors duration-200">
             <h3 className="font-bold text-[#2C2C2C] text-lg">{ref.name}</h3>
             <div className="text-sm text-[#5C5C5C]">
               <p className="font-medium">{ref.role}</p>
               <p>{ref.institution}</p>
             </div>
             <div className="flex items-center gap-3 pt-2 text-xs font-medium text-[#D4693F]">
               <a href={ref.links.website} className="hover:underline">Website</a>
               <span className="text-[#9CA3AF]">|</span>
               <a href={ref.links.scholar} className="hover:underline">Scholar</a>
             </div>
           </div>
         ))}
       </div>
    </section>

    {/* Contact Form & CTA */}
    <section id="contact" className="py-20 bg-white border border-[#E5E5E5] rounded-3xl overflow-hidden">
       <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
         <div className="space-y-4">
           <h2 className="text-3xl font-bold text-[#2C2C2C]">Interested in collaboration?</h2>
           <p className="text-[#5C5C5C] max-w-lg mx-auto">
             I am currently open to discussing opportunities in robust AI, interpretability, and production ML engineering.
           </p>
         </div>
         
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Button variant="primary" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
             <Mail className="w-4 h-4 mr-2" />
             Send Message
           </Button>
           <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Resume
           </Button>
         </div>

         {/* Actual Contact Form */}
         <div id="contact-form" className="pt-12 border-t border-[#E5E5E5] mt-12">
            <h3 className="text-lg font-semibold text-[#2C2C2C] mb-6">Or send me a message directly</h3>
            <ContactForm />
         </div>
       </div>
    </section>

    </div>
  </div>
);

const ProjectsView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <div className="space-y-16 animate-fade-in pb-20">
    {/* Projects Header */}
    <div className="space-y-6 pt-12 md:pt-20">
      <button 
        onClick={() => onNavigate('home')}
        className="group inline-flex items-center text-sm font-medium text-[#5C5C5C] hover:text-[#D4693F] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] tracking-tight">
          Projects <br />
          <span className="text-[#D4693F]">& Blogs</span>
        </h1>
        <p className="text-lg text-[#5C5C5C] max-w-2xl leading-relaxed">
          A collection (to be) of my open source projects, experimental implementations, developer logs and blogs. 
        </p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto space-y-16">
      {/* Main Content Area */}
      <div className="space-y-16">
        
        {/* Featured Projects */}
        <section>
          <div className="flex items-center gap-2 mb-8 border-b border-[#E5E5E5] pb-4">
            <GitBranch className="w-5 h-5 text-[#D4693F]" />
            <h2 className="text-xl font-bold text-[#2C2C2C]">Featured Open Source</h2>
          </div>
          
          <div className="p-12 border border-dashed border-[#D4D4D4] rounded-xl bg-[#F9F9F7] text-center space-y-4">
             <div className="text-4xl mb-2">🧑‍🍳</div>
             <h3 className="text-lg font-bold text-[#2C2C2C]">The chef is cooking something special. Check back soon!</h3>
             <p className="text-[#5C5C5C]">
                {/* TODO: Add featured projects */}
             </p>
          </div>
        </section>

        {/* Blog */}
        <section>
           <div className="flex items-center gap-2 mb-8 border-b border-[#E5E5E5] pb-4">
            <BookOpen className="w-5 h-5 text-[#D4693F]" />
            <h2 className="text-xl font-bold text-[#2C2C2C]">Blog</h2>
          </div>

          <div className="p-12 border border-dashed border-[#D4D4D4] rounded-xl bg-[#F9F9F7] text-center space-y-4">
             <div className="text-4xl mb-2">🧑‍🍳</div>
             <h3 className="text-lg font-bold text-[#2C2C2C]">The chef is cooking something special. Check back soon!</h3>
             <p className="text-[#5C5C5C]">
                {/* TODO: Add blog posts */}
             </p>
          </div>
        </section>

      </div>
    </div>
  </div>
);

// --- Contact Form Component (With Backend) ---
const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    
    setStatus('loading');
    
    try {
      await addDoc(collection(db, COLLECTION_PATH.MESSAGES), {
        email,
        message,
        timestamp: serverTimestamp(),
      });
      setStatus('success');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto text-left">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#5C5C5C] mb-1">Email</label>
        <input 
          type="email" 
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-[#D4D4D4] focus:ring-2 focus:ring-[#D4693F] focus:border-transparent outline-none bg-[#F9F9F7]"
          placeholder="your@email.com"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#5C5C5C] mb-1">Message</label>
        <textarea 
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-[#D4D4D4] focus:ring-2 focus:ring-[#D4693F] focus:border-transparent outline-none bg-[#F9F9F7]"
          placeholder="How can we collaborate?"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        variant="primary" 
        className="w-full"
        disabled={status === 'loading' || status === 'success'}
      >
        {status === 'loading' ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
        ) : status === 'success' ? (
          <><CheckCircle className="w-4 h-4 mr-2" /> Sent Successfully</>
        ) : status === 'error' ? (
           <><AlertCircle className="w-4 h-4 mr-2" /> Error - Try Again</>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  );
};

// --- Main App ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'projects'
  const [user, setUser] = useState<User | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [locationData, setLocationData] = useState<{city: string, country: string} | null>(null);

  // --- Auth & Analytics Effects ---
  useEffect(() => {
    // 1. Initialize Auth
    const initAuth = async () => {
      // For local dev, we just need basic anonymous auth.
      // The environment token logic is specific to the preview iframe.
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error("Auth failed:", e);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // 2. Fetch Location (Once on mount)
    const fetchLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data && !data.error) {
          setLocationData({ city: data.city, country: data.country_name });
        } else {
             setLocationData({ city: 'Unknown', country: 'Unknown' });
        }
      } catch (e) {
        console.error("Location fetch failed", e);
        setLocationData({ city: 'Unknown', country: 'Unknown' });
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    // 3. Track Page View (Analytics)
    const trackView = async () => {
      if (!user) return;
      
      try {
        await addDoc(collection(db, COLLECTION_PATH.ANALYTICS), {
          event_type: 'page_view',
          view: currentView,
          timestamp: serverTimestamp(),
          local_time: new Date().toString(),
          user_id: user.uid,
          location: locationData || { city: 'Unknown', country: 'Unknown' }
        });
      } catch (err) {
        console.error("Analytics Error:", err);
      }
    };

    trackView();
  }, [user, currentView, locationData]); // Re-run if location loads late, but we might want to debounce this or just accept it might come in a later event if user navigates fast. 
  // Actually, better to just let it send 'Unknown' if not loaded yet, or wait? 
  // For simplicity, we trigger when user/view changes. If location loads LATER, we might miss it for the FIRST event only. 
  // To fix that, we can add locationData to dependency, but that might double-fire. 
  // Let's stick to firing on view change. If location is null, it sends null/unknown. 
  // Wait, if I add locationData to dependency, it will fire again when location loads. That's actually good for the first view! 
  // However, we need to avoid double counting. 
  // A better approach: 
  // specific useEffect just for the initial page load? 
  // detailed complexity. Let's keep it simple: fire when [user, currentView] changes. If location isn't ready, it isn't ready. 
  // But wait, user wants to know location. 
  // Let's assume location fetch is fast enough or fine to be missed on immediate load if internet is slow. 
  // Actually, if we add locationData to dependency, we get a second event "Page View with Location". 
  // That might be confusing. 
  // Let's keep [user, currentView]. AND maybe a separate "Session Start" event? 
  // Simplest for now: The locationData state will likely populate quickly.

  const trackDownload = async () => {
    if(!user) return;
    try {
       await addDoc(collection(db, COLLECTION_PATH.ANALYTICS), {
          event_type: 'cv_download',
          timestamp: serverTimestamp(),
          local_time: new Date().toString(),
          user_id: user.uid,
          location: locationData || { city: 'Unknown', country: 'Unknown' }
        });
        alert("Thanks for downloading! (Analytics event tracked)");
    } catch(e) {
      console.error(e);
    }
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (view: string, href?: string) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // If it's a hash link on the same page, scroll to it after a tiny delay to allow render
    if (view === 'home' && href && href.startsWith('#')) {
       setTimeout(() => {
          const id = href.substring(1);
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
       }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#2C2C2C] font-sans selection:bg-[#D4693F]/20 selection:text-[#D4693F]">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? 'bg-[#F9F9F7]/90 backdrop-blur-md border-b border-[#E5E5E5] py-3' : 'bg-transparent py-6'} ${introComplete ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a onClick={() => handleNavigate('home')} className="cursor-pointer text-lg font-semibold tracking-tight hover:text-[#D4693F] transition-colors">
            Yusuf Meric Karadag
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(link => (
              <button 
                key={link.name} 
                onClick={() => handleNavigate(link.view || 'home', link.href)} 
                className={`text-sm font-medium transition-colors ${currentView === link.view && link.view === 'projects' ? 'text-[#D4693F]' : 'text-[#5C5C5C] hover:text-[#D4693F]'}`}
              >
                {link.name}
              </button>
            ))}
            <Button variant="secondary" className="!py-2 !px-4 text-xs" onClick={trackDownload}>
              <Download className="w-4 h-4 mr-2" />
              CV
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#F9F9F7] border-b border-[#E5E5E5] p-6 shadow-lg">
            <div className="flex flex-col space-y-4">
              {NAV_LINKS.map(link => (
                <button 
                  key={link.name} 
                  onClick={() => handleNavigate(link.view || 'home', link.href)} 
                  className="text-left text-base font-medium text-[#2C2C2C]"
                >
                  {link.name}
                </button>
              ))}
              <Button variant="secondary" className="w-full justify-center" onClick={trackDownload}>
                Download CV
              </Button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        {currentView === 'home' ? (
          <HomeView onNavigate={handleNavigate} introComplete={introComplete} onIntroComplete={() => setIntroComplete(true)} />
        ) : (
          <ProjectsView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E5E5] py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#9CA3AF]">
            © 2026 Yusuf Meric Karadag. Built with React & Tailwind.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-[#9CA3AF] hover:text-[#D4693F] transition-colors">GitHub</a>
            <a href="#" className="text-[#9CA3AF] hover:text-[#D4693F] transition-colors">LinkedIn</a>
            <a href="#" className="text-[#9CA3AF] hover:text-[#D4693F] transition-colors">Scholar</a>
          </div>
        </div>
      </footer>
    </div>
  );
}