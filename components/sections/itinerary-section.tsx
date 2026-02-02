"use client"

import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { useRef, useState } from "react"
import { Crown, Clock, AlertTriangle, Music, PartyPopper, Church, LogOut, Sparkles } from "lucide-react"
import { TiltCard } from "../tilt-card"

const timelineItems = [
  { time: "7:30 PM", label: "Ceremonia Religiosa", icon: Church, color: "gold" },
  { time: "8:30 PM", label: "Recepción & Cocktail", icon: Music, color: "gold" },
  { time: "9:00 PM - 3:00 AM", label: "Gran Fiesta", icon: PartyPopper, color: "fire" },
  { time: "3:00 AM", label: "Despedida", icon: LogOut, color: "gray" },
]

export function ItinerarySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section
      ref={ref}
      className="min-h-screen py-32 px-4 flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020a18 0%, #0a1628 50%, #020a18 100%)",
      }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: prefersReducedMotion ? 0 : backgroundY, willChange: "transform" }}
      >
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-royal-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px]" />
      </motion.div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Dress Code Card */}
        <motion.div
          initial={{ opacity: 0, x: -80, rotateY: 30 }}
          animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <TiltCard className="h-full" intensity={12}>
            <div className="glass-royal p-10 text-center flex flex-col items-center justify-center h-full rounded-2xl relative overflow-hidden">
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 70% 70%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)",
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotateY: [0, 10, -10, 0],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative"
              >
                <Crown className="w-16 h-16 text-gold-500 mb-8" />
                <motion.div
                  className="absolute inset-0 blur-xl bg-gold-500/30"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <h3 className="font-decorative text-3xl text-white mb-2">
                Código de
              </h3>
              <h3 className="font-decorative text-3xl text-gold-400 mb-4">
                Vestimenta
              </h3>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="w-16 h-px bg-gold-500/50 mb-6"
              />

              <p className="font-serif text-2xl text-gold-300 uppercase tracking-[0.3em] mb-8">
                Formal
              </p>

              {/* Warning box with 3D effect */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative w-full"
              >
                <motion.div
                  className="bg-fire-500/10 border border-fire-500/30 p-5 rounded-xl relative overflow-hidden"
                  whileHover={{ scale: 1.02, borderColor: "rgba(255, 69, 0, 0.5)" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-fire-500/5"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <AlertTriangle className="w-5 h-5 text-fire-400" />
                    </motion.div>
                    <p className="text-sm text-fire-400 uppercase font-bold tracking-wider">
                      Importante
                    </p>
                  </div>
                  <p className="text-xs text-gray-300 relative z-10">
                    Evitar color Azul
                    <br />
                    <span className="text-gold-400/80">(Reservado para la quinceañera)</span>
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Itinerary Card */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:col-span-2"
        >
          <TiltCard className="h-full" intensity={8}>
            <div className="glass-royal p-10 rounded-2xl h-full">
              {/* Header */}
              <motion.div
                className="flex items-center justify-center gap-4 mb-10 pb-6 border-b border-gold-500/20"
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-8 h-8 text-gold-400" />
                </motion.div>
                <h3 className="font-decorative text-4xl text-white">Itinerario</h3>
              </motion.div>

              {/* Timeline */}
              <div className="relative">
                {/* Vertical line with gradient */}
                <motion.div
                  className="absolute left-6 top-0 bottom-0 w-px"
                  style={{
                    background: "linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.5), rgba(212, 175, 55, 0.5), transparent)",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                />

                <div className="space-y-8 pl-16">
                  {timelineItems.map((item, index) => {
                    const Icon = item.icon
                    const isHovered = hoveredItem === index

                    const colorClasses = {
                      gold: "border-gold-500 bg-gold-500 text-gold-400 shadow-gold-500/50",
                      fire: "border-fire-500 bg-fire-500 text-fire-400 shadow-fire-500/50",
                      gray: "border-gray-500 bg-gray-500 text-gray-400 shadow-gray-500/50",
                    }

                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                        className="relative group"
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {/* Timeline dot */}
                        <motion.div
                          className={`absolute -left-[52px] top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isHovered
                              ? colorClasses[item.color as keyof typeof colorClasses]
                              : `border-${item.color === "gold" ? "gold" : item.color === "fire" ? "fire" : "gray"}-500/50 bg-royal-950`
                            }`}
                          animate={{
                            scale: isHovered ? 1.2 : 1,
                            boxShadow: isHovered ? `0 0 20px var(--${item.color}-500)` : "none",
                          }}
                        >
                          <Icon className={`w-4 h-4 transition-all duration-300 ${isHovered ? "text-white" : `text-${item.color === "gold" ? "gold" : item.color === "fire" ? "fire" : "gray"}-500/50`
                            }`} />
                        </motion.div>

                        {/* Content */}
                        <motion.div
                          className="cursor-pointer"
                          whileHover={{ x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className={`font-decorative text-2xl transition-colors duration-300 ${isHovered
                              ? item.color === "gold" ? "text-gold-400" : item.color === "fire" ? "text-fire-400" : "text-gray-400"
                              : "text-white"
                            }`}>
                            {item.time}
                          </span>
                          <p className={`uppercase tracking-[0.2em] text-sm mt-1 transition-colors duration-300 ${isHovered ? "text-white" : "text-gray-400"
                            }`}>
                            {item.label}
                          </p>
                        </motion.div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Footer notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mt-10 pt-6 border-t border-gold-500/20 text-center"
              >
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-4 h-4 text-gold-500/50" />
                  <p className="text-xs font-serif tracking-[0.3em] text-gold-400/60 uppercase">
                    Solo Adultos • Sin Niños
                  </p>
                  <Sparkles className="w-4 h-4 text-gold-500/50" />
                </div>
              </motion.div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}
