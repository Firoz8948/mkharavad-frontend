"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

import { getBanners } from "@/services/bannerService";
import { API_URL } from "@/utils/constants";
import styles from "./HeroSection.module.css";

const SLIDE_DURATION = 5000;

/** Keep in sync with admin BannerManager crop preview. */
export const DESKTOP_BANNER_ASPECT = 21 / 8; // 2100×800
export const MOBILE_BANNER_ASPECT = 1; // 1∶1

function resolveImage(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/assets")) return url;
  return `${API_URL}${url}`;
}

function mapSlides(items) {
  return (items || [])
    .filter((s) => s.image_url || s.image)
    .map((s) => ({
      id: s.id,
      image: resolveImage(s.image_url || s.image),
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

  const desktopDots = desktopSlides.length;
  const mobileDots = mobileSlides.length;

  if (loaded && !desktopSlides.length && !mobileSlides.length) {
    return null;
  }

  if (!loaded && !desktopSlides.length && !mobileSlides.length) {
    return <section className={styles.heroWrapper} aria-hidden />;
  }

  return (
    <section className={styles.heroWrapper}>
      <div className={`${styles.hero} ${styles.desktopHero}`}>
        <div className={styles.bannerStage}>
          {desktopSlides.map((item, index) => {
            const visible =
              desktopSlides.length > 0 &&
              index === current % desktopSlides.length;
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
                  alt={`Banner ${index + 1}`}
                  className={styles.bannerImage}
                />
              </Link>
            );
          })}
          {desktopDots > 1 && (
            <div className={styles.dots}>
              {Array.from({ length: desktopDots }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.dot} ${
                    i === current % desktopDots ? styles.dotActive : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDotClick(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.mobileHero}>
        <div className={styles.mobileStage}>
          {mobileSlides.map((item, index) => {
            const visible =
              mobileSlides.length > 0 && index === current % mobileSlides.length;
            const href = item.link_url || "/shop";
            return (
              <Link
                key={item.id}
                href={href}
                className={`${styles.mobileSlide} ${visible ? styles.slideVisible : ""}`}
                tabIndex={visible ? 0 : -1}
                aria-hidden={!visible}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={`Banner ${index + 1}`}
                  className={styles.mobileSlideImage}
                />
              </Link>
            );
          })}
          {mobileDots > 1 && (
            <div className={styles.dots}>
              {Array.from({ length: mobileDots }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.dot} ${
                    i === current % mobileDots ? styles.dotActive : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDotClick(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
