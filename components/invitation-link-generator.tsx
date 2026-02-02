"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

/**
 * Componente para generar URLs de invitación personalizadas
 * Para usar en un panel administrativo o página de configuración
 * 
 * Uso: ?n=NombreInvitado&c=5
 * n: Nombre del invitado/familia
 * c: Cupos máximos (1-9)
 */
export function InvitationLinkGenerator() {
  const [guestName, setGuestName] = useState('')
  const [maxSeats, setMaxSeats] = useState(5)
  const [copied, setCopied] = useState(false)

  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}`
    : ''

  const generatedUrl = `${baseUrl}?n=${encodeURIComponent(guestName)}&c=${maxSeats}`

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerateWhatsApp = () => {
    const message = `¡Hola ${guestName}! 👑\n\nEs un honor invitarles a celebrar los *15 años de Eury*. Queremos que formen parte de nuestra Corte Real en este día tan especial.\n\nReservamos *${maxSeats}* lugares para ustedes. Por favor, confirmen cuántos asistirán y sus nombres en el siguiente enlace:\n\n${generatedUrl}`
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="bg-gradient-to-b from-gold-500/10 to-gold-500/5 rounded-3xl border border-gold-500/20 p-8 max-w-2xl mx-auto">
      <h3 className="text-2xl font-decorative text-gold-500 mb-6">
        Generador de Invitaciones
      </h3>

      {/* Guest Name Input */}
      <div className="mb-6">
        <label className="block text-gold-400 mb-2 text-sm uppercase tracking-widest">
          Nombre del Invitado/Familia
        </label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Ej: Familia Rivera"
          className="w-full px-4 py-3 bg-gold-500/10 border border-gold-500/30 rounded-lg text-white placeholder-gold-500/30 focus:outline-none focus:border-gold-500/60 focus:bg-gold-500/15 transition-all duration-300"
        />
      </div>

      {/* Max Seats Select */}
      <div className="mb-8">
        <label className="block text-gold-400 mb-2 text-sm uppercase tracking-widest">
          Boletos Reservados (1-9)
        </label>
        <select
          value={maxSeats}
          onChange={(e) => setMaxSeats(parseInt(e.target.value))}
          className="w-full px-4 py-3 bg-gold-500/10 border border-gold-500/30 rounded-lg text-white focus:outline-none focus:border-gold-500/60 focus:bg-gold-500/15 transition-all duration-300"
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num} className="bg-slate-900 text-white">
              {num} {num === 1 ? 'Boleto' : 'Boletos'}
            </option>
          ))}
        </select>
      </div>

      {/* Generated URL Display */}
      {guestName && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gold-500/5 border border-gold-500/30 rounded-lg"
        >
          <p className="text-xs text-gold-400 mb-2 uppercase tracking-widest">URL Generada:</p>
          <div className="flex items-center justify-between gap-2 bg-gold-500/10 p-3 rounded border border-gold-500/20">
            <code className="text-xs text-gold-300 break-all font-mono overflow-hidden">
              {generatedUrl}
            </code>
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 p-2 hover:bg-gold-500/20 rounded transition-colors"
              title="Copiar URL"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gold-400" />
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <motion.button
          onClick={handleCopy}
          disabled={!guestName}
          whileHover={{ scale: guestName ? 1.02 : 1 }}
          whileTap={{ scale: guestName ? 0.98 : 1 }}
          className="flex-1 py-3 px-4 bg-gold-500 text-black rounded-lg font-semibold uppercase text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-400 transition-colors"
        >
          {copied ? '✓ Copiado' : 'Copiar Link'}
        </motion.button>
        
        <motion.button
          onClick={handleGenerateWhatsApp}
          disabled={!guestName}
          whileHover={{ scale: guestName ? 1.02 : 1 }}
          whileTap={{ scale: guestName ? 0.98 : 1 }}
          className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-semibold uppercase text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
        >
          Enviar por WhatsApp
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="mt-8 pt-8 border-t border-gold-500/20">
        <p className="text-xs text-gold-400/70 mb-3 uppercase tracking-widest">Instrucciones de uso:</p>
        <ul className="text-sm text-gold-400/60 space-y-2 list-disc list-inside">
          <li>Ingresa el nombre del invitado o familia</li>
          <li>Selecciona la cantidad de boletos reservados</li>
          <li>Copia el link o envía por WhatsApp</li>
          <li>El invitado accesará y podrá confirmar sus asistentes</li>
        </ul>
      </div>
    </div>
  )
}
