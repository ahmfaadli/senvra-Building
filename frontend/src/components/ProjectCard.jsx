import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/portfolio/${project.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label={`Lihat detail proyek ${project.name}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={project.coverImage}
          alt={`Foto proyek ${project.name}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onLoad={(e) => e.target.classList.add('loaded')}
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold rounded-full">
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-dark text-base leading-snug group-hover:text-primary transition-colors duration-200">
          {project.name}
        </h3>
        <p className="text-gray text-sm mt-1">{project.subtitle}</p>

        <div className="flex items-center gap-1.5 mt-3 text-gray text-sm">
          <MapPin size={13} className="shrink-0" />
          <span>{project.location}</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-xs font-medium text-secondary bg-background px-2.5 py-1 rounded-md">
            {project.area}
          </span>
          <span className="flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all duration-200">
            Lihat Detail
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard