import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react'
import SectionLabel from '../components/SectionLabel.jsx'
import Button from '../components/Button.jsx'
import { contact, whatsappLink } from '../data/contact.js'

const contactItems = [
  {
    icon: Phone,
    label: 'WhatsApp',
    value: null, // will use contact.whatsappDisplay
    href: null,  // will use whatsappLink()
    key: 'whatsapp',
  },
  {
    icon: Mail,
    label: 'Email',
    key: 'email',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    key: 'instagram',
  },
  {
    icon: MapPin,
    label: 'Studio',
    key: 'location',
  },
]

const validateContact = (f) => {
  const e = {}
  if (!f.name.trim()) e.name = 'Nama wajib diisi.'
  if (!f.email.trim()) e.email = 'Email wajib diisi.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Format email tidak valid.'
  if (!f.message.trim()) e.message = 'Pesan wajib diisi.'
  return e
}

const inputCls = (err) =>
  `w-full px-4 py-3 rounded-lg border text-sm text-dark placeholder:text-gray bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
    err ? 'border-accent' : 'border-border hover:border-secondary/50'
  }`

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateContact(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-dark via-dark to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-10 right-10 w-80 h-80 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="container-xl relative z-10 text-center">
          <SectionLabel light>Kontak</SectionLabel>
          <h1 className="heading-xl text-white mb-4">Hubungi Kami</h1>
          <p className="body-lg text-white/70 max-w-xl mx-auto">
            Kami siap membantu Anda. Pilih cara yang paling nyaman untuk menghubungi tim Senvra.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <SectionLabel>Informasi</SectionLabel>
              <h2 className="heading-md text-dark mb-6">Cara Menghubungi Kami</h2>

              <ul className="space-y-5 mb-8">
                {[
                  { icon: Phone, label: 'WhatsApp', value: contact.whatsappDisplay, href: whatsappLink() },
                  { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
                  { icon: Instagram, label: 'Instagram', value: contact.instagram, href: contact.instagramUrl, external: true },
                  { icon: MapPin, label: 'Studio', value: contact.location, href: null },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={18} className="text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray mb-1">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.external ? '_blank' : undefined}
                          rel={item.external ? 'noopener noreferrer' : undefined}
                          className="text-dark font-medium hover:text-primary transition-colors text-sm"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-dark font-medium text-sm">{item.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* WhatsApp CTA */}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-sm"
                aria-label="Chat langsung via WhatsApp"
              >
                <MessageCircle size={20} aria-hidden="true" />
                Chat WhatsApp Sekarang
              </a>

              {/* Map */}
              <div className="mt-10 rounded-2xl overflow-hidden border border-border aspect-video bg-white flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin size={40} className="mx-auto mb-3 text-gray/40" aria-hidden="true" />
                  <p className="font-semibold text-dark">Senvra Arsitektur Studio</p>
                  <p className="text-gray text-sm mt-1">{contact.location}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent('Bogor, Jawa Barat')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-primary text-sm font-medium hover:underline"
                  >
                    Buka di Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <SectionLabel>Pesan</SectionLabel>
              <h2 className="heading-md text-dark mb-6">Kirim Pesan</h2>

              {sent ? (
                <div className="bg-white rounded-2xl border border-border p-8 text-center animate-fade-in">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-green-500" />
                  </div>
                  <h3 className="heading-sm text-dark mb-2">Pesan Terkirim!</h3>
                  <p className="text-secondary text-sm max-w-sm mx-auto">
                    Terima kasih telah menghubungi kami. Tim Senvra akan merespons pesan Anda
                    dalam 1×24 jam kerja.
                  </p>
                  <Button
                    as={Link}
                    to="/consultation"
                    size="md"
                    variant="primary"
                    className="mt-6"
                  >
                    Atau Mulai Konsultasi
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="bg-white rounded-2xl border border-border p-6 md:p-8 space-y-5"
                  aria-label="Form kontak"
                >
                  {/* Name */}
                  <div>
                    <label htmlFor="c-name" className="block text-sm font-semibold text-dark mb-1.5">
                      Nama Lengkap <span className="text-accent" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="c-name" type="text" name="name"
                      value={form.name} onChange={handleChange}
                      placeholder="Nama Anda"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      className={inputCls(errors.name)}
                    />
                    {errors.name && (
                      <p role="alert" className="flex items-center gap-1 mt-1.5 text-xs text-accent">
                        <AlertCircle size={12} />{errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="c-email" className="block text-sm font-semibold text-dark mb-1.5">
                      Email <span className="text-accent" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="c-email" type="email" name="email"
                      value={form.email} onChange={handleChange}
                      placeholder="email@contoh.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      className={inputCls(errors.email)}
                    />
                    {errors.email && (
                      <p role="alert" className="flex items-center gap-1 mt-1.5 text-xs text-accent">
                        <AlertCircle size={12} />{errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="c-subject" className="block text-sm font-semibold text-dark mb-1.5">
                      Subjek
                    </label>
                    <input
                      id="c-subject" type="text" name="subject"
                      value={form.subject} onChange={handleChange}
                      placeholder="Perihal pesan Anda"
                      className={inputCls(false)}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="c-message" className="block text-sm font-semibold text-dark mb-1.5">
                      Pesan <span className="text-accent" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="c-message" name="message" rows={5}
                      value={form.message} onChange={handleChange}
                      placeholder="Tuliskan pesan atau pertanyaan Anda..."
                      aria-invalid={!!errors.message}
                      className={inputCls(errors.message) + ' resize-none'}
                    />
                    {errors.message && (
                      <p role="alert" className="flex items-center gap-1 mt-1.5 text-xs text-accent">
                        <AlertCircle size={12} />{errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    variant="primary"
                    loading={loading}
                    className="w-full"
                  >
                    <Send size={16} aria-hidden="true" />
                    Kirim Pesan
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container-xl text-center">
          <h2 className="heading-lg text-white mb-4">Lebih Cepat? Konsultasi Langsung</h2>
          <p className="text-white/75 body-lg max-w-lg mx-auto mb-8">
            Mulai konsultasi gratis sekarang dan wujudkan rumah impian Anda bersama Senvra.
          </p>
          <Button as={Link} to="/consultation" size="xl" variant="white">
            Konsultasi Gratis Sekarang
          </Button>
        </div>
      </section>
    </main>
  )
}

export default Contact