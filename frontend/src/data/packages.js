/**
 * Pricing packages data.
 * Single source of truth for all package information.
 * Update here to reflect changes across the site.
 */
export const packages = [
  {
    id: 'compact',
    name: 'Compact',
    price: 'Rp 8.000.000',
    priceNote: 'mulai dari',
    area: 'Untuk rumah di bawah 100 m²',
    description: 'Paket desain rumah compact yang mencakup kebutuhan dasar arsitektur untuk hunian sederhana.',
    features: [
      'Konsep desain',
      'Denah rumah',
      'Tampak depan',
      'Konsultasi 2x pertemuan',
      'Revisi 1x',
    ],
    popular: false,
    cta: 'Pilih Paket & Konsultasi',
    ctaVariant: 'outline',
    status: 'active',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 'Rp 18.000.000',
    priceNote: 'mulai dari',
    area: 'Untuk rumah 100–250 m²',
    description: 'Paket terlengkap untuk hunian menengah. Mencakup visualisasi 3D dan tampak bangunan lebih lengkap.',
    features: [
      'Konsep desain',
      'Denah rumah',
      'Tampak depan & samping',
      '3D eksterior',
      'Konsultasi 4x pertemuan',
      'Revisi 2x',
    ],
    popular: true,
    cta: 'Pilih Paket & Konsultasi',
    ctaVariant: 'primary',
    status: 'active',
  },
  {
    id: 'premium',
    name: 'Premium / Custom',
    price: 'Hubungi Kami',
    priceNote: 'harga custom',
    area: 'Untuk rumah di atas 250 m²',
    description: 'Paket custom lengkap untuk proyek besar. Layanan personal dan komprehensif dari awal hingga akhir.',
    features: [
      'Custom design',
      'Denah lengkap semua lantai',
      'Tampak bangunan lengkap',
      '3D eksterior & interior',
      'Konsultasi tidak terbatas',
      'Revisi tidak terbatas',
      'Site visit',
    ],
    popular: false,
    cta: 'Konsultasi Custom',
    ctaVariant: 'outline',
    status: 'active',
  },
]

export function getPackageById(id) {
  return packages.find((p) => p.id === id) || null
}

export function getActivePackages() {
  return packages.filter((p) => p.status === 'active')
}
