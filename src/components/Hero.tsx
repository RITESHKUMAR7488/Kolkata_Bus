import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bus, Train, Ship, MapPin, ArrowRight, ChevronDown } from 'lucide-react';

/* ── Floating transit icon layer ── */
function FloatingIcon({
  Icon,
  color,
  size,
  x,
  y,
  depth,
  scrollY,
}: {
  Icon: React.ElementType;
  color: string;
  size: number;
  x: string;
  y: string;
  depth: number;
  scrollY: number;
}) {
  // Deeper layers move slower (parallax)
  const translateY = scrollY * depth * 0.3;
  const scale = 1 - Math.abs(depth) * 0.15;
  const opacity = 0.06 + (1 - Math.abs(depth)) * 0.08;

  return (
    <div
      className="absolute pointer-events-none transition-none"
      style={{
        left: x,
        top: y,
        transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
        opacity,
        color,
        willChange: 'transform',
      }}
    >
      <Icon size={size} />
    </div>
  );
}

/* ── 3D Tilt Card ── */
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  const rotateX = mousePos.y * -12;
  const rotateY = mousePos.x * 12;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`,
          transition: 'transform 0.15s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Main Hero Component ── */
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Scroll listener for parallax
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Parallax transforms
  const bgY = scrollY * 0.4;
  const textY = scrollY * 0.15;
  const opacity = Math.max(0, 1 - scrollY / 500);
  const scale = 1 + scrollY * 0.0003;

  // Floating icons data — different depths for parallax
  const icons = [
    { Icon: Bus, color: '#FF6B35', size: 48, x: '8%', y: '15%', depth: -0.8 },
    { Icon: Train, color: '#3B82F6', size: 40, x: '82%', y: '20%', depth: -1.2 },
    { Icon: Ship, color: '#3B82F6', size: 36, x: '15%', y: '70%', depth: -0.5 },
    { Icon: MapPin, color: '#008080', size: 32, x: '75%', y: '65%', depth: -1.0 },
    { Icon: Bus, color: '#008080', size: 28, x: '50%', y: '80%', depth: -1.5 },
    { Icon: Train, color: '#DC2626', size: 24, x: '90%', y: '45%', depth: -0.3 },
    { Icon: MapPin, color: '#FF6B35', size: 20, x: '5%', y: '45%', depth: -1.8 },
    { Icon: Ship, color: '#22C55E', size: 34, x: '60%', y: '10%', depth: -0.7 },
  ];

  return (
    <div
      ref={heroRef}
      className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E3E] mb-6"
      style={{ perspective: '1200px' }}
    >
      {/* ── Layer 1: Animated gradient background ── */}
      <div
        className="absolute inset-0 hero-gradient"
        style={{
          transform: `translate3d(0, ${bgY * 0.5}px, 0) scale(${scale})`,
          willChange: 'transform',
        }}
      />

      {/* ── Layer 2: Grid pattern for depth ── */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: `translate3d(0, ${bgY * 0.3}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* ── Layer 3: Floating transit icons at various depths ── */}
      <div className="absolute inset-0">
        {icons.map((icon, i) => (
          <FloatingIcon
            key={i}
            Icon={icon.Icon}
            color={icon.color}
            size={icon.size}
            x={icon.x}
            y={icon.y}
            depth={icon.depth}
            scrollY={scrollY}
          />
        ))}
      </div>

      {/* ── Layer 4: Decorative blobs ── */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.07] dark:opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, #FF6B35, transparent 70%)',
          transform: `translate3d(0, ${bgY * 0.6}px, 0)`,
          willChange: 'transform',
        }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.06] dark:opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, #008080, transparent 70%)',
          transform: `translate3d(0, ${bgY * 0.4}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* ── Layer 5: Content with parallax ── */}
      <div
        className="relative z-10 text-center py-12 md:py-16 px-6"
        style={{
          transform: `translate3d(0, ${textY}px, 0)`,
          opacity,
          willChange: 'transform, opacity',
        }}
      >
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF6B35]/10 dark:bg-[#FF6B35]/15 border border-[#FF6B35]/20 mb-5"
        >
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[12px] font-semibold text-[#FF6B35]">
            100% Free · No Sign-up
          </span>
        </motion.div>

        {/* Main heading with 3D perspective */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#1C1C28] dark:text-[#F1F1F4] tracking-tight mb-4 leading-tight"
          style={{ perspective: '800px' }}
        >
          Explore{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-[#FF6B35] via-[#FF8F5E] to-[#008080] bg-clip-text text-transparent">
              Kolkata
            </span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-3 bg-[#FF6B35]/15 dark:bg-[#FF6B35]/10 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ transformOrigin: 'left' }}
            />
          </span>
          <br />
          with Ease
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="text-[14px] md:text-[16px] text-[#6B7280] dark:text-[#A1A1AA] max-w-lg mx-auto leading-relaxed mb-8"
        >
          Plan your journey across buses, metro, trains & ferries —
          all in one place, completely free.
        </motion.p>

        {/* 3D Transport mode cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="flex items-center justify-center gap-3 md:gap-4 flex-wrap mb-8"
        >
          {[
            { label: 'Bus', color: '#FF6B35', bg: 'bg-[#FF6B35]/10 dark:bg-[#FF6B35]/15', icon: <Bus size={16} />, stops: '300+ routes' },
            { label: 'Metro', color: '#3B82F6', bg: 'bg-[#3B82F6]/10 dark:bg-[#3B82F6]/15', icon: <Train size={16} />, stops: 'Network map' },
            { label: 'Train', color: '#DC2626', bg: 'bg-[#DC2626]/10 dark:bg-[#DC2626]/15', icon: <Train size={16} />, stops: 'Station guide' },
            { label: 'Ferry', color: '#3B82F6', bg: 'bg-[#3B82F6]/10 dark:bg-[#3B82F6]/15', icon: <Ship size={16} />, stops: '10 connections' },
          ].map((item, i) => (
            <TiltCard
              key={item.label}
              className="flex-shrink-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: 15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl ${item.bg} border border-white/50 dark:border-white/10 backdrop-blur-sm shadow-lg shadow-black/5`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div style={{ color: item.color }}>{item.icon}</div>
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-[#9CA3AF]">{item.stops}</p>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <TiltCard className="inline-block">
            <button className="inline-flex items-center gap-2 px-6 py-3 btn-shimmer text-white rounded-xl font-semibold text-[15px] shadow-lg shadow-[#FF6B35]/25 hover:shadow-xl hover:shadow-[#FF6B35]/30 transition-shadow">
              Start Planning
              <ArrowRight size={16} />
            </button>
          </TiltCard>
        </motion.div>
      </div>

      {/* ── Layer 6: Scroll indicator ── */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity: Math.max(0, 1 - scrollY / 150) }}
      >
        <ChevronDown size={20} className="text-[#9CA3AF]" />
      </motion.div>
    </div>
  );
}
