import React from 'react'
import { Star } from 'lucide-react'

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      {/* Stars */}
      <div className="flex items-center gap-1" aria-label={`Rating ${testimonial.rating} dari 5`}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={14} fill="#175CD3" className="text-primary" aria-hidden="true" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-secondary text-sm leading-relaxed flex-1">
        "{testimonial.text}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div
          className="w-10 h-10 rounded-full bg-primary-50 text-primary font-bold text-sm flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-dark">{testimonial.name}</p>
          <p className="text-xs text-gray">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
