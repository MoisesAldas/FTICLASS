"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bolt, 
  Calendar, 
  ShieldCheck, 
  Timer, 
  Share2, 
  Mail, 
  Home, 
  Dumbbell, 
  Plus, 
  CreditCard, 
  User,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"

export default function Page() {
  const [activeSection, setActiveSection] = useState(0)

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="bg-black text-[#e4e2e4] min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-100 flex justify-between items-center px-6 md:px-10 py-6 max-w-none">
        <div className="flex items-center gap-12">
          <span className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase">FITCLASS</span>
          <div className="hidden lg:flex gap-8 items-center bg-black/20 backdrop-blur-xl px-6 py-2 rounded-full border border-white/5">
            <a href="#historias" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Historias</a>
            <a href="#sistema" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Sistema</a>
            <a href="#comunidad" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Comunidad</a>
            <a href="#precios" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Precios</a>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/login" className="text-white font-bold text-sm md:text-base hover:text-[#c2c1ff] transition-colors">
            Login
          </Link>
          <Button className="font-black" variant="fitclass-nav" size="fitclass-nav">
            ACCESO ELITE
          </Button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-visible">
          <div className="absolute inset-0 z-0">
            <img
              alt="Athlete training"
              className="w-full h-full object-cover grayscale brightness-50 contrast-125"
              src="/hero.png"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent via-70% to-black"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 text-center px-6 max-w-6xl"
          >
            <div className="inline-flex items-center mt-20 gap-2 bg-indigo-500/20 text-[#c2c1ff] border border-[#c2c1ff]/20 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c2c1ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c2c1ff]"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-widest leading-none">Nueva Era Crossfit</span>
            </div>
            <h1 className="font-sans text-4xl sm:text-6xl md:text-[10rem] font-black text-white leading-[0.85] mb-8 tracking-tighter">
              DOMINA EL <br />
              <span className="bg-linear-to-br from-[#c2c1ff] to-[#5e5ce6] bg-clip-text text-transparent">
                CAOS.
              </span>
            </h1>
            <p className="text-white/80 text-lg md:text-3xl max-w-3xl mx-auto mb-12 font-medium leading-tight">
              Gestiona tu box con la precisión de un atleta de élite. Sin fricciones, sin límites.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button variant="fitclass-primary" size="fitclass-hero" className="font-black w-full rounded-full sm:w-[280px]">
                EMPEZAR AHORA
              </Button>
              <Button variant="fitclass-secondary" size="fitclass-hero" className="font-black w-full rounded-full sm:w-[280px]">
                VER INTERFAZ
              </Button>
            </div>
          </motion.div>
          <div className="absolute -bottom-27 inset-x-0 flex flex-col items-center gap-4 z-40 pointer-events-none">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Sigue bajando</span>
            <div className="w-px h-24 bg-linear-to-b from-white/20 to-transparent"></div>
          </div>
        </section>

        {/* Chapter 01 - Datos que Hablan */}
        <section className="relative bg-black pt-32 md:pt-60 pb-24 md:pb-40">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1"
              >
                <div className="bg-[#131315]/60 backdrop-blur-2xl border border-white/10 rounded-lg p-10 shadow-[0_0_80px_-20px_rgba(94,92,230,0.3)] relative overflow-hidden">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="text-6xl font-black text-white">142</div>
                      <div className="text-[#c2c1ff] font-bold uppercase tracking-widest text-xs mt-2">
                        Atletas Entrenando
                      </div>
                    </div>
                    <div className="flex -space-x-4">
                      <img
                        alt="Athlete"
                        className="w-14 h-14 rounded-full border-4 border-black"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd_2HUJA55fh1B0GHwqs9a0mYZwuK5OfNCOCp1740904OZmoY_aqye7R0uasnmy9Q71viUBhAUW7inCFWW6z_CzaMn1a1kzbVoeBNYocPD32u4QrSQIBguJDkGXtcslt3y7V2bbKkKA9kcGLUHdIk0jxzWYhkkIm2PtyS25O9fnIflTQJCdegcN1JSroo0QLWI15IElCy9UvGR7y7v803OUYER-l3zrbCfMnrAUagQG5w92PAgkjYkW-7VrRbgnTD1i7XNMFA76-g"
                      />
                      <img
                        alt="Athlete"
                        className="w-14 h-14 rounded-full border-4 border-black"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKKqNXVM0mmnuEgObOiF1OrBJGL3hCcAFibYHhtyaO2rxIkZGbUhLF6NymyGu1a6lW2tyk30S1qHVFcgscKvhJUT98B20PU-KNTd6UxSDsIMvN07rrfqN_n5dOAMB0u0PUD-PtqIHto52U-9P5k8PUUyIjPl1EOrQdSh0tyhGFyrwHTlipYldz6Tu719JExt5oN2i77zbPR0FYlhSBOwtMte0_G82q6QKg66zhHxUtRXPvM_l1CwX2gr6Y-CKWN-4faN4cFbEjWGg"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-32 bg-white/5 rounded-lg flex items-end gap-3 p-6">
                      <div className="w-full bg-indigo-500/20 h-1/2 rounded-t-lg"></div>
                      <div className="w-full bg-indigo-500/40 h-3/4 rounded-t-lg"></div>
                      <div className="w-full bg-[#c2c1ff] h-full rounded-t-lg"></div>
                      <div className="w-full bg-indigo-500/60 h-2/3 rounded-t-lg"></div>
                      <div className="w-full bg-indigo-500/30 h-1/3 rounded-t-lg"></div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-500">
                      <span>LUNES</span>
                      <span>MARTES</span>
                      <span className="text-white">HOY</span>
                      <span>JUEVES</span>
                      <span>VIERNES</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2"
              >
                <span className="text-[#c2c1ff] font-black uppercase tracking-[0.3em] text-sm block mb-6">
                  Capítulo 01
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-none mb-10 tracking-tight">
                  DATOS QUE <br />HABLAN.
                </h2>
                <p className="text-zinc-400 text-lg md:text-2xl leading-relaxed">
                  No más hojas de cálculo. Visualiza la salud de tu box en tiempo real. Asistencia, ingresos y
                  rendimiento en una sola pantalla de alto impacto.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Chapter 02 - Programación Sin Esfuerzo */}
        <section className="relative bg-zinc-950 py-24 md:py-40 overflow-hidden">
          <div className="absolute -right-20 md:right-0 top-1/2 -translate-y-1/2 w-[120%] sm:w-[70%] md:w-[60%] opacity-20 pointer-events-none">
            <img
              alt="WOD"
              className="w-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKKqNXVM0mmnuEgObOiF1OrBJGL3hCcAFibYHhtyaO2rxIkZGbUhLF6NymyGu1a6lW2tyk30S1qHVFcgscKvhJUT98B20PU-KNTd6UxSDsIMvN07rrfqN_n5dOAMB0u0PUD-PtqIHto52U-9P5k8PUUyIjPl1EOrQdSh0tyhGFyrwHTlipYldz6Tu719JExt5oN2i77zbPR0FYlhSBOwtMte0_G82q6QKg66zhHxUtRXPvM_l1CwX2gr6Y-CKWN-4faN4cFbEjWGg"
            />
          </div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="max-w-7xl mx-auto px-6 md:px-10 relative z-10"
          >
            <div className="max-w-3xl">
              <motion.span variants={cardVariants} className="text-[#ffc07a] font-black uppercase tracking-[0.3em] text-sm block mb-6">
                Capítulo 02
              </motion.span>
              <motion.h2 variants={cardVariants} className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-none mb-10 tracking-tight">
                PROGRAMACIÓN <br />SIN ESFUERZO.
              </motion.h2>
              <motion.p variants={cardVariants} className="text-zinc-400 text-lg md:text-2xl leading-relaxed mb-12">
                Crea WODs complejos en segundos. Tus atletas reciben notificaciones instantáneas y pueden reservar su
                plaza con un solo toque desde su móvil.
              </motion.p>
              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={cardVariants} className="bg-[#131315]/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl">
                  <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                    <Bolt className="text-white w-6 h-6 fill-white/20" />
                  </div>
                  <h4 className="text-white text-xl font-bold mb-2">Push Notifications</h4>
                  <p className="text-zinc-500 text-sm">Mantén a tu comunidad activa y enterada de cada nuevo reto.</p>
                </motion.div>
                <motion.div variants={cardVariants} className="bg-[#131315]/60 backdrop-blur-2xl border border-white/10 p-8 rounded-lg">
                  <div className="w-12 h-12 bg-[#ffc07a] rounded-lg flex items-center justify-center mb-6">
                    <Calendar className="text-black w-6 h-6" />
                  </div>
                  <h4 className="text-white text-xl font-bold mb-2">Reservas Inteligentes</h4>
                  <p className="text-zinc-500 text-sm">
                    Control de aforo automático para que nunca tengas una clase saturada.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Chapter 03 - Finanzas en Piloto Automático */}
        <section id="precios" className="relative bg-black py-24 md:py-40">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center mb-20"
            >
              <span className="text-[#47e266] font-black uppercase tracking-[0.3em] text-sm block mb-6">
                Capítulo 03
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-9xl font-black text-white leading-none mb-10 tracking-tight">
                FINANZAS EN <br />
                <span className="text-[#47e266]">PILOTO AUTOMÁTICO.</span>
              </h2>
              <p className="text-zinc-400 text-lg md:text-3xl max-w-4xl leading-tight">
                Olvídate de perseguir pagos. Integración total con Stripe para cobros recurrentes, facturación
                automática y control de morosidad.
              </p>
            </motion.div>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Comunidad Plan */}
              <motion.div variants={cardVariants} className="bg-zinc-900 p-8 md:p-12 rounded-[2.5rem] border border-white/5 flex flex-col justify-between min-h-[450px] md:h-[500px] hover:border-[#c2c1ff] transition-all">
                <div>
                  <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4">Comunidad</div>
                  <div className="text-4xl md:text-5xl font-black text-white">
                    $49<span className="text-xl font-medium text-zinc-500">/mes</span>
                  </div>
                </div>
                <ul className="space-y-4 my-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#47e266] w-5 h-5" />
                    50 atletas
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#47e266] w-5 h-5" />
                    Gestión WOD
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#47e266] w-5 h-5" />
                    Pagos Manuales
                  </li>
                </ul>
                <Button className="font-black" variant="fitclass-dark" size="fitclass-pricing">
                  DESCUBRIR
                </Button>
              </motion.div>

              {/* Elite Plan */}
              <motion.div variants={cardVariants} className="bg-[#c2c1ff] p-8 md:p-12 rounded-[2.5rem] flex flex-col justify-between min-h-[480px] md:h-[550px] md:-mt-6 shadow-2xl shadow-indigo-500/20 relative">
                <div className="absolute top-8 right-8 bg-black text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                  Best Choice
                </div>
                <div>
                  <div className="text-[#1800a7] font-bold uppercase tracking-widest text-xs mb-4">Elite</div>
                  <div className="text-5xl md:text-6xl font-black text-[#1800a7]">
                    $99<span className="text-xl font-medium opacity-60">/mes</span>
                  </div>
                </div>
                <ul className="space-y-4 text-[#1800a7] my-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    Atletas Ilimitados
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    Stripe Automatizado
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    App Personalizada
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    Soporte Prioritario
                  </li>
                </ul>
                <Button className="font-black" variant="fitclass-elite" size="fitclass-pricing">
                  EMPEZAR ELITE
                </Button>
              </motion.div>

              {/* Franquicia Plan */}
              <motion.div variants={cardVariants} className="bg-zinc-900 p-8 md:p-12 rounded-[2.5rem] border border-white/5 flex flex-col justify-between min-h-[450px] md:h-[500px] hover:border-[#c2c1ff] transition-all">
                <div>
                  <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4">Franquicia</div>
                  <div className="text-4xl md:text-5xl font-black text-white">
                    $199<span className="text-xl font-medium text-zinc-500">/mes</span>
                  </div>
                </div>
                <ul className="space-y-4 my-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#47e266] w-5 h-5" />
                    Multi-box
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#47e266] w-5 h-5" />
                    API Avanzada
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#47e266] w-5 h-5" />
                    CRM Full
                  </li>
                </ul>
                <Button className="font-black" variant="fitclass-dark" size="fitclass-pricing">
                  CONTACTAR
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 bg-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-5xl mx-auto px-6 md:px-10 text-center relative z-10">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-6xl md:text-9xl font-black text-white leading-[0.85] mb-12 tracking-tighter"
            >
              TRANSFORMA TU BOX <br /> HOY MISMO.
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col md:flex-row gap-6 justify-center items-center"
            >
              <Button  className="rounded-full font-black" variant="fitclass-cta" size="fitclass-cta">
                EMPEZAR PRUEBA GRATIS
              </Button>
              <div className="flex flex-col items-start text-left text-white/80 font-bold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-200" />
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-indigo-200" />
                  <span>Setup en 5 minutos</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-24 px-6 md:px-10 border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16"
        >
          <div className="col-span-1 md:col-span-2">
            <span className="text-3xl font-black italic tracking-tighter text-white uppercase mb-8 block">FITCLASS</span>
            <p className="text-zinc-500 text-xl max-w-sm leading-relaxed mb-10">
              Diseñado para quienes entienden que la excelencia en el box empieza con una gestión impecable.
            </p>
            <div className="flex gap-6">
              <a
                className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#c2c1ff] transition-colors"
                href="#"
              >
                <Share2 className="text-white w-5 h-5" />
              </a>
              <a
                className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#c2c1ff] transition-colors"
                href="#"
              >
                <Mail className="text-white w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Sistema</h4>
            <ul className="space-y-4 text-zinc-500 font-bold">
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  WOD Designer
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Atletas App
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Stripe Pay
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Comunidad</h4>
            <ul className="space-y-4 text-zinc-500 font-bold">
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Historias de Éxito
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Blog
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Soporte 24/7
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Legal
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-zinc-600 uppercase tracking-widest gap-4">
          <div>© 2024 FITCLASS TECNOLOGÍA DE ALTO RENDIMIENTO.</div>
          <div className="flex gap-8">
            <a href="#">MADE FOR CHAMPIONS</a>
            <a href="#">PRIVACY POLICY</a>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.8, type: "spring" }}
        className="md:hidden fixed bottom-6 left-6 right-6 z-100"
      >
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full px-8 py-4 flex justify-between items-center shadow-2xl">
          <Home className="text-white w-6 h-6 cursor-pointer" />
          <Dumbbell className="text-zinc-500 w-6 h-6 cursor-pointer hover:text-white transition-colors" />
          <div className="w-10 h-10 bg-[#c2c1ff] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <Plus className="text-black w-6 h-6" />
          </div>
          <CreditCard className="text-zinc-500 w-6 h-6 cursor-pointer hover:text-white transition-colors" />
          <User className="text-zinc-500 w-6 h-6 cursor-pointer hover:text-white transition-colors" />
        </div>
      </motion.div>
    </div>
  )
}
