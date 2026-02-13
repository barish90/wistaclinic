'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { DepartmentData, ServiceItem } from './types';

interface DepartmentSectionProps {
  data: DepartmentData;
  index: number;
}

// Helper for Background Colors
const getBackgroundColor = (index: number) => {
    const colors = [
        "#FFFFFF", // Dental
        "#FFF0F5", // Beauty (Lavender Blush/Rose)
        "#F0FFFF", // Weight (Azure/Teal)
        "#F5F5FF", // Lab (Light Indigo)
        "#FFFAF0"  // Clinic (Floral White/Amber)
    ];
    return colors[index % colors.length];
};

const DepartmentSection: React.FC<DepartmentSectionProps> = ({ data, index }) => {
  const isDark = data.theme === 'dark';

  // Extract hex color from text-[#HEX] class if present, otherwise default to Gold
  const accentColorMatch = data.textColor.match(/text-\[(#[0-9a-fA-F]+)\]/);
  const accentColor = accentColorMatch ? accentColorMatch[1] : '#E0BD3E';

  return (
    <section
        id={data.id}
        // Mobile: Min-height screen, py-16. Desktop: h-full, rounded corners.
        className="relative w-full min-h-screen md:min-h-0 md:h-full rounded-none md:rounded-[3rem] overflow-hidden shadow-none md:shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t md:border border-white/10 ring-1 ring-black/5 flex flex-col transition-colors duration-500"
        style={{ backgroundColor: data.backgroundColor || getBackgroundColor(index) }}
    >
        {/* Decorative Top Bar */}
        <div className={`absolute top-0 left-0 right-0 h-14 md:h-20 flex items-center justify-between px-4 md:px-12 border-b z-20 backdrop-blur-sm ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/5'}`}>
            <div className="flex items-center gap-2 md:gap-3">
                <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full shadow-sm ${data.textColor.replace('text-', 'bg-')}`}></div>
            </div>
            {/* Top Right Title */}
            <div className="text-sm md:text-2xl font-serif font-black select-none tracking-wide" style={{ color: accentColor, opacity: 0.9 }}>
                {data.id.toUpperCase()}
            </div>
        </div>

        {/* Content Container */}
        {/* Mobile: pt-20. Desktop: Reduced padding to ensure fit in 100vh without scroll */}
        <div
            className="relative z-10 w-full flex-1 flex flex-col lg:flex-row gap-6 lg:gap-12 pt-20 md:pt-24 pb-8 md:pb-8 px-4 md:px-12 md:overflow-hidden"
        >

            {/* Left Column: Info */}
            <div className="lg:w-1/3 flex flex-col justify-center shrink-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    {/* Logo */}
                    {data.logo && (
                        <img src={data.logo} alt={`${data.name} Logo`} className="h-10 md:h-16 w-auto object-contain mb-4 md:mb-6" />
                    )}

                    {/* Subhead */}
                    <h4 className={`font-serif italic text-sm md:text-xl mb-2 ${isDark ? 'text-white/60' : 'text-slate-400'}`}>{data.subhead}</h4>

                    {/* Title */}
                    <h2 className={`text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 md:mb-6 leading-tight ${data.textColor}`}>
                        {data.name}
                    </h2>

                    {/* Description - No clamping on mobile, let it scroll naturally */}
                    <p className={`font-light text-sm md:text-lg leading-relaxed mb-8 md:mb-8 max-w-md ${isDark ? 'text-white/70' : 'text-slate-500'}`}>
                        {data.description}
                    </p>
                </motion.div>
            </div>

            {/* Right Column: Service Grid */}
            <div className="lg:w-2/3 flex items-start lg:items-center pb-8 lg:pb-0">
                 <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full">
                    {data.services.map((service, idx) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            idx={idx}
                            isDark={isDark}
                            accentColor={accentColor}
                        />
                    ))}
                 </div>
            </div>
        </div>
    </section>
  );
};

// Service Card Component
const ServiceCard: React.FC<{ service: ServiceItem, idx: number, isDark: boolean, accentColor: string }> = ({ service, idx, isDark, accentColor }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className={`group relative rounded-lg md:rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${isDark ? 'bg-white/10 border border-white/10' : 'bg-white'}`}
            style={{ '--hover-color': accentColor } as React.CSSProperties}
        >
             <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />

             <div className="absolute bottom-0 left-0 p-3 md:p-4 w-full">
                {/* Indicator Line */}
                <div className="w-4 md:w-6 h-[2px] bg-white/50 mb-1 md:mb-2 group-hover:w-10 group-hover:bg-[var(--hover-color)] transition-all duration-300 shadow-sm"></div>

                {/* Service Title - Changed to White for readability */}
                <h5
                    className="text-xs md:text-base font-serif font-medium tracking-wide leading-snug text-white drop-shadow-md"
                >
                    {service.title}
                </h5>
             </div>
        </motion.div>
    );
};

export default DepartmentSection;
