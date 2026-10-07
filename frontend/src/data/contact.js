/**
 * Centralized contact configuration.
 * Update this file to change contact details across the entire site.
 */
export const contact = {
  whatsapp: '6281234567890',
  whatsappDisplay: '+62 812-3456-7890',
  email: 'hello@senvra.id',
  instagram: '@senvra.arsitektur',
  instagramUrl: 'https://instagram.com/senvra.arsitektur',
  location: 'Bogor, Jawa Barat',
  mapsEmbed: 'https://maps.google.com/maps?q=Bogor,+Jawa+Barat&output=embed',
}

/**
 * Generate a WhatsApp link with optional pre-filled message.
 * @param {string} message
 * @returns {string}
 */
export function whatsappLink(message = 'Halo Senvra Arsitektur Studio, saya ingin berkonsultasi mengenai desain rumah.') {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${contact.whatsapp}?text=${encoded}`
}
