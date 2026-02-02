"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { Mail, QrCode, Camera, Heart, Sparkles } from "lucide-react"
import Image from "next/image"

export function GiftsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isQRHovered, setIsQRHovered] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section
      ref={ref}
      className="min-h-[80vh] py-32 px-4 flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020a18 0%, #060d1a 50%, #020a18 100%)",
      }}
    >
      {/* Background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-gold-500/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-royal-500/5 rounded-full blur-[100px]" />
      </motion.div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Heart className="w-10 h-10 text-fire-500" />
          </motion.div>
          <h2 className="font-decorative text-4xl md:text-5xl text-white mb-2">Mesa de Regalos</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* Gift - Envelope */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="h-full"
          >
            <div className="glass-royal p-10 rounded-2xl h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Floating sparkles - reduced on mobile */}
              {typeof window !== 'undefined' && window.innerWidth > 768 && Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    willChange: "transform, opacity",
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-3 h-3 text-gold-400/30" />
                </motion.div>
              ))}

              {/* Animated envelope icon */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotateY: [0, 10, -10, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative mb-8"
              >
                <div className="w-28 h-28 rounded-full border-2 border-gold-500/30 flex items-center justify-center relative">
                  <Mail className="w-14 h-14 text-gold-400" />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: ["0 0 20px rgba(212, 175, 55, 0.2)", "0 0 40px rgba(212, 175, 55, 0.4)", "0 0 20px rgba(212, 175, 55, 0.2)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              <h3 className="font-decorative text-3xl text-white mb-4">
                Lluvia de Sobres
              </h3>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-16 h-px bg-gold-500/50 mb-6"
              />

              <p className="text-gray-400 text-sm leading-relaxed max-w-xs italic mb-8">
                {'"Mi mejor regalo es compartir contigo este gran día... Sin embargo, si deseas obsequiarme algo, agradeceré tu presente en efectivo."'}
              </p>

              {/* Animated envelope illustration */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="w-20 h-14 bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-lg relative overflow-hidden border border-gold-500/30"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {/* Envelope flap */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[40px] border-r-[40px] border-t-[20px] border-transparent border-t-gold-500/40" />

                  {/* Inner glow */}
                  <motion.div
                    className="absolute inset-0 bg-gold-400/10"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full"
          >
            <div className="glass-royal p-10 rounded-2xl h-full flex flex-col items-center justify-center text-center">
              {/* QR Code with 3D effect */}
              <motion.div
                className="relative mb-8"
                onMouseEnter={() => setIsQRHovered(true)}
                onMouseLeave={() => setIsQRHovered(false)}
              >
                <motion.div
                  className="w-52 h-52 bg-white p-3 relative cursor-pointer rounded-lg overflow-hidden"
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  initial={{ rotate: 3 }}
                  animate={{
                    boxShadow: isQRHovered
                      ? "0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(212, 175, 55, 0.3)"
                      : "0 10px 30px rgba(0,0,0,0.3)"
                  }}
                >
                  <Image
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://docs.google.com/forms/d/e/1FAIpQLSc_GYnnwNTNpFqvkvtgIhdUU1UD6z0P5YLwZMvAd4BN68p3fQ/viewform"
                    alt="QR Album"
                    fill
                    className="object-cover rounded"
                    loading="lazy"
                    quality={90}
                  />

                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-royal-950/90 flex flex-col items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isQRHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      animate={isQRHovered ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Camera className="w-10 h-10 text-gold-400" />
                    </motion.div>
                    <span className="text-gold-400 text-xs uppercase tracking-widest">
                      Escanear
                    </span>
                  </motion.div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold-500/50 rounded-tl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold-500/50 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold-500/50 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold-500/50 rounded-br" />
                </motion.div>
              </motion.div>

              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <QrCode className="w-6 h-6 text-gold-500" />
                </motion.div>
                <h3 className="font-decorative text-3xl text-white">
                  Compartir Fotos
                </h3>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="w-16 h-px bg-gold-500/50 mb-4"
              />

              <p className="text-gold-500/70 text-sm tracking-widest uppercase mb-4">
                Escanea y sube tus recuerdos
              </p>

              <motion.p
                className="text-royal-400 text-xs font-mono"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                #EURYTHMI_XV
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
