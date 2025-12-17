"use client"

import Link from "next/link"

interface SocialLogoProps {
  href: string
  children: React.ReactNode
  ariaLabel: string
}

function SocialLogo({ href, children, ariaLabel }: SocialLogoProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="group relative inline-block cursor-pointer"
      style={{ perspective: "1200px" }}
    >
      <div className="transform transition-all duration-400 ease-out group-hover:scale-[1.08] group-hover:-rotate-2 group-hover:-translate-y-0.5">{children}</div>
    </Link>
  )
}

export function LinkedInLogo3D() {
  return (
    <SocialLogo href="https://www.linkedin.com/in/mikedegany/" ariaLabel="LinkedIn Profile">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#5fb2ff] via-[#2e8bda] to-[#0f4f9c] shadow-[0_14px_35px_rgba(0,0,0,0.45)] border border-white/40" />
        <div className="absolute inset-[3px] rounded-[18px] bg-gradient-to-br from-white/18 via-white/6 to-black/25 shadow-[inset_0_1px_12px_rgba(255,255,255,0.25),inset_0_-4px_14px_rgba(0,0,0,0.35)]" />
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute -top-8 -left-6 w-32 h-20 rotate-6 bg-white/25 blur-2xl" />
        </div>
        <div className="relative flex items-center justify-center w-full h-full transform transition-all duration-400 ease-out group-hover:-rotate-3 group-hover:scale-110 group-hover:-translate-y-0.5">
          <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]">
            <defs>
              <linearGradient id="li-metal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e6efff" />
                <stop offset="45%" stopColor="#b4c7e3" />
                <stop offset="100%" stopColor="#6f84a8" />
              </linearGradient>
            </defs>
            <path
              fill="url(#li-metal)"
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.8)]"
            />
          </svg>
        </div>
      </div>
    </SocialLogo>
  )
}

export function GitHubLogo3D() {
  return (
    <SocialLogo href="https://github.com/MikeDegany" ariaLabel="GitHub Profile">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3f3f46] via-[#1f1f23] to-[#0c0c0f] shadow-[0_14px_35px_rgba(0,0,0,0.55)] border border-white/20" />
        <div className="absolute inset-[3px] rounded-[18px] bg-gradient-to-br from-white/12 via-white/3 to-black/35 shadow-[inset_0_1px_12px_rgba(255,255,255,0.2),inset_0_-4px_14px_rgba(0,0,0,0.45)]" />
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute -top-10 -right-8 w-32 h-20 -rotate-8 bg-white/18 blur-3xl" />
        </div>
        <div className="relative flex items-center justify-center w-full h-full transform transition-all duration-400 ease-out group-hover:rotate-2 group-hover:scale-110 group-hover:-translate-y-0.5">
          <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]">
            <defs>
              <linearGradient id="gh-metal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f5f7fb" />
                <stop offset="45%" stopColor="#cfd5df" />
                <stop offset="100%" stopColor="#8d96a7" />
              </linearGradient>
            </defs>
            <path
              fill="url(#gh-metal)"
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.75)]"
            />
          </svg>
        </div>
      </div>
    </SocialLogo>
  )
}

export function XLogo3D() {
  return (
    <SocialLogo href="https://x.com/MikeDegany" ariaLabel="X (Twitter) Profile">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#000000] shadow-[0_14px_35px_rgba(0,0,0,0.55)] border border-white/20" />
        <div className="absolute inset-[3px] rounded-[18px] bg-gradient-to-br from-white/12 via-white/4 to-black/30 shadow-[inset_0_1px_12px_rgba(255,255,255,0.2),inset_0_-4px_14px_rgba(0,0,0,0.4)]" />
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute -top-8 -left-6 w-32 h-20 rotate-12 bg-white/15 blur-3xl" />
        </div>
        <div className="relative flex items-center justify-center w-full h-full transform transition-all duration-400 ease-out group-hover:-rotate-3 group-hover:scale-110 group-hover:-translate-y-0.5">
          <svg viewBox="0 0 24 24" className="w-11 h-11 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]">
            <defs>
              <linearGradient id="x-metal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#d4d4d8" />
                <stop offset="100%" stopColor="#a1a1aa" />
              </linearGradient>
            </defs>
            <path
              fill="url(#x-metal)"
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.8)]"
            />
          </svg>
        </div>
      </div>
    </SocialLogo>
  )
}

export function EmailLogo3D() {
  return (
    <SocialLogo href="mailto:mike.degany@gmail.com" ariaLabel="Email">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ea4335] via-[#c5221f] to-[#a50e0e] shadow-[0_14px_35px_rgba(0,0,0,0.45)] border border-white/30" />
        <div className="absolute inset-[3px] rounded-[18px] bg-gradient-to-br from-white/20 via-white/8 to-black/25 shadow-[inset_0_1px_12px_rgba(255,255,255,0.3),inset_0_-4px_14px_rgba(0,0,0,0.35)]" />
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute -top-6 -right-8 w-32 h-20 -rotate-12 bg-white/25 blur-2xl" />
        </div>
        <div className="relative flex items-center justify-center w-full h-full transform transition-all duration-400 ease-out group-hover:rotate-3 group-hover:scale-110 group-hover:-translate-y-0.5">
          <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]">
            <defs>
              <linearGradient id="email-metal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#f0f0f0" />
                <stop offset="100%" stopColor="#c4c4c4" />
              </linearGradient>
            </defs>
            <path
              fill="url(#email-metal)"
              d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.9)]"
            />
          </svg>
        </div>
      </div>
    </SocialLogo>
  )
}

