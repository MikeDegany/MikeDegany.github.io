"use client"

import Link from "next/link"
import { contactByKind, CONTACT_ICON_PATHS } from "@/data/contact"

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
    <SocialLogo href={contactByKind.linkedin.href} ariaLabel={contactByKind.linkedin.ariaLabel}>
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
              d={CONTACT_ICON_PATHS.linkedin}
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
    <SocialLogo href={contactByKind.github.href} ariaLabel={contactByKind.github.ariaLabel}>
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
              d={CONTACT_ICON_PATHS.github}
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
    <SocialLogo href={contactByKind.x.href} ariaLabel={contactByKind.x.ariaLabel}>
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
              d={CONTACT_ICON_PATHS.x}
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
    <SocialLogo href={contactByKind.email.href} ariaLabel={contactByKind.email.ariaLabel}>
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
              d={CONTACT_ICON_PATHS.email}
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.9)]"
            />
          </svg>
        </div>
      </div>
    </SocialLogo>
  )
}

