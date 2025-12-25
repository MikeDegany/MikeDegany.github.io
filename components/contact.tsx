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
          {/* Map Image with Fade Effect */}
          <div className="relative mb-12">
            <div className="relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/map.png" 
                alt="Map location" 
                fill 
                className="object-cover object-left md:object-center" 
                priority
              />
              {/* Fade gradient overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top fade */}
                <div className="absolute top-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-b from-gray-50 dark:from-background to-transparent" />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-gray-50 dark:from-background to-transparent" />
                {/* Left fade */}
                <div className="absolute top-0 bottom-0 left-0 w-12 md:w-20 bg-gradient-to-r from-gray-50 dark:from-background to-transparent" />
                {/* Right fade */}
                <div className="absolute top-0 bottom-0 right-0 w-12 md:w-20 bg-gradient-to-l from-gray-50 dark:from-background to-transparent" />
              </div>
            </div>
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
