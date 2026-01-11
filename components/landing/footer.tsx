'use client'

import { PawPrint } from '../paw-print'

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-12 relative overflow-hidden">
      {/* Paw prints walking along bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 flex items-center justify-around opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <PawPrint
            key={i}
            size={30}
            color="#FF9A76"
            opacity={0.3}
            delay={i * 200}
            bounce
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#FF9A76]">Levart</h3>
            <p className="text-gray-400 text-sm">
              Your friendly AI travel companion for planning perfect adventures.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#7ECCC4]">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#FF9A76] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-[#FF9A76] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#FF9A76] transition-colors">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#7ECCC4]">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#FF9A76] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#FF9A76] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#FF9A76] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#7ECCC4]">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#FF9A76] transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-[#FF9A76] transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-[#FF9A76] transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Levart. Made with{' '}
            <span className="text-[#FF9A76]">💝</span> and{' '}
            <span className="inline-block animate-bounce">🐾</span>
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#FF9A76] transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-[#FF9A76] transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-[#FF9A76] transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
