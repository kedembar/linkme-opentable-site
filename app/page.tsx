"use client";

import { Fragment, useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════
   ANIMATION HELPERS
   ═══════════════════════════════════════════════ */

const ease: [number, number, number, number] = [0.25, 0.4, 0.25, 1];
const springy = { type: "spring" as const, stiffness: 100, damping: 15 };

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

const fadeUpStagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -80, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

const slideRight = {
  hidden: { opacity: 0, x: 80, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

const rotateIn = {
  hidden: { opacity: 0, rotateY: -15, scale: 0.9 },
  visible: { opacity: 1, rotateY: 0, scale: 1, transition: { duration: 0.8, ease } },
};

/* Animated counter hook */
function useCounter(end: number, duration: number = 2000, trigger: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, end, duration]);
  return count;
}

/* Scroll-triggered wrapper */
function Reveal({ children, className = "", delay = 0, variant = fadeUp }: { children: React.ReactNode; className?: string; delay?: number; variant?: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{ ...variant, visible: { ...variant.visible, transition: { ...variant.visible.transition, delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Parallax section background */
function ParallaxBg({ children, className = "", speed = 0.3 }: { children: React.ReactNode; className?: string; speed?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -100]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        {children}
      </motion.div>
    </div>
  );
}

/* Magnetic hover effect for interactive elements */
function MagneticWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   LOGOS
   ═══════════════════════════════════════════════ */

function LinkmeLogomark({ className = "", color = "#111111" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 143 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.9945 32.3964V37.5749H4.19736C3.55744 37.5749 3.03906 37.0619 3.03906 36.4285V7.82178H9.06651V32.3964H20.9945Z" fill={color}/>
      <path d="M30.4863 17.4587H24.584V37.5749H30.4863V17.4587Z" fill={color}/>
      <path d="M56.7131 24.3551V37.5748H50.8715V26.9842C50.8715 24.5391 48.8677 22.5576 46.3974 22.5576C45.1622 22.5576 44.0451 23.053 43.2353 23.8544C42.4256 24.6559 41.9251 25.7617 41.9251 26.9842V37.5748H36.2051V17.4587H41.8643L41.85 21.7208C41.85 19.2332 45.4 17.0376 47.9114 17.0376H49.3182C53.4026 17.0376 56.7131 20.3142 56.7131 24.3551Z" fill={color}/>
      <path d="M115.827 23.2778V37.575H110.304V24.3058C110.304 22.6321 108.927 21.2768 107.235 21.2874C106.082 21.2945 105.04 21.7616 104.287 22.5118C103.533 23.2637 103.068 24.2987 103.068 25.4398V37.575H97.5447V24.3058C97.5447 22.6321 96.1683 21.2768 94.4755 21.2874C93.3226 21.2945 92.2751 21.7616 91.5154 22.5118C90.7557 23.2637 90.2838 24.2987 90.2838 25.4398L90.2427 37.575H84.6979V17.7702C84.6979 16.4185 83.048 15.7427 82.0828 16.6981L72.3981 26.282L82.6673 37.575H75.4565L68.0634 28.9924V37.575H62.1289V6.72314H68.0634V23.0001L78.2218 12.9455C82.6887 8.52245 90.3285 11.6699 90.3088 17.9241L90.2963 21.8961C90.2963 19.0016 92.6791 16.6609 95.6016 16.6609H96.381C99.0015 16.6609 101.27 18.1541 102.367 20.3268C103.297 18.3611 105.438 16.6609 108.361 16.6609H109.14C112.833 16.6609 115.827 19.6244 115.827 23.2778Z" fill={color}/>
      <path d="M139.962 28.6616V26.8269C139.962 24.0191 138.813 21.4785 136.954 19.6385C135.096 17.7985 132.528 16.6609 129.691 16.6609C124.019 16.6609 119.422 21.2114 119.422 26.8269V28.2423C119.422 33.8472 124.012 38.3923 129.677 38.3923H131.135C133.145 38.3923 135.35 37.5856 137.056 36.2834C138.761 34.9813 139.962 33.1802 139.962 31.1916H134.664C134.664 32.8547 133.302 34.2028 131.622 34.2028H130.063C127.394 34.2028 125.233 32.062 125.233 29.4223V28.6616H139.962ZM129.827 20.6204H130.131C131.391 20.6204 132.531 21.1264 133.357 21.9438C134.183 22.7612 134.694 23.8917 134.694 25.139H125.263C125.263 22.6427 127.307 20.6204 129.827 20.6204Z" fill={color}/>
      <path d="M31.2162 10.435C31.2162 12.3263 29.5682 13.8602 27.534 13.8602C25.5016 13.8602 23.8535 12.3263 23.8535 10.435C23.8535 8.54369 25.5016 7.00977 27.534 7.00977C29.5682 7.00977 31.2162 8.54369 31.2162 10.435Z" fill={color}/>
    </svg>
  );
}

function OpenTableLogo({ className = "" }: { className?: string }) {
  return (
    <img src="/opentable-logo.svg" alt="OpenTable" className={className} />
  );
}

/* ═══════════════════════════════════════════════
   NAV — glassmorphism with scroll progress
   ═══════════════════════════════════════════════ */

function Nav() {
  const { scrollYProgress } = useScroll();
  const links = [
    { href: "#problem", label: "Problem" },
    { href: "#flow", label: "How It Works" },
    { href: "#demo", label: "Demo" },
    { href: "#automation", label: "Automation" },
    { href: "#examples", label: "Examples" },
    { href: "#options", label: "Models" },
    { href: "#timeline", label: "Timeline" },
  ];
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 bg-[rgba(250,250,250,0.8)] backdrop-blur-[30px] border-b border-black/[0.06] flex items-center justify-between"
      >
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-3 cursor-pointer">
          <LinkmeLogomark className="h-6 opacity-90" />
          <span className="text-[#DC2626] text-lg font-light">&times;</span>
          <OpenTableLogo className="h-5 opacity-90" />
        </a>
        <div className="hidden md:flex gap-7">
          {links.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="text-[#9CA3AF] text-[13px] font-medium tracking-wider uppercase hover:text-[#DC2626] transition-colors duration-300 animated-underline"
              style={{ position: "relative", display: "inline-block" }}
            >
              {l.label}
            </motion.a>
          ))}
        </div>
      </motion.nav>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(90deg, #DC2626, #EF4444, #DC2626)",
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════
   SECTION HELPERS
   ═══════════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[3px] uppercase text-[#DC2626] mb-4 relative">
        <motion.span
          className="w-8 h-[2px] bg-gradient-to-r from-[#DC2626] to-[#EF4444] rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ transformOrigin: "left" }}
        />
        <span className="relative z-10">{children}</span>
        <motion.span
          className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#DC2626]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </Reveal>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className="text-4xl md:text-[56px] font-extrabold tracking-tight leading-[1.08] mb-6">{children}</h2>
    </Reveal>
  );
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return (
    <Reveal delay={0.1}>
      <p className="text-lg text-[#9CA3AF] max-w-[720px] leading-relaxed mb-12">{children}</p>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════
   GLASS CARD
   ═══════════════════════════════════════════════ */

function GlassCard({ label, children, borderColor, className = "", delay = 0 }: { label?: string; children: React.ReactNode; borderColor?: string; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} variant={scaleIn}>
      <div className={`glass gradient-border-hover rounded-2xl p-8 ${className}`} style={borderColor ? { borderLeft: `3px solid ${borderColor}` } : undefined}>
        {label && <div className="text-xs font-semibold tracking-[1.5px] uppercase mb-3" style={{ color: borderColor || "#9CA3AF" }}>{label}</div>}
        {children}
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════
   FLOW STEP — animated
   ═══════════════════════════════════════════════ */

function FlowStep({ num, title, desc, last = false, delay = 0 }: { num: number; title: string; desc: string; last?: boolean; delay?: number }) {
  return (
    <Reveal delay={delay} variant={scaleIn}>
      <motion.div
        className="glass gradient-border-hover rounded-xl p-6 text-center relative group cursor-default"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <motion.div
          className="w-10 h-10 bg-gradient-to-br from-[#DC2626] to-[#EF4444] text-[#FFFFFF] rounded-full flex items-center justify-center text-sm font-extrabold mx-auto mb-4 relative pulse-ring"
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {num}
        </motion.div>
        <div className="text-sm font-bold mb-2 group-hover:text-[#DC2626] transition-colors duration-200">{title}</div>
        <div className="text-xs text-[#9CA3AF] leading-relaxed group-hover:text-[#666] transition-colors duration-200">{desc}</div>
        {!last && (
          <motion.div
            className="hidden lg:block absolute -right-[18px] top-1/2 text-[#DC2626] text-lg"
            animate={{ x: [0, 5, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            &rarr;
          </motion.div>
        )}
      </motion.div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════
   PRICE ITEM — with animated counter
   ═══════════════════════════════════════════════ */

function PriceItem({ label, amount, amountColor, suffix, note }: { label: string; amount: string; amountColor: string; suffix?: string; note: string }) {
  return (
    <motion.div
      className="glass rounded-xl p-6 text-center group relative overflow-hidden"
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DC2626]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="text-xs font-semibold text-[#9CA3AF] tracking-[1.5px] uppercase mb-3">{label}</div>
      <div className="text-[36px] font-extrabold num-glow" style={{ color: amountColor }}>
        {amount}
        {suffix && <span className="text-lg text-[#9CA3AF]">{suffix}</span>}
      </div>
      <div className="text-xs text-[#9CA3AF] mt-2">{note}</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   FEATURE — animated icon
   ═══════════════════════════════════════════════ */

function Feature({ title, desc, small = false, delay = 0 }: { title: string; desc: string; small?: boolean; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="mb-8 group">
        <div className={`${small ? "text-base" : "text-lg"} font-bold mb-1.5 group-hover:text-[#DC2626] transition-colors`}>{title}</div>
        <div className="text-[15px] text-[#9CA3AF] leading-relaxed">{desc}</div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════
   CALLOUT
   ═══════════════════════════════════════════════ */

function Callout({ children, green = false }: { children: React.ReactNode; green?: boolean }) {
  return (
    <Reveal>
      <div className={`py-5 px-6 my-8 rounded-r-xl text-base text-[#9CA3AF] leading-relaxed ${green ? "border-l-[3px] border-l-[#DC2626] bg-[rgba(34,197,94,0.06)]" : "border-l-[3px] border-l-[#DC2626] bg-[rgba(247,168,40,0.06)]"}`}>
        {children}
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════
   ANIMATED STAT CARD — for the "70K" section
   ═══════════════════════════════════════════════ */

function StatCard({ value, suffix, label, delay = 0 }: { value: number; suffix: string; label: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCounter(value, 2000, isInView);
  return (
    <Reveal delay={delay} variant={scaleIn}>
      <MagneticWrap>
        <div ref={ref} className="glass rounded-2xl p-8 text-center group card-3d relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DC2626]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <motion.div
            className="text-5xl font-extrabold mb-2 num-glow gradient-text"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
          >
            {count.toLocaleString()}{suffix}
          </motion.div>
          <div className="text-sm text-[#9CA3AF] font-medium">{label}</div>
        </div>
      </MagneticWrap>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════
   BOOKING FLOW DEMO — interactive phone mockup
   ═══════════════════════════════════════════════ */

/* iOS status bar */
function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? "white" : "black";
  return (
    <div className={`flex items-center justify-between px-5 pt-1 pb-0 text-[12px] font-semibold ${dark ? "text-white" : "text-black"}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <svg width="16" height="12" viewBox="0 0 16 12" fill={c}><rect x="0" y="5" width="3" height="7" rx="0.5"/><rect x="4" y="3" width="3" height="9" rx="0.5"/><rect x="8" y="1" width="3" height="11" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
        <svg width="15" height="12" viewBox="0 0 15 12" fill={c}><path d="M7.5 3.6C9.3 3.6 10.9 4.3 12 5.5L13.4 4.1C11.9 2.5 9.8 1.5 7.5 1.5S3.1 2.5 1.6 4.1L3 5.5C4.1 4.3 5.7 3.6 7.5 3.6zM7.5 6.8c1.1 0 2 .4 2.8 1.2l1.4-1.4c-1.1-1.1-2.6-1.8-4.2-1.8s-3.1.7-4.2 1.8L4.7 8c.8-.8 1.7-1.2 2.8-1.2zM7.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0" y="1" width="21" height="10" rx="2" stroke={c} strokeWidth="1"/><rect x="1.5" y="2.5" width="16" height="7" rx="1" fill={c}/><rect x="22" y="4" width="2" height="4" rx="0.5" fill={c}/></svg>
      </div>
    </div>
  );
}

function BookingFlowDemo() {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-100px" });
  const wasInView = useRef(false);
  const steps = [
    { label: "Instagram Bio", sublabel: "Guest taps link.me/mila" },
    { label: "Linkme Profile", sublabel: "Taps Reserve Dinner" },
    { label: "Book via OpenTable", sublabel: "Select time & confirm" },
    { label: "Confirmed", sublabel: "Seated cover earned" },
  ];

  /* Reset to step 0 each time the section re-enters the viewport */
  useEffect(() => {
    if (isInView && !wasInView.current) {
      setStep(0);
    }
    wasInView.current = isInView;
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isInView]);

  /* Reusable photo-like gradient blocks that simulate real restaurant imagery */
  const photoGrads = [
    "linear-gradient(135deg, #3d2218 0%, #8B4513 40%, #CD853F 70%, #A0522D 100%)", // warm food
    "linear-gradient(220deg, #1a0f0a 0%, #5c2e1a 30%, #8B4513 60%, #3d2218 100%)", // dark interior
    "linear-gradient(160deg, #D2691E 0%, #A0522D 30%, #6B3410 70%, #2c1810 100%)", // brunch
    "linear-gradient(200deg, #2c1810 0%, #4a3528 30%, #CD853F 60%, #8B6914 100%)", // golden
    "linear-gradient(145deg, #8B4513 0%, #3d2820 40%, #1a0f0a 70%, #5c2e1a 100%)", // moody
    "linear-gradient(180deg, #A0522D 0%, #CD853F 30%, #D2691E 60%, #8B4513 100%)", // sunset
    "linear-gradient(170deg, #4a2a18 0%, #2c1810 40%, #6B3410 70%, #A0522D 100%)", // nightlife
    "linear-gradient(130deg, #6B3410 0%, #8B4513 30%, #3d2218 60%, #2c1810 100%)", // lounge
    "linear-gradient(190deg, #1a0f0a 0%, #3d2820 30%, #8B4513 70%, #CD853F 100%)", // bar
    "linear-gradient(150deg, #CD853F 0%, #8B6914 30%, #A0522D 60%, #3d2218 100%)", // cocktail
    "linear-gradient(210deg, #5c2e1a 0%, #8B4513 30%, #D2691E 60%, #4a3528 100%)", // plating
    "linear-gradient(140deg, #2c1810 0%, #6B3410 30%, #A0522D 60%, #CD853F 100%)", // ambiance
  ];

  /* Real restaurant / food photos from Unsplash */
  const photoUrls = [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop&auto=format&q=80", // fine dining plate
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=300&fit=crop&auto=format&q=80", // restaurant interior
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=300&fit=crop&auto=format&q=80", // cocktail
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop&auto=format&q=80", // food overhead
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop&auto=format&q=80", // restaurant bar
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=300&fit=crop&auto=format&q=80", // plated dish colorful
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=300&fit=crop&auto=format&q=80", // dark cocktail
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=300&h=300&fit=crop&auto=format&q=80", // table setting
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&h=300&fit=crop&auto=format&q=80", // food plate
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300&h=300&fit=crop&auto=format&q=80", // steak
    "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=300&fit=crop&auto=format&q=80", // sushi
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300&h=300&fit=crop&auto=format&q=80", // nightlife
  ];

  const coverPhoto = "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=200&fit=crop&auto=format&q=80";

  const storyPhotos = [
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=80&h=80&fit=crop&auto=format&q=80", // DJ
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop&auto=format&q=80", // food
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop&auto=format&q=80", // interior
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop&auto=format&q=80", // plating
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=80&h=80&fit=crop&auto=format&q=80", // brunch
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=80&h=80&fit=crop&auto=format&q=80", // cocktail
  ];

  const screens: Record<number, React.ReactNode> = {
    0: (
      /* Instagram profile — matches real @milagroup_miami */
      <div className="h-full bg-white flex flex-col text-[#262626]">
        <StatusBar />
        {/* IG Nav bar */}
        <div className="flex items-center justify-between px-4 py-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[14px]">milagroup_miami</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#3897F0"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.5 14.5l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z"/></svg>
          </div>
          <div className="flex items-center gap-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="1.5"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </div>
        </div>
        {/* Profile header */}
        <div className="px-4 flex items-center gap-5 mt-1">
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[3px] shrink-0">
            <div className="w-full h-full rounded-full bg-white p-[2px]">
              <div className="w-full h-full rounded-full bg-[#8B4513] flex items-center justify-center overflow-hidden" style={{background:"radial-gradient(circle at 40% 40%, #A0522D 0%, #8B4513 50%, #6B3410 100%)"}}>
                <span className="text-white text-[11px] font-light tracking-[2px]" style={{fontFamily:"serif"}}>MILA</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-around text-center">
            <div><div className="font-bold text-[16px]">1,120</div><div className="text-[13px] text-[#262626] font-normal">posts</div></div>
            <div><div className="font-bold text-[16px]">217K</div><div className="text-[13px] text-[#262626] font-normal">followers</div></div>
            <div><div className="font-bold text-[16px]">191</div><div className="text-[13px] text-[#262626] font-normal">following</div></div>
          </div>
        </div>
        {/* Bio */}
        <div className="px-4 mt-3">
          <div className="font-semibold text-[13px]">MILA Miami Beach</div>
          <div className="text-[12px] text-[#8E8E8E]">Restaurant</div>
          <div className="text-[13px] mt-0.5 leading-[18px]">Where MediterrAsian cuisine meets nightlife</div>
          <div className="text-[13px] leading-[18px]">Rooftop Restaurant · Lounge · <span className="text-[#00376B]">@milaomakase</span></div>
          <div className="text-[13px] leading-[18px]">Members: <span className="text-[#00376B]">@mm_membersclub</span></div>
          <motion.div
            onClick={() => setStep(1)}
            className="text-[13px] text-[#00376B] font-medium mt-0.5 cursor-pointer"
            whileTap={{ opacity: 0.5 }}
          >
            <span className="inline-flex items-center gap-0.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00376B" strokeWidth="2.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              link.me/mila
            </span>
          </motion.div>
          <div className="text-[12px] text-[#8E8E8E] mt-1 flex items-center gap-1">
            <div className="flex -space-x-1.5">
              <div className="w-4 h-4 rounded-full border border-white" style={{background:"radial-gradient(circle, #555 0%, #333 100%)"}} />
              <div className="w-4 h-4 rounded-full border border-white" style={{background:"radial-gradient(circle, #777 0%, #555 100%)"}} />
            </div>
            Followed by <span className="text-[#262626] font-medium">nihad_hebib</span> + 28 more
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex gap-1.5 px-4 mt-3">
          <div className="flex-1 bg-[#0095F6] text-white text-[13px] font-semibold py-[6px] rounded-lg text-center">Follow</div>
          <div className="flex-1 bg-[#EFEFEF] text-[#262626] text-[13px] font-semibold py-[6px] rounded-lg text-center">Message</div>
          <div className="w-[32px] bg-[#EFEFEF] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          </div>
        </div>
        {/* Story highlights */}
        <div className="flex gap-2.5 px-4 mt-3 overflow-hidden">
          {["DJ LINEUP","RACE WEEK","PRESS","BEST OF","BRUNCH","FOOD"].map((h, i) => (
            <div key={h} className="flex flex-col items-center shrink-0">
              <div className="w-[52px] h-[52px] rounded-full border border-[#DBDBDB] p-[3px]">
                <div className="w-full h-full rounded-full overflow-hidden" style={{background: photoGrads[i]}}>
                  <img src={storyPhotos[i]} alt={h} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <div className="text-[9px] mt-1 text-center leading-tight" style={{maxWidth:52}}>{h}</div>
            </div>
          ))}
        </div>
        {/* Grid tabs */}
        <div className="flex border-t border-[#DBDBDB] mt-3">
          <div className="flex-1 py-2.5 flex justify-center border-b border-[#262626]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#262626"><rect x="1" y="1" width="9" height="9"/><rect x="14" y="1" width="9" height="9"/><rect x="1" y="14" width="9" height="9"/><rect x="14" y="14" width="9" height="9"/></svg>
          </div>
          <div className="flex-1 py-2.5 flex justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E8E" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          </div>
          <div className="flex-1 py-2.5 flex justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E8E" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </div>
        {/* Photo grid — real restaurant photos */}
        <div className="flex-1 grid grid-cols-3 gap-[1px]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square relative overflow-hidden" style={{background: photoGrads[i % photoGrads.length]}}>
              <img src={photoUrls[i]} alt="" className="w-full h-full object-cover" loading="lazy" />
              {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"/>}
              {i === 4 && <div className="absolute top-1 right-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="white" opacity="0.7"><rect x="1" y="1" width="10" height="10" rx="1"/><rect x="13" y="1" width="10" height="10" rx="1"/></svg></div>}
            </div>
          ))}
        </div>
        {/* Bottom nav */}
        <div className="flex items-center justify-around py-2 border-t border-[#DBDBDB] shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#262626"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          <div className="w-[22px] h-[22px] rounded-full border border-[#262626]" style={{background:"radial-gradient(circle, #888 0%, #555 100%)"}} />
        </div>
      </div>
    ),
    1: (
      /* Linkme profile — dark layout matching real link.me/mila */
      <div className="h-full bg-black flex flex-col overflow-y-auto">
        <StatusBar dark />
        {/* Cover photo — restaurant interior */}
        <div className="h-[100px] relative overflow-hidden">
          <div className="absolute inset-0" style={{background:"linear-gradient(135deg, #4a3020 0%, #2c1810 25%, #1a0f0a 50%, #3d2820 75%, #4a3528 100%)"}} />
          <img src={coverPhoto} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        {/* Profile info */}
        <div className="px-4 pt-4 text-center">
          <div className="font-bold text-[16px] text-white flex items-center justify-center gap-1">
            MILA Miami Beach
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#7C6BF0"><path d="M12 1l2.09 3.36L18 5.27l-1.91 3.36L17.18 13l-3.91.91L12 17l-1.27-3.09L6.82 13l1.09-4.37L6 5.27l3.91-.91L12 1z"/><path d="M10 13l-1.5-1.5 1-1 .5.5 2.5-2.5 1 1L10 13z" fill="white"/></svg>
          </div>
          <div className="text-[12px] text-[#999] mt-0.5">@mila</div>
          {/* Social icons */}
          <div className="flex justify-center gap-2.5 mt-3">
            <div className="w-[34px] h-[34px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </div>
            <div className="w-[34px] h-[34px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954"><circle cx="12" cy="12" r="10"/><path d="M8 15.5c3-1 6-.5 8 1M7.5 12.5c3.5-1 7.5-.5 10 1.5M7 9.5c4-1.5 9-.5 12 2" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
            </div>
            <div className="w-[34px] h-[34px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#DA3743] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"/></div>
            </div>
            <div className="w-[34px] h-[34px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="18" cy="6" r="1.5" fill="white" stroke="none"/></svg>
            </div>
          </div>
          <div className="text-[12px] text-white/60 mt-2.5 flex items-center justify-center gap-1">218K Total Followers <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-40"><polyline points="6 9 12 15 18 9"/></svg></div>
        </div>
        <div className="px-4 mt-2 text-center">
          <div className="text-[12px] text-white/50 leading-relaxed">Where MediterrAsian cuisine meets nightlife<br/>Rooftop Restaurant · MILA Lounge · MILA Omakase</div>
        </div>
        {/* Link cards with photo backgrounds */}
        <div className="px-3 mt-3 space-y-2">
          {/* Reserve Dinner — main CTA with tap animation */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep(2)}
            className="relative h-[80px] rounded-xl overflow-hidden cursor-pointer"
            animate={step === 1 ? { scale: [1, 0.97, 1] } : {}}
            transition={{ delay: 2.5, duration: 0.3 }}
          >
            <div className="absolute inset-0" style={{background: photoGrads[0]}} />
            <img src={photoUrls[0]} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            {/* Pulsing border highlight */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-white/70 pointer-events-none"
              animate={{ opacity: [0, 0.8, 0, 0.8, 0] }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
            <div className="absolute top-2 left-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-60"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            </div>
            <div className="absolute bottom-3 left-0 right-0 text-center text-white text-[13px] font-semibold drop-shadow-lg">Reserve MILA Restaurant Dinner</div>
            {/* Animated tap cursor */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ right: 24, bottom: 16 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.5, 0.5, 1, 0.85, 0.85], y: [10, 10, 0, 2, 2] }}
              transition={{ duration: 3, times: [0, 0.5, 0.65, 0.8, 1], ease: "easeInOut" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
                <path d="M12 1a4 4 0 00-4 4v6.5l-1.3-1.3a2 2 0 00-2.83 2.83l5.6 5.6A6 6 0 0013.6 21H15a6 6 0 006-6v-5a2 2 0 00-4 0v3a1 1 0 01-2 0V5a2 2 0 00-2-2 2 2 0 00-2 2v6a1 1 0 01-2 0V5a4 4 0 014-4z"/>
              </svg>
            </motion.div>
          </motion.div>
          {/* Celebrate Mother's Day */}
          <div className="relative h-[75px] rounded-xl overflow-hidden">
            <div className="absolute inset-0" style={{background: photoGrads[5]}} />
            <img src={photoUrls[5]} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute top-2 left-2"><div className="w-3.5 h-3.5 rounded-full bg-[#DA3743] flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-white"/></div></div>
            <div className="absolute bottom-3 left-0 right-0 text-center text-white text-[12px] font-semibold drop-shadow-lg">Celebrate Mother&apos;s Day</div>
          </div>
          {/* Two-column cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative h-[65px] rounded-xl overflow-hidden">
              <div className="absolute inset-0" style={{background: photoGrads[2]}} />
              <img src={photoUrls[2]} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-2 left-2"><div className="w-3.5 h-3.5 rounded-full bg-[#DA3743] flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-white"/></div></div>
              <div className="absolute bottom-2 left-0 right-0 text-center text-white text-[10px] font-semibold px-1 drop-shadow-lg">Reserve Sunday Brunch</div>
            </div>
            <div className="relative h-[65px] rounded-xl overflow-hidden">
              <div className="absolute inset-0" style={{background: photoGrads[6]}} />
              <img src={photoUrls[6]} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-2 left-2"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-60"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg></div>
              <div className="absolute bottom-2 left-0 right-0 text-center text-white text-[10px] font-semibold px-1 drop-shadow-lg">Reserve Bottle Service</div>
            </div>
          </div>
          {/* Two more cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative h-[65px] rounded-xl overflow-hidden">
              <div className="absolute inset-0" style={{background: photoGrads[4]}} />
              <img src={photoUrls[4]} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-2 left-2"><div className="w-3.5 h-3.5 rounded-full bg-[#DA3743] flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-white"/></div></div>
              <div className="absolute bottom-2 left-0 right-0 text-center text-white text-[10px] font-semibold px-1 drop-shadow-lg">Lounge Dinner</div>
            </div>
            <div className="relative h-[65px] rounded-xl overflow-hidden">
              <div className="absolute inset-0" style={{background: photoGrads[7]}} />
              <img src={photoUrls[7]} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-2 left-2"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-60"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg></div>
              <div className="absolute bottom-2 left-0 right-0 text-center text-white text-[10px] font-semibold px-1 drop-shadow-lg">Private Events</div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-4 mt-3 pb-3">
          <div className="text-[11px] text-white/30 text-center flex items-center justify-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>
            marketing@milarestaurant.com
          </div>
          <div className="text-center text-[9px] text-white/20 mt-2">Privacy Policy | Terms | Report</div>
        </div>
      </div>
    ),
    2: (
      /* OpenTable booking — combined: party size, date, time + available slots on one screen */
      <div className="h-full bg-white flex flex-col">
        <StatusBar />
        <div className="bg-[#DA3743] px-4 py-3 flex items-center gap-3">
          <div onClick={() => setStep(1)} className="text-white cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-[15px]">Book a Table</div>
            <div className="text-white/70 text-[11px]">MILA Miami Beach</div>
          </div>
          <OpenTableLogo className="h-4 brightness-0 invert" />
        </div>
        <div className="px-5 pt-4 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-semibold text-[#666] mb-1.5">Party Size</div>
              <div className="flex gap-1.5">
                {[1,2,3,4,5,6,"7+"].map((n) => (
                  <div key={n} className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-semibold cursor-pointer ${n === 2 ? "bg-[#DA3743] text-white" : "bg-[#F5F5F5] text-[#666]"}`}>{n}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#666] mb-1.5">Date</div>
              <div className="flex gap-1.5 overflow-hidden">
                {[{d:"24",l:"Today"},{d:"25",l:"Fri"},{d:"26",l:"Sat"},{d:"27",l:"Sun"},{d:"28",l:"Mon"}].map((item, i) => (
                  <div key={item.d} className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg cursor-pointer ${i === 0 ? "bg-[#DA3743] text-white" : "bg-[#F5F5F5] text-[#666]"}`}>
                    <div className="text-[9px]">{item.l}</div>
                    <div className="text-[14px] font-bold">{item.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#666] mb-1.5">Available Times</div>
              <div className="grid grid-cols-3 gap-1.5">
                {["6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM"].map((t, i) => (
                  <div key={t} className={`py-2 rounded-lg text-[12px] font-semibold text-center cursor-pointer ${i === 2 ? "bg-[#DA3743] text-white" : "border border-[#E5E5E5] text-[#333]"}`}>{t}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-[#F0FAF0] border border-[#C8E6C9] rounded-xl flex items-start gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#4CAF50" className="shrink-0 mt-0.5"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.5 14.5l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z"/></svg>
            <div>
              <div className="text-[11px] text-[#2E7D32] font-semibold">OpenTable account detected</div>
              <div className="text-[10px] text-[#558B2F] mt-0.5">Your info syncs automatically</div>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep(3)}
            className="w-full py-3 bg-[#DA3743] text-white text-[14px] font-bold rounded-xl mt-4 cursor-pointer"
          >
            Complete Reservation
          </motion.button>
          <div className="text-center mt-2 mb-3 text-[10px] text-[#BCBCBC]">Powered by OpenTable</div>
        </div>
      </div>
    ),
    3: (
      /* Confirmation */
      <div className="h-full bg-white flex flex-col">
        <StatusBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-14 h-14 bg-[#4CAF50] rounded-full flex items-center justify-center mb-4"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="text-[18px] font-bold text-[#111] mb-1">Reservation Confirmed!</div>
            <div className="text-[12px] text-[#999] mb-5">Confirmation sent to your email</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="w-full">
            <div className="bg-[#FAFAFA] rounded-xl p-4 mb-4 border border-[#F0F0F0] text-left">
              <div className="font-bold text-[14px] text-[#111] mb-2">MILA Miami Beach</div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between"><span className="text-[#999]">Date</span><span className="font-medium text-[#333]">Thursday, Apr 24</span></div>
                <div className="flex justify-between"><span className="text-[#999]">Time</span><span className="font-medium text-[#333]">7:30 PM</span></div>
                <div className="flex justify-between"><span className="text-[#999]">Guests</span><span className="font-medium text-[#333]">2</span></div>
                <div className="flex justify-between"><span className="text-[#999]">Confirmation #</span><span className="font-bold text-[#DA3743]">OT-284719</span></div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="w-full">
            <div className="p-3 bg-[#FFF5F5] border border-[#FFCDD2] rounded-xl">
              <div className="text-[12px] text-[#DA3743] font-bold">Booked via OpenTable widget</div>
              <div className="text-[11px] text-[#999] mt-0.5">Cover fee earned + source: Instagram bio</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-4 text-[10px] text-[#CCC]">
            Booked on link.me/mila
          </motion.div>
        </div>
      </div>
    ),
  };

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      {/* Step indicators */}
      <div className="flex-1 space-y-3 order-2 lg:order-1">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            onClick={() => setStep(i)}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${i === step ? "bg-white shadow-lg border border-black/[0.06]" : "hover:bg-white/50"}`}
            animate={{ x: i === step ? 8 : 0 }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 transition-colors ${i === step ? "bg-[#DA3743] text-white" : i < step ? "bg-[#4CAF50] text-white" : "bg-gray-200 text-gray-500"}`}>
              {i < step ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : i + 1}
            </div>
            <div>
              <div className={`text-[16px] font-bold transition-colors ${i === step ? "text-[#111]" : "text-[#CCC]"}`}>{s.label}</div>
              <div className={`text-[13px] transition-colors ${i === step ? "text-[#999]" : "text-[#DDD]"}`}>{s.sublabel}</div>
            </div>
          </motion.div>
        ))}
        <div className="mt-4 p-4 bg-[#FFF5F5] rounded-xl border border-[#FFCDD2]">
          <div className="text-[14px] font-bold text-[#DA3743]">4 taps to a seated cover</div>
          <div className="text-[12px] text-[#999] mt-1">Bio link &rarr; Linkme &rarr; Book &rarr; Done.<br/>Every booking routes through OpenTable.</div>
        </div>
      </div>

      {/* Phone mockup */}
      <div className="order-1 lg:order-2 shrink-0">
        <motion.div
          className="relative phone-float"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="w-[300px] h-[620px] bg-[#1a1a1a] rounded-[44px] p-[10px] shadow-2xl ring-1 ring-white/10 relative">
            {/* Subtle reflection */}
            <div className="absolute inset-0 rounded-[44px] overflow-hidden pointer-events-none z-30">
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/[0.03] to-transparent" />
            </div>
            <div className="w-full h-full bg-white rounded-[34px] overflow-hidden relative">
              {/* Dynamic Island */}
              <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-black rounded-full z-20" />
              {/* Screen */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 40, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -40, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease }}
                  className="absolute inset-0 pt-[30px]"
                >
                  {screens[step]}
                </motion.div>
              </AnimatePresence>
              {/* Home indicator */}
              <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-black/20 rounded-full z-20" />
            </div>
          </div>
          {/* Glow behind phone */}
          <motion.div
            className="absolute -inset-16 rounded-full -z-10"
            animate={{
              background: [
                "radial-gradient(circle, rgba(220,38,67,0.08) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(220,38,67,0.12) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(220,38,67,0.08) 0%, transparent 70%)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "blur(60px)" }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMMENT "BOOK" AUTOMATION DEMO
   ═══════════════════════════════════════════════ */

function CommentBookDemo() {
  const [phase, setPhase] = useState(0);
  const [loopKey, setLoopKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-100px" });
  const wasInView = useRef(false);

  /* phase timeline:
     0 = post visible, no comments yet
     1 = first comment appears
     2 = second comment appears
     3 = "BOOK" comment appears + highlight
     4 = "detecting" badge on BOOK comment
     5 = DM panel slides in
     6 = DM messages animate in one by one
     7 = booking confirmed notification
     8 = pause, then reset
  */

  /* Reset to beginning each time the section re-enters the viewport */
  useEffect(() => {
    if (isInView && !wasInView.current) {
      setPhase(0);
      setLoopKey((k) => k + 1);
    }
    wasInView.current = isInView;
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;
    const delays = [1200, 1400, 1200, 900, 1200, 600, 1800, 2500, 0];
    let timeout: NodeJS.Timeout;
    if (phase < 8) {
      timeout = setTimeout(() => setPhase((p) => p + 1), delays[phase]);
    } else {
      timeout = setTimeout(() => {
        setPhase(0);
        setLoopKey((k) => k + 1);
      }, 2800);
    }
    return () => clearTimeout(timeout);
  }, [phase, loopKey, isInView]);

  const comments = [
    { user: "foodie.sarah", avatar: "#E91E63", text: "This looks incredible", delay: 0 },
    { user: "miami_nights", avatar: "#9C27B0", text: "We need to go here", delay: 0 },
    { user: "jess.martinez", avatar: "#2196F3", text: "BOOK", isBook: true, delay: 0 },
  ];

  return (
    <div ref={containerRef}>
    <div key={loopKey} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

      {/* ── LEFT: Simulated Instagram Post ── */}
      <div className="glass rounded-[20px] overflow-hidden border border-black/[0.06]">
        {/* Post header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-black/[0.04]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[2px]">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop&auto=format&q=80" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-semibold text-[#262626]">milagroup_miami</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#3897F0"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.5 14.5l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z"/></svg>
            </div>
            <div className="text-[11px] text-[#8E8E8E]">MILA Miami Beach</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </div>

        {/* Post image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#1a0f0a]">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&auto=format&q=80"
            alt="Restaurant dish"
            className="w-full h-full object-cover"
          />
          {/* Double-tap heart animation */}
          <AnimatePresence>
            {phase >= 1 && phase <= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <svg width="80" height="80" viewBox="0 0 24 24" fill="white" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Post actions */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-4 mb-2">
            <motion.svg
              width="24" height="24" viewBox="0 0 24 24"
              fill={phase >= 1 ? "#ED4956" : "none"}
              stroke={phase >= 1 ? "#ED4956" : "#262626"}
              strokeWidth="2"
              animate={phase >= 1 ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </motion.svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </div>
          <div className="text-[14px] font-semibold text-[#262626] mb-1">
            <motion.span
              key={phase >= 1 ? "liked" : "initial"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {phase >= 2 ? "2,847" : phase >= 1 ? "2,846" : "2,845"} likes
            </motion.span>
          </div>
          <div className="text-[13px] text-[#262626]">
            <span className="font-semibold">milagroup_miami</span>{" "}
            <span className="text-[#262626]">Tonight&apos;s special. MediterrAsian wagyu tataki with truffle ponzu and gold leaf. Limited availability.</span>
            <br />
            <span className="text-[#262626] font-semibold">Comment &ldquo;BOOK&rdquo; and we&apos;ll send you the link to reserve your table.</span>
          </div>
        </div>

        {/* Comments section */}
        <div className="px-5 pb-4 space-y-2.5 min-h-[120px]">
          <div className="text-[12px] text-[#8E8E8E] mb-1">View all 47 comments</div>
          <AnimatePresence>
            {comments.map((c, i) => (
              phase >= i + 1 && (
                <motion.div
                  key={c.user}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, ease }}
                  className="flex items-start gap-2.5 relative"
                >
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ background: c.avatar }}>
                    {c.user[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px]">
                      <span className="font-semibold text-[#262626]">{c.user}</span>{" "}
                      {c.isBook ? (
                        <motion.span
                          className="font-black text-[#262626] relative"
                          animate={phase >= 4 ? { color: "#DA3743" } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          BOOK
                          {/* Detection pulse */}
                          <AnimatePresence>
                            {phase >= 4 && phase < 6 && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8, x: 8 }}
                                animate={{ opacity: 1, scale: 1, x: 8 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 bg-[#DA3743] text-white text-[9px] font-bold rounded-full whitespace-nowrap absolute -top-0.5"
                              >
                                <motion.span
                                  className="w-1.5 h-1.5 rounded-full bg-white"
                                  animate={{ opacity: [1, 0.3, 1] }}
                                  transition={{ repeat: Infinity, duration: 0.8 }}
                                />
                                Trigger detected
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.span>
                      ) : (
                        <span className="text-[#262626]">{c.text}</span>
                      )}
                    </span>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C7C7C7" strokeWidth="1.5" className="shrink-0 mt-1"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT: DM + Booking Confirmation Panel ── */}
      <div className="space-y-4">
        {/* Status indicator — what's happening */}
        <div className="glass rounded-[16px] p-5 border border-black/[0.06]">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              animate={{
                background: phase >= 4 ? "#DA3743" : phase >= 1 ? "#F3F4F6" : "#F3F4F6",
              }}
              transition={{ duration: 0.3 }}
            >
              {phase >= 4 ? (
                <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></motion.svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              )}
            </motion.div>
            <div>
              <motion.div
                className="text-[14px] font-bold"
                animate={{ color: phase >= 4 ? "#DA3743" : "#111" }}
              >
                {phase < 1 && "Monitoring comments..."}
                {phase >= 1 && phase < 3 && "Scanning new comments..."}
                {phase >= 3 && phase < 4 && "Trigger word found"}
                {phase >= 4 && phase < 5 && "Processing automation..."}
                {phase >= 5 && phase < 7 && "Sending DM to @jess.martinez"}
                {phase >= 7 && "Booking confirmed"}
              </motion.div>
              <div className="text-[12px] text-[#9CA3AF]">
                {phase < 3 && "Waiting for trigger words: book, reserve, table..."}
                {phase >= 3 && phase < 5 && `"BOOK" matched in comment by @jess.martinez`}
                {phase >= 5 && phase < 7 && "Auto-DM with booking link via Linkme"}
                {phase >= 7 && "Cover fee earned + source: Instagram comment"}
              </div>
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-1 mt-2">
            {["Comment", "Detect", "DM", "Booked"].map((label, i) => {
              const stepPhases = [1, 4, 5, 7];
              const active = phase >= stepPhases[i];
              return (
                <Fragment key={label}>
                  <motion.div
                    className="flex items-center gap-1.5"
                    animate={{ opacity: active ? 1 : 0.3 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                      animate={{
                        background: active ? "#DA3743" : "#E5E7EB",
                        color: active ? "#fff" : "#9CA3AF",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {active ? (
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></motion.svg>
                      ) : (
                        i + 1
                      )}
                    </motion.div>
                    <span className="text-[11px] font-medium">{label}</span>
                  </motion.div>
                  {i < 3 && (
                    <motion.div
                      className="flex-1 h-[2px] rounded-full mx-1"
                      animate={{
                        background: phase >= stepPhases[i + 1] ? "#DA3743" : "#E5E7EB",
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* DM conversation */}
        <AnimatePresence>
          {phase >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease }}
              className="glass rounded-[20px] overflow-hidden border border-black/[0.06]"
            >
              {/* DM header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-black/[0.04] bg-gradient-to-r from-[#FAFAFA] to-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[1.5px]">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=60&h=60&fit=crop&auto=format&q=80" alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[#262626] flex items-center gap-1">
                    milagroup_miami
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#3897F0"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.5 14.5l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z"/></svg>
                  </div>
                  <div className="text-[11px] text-[#8E8E8E]">Instagram Direct</div>
                </div>
              </div>

              {/* DM messages */}
              <div className="px-5 py-4 space-y-3 min-h-[200px] bg-white">
                {/* Auto-generated DM from restaurant */}
                <motion.div
                  initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.3, duration: 0.4, ease }}
                  className="flex items-end gap-2 max-w-[85%]"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F58529] to-[#DD2A7B] shrink-0 flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">M</span>
                  </div>
                  <div className="bg-[#F0F0F0] rounded-2xl rounded-bl-md px-4 py-2.5">
                    <div className="text-[13px] text-[#262626] leading-relaxed">
                      Hey! Thanks for your interest in MILA. Tap below to instantly book your table through OpenTable:
                    </div>
                  </div>
                </motion.div>

                {/* Booking link card */}
                {phase >= 6 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.2, duration: 0.4, ease }}
                    className="flex items-end gap-2 max-w-[85%]"
                  >
                    <div className="w-6 h-6 shrink-0" />
                    <div className="bg-[#F0F0F0] rounded-2xl rounded-bl-md overflow-hidden">
                      {/* Link preview card */}
                      <div className="relative h-[80px] overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=160&fit=crop&auto=format&q=80"
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-2 left-3 right-3">
                          <div className="text-white text-[11px] font-bold drop-shadow-lg">Reserve at MILA Miami Beach</div>
                        </div>
                      </div>
                      <div className="px-3 py-2 flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#DA3743] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-[#262626]">link.me/mila</div>
                          <div className="text-[10px] text-[#8E8E8E]">Book via OpenTable</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E8E" strokeWidth="2" className="ml-auto"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* User reply — "Booked!" */}
                {phase >= 7 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.2, duration: 0.4, ease }}
                    className="flex items-end gap-2 max-w-[70%] ml-auto flex-row-reverse"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#2196F3] shrink-0 flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">J</span>
                    </div>
                    <div className="bg-[#3797F0] rounded-2xl rounded-br-md px-4 py-2.5">
                      <div className="text-[13px] text-white leading-relaxed">
                        Just booked! See you Thursday at 7:30
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Booking confirmed banner */}
              <AnimatePresence>
                {phase >= 7 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.4, ease }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-3 bg-gradient-to-r from-[#DA3743]/[0.08] to-[#DA3743]/[0.03] border-t border-[#DA3743]/10 flex items-center gap-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                        className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center shrink-0"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </motion.div>
                      <div>
                        <div className="text-[13px] font-bold text-[#111]">Reservation Confirmed</div>
                        <div className="text-[11px] text-[#9CA3AF]">2 guests &middot; Thu, Apr 24 &middot; 7:30 PM &middot; via OpenTable</div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-[11px] font-bold text-[#DA3743]">Cover fee earned</div>
                        <div className="text-[10px] text-[#9CA3AF]">Source: IG comment</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Waiting state before DM appears */}
        <AnimatePresence>
          {phase < 5 && (
            <motion.div
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.3 }}
              className="glass rounded-[20px] p-8 border border-black/[0.06] flex flex-col items-center justify-center text-center min-h-[200px]"
            >
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  <path d="M13 8L9 12l4 4" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </motion.div>
              <div className="text-[14px] text-[#D1D5DB] font-medium mt-3">
                {phase < 3 ? "Waiting for trigger comment..." : "Preparing auto-DM..."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <>
      <div className="grid-bg" />
      <Nav />

      {/* ───────── HERO ───────── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        id="top"
      >
        <div className="hero-orb-1" />
        <div className="hero-orb-2" />
        <div className="hero-orb-3" />

        {/* Decorative floating dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#DC2626]"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + i * 0.5,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div className="relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-block px-5 py-2 border border-black/[0.08] rounded-full text-xs font-semibold tracking-[2px] uppercase text-[#DC2626] mb-10 glass"
          >
            Partnership Proposal
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 0.8, ease }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8"
          >
            <MagneticWrap>
              <LinkmeLogomark className="h-12 md:h-[72px]" />
            </MagneticWrap>
            <motion.span
              className="gradient-text text-5xl md:text-[72px] font-light"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              &times;
            </motion.span>
            <MagneticWrap>
              <OpenTableLogo className="h-10 md:h-[56px]" />
            </MagneticWrap>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-xl md:text-2xl text-[#9CA3AF] font-light max-w-[750px] mx-auto mb-16 leading-relaxed"
          >
            Turning every restaurant&rsquo;s social media bio into a{" "}
            <motion.span
              className="text-[#111111] font-medium relative"
              initial={{ backgroundSize: "0% 2px" }}
              animate={{ backgroundSize: "100% 2px" }}
              transition={{ delay: 1.5, duration: 0.8 }}
              style={{
                backgroundImage: "linear-gradient(#DC2626, #DC2626)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0% 100%",
              }}
            >
              direct booking channel
            </motion.span>{" "}
            powered by OpenTable
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="scroll-float">
            <div className="w-6 h-10 rounded-full border-2 border-[#DC2626]/20 mx-auto flex items-start justify-center pt-2">
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-1 h-2 bg-[#DC2626] rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ───────── STATS BAR ───────── */}
      <section className="max-w-[900px] mx-auto px-6 md:px-20 -mt-10 relative z-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard value={70000} suffix="" label="OpenTable restaurant partners" delay={0} />
          <StatCard value={100} suffix="%" label="New revenue + attribution data, zero downside" delay={0.15} />
        </div>
      </section>

      {/* ───────── THE PROBLEM (merged opportunity + problem) ───────── */}
      <section id="problem" className="py-20 pt-[140px] px-6 md:px-20 max-w-[1200px] mx-auto">
        <SectionLabel>The Problem</SectionLabel>
        <SectionTitle>
          Social media drives restaurant traffic.<br />OpenTable can&rsquo;t see any of it.
        </SectionTitle>
        <SectionDesc>
          Every restaurant has a bio link on Instagram, TikTok, Facebook, Google, and X. That bio link is the highest-intent touchpoint a restaurant has. But right now, it goes nowhere useful. OpenTable has no visibility, no attribution, and earns no cover fee.
        </SectionDesc>

        {/* ── Side-by-side comparison ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 mb-12">
          {/* Without */}
          <Reveal variant={slideLeft}>
            <div className="relative rounded-[20px] overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FEF2F2] to-[#FFF5F5]" />
              <div className="relative p-7 md:p-8 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </div>
                  <div className="text-[13px] font-bold tracking-[2px] uppercase text-[#EF4444]">Without Linkme</div>
                </div>

                {/* Flow steps */}
                <div className="space-y-3 flex-1">
                  {[
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/></svg>, text: "Guest sees restaurant on Instagram" },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>, text: "Taps bio link" },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>, text: "Broken website, no booking button" },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91"/></svg>, text: "Calls restaurant or walks in" },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center shrink-0 shadow-sm">{step.icon}</div>
                      <span className="text-[14px] text-[#666]">{step.text}</span>
                      {i < 3 && <span className="text-[#D1D5DB] text-[10px] ml-auto hidden md:block">&darr;</span>}
                    </motion.div>
                  ))}
                </div>

                {/* Result */}
                <motion.div
                  className="mt-5 p-4 bg-[#EF4444]/[0.08] rounded-xl border border-[#EF4444]/10"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-[14px] font-bold text-[#EF4444]">OpenTable earns $0</div>
                  <div className="text-[12px] text-[#EF4444]/60 mt-0.5">Zero visibility. Zero attribution. Zero revenue.</div>
                </motion.div>
              </div>
            </div>
          </Reveal>

          {/* With */}
          <Reveal variant={slideRight} delay={0.15}>
            <div className="relative rounded-[20px] overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F5] to-[#FEFAFA]" />
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#DC2626] to-transparent" />
              <div className="relative p-7 md:p-8 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#DC2626]/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="text-[13px] font-bold tracking-[2px] uppercase text-[#DC2626]">With Linkme</div>
                </div>

                {/* Flow steps */}
                <div className="space-y-3 flex-1">
                  {[
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/></svg>, text: "Guest sees restaurant on Instagram" },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>, text: "Taps bio link" },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>, text: "Lands on Linkme with OT widget" },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>, text: "Books through OpenTable" },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#DC2626]/[0.06] flex items-center justify-center shrink-0 shadow-sm">{step.icon}</div>
                      <span className="text-[14px] text-[#666]">{step.text}</span>
                      {i < 3 && <span className="text-[#DC2626]/20 text-[10px] ml-auto hidden md:block">&darr;</span>}
                    </motion.div>
                  ))}
                </div>

                {/* Result */}
                <motion.div
                  className="mt-5 p-4 bg-[#DC2626]/[0.06] rounded-xl border border-[#DC2626]/10"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-[14px] font-bold text-[#DC2626]">Cover fee earned + full attribution</div>
                  <div className="text-[12px] text-[#DC2626]/60 mt-0.5">Platform, post, and campaign tracked per booking.</div>
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Key insight callout ── */}
        <Reveal delay={0.3}>
          <div className="glass rounded-[16px] p-6 md:p-8 border border-black/[0.06] max-w-[900px]">
            <p className="text-[16px] text-[#9CA3AF] leading-relaxed">
              OpenTable charges $1&ndash;$1.50 per network cover and $0.25 per widget cover. When a guest finds a restaurant through social media and the bio link doesn&rsquo;t have an OpenTable widget, the booking either doesn&rsquo;t happen or happens outside the OT ecosystem. Linkme fixes both problems: every bio link booking routes through the OT widget, and Linkme tracks exactly which platform drove each reservation. <strong className="text-[#111]">There is no existing partner in the social presence category. This is a net-new channel for OpenTable.</strong>
            </p>
          </div>
        </Reveal>
      </section>

      {/* ───────── HOW IT WORKS (with product details folded in) ───────── */}
      <section id="flow" className="py-20 pt-[140px] px-6 md:px-20 max-w-[1200px] mx-auto">
        <SectionLabel>How It Works</SectionLabel>
        <SectionTitle>Bio link &rarr; Linkme &rarr; OpenTable booking.</SectionTitle>

        {/* ── Visual journey flow ── */}
        <div className="mt-14 mb-16 relative">
          {/* Animated connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[60px] right-[60px] h-[2px] z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#DC2626] rounded-full origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            />
            {/* Animated pulse traveling along the line */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-8 h-[2px] bg-white rounded-full"
              style={{ filter: "blur(0.5px)", boxShadow: "0 0 8px rgba(220,38,38,0.6)" }}
              animate={{ left: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.8 }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {[
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none"/></svg>,
                title: "Guest sees restaurant",
                desc: "On Instagram, TikTok, Facebook, Google, X, or any platform",
                color: "#E91E63",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
                title: "Taps bio link",
                desc: "The link in the restaurant's bio goes to their Linkme page",
                color: "#DC2626",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                title: "Lands on Linkme",
                desc: "Auto-built page with photos, menu, reviews, and booking widget",
                color: "#DC2626",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>,
                title: "Books via OpenTable",
                desc: "Embedded OT widget with real-time availability. Account auto-syncs.",
                color: "#DA3743",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                title: "Tracked cover",
                desc: "Cover fee earned. Full attribution: platform, post, campaign.",
                color: "#4CAF50",
              },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.12} variant={scaleIn}>
                <motion.div
                  className="flex flex-col items-center text-center group cursor-default"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {/* Icon circle */}
                  <motion.div
                    className="w-[104px] h-[104px] rounded-full flex items-center justify-center mb-5 relative"
                    style={{ background: `${step.color}10`, color: step.color }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Outer ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 opacity-20"
                      style={{ borderColor: step.color }}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.05, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    />
                    {/* Inner filled circle */}
                    <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center" style={{ background: `${step.color}15` }}>
                      {step.icon}
                    </div>
                    {/* Step number badge */}
                    <div
                      className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-[12px] font-bold shadow-lg"
                      style={{ background: step.color }}
                    >
                      {i + 1}
                    </div>
                  </motion.div>

                  <div className="text-[15px] font-bold mb-1.5 group-hover:text-[#DC2626] transition-colors duration-200">{step.title}</div>
                  <div className="text-[13px] text-[#9CA3AF] leading-relaxed max-w-[180px] group-hover:text-[#666] transition-colors duration-200">{step.desc}</div>

                  {/* Mobile arrow (between steps) */}
                  {i < 4 && (
                    <motion.div
                      className="lg:hidden my-3 text-[#DC2626]/30"
                      animate={{ y: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </motion.div>
                  )}
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Key details as visual cards instead of wall of text ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Reveal delay={0.1} variant={scaleIn}>
            <div className="glass rounded-[16px] p-6 border border-black/[0.06] h-full">
              <div className="w-9 h-9 rounded-lg bg-[#DC2626]/[0.08] flex items-center justify-center mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div className="font-bold text-[15px] mb-2">Zero setup for restaurants</div>
              <p className="text-[13px] text-[#9CA3AF] leading-relaxed">Restaurant clicks &ldquo;Activate&rdquo; in the OpenTable marketplace. Linkme auto-builds their page with photos, hours, menus, and reviews. Nothing to configure.</p>
            </div>
          </Reveal>
          <Reveal delay={0.2} variant={scaleIn}>
            <div className="glass rounded-[16px] p-6 border border-black/[0.06] h-full">
              <div className="w-9 h-9 rounded-lg bg-[#DC2626]/[0.08] flex items-center justify-center mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <div className="font-bold text-[15px] mb-2">Full attribution data</div>
              <p className="text-[13px] text-[#9CA3AF] leading-relaxed">Linkme tracks which platform, post, and campaign drove each booking. OpenTable gets a data layer that doesn&rsquo;t exist today.</p>
            </div>
          </Reveal>
          <Reveal delay={0.3} variant={scaleIn}>
            <div className="glass rounded-[16px] p-6 border border-black/[0.06] h-full">
              <div className="w-9 h-9 rounded-lg bg-[#DC2626]/[0.08] flex items-center justify-center mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>
              </div>
              <div className="font-bold text-[15px] mb-2">Every booking routes through OT</div>
              <p className="text-[13px] text-[#9CA3AF] leading-relaxed">The guest never leaves the page. The embedded widget is powered by OpenTable with real-time availability. OT account auto-syncs.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── BOOKING FLOW DEMO ───────── */}
      <section id="demo" className="py-20 px-6 md:px-20 max-w-[1200px] mx-auto">
        <SectionLabel>The Booking Experience</SectionLabel>
        <SectionTitle>From Instagram to seated.<br />All on one page.</SectionTitle>
        <SectionDesc>
          Click through each step to see how a guest goes from tapping a bio link to having a confirmed OpenTable reservation, without ever leaving the restaurant&rsquo;s Linkme profile.
        </SectionDesc>

        <Reveal variant={scaleIn}>
          <BookingFlowDemo />
        </Reveal>
      </section>

      {/* ───────── COMMENT AUTOMATION ───────── */}
      <section id="automation" className="py-20 px-6 md:px-20 max-w-[1200px] mx-auto">
        <SectionLabel>Instagram Automation</SectionLabel>
        <SectionTitle>Every post becomes a booking engine.</SectionTitle>
        <SectionDesc>
          A follower comments on a food photo. Seconds later they have a reservation. No manual effort from the restaurant.
        </SectionDesc>

        <Reveal variant={scaleIn}>
          <CommentBookDemo />
        </Reveal>

        <Reveal delay={0.3}>
          <p className="text-[17px] font-semibold text-[#111111] leading-relaxed mt-10 max-w-[900px]">
            Restaurants post multiple times per week. Each post reaches thousands of followers. Right now those followers double-tap and scroll past. With this automation, anyone who&rsquo;s ready to eat can book a table without leaving Instagram. Every one of those bookings routes through the OpenTable network.
          </p>
        </Reveal>
      </section>

      {/* ───────── LIVE EXAMPLES (embedded) ───────── */}
      <section id="examples" className="py-20 pt-[140px] px-6 md:px-20 max-w-[1200px] mx-auto">
        <SectionLabel>Live Examples</SectionLabel>
        <SectionTitle>See it in action.</SectionTitle>
        <SectionDesc>
          These are live Linkme profiles for real restaurants. This is exactly what every OpenTable restaurant gets on activation. The restaurant didn&rsquo;t build anything.
        </SectionDesc>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {[
            { name: "MILA", url: "https://link.me/mila" },
            { name: "Casa Neos", url: "https://link.me/casaneos" },
          ].map((p, i) => (
            <Reveal key={p.name} delay={i * 0.15} variant={scaleIn}>
              <motion.div
                className="glass rounded-2xl overflow-hidden border border-black/[0.06] group"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-lg font-bold relative z-10">{p.name}</div>
                  <motion.a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#DC2626] text-sm font-semibold relative z-10"
                    whileHover={{ x: 4 }}
                  >
                    {p.url.replace("https://", "")} &rarr;
                  </motion.a>
                </div>
                <div className="relative w-full overflow-hidden" style={{ height: "600px" }}>
                  <iframe
                    src={p.url}
                    title={`${p.name} Linkme Profile`}
                    className="absolute border-0 origin-top-left"
                    style={{ width: "166.67%", height: "166.67%", transform: "scale(0.6)", transformOrigin: "top left" }}
                    loading="lazy"
                    allow="clipboard-write"
                  />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── PARTNERSHIP MODELS ───────── */}
      <section id="options" className="py-20 pt-[140px] px-6 md:px-20 max-w-[1200px] mx-auto">
        <SectionLabel>Partnership Models</SectionLabel>
        <SectionTitle>Two options. Zero downside for OpenTable.</SectionTitle>
        <SectionDesc>
          OpenTable can choose whichever aligns best with their strategy, or run both simultaneously for different restaurant segments.
        </SectionDesc>

        {/* ── OPTION 1 ── */}
        <Reveal>
          <div className="mb-6">
            <div className="text-[13px] font-bold tracking-[3px] uppercase text-[#DC2626] mb-2">Option 1</div>
            <h3 className="text-[36px] md:text-[44px] font-extrabold tracking-tight leading-[1.1]">Subscription Revenue Share</h3>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {/* Left — the model */}
          <Reveal variant={slideLeft}>
            <div className="glass rounded-[20px] p-7 md:p-10 border border-black/[0.06] h-full flex flex-col">
              <p className="text-[16px] text-[#9CA3AF] leading-relaxed mb-8">
                OpenTable offers Linkme Pro to all restaurants as a recommended tool. Restaurants pay $29.99/month billed through their OpenTable invoice. OpenTable keeps $10 per restaurant per month.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <PriceItem label="Restaurant pays" amount="$29.99" amountColor="#111111" suffix="/mo" note="On their existing OT invoice" />
                <PriceItem label="OpenTable keeps" amount="$10" amountColor="#DC2626" suffix="/mo" note="Pure margin, zero cost" />
              </div>
            </div>
          </Reveal>

          {/* Right — revenue projection */}
          <Reveal variant={slideRight} delay={0.1}>
            <div className="glass rounded-[20px] p-7 md:p-10 border border-black/[0.06] h-full">
              <div className="text-[13px] font-bold tracking-[2px] uppercase text-[#9CA3AF] mb-5">Revenue Projection</div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {["Adoption", "Restaurants", "OT Revenue"].map((h) => (
                        <th key={h} className="px-4 py-3 text-[11px] font-bold tracking-wider uppercase text-[#9CA3AF] text-center border-b border-black/[0.06]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["10%", "7,000", "$840K/yr"],
                      ["25%", "17,500", "$2.1M/yr"],
                      ["100%", "70,000", "$8.4M/yr"],
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-black/[0.02] transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className={`px-4 py-3.5 text-center text-[15px] border-b border-black/[0.06] ${i === 2 ? "font-bold text-[#DC2626] text-base !border-b-0" : ""}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── OPTION 2 ── */}
        <Reveal>
          <div className="mb-6">
            <div className="text-[13px] font-bold tracking-[3px] uppercase text-[#DC2626] mb-2">Option 2</div>
            <h3 className="text-[36px] md:text-[44px] font-extrabold tracking-tight leading-[1.1]">Recovered Revenue Split</h3>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Left — the model */}
          <Reveal variant={slideLeft}>
            <div className="glass rounded-[20px] p-7 md:p-10 border-2 border-[#DC2626]/30 h-full flex flex-col relative overflow-hidden breathing-glow">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#DC2626] to-transparent" />
              <p className="text-[16px] text-[#9CA3AF] leading-relaxed mb-8">
                OpenTable offers Linkme Pro to all restaurants for free. Every booking through the bio link routes through the OpenTable widget. Linkme and OpenTable split the cover fees 50/50 on these newly attributed bookings.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <PriceItem label="Restaurant pays" amount="$0" amountColor="#DC2626" suffix="/mo" note="Linkme Pro is free" />
                <PriceItem label="OpenTable keeps" amount="50%" amountColor="#DC2626" note="Of cover fees on recovered bookings" />
              </div>
            </div>
          </Reveal>

          {/* Right — why this works */}
          <Reveal variant={slideRight} delay={0.1}>
            <div className="glass rounded-[20px] p-7 md:p-10 border border-black/[0.06] h-full">
              <div className="text-[13px] font-bold tracking-[2px] uppercase text-[#9CA3AF] mb-5">Why This Works</div>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#DC2626]/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-[14px] text-[#666] leading-relaxed">OpenTable is not paying Linkme from existing revenue. These are <strong className="text-[#111]">net-new bookings</strong> from social media traffic OT can&rsquo;t see today.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#DC2626]/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-[14px] text-[#666] leading-relaxed">Free means <strong className="text-[#111]">maximum adoption</strong>. No restaurant says no. Both sides only earn when diners are sitting in seats.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#DC2626]/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-[14px] text-[#666] leading-relaxed">Beyond revenue, OpenTable gets a <strong className="text-[#111]">social media attribution layer</strong> showing which platforms drive real bookings.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── GETTING STARTED (merged activation + OT needs + timeline) ───────── */}
      <section id="timeline" className="py-20 pt-[140px] px-6 md:px-20 max-w-[1200px] mx-auto">
        <SectionLabel>Getting Started</SectionLabel>
        <SectionTitle>Low lift. Ready to build.</SectionTitle>
        <SectionDesc>
          Linkme builds and maintains everything. OpenTable provides Consumer API v2 credentials for the booking widget, Directory API access to auto-build restaurant pages, an Integrations Marketplace listing, and billing pass-through for Option 1.
        </SectionDesc>

        <div className="mt-8 relative">
          {/* Vertical timeline connector */}
          <div className="hidden md:block absolute left-[68px] top-6 bottom-6 w-[2px]">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-[#DC2626] via-[#DC2626]/40 to-transparent rounded-full"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{ transformOrigin: "top" }}
            />
          </div>
          {[
            { when: "Day 1", what: "Confirm partnership model. OpenTable issues OAuth 2.0 credentials (Consumer Partner tier) and referral ID.", result: "Partnership confirmed" },
            { when: "Week 1\u20132", what: "Build integration using Directory API (auto-page builder), Consumer API v2 (booking widget), and Reviews API (social proof). Wire ref parameter for attribution.", result: "Integration ready" },
            { when: "Week 2\u20133", what: "Pilot with restaurants on both platforms. Validate booking flow, measure recovered bookings.", result: "Pilot live" },
            { when: "Week 4", what: "Go live within the OpenTable network. Identify highest-conversion go-to-market: push via OpenTable onboarding flow, in-app prompt to existing restaurants, or email campaign to top-performing restaurant segments.", result: "Live" },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-[140px_1fr_200px] gap-1 md:gap-6 items-center py-6 border-b border-black/5 last:border-b-0 group hover-lift rounded-lg px-2 -mx-2 relative"
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Timeline dot */}
                <motion.div
                  className="hidden md:block absolute left-[64px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-[#DC2626] border-2 border-white z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 300 }}
                />
                <div className="text-sm font-bold text-[#DC2626]">{item.when}</div>
                <div className="text-[15px] text-[#9CA3AF] leading-relaxed group-hover:text-[#111111] transition-colors duration-200">{item.what}</div>
                <div className={`text-[13px] font-semibold uppercase tracking-wider md:text-right ${i === 3 ? "text-[#DC2626]" : "text-[#9CA3AF]"}`}>{item.result}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── BOTTOM LINE ───────── */}
      <section className="relative py-20 md:py-[140px] px-6 overflow-hidden" id="bottom">
        {/* Animated gradient orb */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-[700px] h-[500px] bg-gradient-to-br from-[#DC2626]/10 via-[#EF4444]/5 to-[#DC2626]/8 rounded-full blur-[120px]" />
        </motion.div>

        <div className="text-center max-w-[900px] mx-auto relative z-10">
          <Reveal>
            <motion.div
              className="w-[60px] h-[3px] bg-gradient-to-r from-[#DC2626] to-[#EF4444] rounded-full mb-8 mx-auto"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-[56px] font-extrabold tracking-tight leading-[1.08] mb-10">Bottom Line</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-[#9CA3AF] leading-relaxed mb-8">
              Every restaurant has a bio link. Every restaurant has OpenTable. Nobody has connected them. Social media is driving more restaurant traffic than ever, and OpenTable can&rsquo;t see any of it. Linkme turns every bio link into a direct booking channel with full attribution, routing every reservation through the OpenTable widget.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <MagneticWrap>
              <p className="text-[24px] font-bold shimmer">
                OpenTable&rsquo;s downside is zero. Your upside is a new revenue stream plus social media attribution data across 70,000 restaurants.
              </p>
            </MagneticWrap>
          </Reveal>
          {/* Logos */}
          <Reveal delay={0.4}>
            <div className="flex items-center justify-center gap-4 mt-16">
              <LinkmeLogomark className="h-7" />
              <span className="text-[#DC2626] text-xl font-light">&times;</span>
              <OpenTableLogo className="h-6" />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="h-10" />
    </>
  );
}
