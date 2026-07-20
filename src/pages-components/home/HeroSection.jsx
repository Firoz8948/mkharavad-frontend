"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

import { getBanners } from "@/services/bannerService";
import { API_URL } from "@/utils/constants";
import styles from "./HeroSection.module.css";

const FALLBACK_DESKTOP = [
  {
    id: "d1",
    image: "/assets/images/banners/slide1.png",
    title: "Premium Iron Cookware,",
    title_highlight: "Built to Last",
    subtitle:
      "M Kharavad Company is known for producing high-quality iron cookware, including tawas, kadhai, and other utensils. Durable, traditional craftsmanship for your kitchen.",
  },
  {
    id: "d2",
    image: "/assets/images/banners/slide2.png",
    title: "Authentic Cast Iron,",
    title_highlight: "Traditional Craftsmanship",
    subtitle:
      "Experience superior heat retention and unmatched durability. Our cast iron products are crafted for a lifetime of healthy and traditional cooking.",
  },
  {
    id: "d3",
    image: "/assets/images/banners/slide3.png",
    title: "Heavy-Duty Tawas &",
    title_highlight: "Iron Sheets",
    subtitle:
      "Discover our premium range of iron sheets and heavy-duty tawas, designed for consistent performance, high heat tolerance, and authentic flavor.",
  },
];

const FALLBACK_MOBILE = [
  { id: "m1", image: "/assets/images/banners/banner1.png" },
  { id: "m2", image: "/assets/images/banners/banner2.png" },
  { id: "m3", image: "/assets/images/banners/banner3.png" },
];

const SLIDE_DURATION = 5000;

function resolveImage(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/assets")) return url;
  return `${API_URL}${url}`;
}

function mapSlides(items, fallback) {
  const active = (items || []).filter((s) => s.image_url || s.image);
  if (!active.length) return fallback;
  return active.map((s) => ({
    id: s.id,
    image: resolveImage(s.image_url || s.image),
    title: s.title || "",
    title_highlight: s.title_highlight || s.titleHighlight || "",
    subtitle: s.subtitle || "",
    link_url: s.link_url || null,
  }));
}

export default function HeroSection() {
  const [desktopSlides, setDesktopSlides] = useState(FALLBACK_DESKTOP);
  const [mobileSlides, setMobileSlides] = useState(FALLBACK_MOBILE);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [desk, mob] = await Promise.all([
          getBanners("desktop"),
          getBanners("mobile"),
        ]);
        if (cancelled) return;
        setDesktopSlides(mapSlides(desk.data, FALLBACK_DESKTOP));
        setMobileSlides(mapSlides(mob.data, FALLBACK_MOBILE));
      } catch {
        // keep fallbacks
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const slideCount = Math.max(desktopSlides.length, mobileSlides.length, 1);

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, SLIDE_DURATION);
  }, [next]);

  useEffect(() => {
    setCurrent(0);
  }, [slideCount]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  useEffect(() => {
    [...desktopSlides, ...mobileSlides].forEach((slide) => {
      if (!slide.image) return;
      const img = new Image();
      img.src = slide.image;
    });
  }, [desktopSlides, mobileSlides]);

  const handleDotClick = (index) => {
    goTo(index);
    resetTimer();
  };

  const slide = desktopSlides[current % desktopSlides.length] || desktopSlides[0];
  const dotsCount = desktopSlides.length || mobileSlides.length;

  return (
    <section className={styles.heroWrapper}>
      <div className={`${styles.hero} ${styles.desktopHero}`}>
        <div className={styles.inner}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              {slide?.title} <span>{slide?.title_highlight}</span>
            </h1>

            <p className={styles.subtitle}>{slide?.subtitle}</p>

            <div className={styles.actions}>
              <Link href={slide?.link_url || "/shop"} className={styles.primary}>
                Shop Now
              </Link>
              <Link href="/about" className={styles.secondary}>
                Our Story
              </Link>
            </div>

            <div className={styles.stats}>
              <div>
                <strong>5000+</strong>
                <span>Happy Customers</span>
              </div>
              <div>
                <strong>50+</strong>
                <span>Products</span>
              </div>
              <div>
                <strong>4.8★</strong>
                <span>Avg Rating</span>
              </div>
            </div>
          </div>
          <div className={styles.imageWrapper}>
            {desktopSlides.map((item, index) => (
              <img
                key={item.id}
                src={item.image}
                alt={item.title || `Slide ${index + 1}`}
                className={`${styles.slideImage} ${
                  index === current % desktopSlides.length
                    ? styles.slideVisible
                    : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.mobileHero}>
        {mobileSlides.map((item, index) => (
          <img
            key={item.id}
            src={item.image}
            alt={`Slide ${index + 1}`}
            className={`${styles.mobileSlideImage} ${
              index === current % mobileSlides.length ? styles.slideVisible : ""
            }`}
          />
        ))}
      </div>

      <div className={styles.dots}>
        {Array.from({ length: dotsCount }).map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current % dotsCount ? styles.dotActive : ""}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
