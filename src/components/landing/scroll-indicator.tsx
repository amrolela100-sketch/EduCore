"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";
import { ChevronDown } from "lucide-react";

interface ScrollProgressBarProps {
  className?: string;
}

export function ScrollProgressBar({ className = "" }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const prefersReducedMotion = useSafeReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1.5 z-50 origin-left border-b-2 border-border bg-coral ${className}`}
      style={{ scaleX }}
    />
  );
}

interface ScrollIndicatorProps {
  className?: string;
  text?: string;
}

export function ScrollIndicator({ className = "", text }: ScrollIndicatorProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${className}`}
    >
      {text && (
        <span className="font-label-caps text-xs font-bold text-ink/70 uppercase tracking-wider">{text}</span>
      )}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-coral" />
      </motion.div>
    </motion.div>
  );
}

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export function SectionReveal({ children, className = "", delay = 0, direction = "up" }: SectionRevealProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
    >
      {children}
    </motion.div>
  );
}

interface ScrollFadeProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollFade({ children, className = "" }: ScrollFadeProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ opacity }} className={className}>
      {children}
    </motion.div>
  );
}

interface StaggerRevealProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  itemClassName?: string;
}

export function StaggerReveal({ children, className = "", staggerDelay = 0.1, itemClassName = "" }: StaggerRevealProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
          animate={isInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: index * staggerDelay, ease: [0.25, 0.1, 0.25, 1.0] }}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

interface CounterRevealProps {
  target: number;
  suffix?: string;
  className?: string;
}

export function CounterReveal({ target, suffix = "", className = "" }: CounterRevealProps) {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = useSafeReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }
    let start = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, target, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}