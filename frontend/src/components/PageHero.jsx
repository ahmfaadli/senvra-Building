import React from 'react'

/**
 * Reusable interior page hero banner.
 */
const PageHero = ({ title, subtitle, breadcrumb }) => (
  <section className="bg-gradient-to-br from-dark to-primary-dark pt-32 pb-16 text-white">
    <div className="container-xl">
      {breadcrumb && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-sm text-white/50">
            {breadcrumb.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <li aria-hidden="true">/</li>}
                <li className={idx === breadcrumb.length - 1 ? 'text-white font-medium' : ''}>
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-white transition-colors">
                      {crumb.label}
                    </a>
                  ) : (
                    crumb.label
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="heading-lg text-white">{title}</h1>
      {subtitle && (
        <p className="text-white/70 body-lg mt-3 max-w-2xl">{subtitle}</p>
      )}
    </div>
  </section>
)

export default PageHero
