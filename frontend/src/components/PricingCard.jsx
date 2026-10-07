import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Star } from 'lucide-react'
import Button from './Button.jsx'

const PricingCard = ({ pkg }) => {
  const to = `/consultation?package=${pkg.id}`

  return (
    <div
      className={`relative flex flex-col rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
        pkg.popular
          ? 'border-primary bg-primary shadow-xl shadow-primary/20 text-white'
          : 'border-border bg-white hover:shadow-lg hover:border-primary/30'
      }`}
    >
      {/* Popular Badge */}
      {pkg.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent text-white text-xs font-bold rounded-full shadow-lg">
            <Star size={11} fill="currentColor" />
            Paling Banyak Dipilih
          </span>
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-6">
          <h3 className={`text-xl font-bold mb-1 ${pkg.popular ? 'text-white' : 'text-dark'}`}>
            {pkg.name}
          </h3>
          <p className={`text-sm ${pkg.popular ? 'text-white/70' : 'text-gray'}`}>
            {pkg.area}
          </p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${pkg.popular ? 'text-white/60' : 'text-gray'}`}>
            {pkg.priceNote}
          </p>
          <p className={`text-2xl font-extrabold ${pkg.popular ? 'text-white' : 'text-dark'}`}>
            {pkg.price}
          </p>
        </div>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-6 ${pkg.popular ? 'text-white/80' : 'text-secondary'}`}>
          {pkg.description}
        </p>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1" role="list">
          {pkg.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <span
                className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  pkg.popular ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary'
                }`}
                aria-hidden="true"
              >
                <Check size={12} strokeWidth={3} />
              </span>
              <span className={pkg.popular ? 'text-white/90' : 'text-secondary'}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          as={Link}
          to={to}
          size="lg"
          variant={pkg.popular ? 'white' : 'outline'}
          className="w-full"
        >
          {pkg.cta}
        </Button>
      </div>
    </div>
  )
}

export default PricingCard
