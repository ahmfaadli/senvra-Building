import React, { useState } from 'react'
import { Save, Globe, Phone, Mail, MapPin, Instagram, CheckCircle } from 'lucide-react'
import Button from '../components/Button.jsx'
import { contact } from '../data/contact.js'

const inputCls = 'w-full px-4 py-2.5 rounded-lg border border-border text-sm text-dark bg-white placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

const AdminSettings = () => {
  const [form, setForm] = useState({
    siteName: 'Senvra Arsitektur Studio',
    tagline: 'Wujudkan Rumah Impian Anda Bersama Kami.',
    whatsapp: contact.whatsapp,
    email: contact.email,
    instagram: contact.instagram,
    location: contact.location,
  })
  const [saved, setSaved] = useState(false)

  const handle = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await new Promise((r) => setTimeout(r, 500))
    // In production: call API to update settings
    setSaved(true)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Settings</h1>
        <p className="text-gray text-sm mt-1">Konfigurasi umum website Senvra Arsitektur Studio.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Info */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-bold text-dark flex items-center gap-2">
            <Globe size={16} className="text-primary" />
            Informasi Website
          </h2>
          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5" htmlFor="s-siteName">Nama Studio</label>
            <input id="s-siteName" name="siteName" value={form.siteName} onChange={handle} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5" htmlFor="s-tagline">Tagline</label>
            <input id="s-tagline" name="tagline" value={form.tagline} onChange={handle} className={inputCls} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-bold text-dark flex items-center gap-2">
            <Phone size={16} className="text-primary" />
            Informasi Kontak
          </h2>
          {[
            { icon: Phone, id: 's-wa', name: 'whatsapp', label: 'Nomor WhatsApp', placeholder: '6281234567890' },
            { icon: Mail, id: 's-email', name: 'email', label: 'Email', placeholder: 'hello@senvra.id' },
            { icon: Instagram, id: 's-ig', name: 'instagram', label: 'Instagram', placeholder: '@senvra.arsitektur' },
            { icon: MapPin, id: 's-loc', name: 'location', label: 'Lokasi Studio', placeholder: 'Bogor, Jawa Barat' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-dark mb-1.5" htmlFor={field.id}>
                {field.label}
              </label>
              <div className="relative">
                <field.icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray pointer-events-none" />
                <input
                  id={field.id} name={field.name} value={form[field.name]}
                  onChange={handle} placeholder={field.placeholder}
                  className={inputCls + ' pl-10'}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="bg-primary-50 border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-secondary">
            <strong className="text-dark">Catatan:</strong> Perubahan settings saat ini bersifat demo.
            Untuk menyimpan secara permanen, hubungkan dengan backend/database.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" size="lg">
            <Save size={16} />
            Simpan Perubahan
          </Button>
          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium animate-fade-in">
              <CheckCircle size={16} />
              Tersimpan!
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default AdminSettings
