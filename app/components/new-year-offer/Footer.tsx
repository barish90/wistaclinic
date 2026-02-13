'use client'

import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  // Social Icon Animation Variants
  const socialVariants = {
    hover: {
      y: -4,
      backgroundColor: "#D4AF37", // gold-500
      color: "#FFFFFF",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.9 }
  };

  // Link Animation Variants
  const linkVariants = {
    initial: { x: 0, color: "#64748b" }, // slate-500
    hover: {
      x: 6,
      color: "#AA8C2C", // gold-600
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const socialLinks = [
    { id: 'twitter', url: 'https://x.com/dentawista' },
    { id: 'facebook', url: 'https://www.facebook.com/p/DentaWista-Clinic-61563466250495/' },
    { id: 'instagram', url: 'https://www.instagram.com/mediwista/' },
  ];

  const departmentLinks = [
    { name: 'DentaWista', id: 'dental' },
    { name: 'Wista Beauty', id: 'beauty' },
    { name: 'Weight Loss', id: 'weight' },
    { name: 'Wista Lab', id: 'lab' },
    { name: 'WistaClinic', id: 'clinic' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (window.gsap) {
      window.gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: `#${id}`, offsetY: 0 },
        ease: "power3.inOut"
      });
    } else {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  return (
    <footer className="relative z-10 pt-24 pb-12 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* PREMIUM CTA Card - Dark Luxury Aesthetic with Animated Sheen */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2rem] overflow-hidden shadow-2xl mb-32 group isolate"
        >
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[#0F1115]">
               {/* Animated Gradient Spotlights */}
               <motion.div
                 animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                 }}
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-600/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"
               />
               <motion.div
                 animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"
               />

               {/* Pattern Overlay */}
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-12 md:p-24 gap-12">
                <div className="text-center md:text-left max-w-3xl">
                    <div className="inline-flex items-center justify-center md:justify-start gap-3 mb-6">
                        <span className="w-8 h-[1px] bg-gold-400"></span>
                        <span className="text-gold-400 uppercase tracking-[0.3em] text-xs font-bold">Limited Time Offer</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-serif text-white font-medium mb-8 leading-tight">
                        Ready to elevate your <br/>
                        {/* Shimmer Text Effect */}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5EBC1] via-[#D4AF37] to-[#F5EBC1] font-bold bg-[length:200%_auto] animate-shimmer drop-shadow-sm">
                            Lifestyle Experience?
                        </span>
                    </h2>

                    <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                        Your exclusive $50 voucher is the key to a world of premium care. Secure your appointment today.
                    </p>
                </div>

                <div className="flex-shrink-0 relative z-20">
                    {/* Layer 1: Soft Ambient Glow (Scaled down for elegance) */}
                    <div className="absolute -inset-6 bg-gold-500/15 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out"></div>

                    {/* Layer 2: Subtle Core Halo */}
                    <div className="absolute -inset-1 bg-gold-300/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen"></div>

                    <motion.a
                        href="https://wa.me/905070808888?text=Hello,%20I%20would%20like%20to%20claim%20my%20voucher!"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group/btn relative overflow-hidden rounded-full px-10 py-4 bg-gradient-to-br from-[#EEDC94] to-[#AA8C2C] shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] border border-[#AA8C2C]/40 inline-flex items-center"
                    >
                        {/* Matte Shimmer Overlay on Hover (Subtle Light Beam) */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700 bg-[length:200%_auto] animate-shimmer pointer-events-none" />

                        <div className="relative flex items-center gap-3 z-10">
                            <span className="font-serif text-[#2B230B] text-sm md:text-base font-bold tracking-[0.15em] uppercase drop-shadow-none">
                                Claim Voucher Now
                            </span>
                            <div className="relative w-5 h-5 overflow-hidden">
                                <svg
                                    className="w-5 h-5 text-[#2B230B] absolute transform transition-all duration-300 group-hover/btn:translate-x-full group-hover/btn:opacity-0"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                <svg
                                    className="w-5 h-5 text-[#2B230B] absolute transform -translate-x-full opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </motion.a>
                </div>
            </div>

            {/* Decorative Borders */}
            <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none"></div>
        </motion.div>

        {/* Footer Links Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-slate-100 pb-16">

            {/* Brand Column */}
            <div className="md:col-span-4 space-y-6">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                     <img
                       src="/images/logo/logo-gold-no-title.webp"
                       alt="Wista Group"
                       className="w-12 h-12 object-contain"
                     />
                     <span className="font-serif text-2xl font-bold text-slate-900 tracking-tight">Wista Group</span>
                </div>
                <p className="text-slate-500 text-base leading-relaxed font-light max-w-sm">
                    Redefining healthcare with a touch of luxury. We blend advanced medical technology with comfort to ensure your well-being is always prioritized.
                </p>
                <div className="flex space-x-4">
                    {socialLinks.map((social) => (
                        <motion.a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={socialVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"
                        >
                            {/* SVG Icons */}
                            {social.id === 'twitter' && (
                                <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            )}
                            {social.id === 'facebook' && (
                                <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                            )}
                            {social.id === 'instagram' && (
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                            )}
                        </motion.a>
                    ))}
                </div>
            </div>

            {/* Departments Column */}
            <div className="md:col-span-3 md:col-start-6">
                <h4 className="font-sans font-bold text-slate-900 mb-8 text-xs uppercase tracking-widest">Departments</h4>
                <ul className="space-y-4 text-sm text-slate-500 font-medium">
                    {departmentLinks.map(dept => (
                        <motion.li
                            key={dept.id}
                            variants={linkVariants}
                            initial="initial"
                            whileHover="hover"
                            className="cursor-pointer"
                        >
                            <a
                                href={`#${dept.id}`}
                                onClick={(e) => handleScrollTo(e, dept.id)}
                                className="inline-block transition-colors hover:text-gold-600 w-full"
                            >
                                {dept.name}
                            </a>
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Get in Touch & Map */}
            <div className="md:col-span-4 md:col-start-9">
                 <h4 className="font-sans font-bold text-slate-900 mb-8 text-xs uppercase tracking-widest">Get in Touch</h4>
                 <div className="flex flex-col gap-8">
                    {/* Contact Info */}
                    <ul className="space-y-6 text-sm text-slate-500">
                        <motion.li
                            whileHover={{ x: 6 }}
                            className="group"
                        >
                            <a
                                href="https://maps.app.goo.gl/qns5ENQKB9THKUh59"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-4 cursor-pointer"
                            >
                                <span className="text-gold-500 text-lg mt-0.5">📍</span>
                                <span className="group-hover:text-gold-600 transition-colors leading-relaxed">
                                    Merkez, Cendere Cad. No:9,<br/>34406 Kağıthane/İstanbul
                                </span>
                            </a>
                        </motion.li>
                        <motion.li
                            whileHover={{ x: 6 }}
                            className="group"
                        >
                            <a
                                href="https://wa.me/905070808888"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-4 cursor-pointer"
                            >
                                <span className="text-gold-500 text-lg">📞</span>
                                <span className="group-hover:text-gold-600 transition-colors">
                                    +90 507 080 88 88
                                </span>
                            </a>
                        </motion.li>
                        <motion.li
                            whileHover={{ x: 6 }}
                            className="group"
                        >
                            <a
                                href="mailto:info@dentawista.com"
                                className="flex items-center space-x-4 cursor-pointer"
                            >
                                <span className="text-gold-500 text-lg">✉️</span>
                                <span className="group-hover:text-gold-600 transition-colors">
                                    info@dentawista.com
                                </span>
                            </a>
                        </motion.li>
                    </ul>

                    {/* Google Map Embed */}
                    <div className="w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative group bg-slate-50">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src="https://maps.google.com/maps?q=Merkez%2C%20Cendere%20Cad.%20No%3A9%2C%2034406%20Ka%C4%9F%C4%B1thane%2F%C4%B0stanbul&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            className="w-full h-full grayscale-[50%] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                            title="WistaClinic Location"
                        ></iframe>
                         {/* Full area click to open map */}
                         <a
                             href="https://maps.app.goo.gl/qns5ENQKB9THKUh59"
                             target="_blank"
                             rel="noopener noreferrer"
                             className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 hover:bg-black/5 transition-colors group"
                             aria-label="Open in Google Maps"
                         >
                            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-xs font-bold text-slate-600 group-hover:text-gold-600 group-hover:scale-105 transition-all flex items-center gap-2">
                                <span>View on Google Maps</span>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </div>
                         </a>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-medium tracking-wide">
            <p>© 2024 Wista Group. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
                {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(item => (
                    <motion.a
                        key={item}
                        href="#"
                        whileHover={{ color: '#AA8C2C', y: -2 }}
                        className="transition-colors inline-block"
                    >
                        {item}
                    </motion.a>
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
