"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, HTMLMotionProps } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";

interface PageFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function PageFadeIn({ children, className = "", delay = 0 }: PageFadeInProps) {
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
      transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className = "", staggerDelay = 0.06 }: StaggerContainerProps) {
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className = "", ...props }: AnimatedCardProps) {
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface PulseBadgeProps {
  text: string;
  variant?: "success" | "warning" | "info" | "neutral";
  className?: string;
}

export function PulseBadge({ text, variant = "info", className = "" }: PulseBadgeProps) {
  const prefersReducedMotion = useSafeReducedMotion();

  const variantStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    warning: "bg-amber-50 text-amber-700 border-amber-200/80",
    info: "bg-verified/10 text-verified border-verified/20",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const dotStyles = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    info: "bg-verified",
    neutral: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${variantStyles[variant]} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <motion.span
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${dotStyles[variant]}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotStyles[variant]}`} />
      </span>
      <span>{text}</span>
    </span>
  );
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  delay?: number;
}

export function ScrollReveal({ children, className = "", direction = "up", distance = 30, duration = 0.5, delay = 0 }: ScrollRevealProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const directionOffsets = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  const offset = directionOffsets[direction];

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, ...offset }}
      animate={isInView && !prefersReducedMotion ? { opacity: 1, x: 0, y: 0 } : prefersReducedMotion ? { opacity: 1 } : { opacity: 0, ...offset }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({ children, className = "", speed = 0.5 }: ParallaxSectionProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const baseY = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  const smoothY = useSpring(baseY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
}

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}

export function MagneticButton({ children, className = "", strength = 0.3, onClick }: MagneticButtonProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function FloatingElement({ children, className = "", amplitude = 8, duration = 3 }: FloatingElementProps) {
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? undefined : {
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScaleOnHoverProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function ScaleOnHover({ children, className = "", scale = 1.05 }: ScaleOnHoverProps) {
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { scale, transition: { duration: 0.2, ease: "easeOut" } }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}