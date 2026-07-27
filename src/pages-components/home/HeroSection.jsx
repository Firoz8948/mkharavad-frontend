"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

import { getBanners } from "@/services/bannerService";
import { API_URL } from "@/utils/constants";
import styles from "./HeroSection.module.css";

const SLIDE_DURATION = 5000;

function resolveImage(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/assets")) return url;
  return `${API_URL}${url}`;
}

function mapSlides(items) {
  const active = (items || []).filter((s) => s.image_url || s.image);
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
  const [desktopSlides, setDesktopSlides] = useState([]);
  const [mobileSlides, setMobileSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
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
        setDesktopSlides(mapSlides(desk.data));
        setMobileSlides(mapSlides(mob.data));
      } catch {
        // leave empty — admin must add banners
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const slideCount = Math.max(desktopSlides.length, mobileSlides.length, 1);

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
    if (slideCount <= 1) return undefined;
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer, slideCount]);

  useEffect(() => {
    [...desktopSlides, ...mobileSlides].forEach((slide) => {
      if (!slide.image) return;
      const img = new Image();
      img.src = slide.image;
    });
  }, [desktopSlides, mobileSlides]);

  const handleDotClick = (index) => {
    setCurrent(index);
    resetTimer();
  };

  const deskSlide =
    desktopSlides[current % Math.max(desktopSlides.length, 1)] || desktopSlides[0];
  const dotsCount = desktopSlides.length || mobileSlides.length;

  if (loaded && !desktopSlides.length && !mobileSlides.length) {
    return null;
  }

  if (!loaded && !desktopSlides.length && !mobileSlides.length) {
    return <section className={styles.heroWrapper} aria-hidden />;
  }

  const hasCopy = Boolean(
    deskSlide?.title || deskSlide?.title_highlight || deskSlide?.subtitle
  );

  return (
    <section className={styles.heroWrapper}>
      {/* Desktop: full-bleed banners from admin */}
      <div className={`${styles.hero} ${styles.desktopHero}`}>
        <div className={styles.bannerStage}>
          {desktopSlides.map((item, index) => {
            const visible = index === current % desktopSlides.length;
            const href = item.link_url || "/shop";
            return (
              <Link
                key={item.id}
                href={href}
                className={`${styles.bannerSlide} ${visible ? styles.slideVisible : ""}`}
                tabIndex={visible ? 0 : -1}
                aria-hidden={!visible}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title || `Banner ${index + 1}`}
                  className={styles.bannerImage}
                />
              </Link>
            );
          })}
          {hasCopy && (
            <div className={styles.bannerCopy}>
              <h1 className={styles.title}>
                {deskSlide?.title}{" "}
                {deskSlide?.title_highlight ? (
                  <span>{deskSlide.title_highlight}</span>
                ) : null}
              </h1>
              {deskSlide?.subtitle ? (
                <p className={styles.subtitle}>{deskSlide.subtitle}</p>
              ) : null}
              <Link href={deskSlide?.link_url || "/shop"} className={styles.primary}>
                Shop Now
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className={styles.mobileHero}>
        {mobileSlides.map((item, index) => (
          // eslint-disable-next-line @next/next/no-img-element
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

      {dotsCount > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: dotsCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === current % dotsCount ? styles.dotActive : ""}`}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
