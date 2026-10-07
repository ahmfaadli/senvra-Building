import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Target, Eye, Heart, Users, Award, Clock, MapPin } from 'lucide-react'
import Button from '../components/Button.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import TestimonialCard from '../components/TestimonialCard.jsx'
import { testimonials } from '../data/testimonials.js'

const team = [
  {
    name: 'Arief Senvra',
    role: 'Principal Architect',
    avatar: 'AS',
    bio: 'Arsitek senior dengan pengalaman 10+ tahun dalam desain hunian residensial dan komersial.',
  },
  {
    name: 'Nadia Rahmawati',
    role: 'Interior Designer',
    avatar: 'NR',
    bio: 'Spesialis desain interior dengan fokus pada ruang yang fungsional dan estetis.',
  },
  {
    name: 'Bagas Wicaksono',
    role: '3D Visualizer',
    avatar: 'BW',
    bio: 'Ahli visualisasi 3D yang membantu klien memahami desain sebelum pembangunan dimulai.',
  },
  {
    name: 'Sinta Maharani',
    role: 'Project Manager',
    avatar: 'SM',
    bio: 'Memastikan setiap proyek berjalan tepat waktu dan sesuai dengan ekspektasi klien.',
  },
]

const values = [
  {
    icon: Target,
    title: 'Fokus pada Klien',
    desc: 'Setiap keputusan desain dimulai dari memahami kebutuhan dan keinginan klien secara mendalam.',
  },
  {
    icon: Eye,
    title: 'Perhatian terhadap Detail',
    desc: 'Kami percaya bahwa detail kecil membuat perbedaan besar dalam kualitas akhir desain.',
  },
  {
    icon: Heart,
    title: 'Desain yang Bermakna',
    desc: 'Setiap rumah harus mencerminkan kepribadian, gaya hidup, dan impian penghuninya.',
  },
  {
    icon: Users,
    title: 'Kolaborasi',
    desc: 'Proses desain adalah kolaborasi antara arsitek dan klien untuk hasil terbaik.',
  },
]

const stats = [
  { icon: Award, value: '50+', label: 'Proyek Selesai' },
  { icon: Users, value: '45+', label: 'Klien Puas' },
  { icon: Clock, value: '5+', label: 'Tahun Pengalaman' },
  { icon: MapPin, value: '4', label: 'Kota Terlayani' },
]

const About = () => {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-dark via-dark to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="container-xl relative z-10">
          <div className="max-w-3xl">
            <SectionLabel light>Tentang Kami</SectionLabel>
            <h1 className="heading-xl text-white mb-6">
              Studio Arsitektur yang Mengutamakan Kebutuhan Anda.
            </h1>
            <p className="body-lg text-white/70 max-w-2xl">
              Senvra Arsitektur Studio adalah studio desain yang berfokus pada hunian
              residensial. Kami percaya setiap rumah harus dirancang sesuai dengan cara
              hidup penghuninya.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80"
                  alt="Tim Senvra Arsitektur Studio di studio kerja"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onLoad={(e) => e.target.classList.add('loaded')}
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 bg-primary rounded-2xl shadow-xl p-5 text-white">
                <p className="text-3xl font-extrabold">5+</p>
                <p className="text-sm text-white/80 mt-0.5">Tahun Pengalaman</p>
              </div>
            </div>

            <div>
              <SectionLabel>Cerita Kami</SectionLabel>
              <h2 className="heading-lg text-dark mb-5">
                Merancang ruang yang sesuai dengan cara hidup Anda.
              </h2>
              <div className="space-y-4 text-secondary body-md">
                <p>
                  Senvra Arsitektur Studio didirikan dengan satu tujuan sederhana: membantu
                  setiap klien membangun rumah yang benar-benar mencerminkan dirinya. Bukan
                  sekadar mengikuti tren, tetapi menciptakan ruang yang bermakna.
                </p>
                <p>
                  Kami membantu klien merancang rumah yang sesuai dengan kebutuhan, gaya
                  hidup, karakter lahan, dan budget. Setiap proyek adalah perjalanan bersama
                  antara arsitek dan klien menuju hasil yang memuaskan.
                </p>
                <p>
                  Dengan pengalaman lebih dari 5 tahun dan 50+ proyek yang telah diselesaikan,
                  kami terus berkembang dan berkomitmen untuk menghadirkan desain terbaik.
                </p>
              </div>
              <Button as={Link} to="/consultation" size="lg" variant="primary" className="mt-8">
                Mulai Konsultasi
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary" aria-label="Statistik studio">
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={20} className="text-white" aria-hidden="true" />
                </div>
                <p className="text-4xl font-extrabold text-white">{stat.value}</p>
                <p className="text-white/70 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="text-center max-w-xl mx-auto mb-14">
            <SectionLabel>Nilai Kami</SectionLabel>
            <h2 className="heading-lg text-dark">Prinsip yang Kami Pegang</h2>
            <p className="text-secondary body-md mt-3">
              Nilai-nilai ini menjadi landasan dalam setiap proyek yang kami kerjakan.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => (
              <div
                key={val.title}
                className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <val.icon size={22} className="text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-dark mb-2">{val.title}</h3>
                <p className="text-gray text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white">
        <div className="container-xl">
          <div className="text-center max-w-xl mx-auto mb-14">
            <SectionLabel>Tim Kami</SectionLabel>
            <h2 className="heading-lg text-dark">Orang-orang di Balik Senvra</h2>
            <p className="text-secondary body-md mt-3">
              Tim profesional yang berdedikasi untuk mewujudkan impian Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-all duration-300 text-center"
              >
                <div
                  className="w-20 h-20 rounded-full bg-primary-50 text-primary font-extrabold text-xl flex items-center justify-center mx-auto mb-4"
                  aria-hidden="true"
                >
                  {member.avatar}
                </div>
                <h3 className="font-bold text-dark">{member.name}</h3>
                <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
                <p className="text-gray text-sm mt-3 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="text-center max-w-xl mx-auto mb-14">
            <SectionLabel>Testimoni</SectionLabel>
            <h2 className="heading-lg text-dark">Kata Klien Kami</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container-xl text-center">
          <h2 className="heading-lg text-white mb-4">
            Siap Mulai Proyek Bersama Kami?
          </h2>
          <p className="text-white/75 body-lg max-w-lg mx-auto mb-8">
            Hubungi kami untuk konsultasi gratis dan mulai perjalanan menuju rumah impian Anda.
          </p>
          <Button as={Link} to="/consultation" size="xl" variant="white">
            Konsultasi Gratis
          </Button>
        </div>
      </section>
    </main>
  )
}

export default About
