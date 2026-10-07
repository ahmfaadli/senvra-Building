import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'
import { contact, whatsappLink } from '../data/contact.js'

const footerLinks = [
  { to: '/about', label: 'Tentang Kami' },
  { to: '/portfolio', label: 'Portofolio' },
  { to: '/pricing', label: 'Paket' },
  { to: '/contact', label: 'Kontak' },
  { to: '/consultation', label: 'Konsultasi Gratis' },
]

const Footer = () => {
  return (
    <footer className="bg-dark text-white" role="contentinfo">
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex flex-col leading-none mb-4" aria-label="Senvra Arsitektur Studio">
              <span className="text-2xl font-extrabold tracking-tight text-white">Senvra</span>
              <span className="text-xs font-medium tracking-widest uppercase text-white/50">
                Arsitektur Studio
              </span>
            </Link>
            <p className="text-white/60 body-md max-w-xs leading-relaxed mt-3">
              Desain rumah yang dirancang sesuai kebutuhan, gaya, dan impian Anda.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Senvra Arsitektur Studio"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all duration-200"
              >
                <Instagram size={18} />
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Senvra Arsitektur Studio"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all duration-200"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={`mailto:${contact.email}`}
                aria-label={`Email ${contact.email}`}
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all duration-200"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Navigasi
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Phone size={15} className="mt-0.5 shrink-0 text-white/30" />
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {contact.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Mail size={15} className="mt-0.5 shrink-0 text-white/30" />
                <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Instagram size={15} className="mt-0.5 shrink-0 text-white/30" />
                <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {contact.instagram}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin size={15} className="mt-0.5 shrink-0 text-white/30" />
                <span>{contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2026 Senvra Arsitektur Studio. All Rights Reserved.
          </p>
          <p className="text-white/30 text-xs">
            Desain Arsitektur Profesional untuk Rumah Impian Anda
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
