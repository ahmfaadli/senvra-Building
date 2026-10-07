import React from 'react'
import { CheckCircle, MessageSquare, Clock, Shield } from 'lucide-react'
import ConsultationForm from '../components/ConsultationForm.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import { packages } from '../data/packages.js'

const benefits = [
  {
    icon: MessageSquare,
    title: 'Gratis & Tanpa Komitmen',
    desc: 'Konsultasi pertama sepenuhnya gratis. Tidak ada kewajiban untuk melanjutkan.',
  },
  {
    icon: Clock,
    title: 'Respons Cepat',
    desc: 'Tim kami akan menghubungi Anda dalam 1×24 jam setelah form dikirim.',
  },
  {
    icon: Shield,
    title: 'Data Anda Aman',
    desc: 'Data yang Anda berikan hanya digunakan untuk keperluan konsultasi.',
  },
  {
    icon: CheckCircle,
    title: 'Konsultasi Personal',
    desc: 'Setiap klien mendapatkan perhatian penuh dari arsitek berpengalaman.',
  },
]

const Consultation = () => {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-dark via-dark to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-10 right-10 w-80 h-80 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-60 h-60 bg-blue-400 rounded-full blur-3xl" />
        </div>

        <div className="container-xl relative z-10">
          <div className="max-w-2xl">
            <SectionLabel light>Konsultasi</SectionLabel>

            <h1 className="heading-xl text-white mb-4">
              Mulai Konsultasi
            </h1>

            <p className="body-lg text-white/70">
              Ceritakan kebutuhan desain rumah Anda. Tim arsitek kami siap membantu mewujudkan
              rumah impian Anda dengan konsep yang tepat.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Form */}
            <div className="lg:col-span-2">
              <ConsultationForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Benefits */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h3 className="font-bold text-dark mb-5">
                  Kenapa Konsultasi dengan Kami?
                </h3>

                <ul className="space-y-5">
                  {benefits.map((b) => (
                    <li key={b.title} className="flex gap-4">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <b.icon
                          size={16}
                          className="text-primary"
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-dark text-sm">
                          {b.title}
                        </p>

                        <p className="text-gray text-sm mt-0.5 leading-relaxed">
                          {b.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Package Summary */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h3 className="font-bold text-dark mb-4">
                  Ringkasan Paket
                </h3>

                <ul className="space-y-3">
                  {packages.map((pkg) => (
                    <li
                      key={pkg.id}
                      className="flex items-start gap-3 py-3 border-b border-border last:border-0"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          pkg.popular ? 'bg-primary' : 'bg-border'
                        }`}
                        aria-hidden="true"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-dark text-sm">
                            {pkg.name}
                          </p>

                          {pkg.popular && (
                            <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-bold rounded-full">
                              Populer
                            </span>
                          )}
                        </div>

                        <p className="text-gray text-xs mt-0.5">
                          {pkg.area}
                        </p>

                        <p className="text-primary font-bold text-sm mt-1">
                          {pkg.price}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Process Note */}
              <div className="bg-primary-50 rounded-2xl border border-primary/20 p-5">
                <h4 className="font-bold text-dark text-sm mb-3">
                  Setelah Submit Form:
                </h4>

                <ol className="space-y-2">
                  {[
                    'Tim kami menerima data konsultasi',
                    'Kami menghubungi Anda dalam 1×24 jam',
                    'Jadwal konsultasi gratis ditetapkan',
                    'Proses desain dimulai',
                  ].map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-secondary"
                    >
                      <span className="w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>

                      {step}
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Consultation