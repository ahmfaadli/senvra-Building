import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  Layers,
  RefreshCcw,
  Box,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Instagram,
  MessageCircle,
  ChevronRight,
} from 'lucide-react'
import Button from '../components/Button.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import PricingCard from '../components/PricingCard.jsx'
import TestimonialCard from '../components/TestimonialCard.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import { portfolioService, normalizeProject } from '../data/portfolioService.js'
import { packagesService } from '../data/packagesService.js'
import { testimonials } from '../data/testimonials.js'
import { contact, whatsappLink } from '../data/contact.js'

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Hero section">
    <div className="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
        alt="Rumah modern hasil desain Senvra Arsitektur Studio"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-dark/30" />
    </div>

    <div className="relative z-10 container-xl pt-20">
      <div className="max-w-2xl animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
          <span className="text-white/90 text-sm font-medium">Senvra Arsitektur Studio</span>
        </div>

        <h1 className="heading-xl text-white mb-6 leading-tight">
          Wujudkan Rumah{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100">
            Impian
          </span>{' '}
          Anda Bersama Kami.
        </h1>

        <p className="body-lg text-white/75 mb-10 max-w-xl">
          Layanan desain arsitektur untuk menciptakan rumah yang nyaman, modern, fungsional, dan sesuai kebutuhan Anda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-14">
          <Button as={Link} to="/consultation" size="xl" variant="primary">
            Konsultasi Gratis
          </Button>

          <Button as={Link} to="/portfolio" size="xl" variant="outline-white">
            Lihat Portofolio
            <ArrowRight size={18} />
          </Button>
        </div>

        <div className="flex flex-wrap gap-6">
          {['Desain Profesional', 'Konsultasi Personal', 'Sesuai Kebutuhan'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-white/80 text-sm">
              <CheckCircle size={16} className="text-blue-300 shrink-0" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce" aria-hidden="true">
      <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
        <div className="w-1.5 h-2.5 bg-white/60 rounded-full" />
      </div>
    </div>
  </section>
)

const AboutSection = () => (
  <section className="section-padding bg-white" aria-label="Tentang Senvra">
    <div className="container-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative">
          <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80"
              alt="Tim Senvra Arsitektur Studio sedang merancang desain rumah"
              loading="lazy"
              className="w-full h-full object-cover"
              onLoad={(e) => e.target.classList.add('loaded')}
            />
          </div>

          <div className="absolute -bottom-6 -right-4 md:-right-8 bg-white rounded-2xl shadow-xl border border-border p-5 min-w-[160px]">
            <p className="text-3xl font-extrabold text-primary">50+</p>
            <p className="text-sm text-gray mt-1">Proyek Selesai</p>
          </div>
        </div>

        <div>
          <SectionLabel>Tentang Senvra</SectionLabel>

          <h2 className="heading-lg text-dark mb-4">
            Merancang ruang yang sesuai dengan cara hidup Anda.
          </h2>

          <p className="text-secondary body-md mb-8">
            Senvra Arsitektur Studio membantu klien merancang rumah yang sesuai dengan kebutuhan, gaya hidup, karakter lahan, dan budget. Kami percaya bahwa setiap rumah harus mencerminkan karakter penghuninya.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: Layers,
                title: 'Desain Modern',
                desc: 'Konsep desain yang modern dan tetap fungsional.',
              },
              {
                icon: MessageSquare,
                title: 'Konsultasi Personal',
                desc: 'Setiap proyek dimulai dari memahami kebutuhan klien.',
              },
              {
                icon: CheckCircle,
                title: 'Sesuai Kebutuhan',
                desc: 'Desain menyesuaikan luas lahan, fungsi, gaya, dan budget.',
              },
              {
                icon: Box,
                title: 'Visualisasi 3D',
                desc: 'Lihat hasil desain sebelum pembangunan dimulai.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark text-sm">{item.title}</h3>
                  <p className="text-gray text-sm mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button as={Link} to="/about" size="lg" variant="outline" className="mt-8">
            Pelajari Lebih Lanjut
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  </section>
)

const services = [
  {
    icon: Layers,
    title: 'Desain Rumah',
    desc: 'Perancangan rumah baru sesuai kebutuhan dan karakter penghuni.',
    color: 'from-blue-50 to-primary-50',
    iconBg: 'bg-primary-50',
  },
  {
    icon: RefreshCcw,
    title: 'Renovasi',
    desc: 'Membantu merancang perubahan dan pengembangan rumah yang ada.',
    color: 'from-purple-50 to-blue-50',
    iconBg: 'bg-purple-50',
  },
  {
    icon: Box,
    title: '3D Visualization',
    desc: 'Visualisasi desain untuk membantu klien memahami hasil akhir.',
    color: 'from-cyan-50 to-blue-50',
    iconBg: 'bg-cyan-50',
  },
  {
    icon: MessageSquare,
    title: 'Konsultasi Arsitektur',
    desc: 'Diskusi kebutuhan, konsep, lahan, dan solusi desain terbaik.',
    color: 'from-emerald-50 to-blue-50',
    iconBg: 'bg-emerald-50',
  },
]

const ServicesSection = () => (
  <section className="section-padding bg-background" aria-label="Layanan kami">
    <div className="container-xl">
      <div className="text-center max-w-xl mx-auto mb-14">
        <SectionLabel>Layanan</SectionLabel>
        <h2 className="heading-lg text-dark">Apa yang Kami Kerjakan?</h2>
        <p className="text-secondary body-md mt-3">
          Kami menyediakan solusi desain arsitektur yang komprehensif untuk setiap kebutuhan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((svc) => (
          <div
            key={svc.title}
            className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className={`w-12 h-12 ${svc.iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
              <svc.icon size={22} className="text-primary" aria-hidden="true" />
            </div>
            <h3 className="font-bold text-dark mb-2">{svc.title}</h3>
            <p className="text-gray text-sm leading-relaxed">{svc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const extractProjects = (response) => {
  const payload = response?.data ?? response
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  return []
}

const PortfolioSection = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true)
        const response = await portfolioService.getAll()
        const data = extractProjects(response)

        const publishedProjects = data
          .filter((project) => String(project?.status || '').toLowerCase() === 'published')
          .map(normalizeProject)
          .filter(Boolean)

        setFeatured(publishedProjects.slice(0, 3))
      } catch (error) {
        console.error('LOAD HOME PORTFOLIO ERROR:', error)
        setFeatured([])
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [])

  return (
    <section className="section-padding bg-white" aria-label="Portofolio proyek">
      <div className="container-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <SectionLabel>Portofolio</SectionLabel>
            <h2 className="heading-lg text-dark">Portofolio Proyek</h2>
            <p className="text-secondary body-md mt-2 max-w-lg">
              Beberapa proyek desain yang telah kami kerjakan.
            </p>
          </div>

          <Button as={Link} to="/portfolio" size="md" variant="outline">
            Lihat Semua
            <ArrowRight size={16} />
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl overflow-hidden border border-border animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && featured.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {!loading && featured.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray text-sm">Belum ada proyek portfolio.</p>
          </div>
        )}
      </div>
    </section>
  )
}

const processSteps = [
  {
    step: '01',
    title: 'Konsultasi',
    desc: 'Memahami kebutuhan, keinginan, dan impian klien secara mendalam.',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'Konsep',
    desc: 'Menyusun konsep desain berdasarkan kebutuhan dan karakter lahan.',
    icon: Layers,
  },
  {
    step: '03',
    title: 'Pengembangan Desain',
    desc: 'Mengembangkan denah, tampak, dan visualisasi 3D yang detail.',
    icon: Box,
  },
  {
    step: '04',
    title: 'Final Design',
    desc: 'Menyiapkan hasil desain lengkap sesuai paket yang dipilih.',
    icon: CheckCircle,
  },
]

const ProcessSection = () => (
  <section className="section-padding bg-background" aria-label="Proses kerja kami">
    <div className="container-xl">
      <div className="text-center max-w-xl mx-auto mb-14">
        <SectionLabel>Proses</SectionLabel>
        <h2 className="heading-lg text-dark">Bagaimana Proses Kami?</h2>
        <p className="text-secondary body-md mt-3">
          Proses desain yang terstruktur untuk memastikan hasil terbaik sesuai kebutuhan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {processSteps.map((step, idx) => (
          <div key={step.step} className="relative">
            {idx < processSteps.length - 1 && (
              <div
                className="hidden lg:block absolute top-8 left-full w-full h-px bg-border z-0 -translate-y-0"
                style={{
                  width: 'calc(100% - 4rem)',
                  left: '4rem',
                }}
                aria-hidden="true"
              />
            )}

            <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-md transition-all duration-300 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-extrabold text-primary/10">{step.step}</span>
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <step.icon size={18} className="text-primary" aria-hidden="true" />
                </div>
              </div>

              <h3 className="font-bold text-dark mb-2">{step.title}</h3>
              <p className="text-gray text-sm leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const extractPackages = (response) => {
  const payload = response?.data ?? response
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  return []
}

const PricingSection = () => {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const response = await packagesService.getAll()
        const data = extractPackages(response)
        setPackages(data)
      } catch (error) {
        console.error('LOAD HOME PACKAGES ERROR:', error)
        setPackages([])
      }
    }

    loadPackages()
  }, [])

  return (
    <section className="section-padding bg-white" aria-label="Paket harga">
      <div className="container-xl">
        <div className="text-center max-w-xl mx-auto mb-14">
          <SectionLabel>Harga</SectionLabel>
          <h2 className="heading-lg text-dark">Pilih Paket Desain Anda</h2>
          <p className="text-secondary body-md mt-3">
            Paket desain yang fleksibel sesuai kebutuhan dan luas bangunan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {packages.map((pkg) => (
            <PricingCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialsSection = () => (
  <section className="section-padding bg-background" aria-label="Testimoni klien">
    <div className="container-xl">
      <div className="text-center max-w-xl mx-auto mb-14">
        <SectionLabel>Testimoni</SectionLabel>
        <h2 className="heading-lg text-dark">Dipercaya Oleh Klien Kami</h2>
        <p className="text-secondary body-md mt-3">
          Apa yang klien kami katakan tentang pengalaman bekerja bersama Senvra.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.slice(0, 3).map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-border">
        {[
          { value: '50+', label: 'Proyek Selesai' },
          { value: '95%', label: 'Kepuasan Klien' },
          { value: '5+', label: 'Tahun Pengalaman' },
          { value: '4', label: 'Kota Terlayani' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
            <p className="text-gray text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const CtaSection = () => (
  <section className="py-20 bg-primary" aria-label="Call to action">
    <div className="container-xl text-center">
      <SectionLabel light>Mulai Sekarang</SectionLabel>
      <h2 className="heading-lg text-white mb-4">Punya Rencana Membangun Rumah?</h2>
      <p className="text-white/75 body-lg max-w-xl mx-auto mb-10">
        Konsultasikan kebutuhan desain rumah Anda bersama Senvra Arsitektur Studio. Konsultasi pertama gratis!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button as={Link} to="/consultation" size="xl" variant="white">
          Konsultasi Gratis
        </Button>

        <Button as={Link} to="/portfolio" size="xl" variant="outline-white">
          Lihat Portofolio
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  </section>
)

const ContactSection = () => (
  <section className="section-padding bg-white" aria-label="Informasi kontak">
    <div className="container-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionLabel>Kontak</SectionLabel>
          <h2 className="heading-lg text-dark mb-4">Hubungi Kami</h2>
          <p className="text-secondary body-md mb-8">
            Siap membantu Anda mewujudkan rumah impian. Hubungi kami melalui WhatsApp atau email untuk informasi lebih lanjut.
          </p>

          <ul className="space-y-5">
            {[
              {
                icon: Phone,
                label: 'WhatsApp',
                value: contact.whatsappDisplay,
                href: whatsappLink(),
              },
              {
                icon: Mail,
                label: 'Email',
                value: contact.email,
                href: `mailto:${contact.email}`,
              },
              {
                icon: Instagram,
                label: 'Instagram',
                value: contact.instagram,
                href: contact.instagramUrl,
              },
              {
                icon: MapPin,
                label: 'Studio',
                value: contact.location,
                href: null,
              },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-gray font-medium uppercase tracking-wide">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
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

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Chat WhatsApp
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden border border-border aspect-video bg-background flex items-center justify-center">
          <div className="text-center text-gray p-8">
            <MapPin size={40} className="mx-auto mb-3 text-gray/50" aria-hidden="true" />
            <p className="font-medium text-dark">Senvra Arsitektur Studio</p>
            <p className="text-sm mt-1">{contact.location}</p>
            <a
              href={`https://maps.google.com/maps?q=${encodeURIComponent('Bogor, Jawa Barat')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-primary text-sm font-medium hover:underline"
            >
              Buka di Google Maps
              <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const Home = () => (
  <main>
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <PortfolioSection />
    <ProcessSection />
    <PricingSection />
    <TestimonialsSection />
    <CtaSection />
    <ContactSection />
  </main>
)

export default Home