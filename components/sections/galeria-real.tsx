'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Maximize2, Loader2, Camera, QrCode as QrIcon, X } from 'lucide-react';
import Image from 'next/image';

// --- CONFIGURACIÓN ---
// Sustituye estos links con los de la clienta
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbdEa9bOrsZlox-4zeXaiOpHtJQptDoC7uuJXvcbgcV6D7FsX0mGCGuPk9W8qyxWLhi7tqAuyzMK6Y/pub?output=csv';
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSc_GYnnwNTNpFqvkvtgIhdUU1UD6z0P5YLwZMvAd4BN68p3fQ/viewform';
// ---------------------

interface Foto {
    id: string;
    viewUrl: string;
    downloadUrl: string;
    author?: string; // Si el form pide nombre
}

export function GaleriaReal() {
    const [fotos, setFotos] = useState<Foto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        Papa.parse(GOOGLE_SHEET_CSV_URL, {
            download: true,
            header: true,
            complete: (res) => {
                console.log("Datos del CSV:", res.data); // Debugging

                const validas = res.data
                    .filter((row: any) => {
                        // Buscar dinámicamente cualquier columna que parezca un link de Drive
                        return Object.values(row).some((val: any) =>
                            typeof val === 'string' && val.includes('drive.google.com')
                        );
                    })
                    .map((row: any) => {
                        // Encontrar la URL exacta
                        const url = Object.values(row).find((val: any) =>
                            typeof val === 'string' && val.includes('drive.google.com')
                        ) as string;

                        console.log("URL encontrada:", url);

                        // Extraer ID de archivo de Drive
                        // Formatos manejados: 
                        // open?id=XXX
                        // uc?id=XXX
                        // file/d/XXX/view
                        let id = '';
                        if (url.includes('id=')) {
                            id = url.split('id=')[1];
                        } else if (url.includes('/d/')) {
                            id = url.split('/d/')[1].split('/')[0];
                        }

                        // Limpiar ID de parámetros extra (&)
                        id = id.split('&')[0];

                        // Buscar nombre del autor (cualquier columna que no sea la URL y no sea Timestamp)
                        const possibleName = Object.entries(row).find(([key, val]) =>
                            key !== 'Marca temporal' &&
                            key !== 'Timestamp' &&
                            val !== url &&
                            typeof val === 'string' &&
                            val.length < 50 // Heurística simple
                        );

                        const author = possibleName ? possibleName[1] as string : 'Invitado';

                        // Generar múltiples formatos de URL para mayor compatibilidad
                        const viewUrl = `https://lh3.googleusercontent.com/d/${id}=s1000`;
                        const fallbackUrl = `https://drive.google.com/uc?export=view&id=${id}`;

                        console.log("URL original:", url);
                        console.log("ID extraído:", id);
                        console.log("URL final (thumbnail):", viewUrl);
                        console.log("URL fallback:", fallbackUrl);

                        return {
                            id,
                            viewUrl,
                            downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`,
                            author: author
                        };
                    });

                console.log("Total fotos válidas:", validas.length);
                console.log("Fotos procesadas:", validas);

                // Invertir para mostrar las más nuevas primero
                setFotos(validas.reverse());
                setLoading(false);
            },
            error: () => {
                setLoading(false);
            }
        });
    }, []);

    return (
        <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-[#020a18] to-[#050a14]">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-gold-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-royal-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* 1. HEADER & SUBIR & QR */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-decorative text-4xl md:text-5xl text-gold-400 mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            Galería Real
                        </h2>
                        <p className="font-serif text-gold-200/60 max-w-2xl mx-auto mb-8 text-lg">
                            Los momentos mágicos capturados por nuestros invitados de honor.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.a
                                href={GOOGLE_FORM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-400 text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider shadow-lg hover:from-gold-400 hover:to-gold-300 transition-all duration-300 group"
                            >
                                <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span>Añadir mis Fotos</span>
                            </motion.a>

                            <motion.button
                                onClick={() => setShowQR(true)}
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(212,175,55,0.2)" }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 bg-royal-800/50 border border-gold-500/30 text-gold-400 px-6 py-4 rounded-full font-bold uppercase tracking-wider shadow-lg hover:text-gold-300 transition-all duration-300"
                            >
                                <QrIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">Escanear</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* 2. LOADING STATE */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-gold-400 animate-spin mb-4" />
                        <p className="text-gold-200/50 font-serif">Cargando recuerdos...</p>
                    </div>
                )}

                {/* 3. EMPTY STATE */}
                {!loading && fotos.length === 0 && (
                    <div className="text-center py-20 border border-gold-500/20 rounded-2xl bg-gold-500/5 backdrop-blur-sm">
                        <p className="text-gold-200/70 font-serif text-xl mb-2">Aún no hay fotos</p>
                        <p className="text-gold-400/50">¡Sé el primero en subir un recuerdo mágico!</p>
                    </div>
                )}

                {/* 4. GRID DE FOTOS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fotos.map((foto, index) => (
                        <motion.div
                            key={foto.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-royal-800 border border-gold-500/10 shadow-xl"
                        >
                            {/* Imagen */}
                            <div className="relative w-full h-full">
                                <img
                                    src={foto.viewUrl}
                                    alt={`Foto por ${foto.author}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                />
                            </div>

                            {/* Overlay y Acciones */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">

                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-gold-200 text-sm font-serif mb-4 italic">
                                        Subida por {foto.author}
                                    </p>

                                    <div className="flex gap-3">
                                        <a
                                            href={foto.downloadUrl}
                                            className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors border border-white/10"
                                            download
                                        >
                                            <Download className="w-4 h-4" />
                                            Descargar
                                        </a>
                                        <button
                                            onClick={() => setSelectedId(foto.id)}
                                            className="w-10 h-10 bg-gold-500 hover:bg-gold-400 text-black rounded-lg flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                                            title="Ver en grande"
                                        >
                                            <Maximize2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedId(null)}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-5xl h-[80vh]">
                            {fotos.find(f => f.id === selectedId) && (
                                <img
                                    src={fotos.find(f => f.id === selectedId)!.viewUrl}
                                    alt="Vista completa"
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                />
                            )}
                        </div>
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedId(null)}
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQR && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowQR(false)}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-royal-900 border border-gold-500/30 p-8 rounded-2xl max-w-sm w-full text-center relative shadow-[0_0_50px_rgba(212,175,55,0.2)]"
                        >
                            <button
                                onClick={() => setShowQR(false)}
                                className="absolute top-4 right-4 text-gold-500/50 hover:text-gold-500 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h3 className="font-decorative text-2xl text-gold-400 mb-2">Escanea para Subir</h3>
                            <p className="text-gold-200/60 text-sm mb-6">Comparte tus fotos desde tu celular</p>

                            <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-inner">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(GOOGLE_FORM_URL)}`}
                                    alt="QR Upload"
                                    width={200}
                                    height={200}
                                    className="rounded-lg"
                                />
                            </div>

                            <p className="text-xs text-gold-500/40 font-mono mt-2">#EURYTHMI_XV</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
