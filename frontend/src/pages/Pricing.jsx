import React from 'react'
import { Link } from 'react-router-dom'
import { Check, MessageCircle, ArrowRight, HelpCircle } from 'lucide-react'
import PricingCard from '../components/PricingCard.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import Button from '../components/Button.jsx'
import { packages } from '../data/packages.js'
import { whatsappLink } from '../data/contact.js'

const faqs = [
  {
    q: 'Apakah konsultasi pertama gratis?',
    a: 'Ya! Konsultasi pertama sepenuhnya gratis. Kami akan mendiskusikan kebutuhan, lahan, dan ekspektasi Anda sebelum memulai proyek.',
  },
  {
    q: 'Berapa lama proses desain berlangsung?',
    a: 'Tergantung kompleksitas proyek. Untuk paket Compact biasanya 2–3 minggu, Standard 4–6 minggu, dan Premium bisa 6–12 minggu.',
  },
  {
    q: 'Apakah bisa request revisi?',
    a: 'Tentu. Setiap paket memiliki kuota revisi yang berbeda. Paket Premium memiliki revisi tidak terbatas.',
  },
  {
    q: 'Apakah Senvra menerima proyek di luar Bogor?',
    a: 'Ya, kami melayani proyek di Bogor, Jakarta, Depok, Bekasi, Tangerang, dan sekitarnya.',
  },
  {
    q: 'Apakah ada biaya tambahan selain paket?',
    a: 'Harga paket sudah termasuk semua yang tertera. Biaya tambahan hanya berlaku jika ada permintaan di luar cakupan paket.',
  },
  {
    q: 'Bagaimana cara pembayaran?',
    a: 'Kami menerima transfer bank dan dapat mendiskusikan skema pembayaran bertahap sesuai milestone proyek.',
  },
]

const FAQ = () => {
  const [open, setOpen] = React.useState(null)
  return (
    <section className="section-padding bg-white">
      <div className="container-xl">
        <div className="text-center max-w-xl mx-auto mb-14">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="heading-lg text-dark">Pertanyaan yang Sering Diajukan</h2>
          <p className="text-secondary body-md mt-3">
            Tidak menemukan jawaban yang Anda cari? Hubungi kami langsung.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-background transition-colors duration-200"
              >
                <span className="font-semibold text-dark text-sm">{faq.q}</span>
                <HelpCircle
                  size={18}
                  className={`shrink-0 transition-colors duration-200 ${open === idx ? 'text-primary' : 'text-gray'}`}
                  aria-hidden="true"
                />
              </button>
              {open === idx && (
                <div className="px-6 pb-5 text-secondary text-sm leading-relaxed border-t border-border bg-background">
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Pricing = () => {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-dark via-dark to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-10 right-10 w-80 h-80 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="container-xl relative z-10 text-center">
          <SectionLabel light>Harga</SectionLabel>
          <h1 className="heading-xl text-white mb-4">Pilih Paket Desain Anda</h1>
          <p className="body-lg text-white/70 max-w-xl mx-auto">
            Paket desain yang fleksibel dan transparan, disesuaikan dengan luas dan
            kompleksitas bangunan Anda.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {packages.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          {/* Note */}
          <div className="mt-10 p-6 bg-primary-50 border border-primary/20 rounded-2xl text-center max-w-2xl mx-auto">
            <p className="text-secondary text-sm">
              <strong className="text-dark">Catatan:</strong> Harga di atas adalah estimasi awal
              dan dapat berubah tergantung kompleksitas dan lokasi proyek. Konsultasikan kebutuhan
              Anda untuk mendapatkan estimasi yang lebih akurat.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-white">
        <div className="container-xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <SectionLabel>Perbandingan</SectionLabel>
            <h2 className="heading-lg text-dark">Apa yang Termasuk?</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[600px]" role="table">
              <thead>
                <tr className="bg-background">
                  <th scope="col" className="text-left px-6 py-4 text-sm font-semibold text-dark border-b border-border w-1/2">
                    Fitur
                  </th>
                  {packages.map((pkg) => (
                    <th
                      key={pkg.id}
                      scope="col"
                      className={`text-center px-4 py-4 text-sm font-semibold border-b border-border ${
                        pkg.popular ? 'text-primary' : 'text-dark'
                      }`}
                    >
                      {pkg.name}
                      {pkg.popular && (
                        <span className="block text-xs font-normal text-accent mt-0.5">Populer</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  'Konsep desain',
                  'Denah rumah',
                  'Tampak depan',
                  'Tampak samping',
                  '3D eksterior',
                  '3D interior',
                  'Denah lengkap semua lantai',
                  'Site visit',
                  'Revisi tidak terbatas',
                ].map((feature, i) => {
                  const compact = ['Konsep desain', 'Denah rumah', 'Tampak depan']
                  const standard = [...compact, 'Tampak samping', '3D eksterior']
                  const premium = [
                    'Konsep desain',
                    'Denah rumah',
                    'Tampak depan',
                    'Tampak samping',
                    '3D eksterior',
                    '3D interior',
                    'Denah lengkap semua lantai',
                    'Site visit',
                    'Revisi tidak terbatas',
                  ]
                  return (
                    <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-background/50'}>
                      <td className="px-6 py-4 text-sm text-secondary">{feature}</td>
                      <td className="px-4 py-4 text-center">
                        {compact.includes(feature) ? (
                          <Check size={16} className="text-primary mx-auto" aria-label="Termasuk" />
                        ) : (
                          <span className="block w-4 h-0.5 bg-border mx-auto" aria-label="Tidak termasuk" />
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {standard.includes(feature) ? (
                          <Check size={16} className="text-primary mx-auto" aria-label="Termasuk" />
                        ) : (
                          <span className="block w-4 h-0.5 bg-border mx-auto" aria-label="Tidak termasuk" />
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {premium.includes(feature) ? (
                          <Check size={16} className="text-primary mx-auto" aria-label="Termasuk" />
                        ) : (
                          <span className="block w-4 h-0.5 bg-border mx-auto" aria-label="Tidak termasuk" />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container-xl text-center">
          <h2 className="heading-lg text-white mb-4">
            Tidak Yakin Paket Mana yang Tepat?
          </h2>
          <p className="text-white/75 body-lg max-w-lg mx-auto mb-8">
            Konsultasikan kebutuhan Anda dengan tim kami. Kami akan membantu memilih paket
            yang paling sesuai dengan lahan, kebutuhan, dan budget Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button as={Link} to="/consultation" size="xl" variant="white">
              Konsultasi Gratis
            </Button>
            <a
              href={whatsappLink('Halo Senvra, saya ingin bertanya soal paket desain yang sesuai untuk proyek saya.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-all duration-200 text-base"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Pricing
