"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, HTMLMotionProps } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";

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

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxCard({ children, className = "", speed = 0.5 }: ParallaxCardProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
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

interface ScrollTriggeredCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}

export function ScrollTriggeredCard({ children, className = "", direction = "up", delay = 0, ...props }: ScrollTriggeredCardProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getInitialTransform = () => {
    if (prefersReducedMotion) return { opacity: 1 };
    switch (direction) {
      case "up": return { opacity: 0, y: 40 };
      case "left": return { opacity: 0, x: -40 };
      case "right": return { opacity: 0, x: 40 };
      default: return { opacity: 0, y: 40 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialTransform()}
      animate={isInView && !prefersReducedMotion ? { opacity: 1, x: 0, y: 0 } : getInitialTransform()}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface HoverScaleProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function HoverScale({ children, className = "", scale = 1.05 }: HoverScaleProps) {
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

interface FloatingBadgeProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function FloatingBadge({ children, className = "", amplitude = 6, duration = 3 }: FloatingBadgeProps) {
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? undefined : { y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface PageProgressBarProps {
  className?: string;
  color?: string;
}

export function PageProgressBar({ className = "", color = "bg-coral" }: PageProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const prefersReducedMotion = useSafeReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 z-50 origin-left ${color} ${className}`}
      style={{ scaleX }}
    />
  );
}

interface ScrollFadeRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

export function ScrollFadeReveal({ children, className = "", threshold = 0.2 }: ScrollFadeRevealProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, threshold, 1 - threshold, 1], [0, 1, 1, 0]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ opacity }} className={className}>
      {children}
    </motion.div>
  );
}