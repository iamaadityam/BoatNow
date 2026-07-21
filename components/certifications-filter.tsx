'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Award,
  Shield,
  GraduationCap,
  Globe,
  Lightbulb,
  BarChart3,
  Trophy,
  Smartphone,
  Brain,
  Target,
  Zap,
  Code,
  Sparkles,
  TrendingUp,
  Cpu,
  BookOpen,
  Palette,
} from 'lucide-react'

const CERTIFICATIONS = [
  {
    icon: Brain,
    title: 'Build with AI',
    org: 'Google for Developers',
    year: '2026',
    link: 'https://certificate.hack2skill.com/verify/2026H2S07BWAIBDEL-P00175',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    category: 'AI',
  },
  {
    icon: Award,
    title: 'GenAI- Digital Marketing',
    org: 'WsCube',
    year: '2026',
    link: 'https://drive.google.com/file/d/1eACQNm8aH64vHsOF78WElYhlAj8p8-I_/view?usp=sharing',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    category: 'Marketing',
  },
  {
    icon: Shield,
    title: 'Network Security',
    org: 'Cisco',
    year: '2026',
    link: 'https://drive.google.com/drive/folders/1EIPgEDAQCuO04n9rb3JCvWAAU6Bt6SxD?usp=sharing',
    color: 'from-blue-600 to-blue-500',
    bgColor: 'bg-blue-600/10',
    category: 'Security',
  },
  {
    icon: GraduationCap,
    title: 'Cybersecurity',
    org: 'WsCube',
    year: '2025',
    link: 'https://drive.google.com/file/d/1K2krPoCdj3KMAkILeeFERRz7fNHsZHsb/view?usp=sharing',
    color: 'from-teal-600 to-emerald-500',
    bgColor: 'bg-teal-600/10',
    category: 'Security',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    org: 'Skill India',
    year: '2025',
    link: 'https://drive.google.com/file/d/10BQ4e8JQifefq7hq3aGJ7wsfFvuGo0Sq/view?usp=sharing',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-500/10',
    category: 'Security',
  },
  {
    icon: Globe,
    title: 'Dark Web & Crypto',
    org: 'EC-Council',
    year: '2025',
    link: 'https://drive.google.com/file/d/1poKAr9yklvk6x11HmCc5hSOHTlHtgvvf/view?usp=sharing',
    color: 'from-purple-600 to-indigo-700',
    bgColor: 'bg-purple-600/10',
    category: 'Security',
  },
  {
    icon: Lightbulb,
    title: 'AI Marketing',
    org: 'IIDE',
    year: '2025',
    link: 'https://drive.google.com/file/d/1JqVk95aqlGm1StlrjdGgWD38G6TdMiuF/view?usp=sharing',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
    category: 'AI',
  },
  {
    icon: BarChart3,
    title: 'Data Analytics',
    org: 'IIT Guwahati',
    year: '2025',
    link: 'https://verification.givemycertificate.com/v/5951b91e-2e4d-4961-8c27-2002f0a6de0e',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/10',
    category: 'Data',
  },
  {
    icon: Trophy,
    title: 'Lifelong Learner',
    org: 'Certiprof',
    year: '2025',
    link: 'https://www.credly.com/badges/6785339a-bc5c-439c-ba37-cfc439affe2b/public_url',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    category: 'General',
  },
  {
    icon: Smartphone,
    title: 'Flutter Dev',
    org: 'LetsUpgrade',
    year: '2025',
    link: 'https://drive.google.com/file/d/1bE2JGelNJ7qNT1XArBCxLdgeuji3JTpb/view?usp=sharing',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    category: 'Development',
  },
  {
    icon: Brain,
    title: 'AI Development',
    org: 'LetsUpgrade',
    year: '2025',
    link: 'https://drive.google.com/file/d/1y1S72KbzZFJRxX2rWYkwKbY6MKoqPPjg/view?usp=sharing',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-500/10',
    category: 'AI',
  },
  {
    icon: Award,
    title: 'Cyber Defense',
    org: 'OPSWAT',
    year: '2025',
    link: 'https://learn.opswatacademy.com/certificate/P9M4mzYptA',
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-500/10',
    category: 'Security',
  },
  {
    icon: Target,
    title: 'Data Analysis',
    org: 'LetsUpgrade',
    year: '2025',
    link: 'https://drive.google.com/file/d/1btd4zauum0RqfmEMfMnQ5skhq2VTgqVG/view?usp=sharing',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    category: 'Data',
  },
  {
    icon: Zap,
    title: 'Power BI',
    org: 'E-Learning',
    year: '2025',
    link: 'https://drive.google.com/file/d/15abkOacjZdSYtNBkAzcuW2qQ4XMyqm0n/view?usp=sharing',
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-yellow-500/10',
    category: 'Data',
  },
  {
    icon: Code,
    title: 'Python',
    org: 'LetsUpgrade',
    year: '2025',
    link: 'https://drive.google.com/file/d/1S1w37O6DLB2msdndPcMNqFL85GfiP61_/view?usp=sharing',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    category: 'Development',
  },
  {
    icon: Sparkles,
    title: 'AI Tools',
    org: 'Juno AI',
    year: '2025',
    link: 'https://drive.google.com/file/d/1xZdx3jqO5-2IyO5OHYaprKRVkcQ_-Tdf/view?usp=sharing',
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-500/10',
    category: 'AI',
  },
  {
    icon: TrendingUp,
    title: 'Digital Marketing',
    org: 'IIDE',
    year: '2025',
    link: 'https://drive.google.com/file/d/1QHTRP311xgT-ZF4FjNP6ah1fcK1ZTlqj/view?usp=sharing',
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-500/10',
    category: 'Marketing',
  },
  {
    icon: Cpu,
    title: 'AI Fundamentals',
    org: 'Intel',
    year: '2021',
    link: 'https://drive.google.com/drive/folders/1AoIUCVrHIu3E7UDRZk5BNoU_REG6ze96?usp=sharing',
    color: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-500/10',
    category: 'AI',
  },
  {
    icon: BookOpen,
    title: 'Python Basics',
    org: 'iLearn',
    year: '2021',
    link: 'https://drive.google.com/file/d/1kAWhBSuFO_REG5xNbMU2TcrrNEY5svqj/view?usp=drive_link',
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-500/10',
    category: 'Development',
  },
  {
    icon: Palette,
    title: 'Web Development',
    org: 'TestDome',
    year: '2021',
    link: 'https://drive.google.com/file/d/1u28iMz9uTh5bkD7BEGGRMQNxLVimv_Z_/view?usp=sharing',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-500/10',
    category: 'Development',
  },
]

