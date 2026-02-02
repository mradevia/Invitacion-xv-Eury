'use client';

import { GaleriaReal } from '@/components/sections/galeria-real';
import { Camera, Home } from 'lucide-react';
import Link from 'next/link';

export default function PaginaFotos() {
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSc_GYnnwNTNpFqvkvtgIhdUU1UD6z0P5YLwZMvAd4BN68p3fQ/viewform';

    return (
        <main className="min-h-screen bg-[#020a18] relative overflow-x-hidden">
            {/* Background decorations matching the main theme */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-royal-900/50 to-transparent" />
                <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-gold-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-royal-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Navigation */}
            <nav className="absolute top-4 left-4 z-50">
                <Link
                    href="/"
                    className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-colors text-sm font-medium"
                >
                    <Home className="w-4 h-4" />
                    <span>Volver a Inicio</span>
                </Link>
            </nav>

            {/* 1. COMPONENTE DE GALERÍA REAL (Incluye Header y Grid) */}
            <div className="relative z-10 pt-10">
                <GaleriaReal />
            </div>

            {/* 2. SECCIÓN EXTRA DE SUBIDA (Al final) */}
            <section className="py-20 px-4 relative z-10 text-center">
                <div className="max-w-2xl mx-auto bg-royal-900/50 backdrop-blur-md border border-gold-500/20 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.4)]">
                    <h2 className="font-decorative text-3xl text-gold-400 mb-4">
                        ¿Tienes más recuerdos?
                    </h2>
                    <p className="text-gold-200/60 mb-8 font-serif">
                        Ayúdanos a completar la historia de esta noche mágica.
                    </p>

                    <a
                        href={GOOGLE_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-400 text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
                    >
                        <Camera className="w-5 h-5" />
                        <span>Subir mi Recuerdo</span>
                    </a>
                </div>
            </section>

            {/* Footer simple */}
            <footer className="py-8 text-center text-gold-500/30 text-xs relative z-10">
                <p>EURYTHMI XV • GALERÍA REAL</p>
            </footer>
        </main>
    );
}
