"use client"
import Link from "next/link"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CertificationsFilter from "@/components/certifications-filter"
import {
  Github,
  Linkedin,
  Mail,
  ChevronRight,
  Star,
  Award,
  Code,
  Sparkles,
  Shield,
  Brain,
  BarChart3,
  Globe,
  Trophy,
  Smartphone,
  Zap,
  Cpu,
  Target,
  Palette,
  BookOpen,
  Lightbulb,
  TrendingUp,
  GraduationCap,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import ThemeToggle from "@/components/theme-toggle"

function CursorHalo() {
  const haloRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let targetX = x
    let targetY = y
    let rafId = 0
    let idleTimer: number | null = null
    const SPEED = 1

    const el = haloRef.current

    const setIdle = () => {
      if (!el) return
      el.classList.add("is-idle")
    }

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!el) return
      el.classList.remove("is-idle")
      if (idleTimer) window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(setIdle, 1200)
    }

    const animate = () => {
      const dx = targetX - x
      const dy = targetY - y
      if (dx * dx + dy * dy < 4) {
        x = targetX
        y = targetY
      } else {
        x += dx * SPEED
        y += dy * SPEED
      }

      if (el) {
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }
      rafId = window.requestAnimationFrame(animate)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    rafId = window.requestAnimationFrame(animate)
    idleTimer = window.setTimeout(setIdle, 1200)

    return () => {
      window.removeEventListener("pointermove", onMove)
      if (rafId) window.cancelAnimationFrame(rafId)
      if (idleTimer) window.clearTimeout(idleTimer)
    }
  }, [])

  return <div ref={haloRef} className="cursor-halo" aria-hidden="true" />
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("")
  const [typedText, setTypedText] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const words = ["problem-solving", "AI/ML", "data analysis", "software development", "creative thinking"]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "academic-journey", "achievements", "certifications", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const currentWord = words[currentWordIndex]
    const typingSpeed = isDeleting ? 50 : 100
    const pauseTime = isDeleting ? 500 : 2000

    const timer = setTimeout(() => {
      if (!isDeleting && typedText === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseTime)
      } else if (isDeleting && typedText === "") {
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      } else {
        setTypedText(
          isDeleting ? currentWord.substring(0, typedText.length - 1) : currentWord.substring(0, typedText.length + 1),
        )
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [typedText, isDeleting, currentWordIndex, words])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen text-slate-900 dark:text-white bg-slate-50 dark:bg-[#0f1419] relative transition-colors duration-300">
      <CursorHalo />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/30 bg-white/80 dark:bg-[#0f1419]/90 backdrop-blur-xl transition-colors">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link
            href="/"
            className="font-bold text-xl hover:scale-105 transition-transform bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-500"
          >
            Portfolio
          </Link>
          <nav className="hidden md:flex gap-8">
            {["About", "Academic Journey", "Achievements", "Certifications", "Contact"].map((item, index) => {
              const sectionId = item.toLowerCase().replace(" ", "-")
              const isActive = activeSection === sectionId

              return (
                <Link
                  key={item}
                  href={`#${sectionId}`}
                  onClick={(e) => handleNavClick(e, sectionId)}
                  className={`transition-colors duration-300 relative group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden md:flex border-blue-500/40 text-blue-600 hover:bg-blue-500/10 hover:border-blue-500 dark:border-blue-500/50 dark:text-blue-400 dark:hover:bg-blue-500/10 bg-transparent"
            >
              <Link href="#contact" onClick={(e) => handleNavClick(e, "contact")}>
                Get in touch
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto py-20 md:py-32 px-14">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="space-y-8 lg:w-1/2 animate-fade-in-left mx-3">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  {"Hi, I'm "}
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-500">
                    Aaditya Malhotra
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-400 leading-relaxed">
                  A passionate student with expertise in <br />
                  <span className="text-blue-600 dark:text-blue-400 font-semibold relative inline-block">
                    <span className="relative z-10">
                      {typedText}
                      <span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}>|</span>
                    </span>
                    <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-400/10 rounded-md blur-sm opacity-0 hover:opacity-100 transition-opacity"></div>
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl hover-lift"
                >
                  <Link href="#certifications">
                    <Code className="mr-2 h-5 w-5" />
                    View My Certifications
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700/50 dark:text-slate-400 dark:hover:bg-slate-800/50 px-8 py-3 rounded-xl hover-lift bg-transparent"
                >
                  <Link href="#contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Contact Me
                  </Link>
                </Button>
              </div>

              <div className="flex gap-4 pt-4">
                {[
                  { href: "https://github.com/iamaadityam/", icon: Github, label: "GitHub" },
                  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
                  { href: "mailto:malhotraaaditya1.m@gmail.com", icon: Mail, label: "Email" },
                ].map(({ href, icon: Icon, label }, index) => (
                  <Link key={label} href={href} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:scale-110 transition-all duration-300 hover-glow"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="sr-only">{label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center animate-fade-in-right">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-500 dark:from-blue-600 dark:to-blue-800 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-blue-300/40 dark:border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="/images/aaditya1m.jpg"
                    alt="Aaditya Malhotra"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-20 md:py-32"
        >
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              <div className="text-center space-y-4 animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-500">
                  About Me
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  Learn more about my background, education, and what drives me.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <Card className="gradient-card border-slate-200 dark:border-slate-700/30 hover-lift">
                  <CardContent className="p-8 md:p-12">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">My Story</h3>
                      <div className="space-y-4 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                        <p>
                          It all started in 7th grade when my dad introduced me to the basics of HTML. That simple
                          moment of curiosity turned into a defining experience, sparking a deep and lasting passion for
                          programming.
                        </p>
                        <p>
                          When I'm not immersed in academics or building projects, you'll likely find me solving Sudoku
                          and logic puzzles, enjoying music, or engaging with communities on Reddit.
                        </p>
                      </div>
                      <div className="pt-6">
                        <Button
                          variant="outline"
                          asChild
                          className="border-blue-500/40 text-blue-600 hover:bg-blue-500/10 dark:border-blue-500/50 dark:text-blue-400 dark:hover:bg-blue-500/10 bg-transparent"
                        >
                          <Link href="#contact" onClick={(e) => handleNavClick(e, "contact")}>
                            {"Let's Connect"} <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Journey */}
        <section
          id="academic-journey"
          className="py-20 md:py-32"
        >
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              <div className="text-center space-y-4 animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-500">
                  Academic Journey
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  My educational institutions and academic path.
                </p>
              </div>

              {/* Exam Scores Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-8">
                {[
                  {
                    year: "Class 10",
                    label: "CBSE",
                    score: "96.8%",
                    period: "2023",
                  },
                  {
                    year: "Class 12",
                    label: "CBSE",
                    score: "92.8%",
                    period: "2025",
                  },
                  {
                    year: "VITEEE",
                    label: "VIT",
                    score: "AIR 2655",
                    period: "2025",
                  },
                  {
                    year: "JEE Mains",
                    label: "NTA",
                    score: "97.28%ile",
                    period: "2025",
                  },
                  {
                    year: "JEE Mains",
                    label: "NTA",
                    score: "99.1%ile",
                    period: "2026",
                  },
                ].map((exam, index) => (
                  <Card key={index} className="gradient-card border-slate-200 dark:border-slate-700/30 hover-lift">
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">{exam.period}</p>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{exam.year}</h3>
                      <p className="text-base text-slate-600 dark:text-slate-300 mb-4">{exam.label}</p>
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {exam.score}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="relative max-w-6xl mx-auto">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-300 to-blue-500 dark:from-blue-500 dark:to-blue-800 rounded-full hidden md:block"></div>

                <div className="space-y-12">
                  {[
                    {
                      title: "Gap Year - JEE Preparation",
                      period: "2025-2026",
                      description:
                        "Focused preparation for JEE Mains/ Advanced.",
                      side: "right",
                    },
                    {
                      title: "Senior Secondary Studies",
                      period: "2023-25",
                      description:
                        "Class 12\nPhysics | Chemistry | Mathematics | English | Physical Education.",
                      side: "left",
                    },
                    {
                      title: "Secondary Studies",
                      period: "Till 2023",
                      description:
                        "Class 10\nScience | Mathematics | Artificial Intelligence | French | English | Social Studies.",
                      side: "right",
                    },
                  ].map((item, index) => (
                    <div key={index} className="relative">
                      {/* Mobile Layout */}
                      <div className="md:hidden">
                        <Card className="gradient-card border-slate-200 dark:border-slate-700/30 hover-lift">
                          <CardContent className="p-8">
                            <div className="flex items-start gap-4">
                              <div className="w-4 h-4 rounded-full bg-blue-400 dark:bg-blue-500 mt-2 flex-shrink-0 animate-pulse-glow"></div>
                              <div className="flex-1">
                                <h3 className="font-bold text-2xl text-blue-600 dark:text-blue-400 mb-3">
                                  {item.title}
                                </h3>
                                <p className="text-base text-slate-500 dark:text-slate-500 mb-4">{item.period}</p>
                                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:flex items-center justify-center">
                        <div className="flex w-full text-center items-center justify-center">
                          {/* Left side content */}
                          <div className="w-5/12 pr-8">
                            {item.side === "left" && (
                              <div className="text-right">
                                <Card className="gradient-card border-slate-200 dark:border-slate-700/30 hover-lift">
                                  <CardContent className="p-8 text-right">
                                    <h3 className="font-bold text-2xl text-blue-600 dark:text-blue-400 mb-3">
                                      {item.title}
                                    </h3>
                                    <p className="text-base text-slate-500 dark:text-slate-500 mb-4">{item.period}</p>
                                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                                      {item.description}
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </div>

                          {/* Center dot */}
                          <div className="relative z-10 flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-blue-400 dark:bg-blue-500 border-4 border-slate-50 dark:border-[#0f1419] animate-pulse-glow"></div>
                          </div>

                          {/* Right side content */}
                          <div className="w-5/12 pl-8 text-right">
                            {item.side === "right" && (
                              <div>
                                <Card className="gradient-card border-slate-200 dark:border-slate-700/30 hover-lift">
                                  <CardContent className="p-8 text-left">
                                    <h3 className="font-bold text-2xl text-blue-600 dark:text-blue-400 mb-3">
                                      {item.title}
                                    </h3>
                                    <p className="text-base text-slate-500 dark:text-slate-500 mb-4">{item.period}</p>
                                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                                      {item.description}
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section
          id="achievements"
          className="py-20 md:py-32"
        >
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              <div className="text-center space-y-4 animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-500">
                  Achievements
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  Awards, recognitions and notable accomplishments.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {[
                  {
                    icon: Award,
                    title: "Featured in The Economic Times",
                    date: "2nd June 2025",
                    description:
                      "Recognized for my resilience and perseverance during my JEE journey. Despite not achieving the rank I aimed for, I remained steadfast in my goals.",
                    link: "https://m.economictimes.com/magazines/panache/he-did-not-top-jee-advanced-or-achieve-the-rank-he-wanted-but-never-gave-up-post-wins-over-internet/articleshow/121565238.cms",
                    pdfLink: "https://drive.google.com/file/d/1MOxFaThNdchhPlvtx3GDHs1POK83N4DC/view?usp=sharing",
                    redditLink:
                      "https://www.reddit.com/r/JEE/comments/1l0xpxr/yes_i_tried/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
                  },
                  {
                    icon: Star,
                    title: "Honored by Dainik Jagran",
                    date: "30th May 2025",
                    description:
                      "Received a medal and certificate for academic excellence from Dainik Jagran in recognition of my outstanding performance in Class 12th, reflecting consistent dedication and a strong academic foundation across subjects",
                  },
                  {
                    icon: Sparkles,
                    title: "Multiple Local Association Awards",
                    date: "30th June 2023",
                    description:
                      "Awarded by multiple Resident Welfare Associations for my academic performance in Class 10 and 12 CBSE board exams.",
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className="group relative p-8 rounded-xl border border-slate-200 dark:border-slate-700/30 backdrop-blur-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <achievement.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{achievement.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{achievement.date}</p>
                    <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">{achievement.description}</p>

                    {/* Buttons for article links and original post */}
                    <div className="flex flex-wrap gap-3">
                      {achievement.link && (
                        <a
                          href={achievement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-300"
                        >
                          Article (webpage)
                        </a>
                      )}
                      {achievement.pdfLink && (
                        <a
                          href={achievement.pdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors duration-300"
                        >
                          Article (PDF)
                        </a>
                      )}
                      {achievement.redditLink && (
                        <a
                          href={achievement.redditLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-colors duration-300"
                        >
                          Original Post
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-20 md:py-32">
          <div className="container mx-auto px-6">
            <CertificationsFilter />
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-20 md:py-32"
        >
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              <div className="text-center space-y-4 animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-500">
                  Contact Me
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  Get in touch with me for any opportunities.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <Card className="gradient-card border-slate-200 dark:border-slate-700/30 hover-lift">
                  <CardContent className="p-8 md:p-12">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">{"Let's Connect"}</h3>
                      <div className="space-y-4 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                        <p>
                          I'm always open to new opportunities and
                          collaborations.
                        </p>
                      </div>
                      <div className="pt-6">
                        <Button
                          variant="outline"
                          asChild
                          className="border-blue-500/40 text-blue-600 hover:bg-blue-500/10 dark:border-blue-500/50 dark:text-blue-400 dark:hover:bg-blue-500/10 bg-transparent"
                        >
                          <Link href="mailto:malhotraaaditya1.m@gmail.com">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/30 py-8 bg-slate-100/60 dark:bg-slate-900/20 transition-colors">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-500">
              © {new Date().getFullYear()} Aaditya Malhotra. All rights reserved.
            </p>
            <div className="flex gap-4">
              {[
                { href: "https://github.com/iamaadityam", icon: Github, label: "GitHub" },
                { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
                { href: "mailto:malhotraaaditya1.m@gmail.com", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <Link key={label} href={href} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800/50 hover:scale-110 transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
