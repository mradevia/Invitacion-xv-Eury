"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect, useMemo } from "react"
import { Crown, MessageCircle, Sparkles, Users, Check } from "lucide-react"
import { AnimatedButton } from "../animated-button"
import { TiltCard } from "../tilt-card"
import { useInvitationParams } from "@/hooks/use-invitation-params"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { usePerformanceMode } from "@/hooks/use-performance-mode"


export function RSVPSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isHovered, setIsHovered] = useState(false)

  // Performance optimization
  const performance = usePerformanceMode()
  const { ref: sparklesRef, isIntersecting } = useIntersectionObserver({
    freezeOnceVisible: false,
    rootMargin: "150px",
  })

  // Parámetros de URL
  const { guestName, maxSeats, isLoaded } = useInvitationParams()

  // Estado de selección de asientos
  const [selectedSeats, setSelectedSeats] = useState<number>(1)
  const [attendeeNames, setAttendeeNames] = useState<string[]>(Array(1).fill(''))
  const [validationError, setValidationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])

  // Memoizar posiciones de sparkles para evitar recalcular en cada render
  const sparklePositions = useMemo(() => {
    return Array.from({ length: performance.particleCount }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 2,
    }))
  }, [performance.particleCount])

  // Actualizar nombres cuando cambia la selección de asientos
  useEffect(() => {
    setAttendeeNames(prev => {
      const newNames = [...prev]
      // Agregar nombres si es necesario
      while (newNames.length < selectedSeats) {
        newNames.push('')
      }
      // Remover nombres si no son necesarios
      return newNames.slice(0, selectedSeats)
    })
    setValidationError('')
  }, [selectedSeats])

  // Manejar cambio de nombre en los inputs
  const handleNameChange = (index: number, value: string) => {
    const newNames = [...attendeeNames]
    newNames[index] = value
    setAttendeeNames(newNames)
  }

  // Validar y enviar confirmación
  const handleConfirm = () => {
    // Validar que todos los nombres estén llenos
    const hasEmptyNames = attendeeNames.some(name => !name.trim())
    if (hasEmptyNames) {
      setValidationError('Por favor, completa todos los nombres de los asistentes.')
      return
    }

    // Construir el mensaje de WhatsApp
    const attendeesList = attendeeNames
      .map((name, index) => `${index + 1}. ${name}`)
      .join('\n')

    const message = `✨ 🏰 *CONFIRMACIÓN REAL* 🏰 ✨
📜 *_Decreto de Asistencia_*

👑 *Invitado de Honor:* ${guestName || 'Invitado'}
🎟 *Asientos Reservados:* ${selectedSeats} de ${maxSeats}

⚜️ *Corte Real (Asistentes):*
${attendeesList}

🥂 _"Su presencia es el honor de nuestra corte."_
✨ ¡Nos vemos en la celebración! ✨`

    const whatsappUrl = `https://wa.me/525522678650?text=${encodeURIComponent(message)}`

    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank')
    setIsSubmitting(true)
  }

  // Mostrar estado de carga
  if (!isLoaded) {
    return (
      <section
        ref={ref}
        className="min-h-screen relative flex items-center justify-center py-32 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #020a18 0%, #0d1a33 30%, #1a3366 50%, #0d1a33 70%, #020a18 100%)",
        }}
      >
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
          <p className="text-gold-500 text-xl">Cargando invitación...</p>
        </motion.div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="min-h-screen relative flex items-center justify-center py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020a18 0%, #0d1a33 30%, #1a3366 50%, #0d1a33 70%, #020a18 100%)",
      }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-royal-500/10 rounded-full"
          style={{
            filter: performance.enableBlur ? 'blur(150px)' : 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full"
          style={{
            filter: performance.enableBlur ? 'blur(120px)' : 'blur(60px)',
          }}
        />
      </motion.div>

      {/* Fire glow at bottom - solo si está habilitado */}
      {performance.enableGlow && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-60 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(255, 69, 0, 0.1), transparent)",
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Floating Sparkles - optimizados */}
      <div ref={sparklesRef as React.RefObject<HTMLDivElement>}>
        {isIntersecting && sparklePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: pos.left,
              top: pos.top,
              willChange: "transform, opacity",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              delay: pos.delay,
            }}
          >
            <Sparkles className="w-4 h-4 text-gold-500/30" />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center max-w-4xl px-6 w-full"
        style={{ scale }}
      >
        {/* Crown animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="mb-10"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative inline-block"
          >
            <Crown className="w-20 h-20 text-gold-500" />
            <motion.div
              className="absolute inset-0 blur-xl"
              style={{ background: "radial-gradient(circle, rgba(212, 175, 55, 0.4), transparent)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Guest greeting */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-2xl md:text-4xl text-gold-500 mb-6 font-decorative"
        >
          ¡Hola {guestName}!
        </motion.h3>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-decorative text-5xl md:text-7xl text-white mb-4"
        >
          Su Presencia
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-gold-500/60 text-xs tracking-[0.5em] uppercase mb-16"
        >
          Es requerida por la corte real
        </motion.p>

        {/* Seat Selection Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12 p-8 bg-gradient-to-b from-gold-500/10 to-gold-500/5 rounded-3xl border border-gold-500/20"
        >
          <p className="text-gold-400 mb-6 text-sm tracking-widest uppercase">Selecciona cuántos asientos confirmas</p>

          {/* Seat Buttons Grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 mb-8">
            {Array.from({ length: maxSeats }).map((_, i) => {
              const seatNumber = i + 1
              const isSelected = selectedSeats === seatNumber

              return (
                <motion.button
                  key={seatNumber}
                  onClick={() => setSelectedSeats(seatNumber)}
                  className={`
                    relative py-3 px-2 rounded-xl font-decorative text-lg transition-all duration-300
                    ${isSelected
                      ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/50'
                      : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/40 border border-gold-500/40'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {seatNumber}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-4 h-4 absolute top-1 right-1" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Attendee Names Input Section */}
          <div className="mt-10 pt-8 border-t border-gold-500/20">
            <p className="text-gold-400 mb-6 text-sm tracking-widest uppercase">Nombres de los asistentes</p>

            <div className="space-y-4">
              {attendeeNames.map((name, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm text-gold-400/80 mb-2">
                    Asistente {index + 1}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={`Nombre del asistente ${index + 1}`}
                    className="w-full px-4 py-3 bg-gold-500/10 border border-gold-500/30 rounded-lg text-white placeholder-gold-500/30 focus:outline-none focus:border-gold-500/60 focus:bg-gold-500/15 transition-all duration-300 font-sans"
                  />
                </motion.div>
              ))}
            </div>

            {/* Validation Error */}
            {validationError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-4 text-center"
              >
                {validationError}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Confirmation Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col items-center gap-8"
        >
          <AnimatedButton
            variant="primary"
            size="lg"
            onClick={handleConfirm}
          >
            <MessageCircle className="w-5 h-5" />
            Confirmar Asistencia
          </AnimatedButton>

          <motion.p
            className="text-xs text-gold-500/40 tracking-widest uppercase"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Favor de confirmar antes del 15 de Mayo
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  )
}
