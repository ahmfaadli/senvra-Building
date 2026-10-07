import React from 'react'

/**
 * Reusable Button component with multiple variants and sizes.
 * @param {'primary'|'outline'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  as: Tag = 'button',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:outline-primary shadow-sm',
    outline:
      'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white active:bg-primary-600 focus-visible:outline-primary',
    ghost:
      'text-primary bg-transparent hover:bg-primary-50 active:bg-primary-100 focus-visible:outline-primary',
    white:
      'bg-white text-primary hover:bg-gray-50 active:bg-gray-100 shadow-sm focus-visible:outline-white',
    'outline-white':
      'border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary active:bg-gray-100 focus-visible:outline-white',
    danger:
      'bg-accent text-white hover:bg-red-700 active:bg-red-800 focus-visible:outline-accent shadow-sm',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
  }

  return (
    <Tag
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </Tag>
  )
}

export default Button
