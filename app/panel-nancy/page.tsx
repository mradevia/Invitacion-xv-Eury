'use client'

import { useState, useEffect } from 'react'

export default function PanelNancy() {
    const [guestName, setGuestName] = useState('')
    const [guestSeats, setGuestSeats] = useState('5')
    const [generatedUrl, setGeneratedUrl] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [copyFeedback, setCopyFeedback] = useState(false)

    // Generar URL personalizada
    const generateUrl = () => {
        if (!guestName.trim()) return ''

        const origin = window.location.origin
        let path = window.location.pathname

        // Limpiar el path del panel
        path = path.replace(/\/public\/panel-nancy(\.html)?\/?$/i, '')
            .replace(/\/panel-nancy(\.html)?\/?$/i, '')

        if (!path || path === '/') {
            path = ''
        }

        const baseUrl = origin + path
        return `${baseUrl}/?n=${encodeURIComponent(guestName.trim())}&c=${guestSeats}`
    }

    // Actualizar URL cuando cambian los inputs
    useEffect(() => {
        const url = generateUrl()
        setGeneratedUrl(url)
        if (url) {
            setShowResult(true)
        }
    }, [guestName, guestSeats])

    // Copiar link
    const copyLink = async () => {
        const url = generateUrl()
        if (!url) {
            alert('Por favor, ingresa un nombre.')
            return
        }

        try {
            await navigator.clipboard.writeText(url)
            setCopyFeedback(true)
            setTimeout(() => setCopyFeedback(false), 2000)
        } catch (err) {
            console.error('Error al copiar:', err)
            alert('Error al copiar. Por favor intenta de nuevo.')
        }
    }

    // Enviar por WhatsApp
    const sendWhatsApp = () => {
        const url = generateUrl()
        if (!url) {
            alert('Por favor, ingresa un nombre.')
            return
        }

        const message = `¡Hola ${guestName.trim()}! 👑

Es un honor invitarles a celebrar los *15 años de Eury*. Queremos que formen parte de nuestra Corte Real en este día tan especial.

Hemos reservado *${guestSeats}* lugares para ustedes. Por favor, confirmen cuántos de ustedes asistirán y sus nombres en el siguiente enlace:

🔗 ${url}

¡Esperamos verlos pronto!`

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-5" style={{
            background: 'radial-gradient(circle at top, #1a2a44 0%, #050a14 100%)'
        }}>
            <div className="w-full max-w-[600px] rounded-[30px] p-10 border border-[rgba(212,175,55,0.4)] shadow-[0_30px_70px_rgba(0,0,0,0.8)]" style={{
                background: 'rgba(10, 25, 47, 0.95)',
                backdropFilter: 'blur(20px)'
            }}>
                <h1 className="text-[#d4af37] mb-2.5 font-light tracking-[4px] uppercase text-center text-[2.5rem] max-md:text-[1.8rem]">
                    👑 Panel Nancy
                </h1>
                <p className="text-center text-[#d4af37] opacity-60 mb-[30px] text-[0.85rem] tracking-[2px]">
                    Generador de Invitaciones
                </p>

                <div className="text-left mb-[25px]">
                    <label className="block mb-3 text-[#d4af37] text-[0.95rem] font-medium uppercase tracking-[1px]">
                        Nombre del Invitado/Familia:
                    </label>
                    <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && copyLink()}
                        placeholder="Ej: Familia Rivera"
                        autoComplete="off"
                        className="w-full p-4 bg-[#0c1525] border-2 border-[rgba(212,175,55,0.3)] rounded-2xl text-white text-base outline-none transition-all duration-300 focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.4)] focus:bg-[#0e1a30] placeholder:text-[rgba(212,175,55,0.3)]"
                    />
                </div>

                <div className="text-left mb-[25px]">
                    <label className="block mb-3 text-[#d4af37] text-[0.95rem] font-medium uppercase tracking-[1px]">
                        Boletos Reservados (Máx 9):
                    </label>
                    <select
                        value={guestSeats}
                        onChange={(e) => setGuestSeats(e.target.value)}
                        className="w-full p-4 pr-[45px] bg-[#0c1525] border-2 border-[rgba(212,175,55,0.3)] rounded-2xl text-white text-base outline-none transition-all duration-300 cursor-pointer appearance-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.4)] focus:bg-[#0e1a30]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            backgroundSize: '20px'
                        }}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <option key={num} value={num}>
                                {num} Boleto{num > 1 ? 's' : ''}{num === 5 ? ' (Predeterminado)' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-[15px] mt-[30px] max-md:grid-cols-1">
                    <button
                        onClick={copyLink}
                        disabled={!guestName.trim()}
                        className="p-[18px_24px] border-none rounded-2xl text-black text-[0.95rem] font-black uppercase cursor-pointer transition-all duration-300 tracking-[1px] border-2 border-transparent bg-gradient-to-br from-[#d4af37] to-[#f2d06b] shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.5)] hover:-translate-y-[3px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {copyFeedback ? '✓ Copiado' : 'Copiar Link'}
                    </button>
                    <button
                        onClick={sendWhatsApp}
                        disabled={!guestName.trim()}
                        className="p-[18px_24px] border-none rounded-2xl text-white text-[0.95rem] font-black uppercase cursor-pointer transition-all duration-300 tracking-[1px] border-2 border-transparent bg-gradient-to-br from-[#25d366] to-[#20ba5a] shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.5)] hover:-translate-y-[3px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        WhatsApp
                    </button>
                </div>

                {showResult && generatedUrl && (
                    <div className="mt-[30px] p-5 bg-[rgba(0,0,0,0.5)] border-2 border-dashed border-[#d4af37] rounded-2xl animate-slideUp">
                        <p className="text-[#f2d06b] m-0 mb-3 font-bold text-[1.1rem]">
                            ✅ Link Generado
                        </p>
                        <p className="text-[0.8rem] opacity-70 mb-2 text-[#d4af37] uppercase tracking-[1px]">
                            URL personalizada:
                        </p>
                        <div
                            onClick={copyLink}
                            className="break-all text-[0.9rem] text-[#f2d06b] font-mono leading-[1.5] bg-[rgba(0,0,0,0.3)] p-3 rounded-lg border-l-[3px] border-[#d4af37] cursor-copy transition-all duration-300 hover:bg-[rgba(212,175,55,0.1)] hover:border-l-[#f2d06b]"
                            title="Click para copiar"
                        >
                            {generatedUrl}
                        </div>
                    </div>
                )}

                <div className="mt-[25px] p-[15px] bg-[rgba(212,175,55,0.05)] border-l-[3px] border-[#d4af37] rounded-lg text-[0.85rem] text-[#d4af37] opacity-80">
                    <strong className="text-[#f2d06b]">💡 Cómo usar:</strong><br />
                    Ingresa el nombre y los boletos, luego copia el link o envía por WhatsApp. El invitado recibirá un mensaje
                    personalizado con su nombre y la cantidad de asientos que puede confirmar.
                </div>
            </div>

            <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
        </div>
    )
}
