"use client"

import Image from "next/image"
import { EmailLogo3D, LinkedInLogo3D, GitHubLogo3D, XLogo3D } from "./social-logos"

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-2">CONTACT</h2>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto" />
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Map Image */}
          <div className="relative h-64 sm:h-80 md:h-96 mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="/map1.png" 
              alt="Map location" 
              fill 
              className="object-cover" 
              priority
            />
          </div>

          {/* 3D Social Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto place-items-center">
            <EmailLogo3D />
            <LinkedInLogo3D />
            <GitHubLogo3D />
            <XLogo3D />
          </div>
        </div>
      </div>
    </section>
  )
}
