import React from 'react'

/**
 * Small label above section headings (e.g. "OUR SERVICES")
 */
const SectionLabel = ({ children, light = false }) => (
  <p className={`label-text mb-3 ${light ? 'text-white/50' : 'text-primary'}`}>
    {children}
  </p>
)

export default SectionLabel
