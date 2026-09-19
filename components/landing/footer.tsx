'use client'

import Link from 'next/link'
import { PawPrint } from '../paw-print'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1A1A1A] py-12 text-white">
      <div className="absolute bottom-0 left-0 right-0 flex h-20 items-center justify-around opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <PawPrint key={i} size={30} color="#FF9A76" opacity={0.3} delay={i * 200} bounce />
        ))}
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-8 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-[#FF9A76]">Levart</h3>
            <p className="text-sm text-gray-400">
              Chat with AI, refine your itinerary, confirm when it feels right, and share the beautiful plan.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-[#7ECCC4]">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/plan" className="hover:text-[#FF9A76]">
                  Plan a trip
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#FF9A76]">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-[#FF9A76]">
                  My trips
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-[#7ECCC4]">Account</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/login" className="hover:text-[#FF9A76]">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#FF9A76]">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} Levart. Made with a warm paw print.
        </div>
      </div>
    </footer>
  )
}