const CATEGORIES = ['All', 'Marketing', 'Security', 'Data', 'General', 'Development', 'AI']

export default function CertificationsFilter() {
  const filteredCerts = CERTIFICATIONS

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-500">
          Certifications
        </h2>
        <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
          Verified certifications across multiple domains
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto justify-center">
        {[
          { number: '19+', label: 'Certifications' },
          { number: '6', label: 'Categories' },
          { number: '2026', label: 'Latest Year' },
          { number: '2021', label: 'First Certification' },
        ].map((stat, index) => (
          <div
            key={index}
            className="dark:bg-slate-900/40 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700/30 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300 hover-lift opacity-100"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 bg-transparent">
              {stat.number}
            </div>
            <div className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Certification Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {filteredCerts.map((cert, index) => (
          <Link key={index} href={cert.link} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="relative aspect-square rounded-xl p-6 transition-all duration-300 border border-slate-200 dark:border-slate-700/30 backdrop-blur-sm dark:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-600 hover-lift px-6 h-auto w-full py-8">
              {/* Subtle tinted layer */}
              <div className={`pointer-events-none absolute inset-0 rounded-xl ${cert.bgColor} opacity-15`} aria-hidden="true" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-3">
                {/* Icon with gradient background */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 transition-transform duration-300 bg-gradient-to-br ${cert.color} group-hover:scale-110`}>
                  <cert.icon className="w-7 h-7 text-white flex-shrink-0 py-0 my-3" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                  {cert.title}
                </h3>

                {/* Organization */}
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {cert.org}
                </p>

                {/* Year Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 px-1 border rounded-sm py-0">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{cert.year}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
