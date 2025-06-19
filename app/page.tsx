"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Menu,
  X,
  Download,
  Github,
  ExternalLink,
  Instagram,
  Linkedin,
  Mail,
  ArrowUpRight,
  Sparkles,
  Code2,
  Palette,
  Zap,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavAvatar } from "@/components/ui/nav-avatar";

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [showSupportDialog, setShowSupportDialog] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Initialize theme and audio from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedAudio = localStorage.getItem("audioEnabled");

    if (savedTheme === "light") {
      setIsDarkMode(false);
    }

    if (savedAudio === "true") {
      setIsSoundOn(true);
    }

    // Simulate loading with progress
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setShowBackToTop(scrollPosition > 400);

      const sections = ["home", "about", "skills", "projects"];
      let current = "home";

      sections.forEach((section) => {
        const element = sectionsRef.current[section];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            current = section;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cursor tracking effects (similar to original HTML)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Update cursor elements if they exist
      const cursorInner = document.querySelector(
        ".cursor-inner"
      ) as HTMLElement;
      const cursorOuter = document.querySelector(
        ".cursor-outer"
      ) as HTMLElement;

      if (cursorInner && cursorOuter) {
        cursorInner.style.left = e.clientX + "px";
        cursorInner.style.top = e.clientY + "px";
        cursorOuter.style.left = e.clientX + "px";
        cursorOuter.style.top = e.clientY + "px";
      }

      // Eye tracking functionality (exact from original HTML)
      const pupils = document.querySelectorAll(
        ".footer-pupil"
      ) as NodeListOf<HTMLElement>;
      if (pupils.length > 0) {
        const pupilConfig = {
          startPoint: -10,
          rangeX: 20,
          rangeY: 15,
          mouseXStart: 0,
          mouseXEnd: window.innerWidth,
          mouseYEnd: window.innerHeight,
        };

        const fracX =
          (e.clientX - pupilConfig.mouseXStart) /
          (pupilConfig.mouseXEnd - pupilConfig.mouseXStart);
        const fracY = e.clientY / pupilConfig.mouseYEnd;

        const pupilX = pupilConfig.startPoint + fracX * pupilConfig.rangeX;
        const pupilY = pupilConfig.startPoint + fracY * pupilConfig.rangeY;

        const transform = `translate(${pupilX}px, ${pupilY}px)`;

        pupils.forEach((pupil) => {
          pupil.style.transform = transform;
        });
      }
    };

    const handleMouseEnter = () => setCursorVariant("hover");
    const handleMouseLeave = () => setCursorVariant("default");

    // Add cursor tracking to interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, .tech-stack-box"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Eye tracking functionality
    const eyeTracking = (e: MouseEvent) => {
      const pupils = document.querySelectorAll(".footer-pupil");
      const pupilConfig = {
        startPoint: -8,
        rangeX: 16,
        rangeY: 12,
        mouseXStart: 0,
        mouseXEnd: window.innerWidth,
        mouseYEnd: window.innerHeight,
      };

      pupils.forEach((pupil) => {
        const xVal =
          pupilConfig.startPoint +
          ((e.clientX - pupilConfig.mouseXStart) /
            (pupilConfig.mouseXEnd - pupilConfig.mouseXStart)) *
            pupilConfig.rangeX;
        const yVal =
          pupilConfig.startPoint +
          (e.clientY / pupilConfig.mouseYEnd) * pupilConfig.rangeY;

        // Clamp values to keep pupils inside eyes
        const clampedX = Math.max(-8, Math.min(8, xVal));
        const clampedY = Math.max(-6, Math.min(6, yVal));

        (
          pupil as HTMLElement
        ).style.transform = `translate(${clampedX}px, ${clampedY}px)`;
      });
    };

    window.addEventListener("mousemove", eyeTracking);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", eyeTracking);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  // Handle audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Set a comfortable volume level

      if (isSoundOn) {
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Audio playback failed:", error);
            // Handle autoplay restrictions
            if (error.name === "NotAllowedError") {
              setIsSoundOn(false);
              localStorage.setItem("audioEnabled", "false");
            }
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isSoundOn]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  const toggleSound = () => {
    if (audioRef.current) {
      if (!isSoundOn) {
        // Try to play when turning on
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsSoundOn(true);
              localStorage.setItem("audioEnabled", "true");
            })
            .catch((error) => {
              console.warn("Audio playback failed:", error);
              setIsSoundOn(false);
              localStorage.setItem("audioEnabled", "false");
            });
        }
      } else {
        // Turning off
        audioRef.current.pause();
        setIsSoundOn(false);
        localStorage.setItem("audioEnabled", "false");
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { id: "home", label: "Home", icon: "01" },
    { id: "about", label: "About", icon: "02" },
    { id: "skills", label: "Skills", icon: "03" },
    { id: "projects", label: "Projects", icon: "04" },
  ];

  const techStack = [
    {
      name: "HTML5",
      icon: "/png/htmllogo.png",
      color: "from-orange-400 to-red-500",
    },
    {
      name: "CSS3",
      icon: "/png/csslogo.png",
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "JavaScript",
      icon: "/png/jslogo.png",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      name: "Django",
      icon: "/png/django.svg",
      color: "from-green-400 to-green-600",
    },
    {
      name: "React",
      icon: "/png/reactlogo.png",
      color: "from-cyan-400 to-blue-500",
    },
    {
      name: "Next.js",
      icon: "/png/nextlogo.png",
      color: "from-gray-700 to-gray-900",
    },
    {
      name: "GitHub",
      icon: "/png/githublogo.png",
      color: "from-gray-600 to-gray-800",
    },
    {
      name: "Git",
      icon: "/png/gitlogo.png",
      color: "from-red-400 to-orange-500",
    },
  ];

  const services = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Frontend Development",
      description:
        "Modern, responsive web applications using React, Next.js, and cutting-edge technologies.",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "UI/UX Design",
      description:
        "Beautiful, intuitive interfaces that provide exceptional user experiences.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Backend Development",
      description:
        "Robust, scalable server-side solutions with Django and modern APIs.",
    },
  ];

  const handleSupportClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 640) {
      // sm breakpoint
      e.preventDefault();
      setShowSupportDialog(true);
    }
  };

  // Lightweight GSAP animations setup
  useEffect(() => {
    const initGSAP = async () => {
      if (typeof window !== "undefined") {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        gsap.registerPlugin(ScrollTrigger);

        // Set default ease and reduce motion for better performance
        gsap.defaults({ ease: "power2.out" });

        // Simple navbar fade-in
        gsap.set(".navbar-content", { opacity: 0, y: -20 });
        gsap.to(".navbar-content", {
          opacity: 1,
          y: 0,
          duration: 0.6,
        });

        // Hero section fade-in
        gsap.set(".hero-content", { opacity: 0, y: 30 });
        gsap.to(".hero-content", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
        });

        // Lightweight scroll-triggered animations
        const sections = [
          ".about-section",
          ".skills-section",
          ".projects-section",
        ];

        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 20 },
            {
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true, // Only animate once for better performance
              },
              opacity: 1,
              y: 0,
              duration: 0.6,
            }
          );
        });

        // Simplified project cards animation
        gsap.fromTo(
          ".project-card",
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: ".projects-section",
              start: "top 70%",
              once: true,
            },
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
          }
        );

        // Lightweight tech icons animation
        gsap.fromTo(
          ".tech-icon",
          { opacity: 0, scale: 0.8 },
          {
            scrollTrigger: {
              trigger: ".skills-section",
              start: "top 75%",
              once: true,
            },
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
          }
        );
      }
    };

    initGSAP();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
        <div className="text-center">
          <motion.div
            className="relative w-32 h-32 mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-500 border-l-cyan-500"></div>
            <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-green-500 border-r-yellow-500"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Loading Portfolio
            </div>
            <div className="text-gray-400 font-mono text-sm">
              Initializing experience...
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Custom Cursor */}
      <div
        className={`cursor-inner fixed w-2 h-2 rounded-full pointer-events-none z-50 transition-all duration-200 ${
          cursorVariant === "hover"
            ? "w-6 h-6 bg-purple-500 mix-blend-difference"
            : "bg-yellow-400"
        }`}
        style={{
          transform: "translate(-50%, -50%)",
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />
      <div
        className={`cursor-outer fixed w-8 h-8 rounded-full border-2 border-white pointer-events-none z-50 transition-all duration-200 ${
          cursorVariant === "hover" ? "w-12 h-12" : ""
        }`}
        style={{
          transform: "translate(-50%, -50%)",
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      {/* Custom Cursor */}
      <motion.div
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 mix-blend-difference hidden lg:block"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: cursorVariant === "hover" ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Audio Element */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/mp3/preloader.mp3" type="audio/mp3" />
      </audio>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-40 p-6">
        <nav
          className={`navbar-content max-w-7xl mx-auto backdrop-blur-xl rounded-2xl border transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-900/50 border-gray-700/50"
              : "bg-white/70 border-gray-200/50"
          }`}
        >
          <div className="flex items-center justify-between px-8 py-2">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <NavAvatar />
              <div className="hidden sm:block">
                <div className="font-bold text-lg">Pawal Karki</div>
                <div className="text-sm text-gray-500">
                  Full Stack Developer
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-purple-500"
                      : isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() => setCursorVariant("hover")}
                  onHoverEnd={() => setCursorVariant("default")}
                >
                  <span className="text-xs font-mono opacity-50">
                    {item.icon}
                  </span>
                  <span className="ml-2">{item.label}</span>
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute inset-0 bg-purple-500/10 rounded-lg"
                      layoutId="activeTab"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>

              <motion.button
                onClick={toggleSound}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </motion.button>

              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-6 top-24 z-30 lg:hidden"
          >
            <div
              className={`backdrop-blur-xl rounded-2xl border p-6 ${
                isDarkMode
                  ? "bg-gray-900/90 border-gray-700/50"
                  : "bg-white/90 border-gray-200/50"
              }`}
            >
              <div className="space-y-4">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? "bg-purple-500/10 text-purple-500"
                        : isDarkMode
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-xs font-mono opacity-50">
                      {item.icon}
                    </span>
                    <span className="ml-3">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        ref={(el) => {
          if (el) sectionsRef.current.home = el;
        }}
        className="hero-content min-h-screen flex items-center justify-center relative overflow-hidden pt-24"
      >
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 text-sm font-mono text-purple-500">
                <Sparkles size={16} />
                <span>Hello, I'm</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <div>
                  {["P", "a", "w", "a", "l"].map((letter, index) => (
                    <span key={index} className="jello">
                      {letter}
                    </span>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  {[
                    "K",
                    "a",
                    "r",
                    "k",
                    "i",
                    "\u00A0",
                    "D",
                    "h",
                    "o",
                    "l",
                    "i",
                  ].map((letter, index) => (
                    <span key={index} className="jello">
                      {letter}
                    </span>
                  ))}
                </div>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Full Stack Developer crafting exceptional digital experiences
                with modern technologies
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="mailto:pawal_karki@icloud.com"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white font-medium overflow-hidden"
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Let's Connect</span>
                  <ArrowUpRight
                    size={18}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              <motion.button
                className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl font-medium hover:border-purple-500 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center space-x-2">
                  <Download size={18} />
                  <span>Resume</span>
                </span>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center space-x-6 pt-8"
            >
              {[
                {
                  href: "https://github.com/pawal-karki",
                  icon: <Github size={20} />,
                },
                {
                  href: "https://www.linkedin.com/pawal-karki",
                  icon: <Linkedin size={20} />,
                },
                {
                  href: "https://www.instagram.com/pawal_karki/",
                  icon: <Instagram size={20} />,
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-80 h-80 mx-auto">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full overflow-hidden border-4 border-white dark:border-gray-700">
                <Image
                  src="/png/nav-avatar.png"
                  alt="Pawal Karki"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="w-3 h-3 bg-white rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              What I{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Offer
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Specialized services to bring your digital vision to life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`p-8 rounded-3xl border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700 hover:border-purple-500/50"
                    : "bg-white border-gray-200 hover:border-purple-500/50 hover:shadow-xl"
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={(el) => {
          if (el) sectionsRef.current.about = el;
        }}
        className="about-section py-32 relative"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  About{" "}
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Me
                  </span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-8" />
              </div>

              <div className="space-y-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                <p>
                  Hi! I'm Pawal, a passionate Full Stack Developer who loves
                  creating digital experiences that matter. My journey began
                  during my college years, and I've been fascinated by the
                  endless possibilities of web development ever since.
                </p>
                <p>
                  I specialize in building modern web applications using{" "}
                  <strong className="text-purple-500">React.js</strong> for
                  dynamic frontends and{" "}
                  <strong className="text-purple-500">Django</strong> for robust
                  backends. I believe in writing clean, maintainable code and
                  creating user experiences that delight.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new
                  technologies, contributing to open source projects, or sharing
                  knowledge with the developer community.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {["React", "Django", "TypeScript", "Python", "Next.js"].map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-500/10 text-purple-500 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <div className="w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl overflow-hidden">
                  <Image
                    src="/webp/pawal.jpg"
                    alt="About Pawal"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  2+
                  <span className="text-sm ml-1">Years</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        ref={(el) => {
          if (el) sectionsRef.current.skills = el;
        }}
        className="skills-section py-32 relative"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Tech{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Stack
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Technologies I work with to bring ideas to life
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 tech-icon ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-blue-900/30 hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-500/20"
                    : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10"
                }`}
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center">
                    <Image
                      src={tech.icon}
                      alt={`${tech.name} logo`}
                      width={48}
                      height={48}
                      className={`w-12 h-12 object-contain transition-all duration-300 group-hover:scale-110 ${
                        tech.name === "GitHub" && isDarkMode
                          ? "filter invert"
                          : ""
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">{tech.name}</h3>
                    <div
                      className={`h-1 w-full bg-gradient-to-r ${tech.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  {tech.name}
                </div>

                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${tech.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  initial={false}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        ref={(el) => {
          if (el) sectionsRef.current.projects = el;
        }}
        className="projects-section py-32 relative"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Featured{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A showcase of my recent work and creative solutions
            </p>
          </motion.div>

          {/* AirWings Project */}
          <motion.div
            className={`project-card relative p-8 lg:p-12 rounded-3xl border overflow-hidden ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <Image
                    src="/webp/Airwings.svg"
                    alt="AirWings Horizon Logo"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold">
                      AirWings Horizon
                    </h3>
                    <p className="text-gray-500">Flight Booking Platform</p>
                  </div>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  A comprehensive flight booking platform for Nepal with
                  role-based access control, real-time flight tracking, and
                  seamless payment integration. Built with modern web
                  technologies for optimal performance and user experience.
                </p>

                <div className="flex flex-wrap gap-3">
                  {["React", "Django", "PostgreSQL", "Stripe API"].map(
                    (tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>

                <div className="flex space-x-4">
                  <Link
                    href="https://github.com/pawal-karki/AirWings-Horizon-Frontend"
                    target="_blank"
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <Github size={20} />
                  </Link>
                  <Link
                    href="https://airwings-horizon.netlify.app/"
                    target="_blank"
                    className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <span>Live Demo</span>
                    <ExternalLink
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/webp/Flight.png"
                    alt="AirWings Horizon Preview"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Doctor Appointment System Project */}
          <motion.div
            className={`project-card relative p-8 lg:p-12 rounded-3xl border overflow-hidden mt-12 ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src="\webp\Logo_Book_Garum.png"
                      alt="Book Garum Sallah Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold">
                      बुक गरौं सल्लाह
                    </h3>
                    <p className="text-gray-500">Hospital Management System</p>
                  </div>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  A comprehensive web-based hospital management system that
                  enables patients to book appointments with doctors and manage
                  schedules. Features multi-role access control for Admin and
                  Patients, built with Java Servlets and JSP following MVC
                  architecture.
                </p>

                <div className="flex flex-wrap gap-3">
                  {["Java EE", "Servlets", "JSP", "Maven", "MySQL", "JDBC"].map(
                    (tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>

                <div className="flex space-x-4">
                  <Link
                    href="https://github.com/pawal-karki/doctor-appointment-system"
                    target="_blank"
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <Github size={20} />
                  </Link>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/webp/doctor.png"
                    alt="Doctor Appointment System Dashboard"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal Modern Design */}
      <footer className="relative min-h-[70vh] bg-gradient-to-b from-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 py-10">
          {/* Compact Quote */}
          <div className="max-w-[600px] mx-auto mb-12 px-4">
            <p className="text-xl sm:text-2xl font-mono text-gray-300 text-center leading-relaxed">
              &ldquo;Every day feels like a journey to win something now
              days!&rdquo;
            </p>
          </div>

          {/* Avatar with Eye Tracking - Preserved Exactly */}
          <div className="footer-avatar-container mb-12">
            <Image
              src="/png/pawal-avatar.png"
              alt="Pawal Karki Avatar"
              width={280}
              height={280}
              className="footer-avatar-img"
              id="footer-wala-avatar"
            />
            <div className="footer-avatar-face">
              <div className="footer-avatar-eye footer-left-eye">
                <div className="footer-pupil"></div>
              </div>
              <div className="footer-avatar-eye footer-right-eye">
                <div className="footer-pupil"></div>
              </div>
            </div>
          </div>

          {/* Compact Social Links */}
          <div className="flex items-center gap-6 mb-12">
            <a
              href="https://github.com/pawal-karki"
              target="_blank"
              className="group relative w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-gray-400 group-hover:fill-purple-400 transition-colors"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/pawal-karki/"
              target="_blank"
              className="group relative w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-gray-400 group-hover:fill-purple-400 transition-colors"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/pawal_karki/"
              target="_blank"
              className="group relative w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-gray-400 group-hover:fill-purple-400 transition-colors"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="mailto:pawal_karki@icloud.com"
              target="_blank"
              className="group relative w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-gray-400 group-hover:fill-purple-400 transition-colors"
              >
                <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-md bg-black/30 z-40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Support Button - Responsive with Dialog on Mobile */}
            <div className="w-full sm:w-auto flex justify-center">
              <a
                href="https://ko-fi.com/pawal_karki"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSupportClick}
                className="group relative px-4 py-2 rounded-full overflow-hidden w-full sm:w-auto flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-pink-600/80 opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <span className="text-white text-sm">♥</span>
                  <span className="text-white text-sm whitespace-nowrap">
                    Support me
                  </span>
                </div>
              </a>
            </div>

            {/* Copyright - Center on mobile */}
            <p className="font-mono text-xs text-gray-400 text-center order-last sm:order-none">
              © TWENTY ONE Pawal Karki
            </p>

            {/* Back to Top Button - Hide on very small screens, show mobile version instead */}
            <button
              onClick={scrollToTop}
              className={`hidden sm:block group px-4 py-2 rounded-lg text-sm font-mono text-gray-400 hover:text-white transition-colors whitespace-nowrap ${
                showBackToTop ? "opacity-100" : "opacity-50"
              }`}
            >
              ←BACK TO TOP
            </button>
          </div>
        </div>

        {/* Mobile Back to Top Button - Show only on small screens */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed sm:hidden bottom-20 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-purple-600/90 text-white shadow-lg z-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpRight size={16} className="rotate-[-90deg]" />
            </motion.button>
          )}
        </AnimatePresence>
      </footer>

      {/* Support Dialog for Mobile */}
      <AnimatePresence>
        {showSupportDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupportDialog(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Ko-fi Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl w-[360px] max-w-[95vw]"
            >
              <div className="relative">
                <button
                  onClick={() => setShowSupportDialog(false)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <iframe
                  id="kofiframe"
                  src="https://ko-fi.com/pawal_karki/?hidefeed=true&widget=true&embed=true&preview=true"
                  className="w-full h-[550px] max-h-[80vh]"
                  title="pawal_karki"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
