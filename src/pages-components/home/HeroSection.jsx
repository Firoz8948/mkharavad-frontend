"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

import { getBanners } from "@/services/bannerService";
import { mapBannerSlides } from "@/utils/homeData";
import styles from "./HeroSection.module.css";

const SLIDE_DURATION = 5000;

/** Keep in sync with admin BannerManager crop preview. */
export const DESKTOP_BANNER_ASPECT = 21 / 8; // 2100×800
export const MOBILE_BANNER_ASPECT = 1; // 1∶1

export default function HeroSection({
  initialDesktop = [],
  initialMobile = [],
}) {
  const hasInitial = initialDesktop.length > 0 || initialMobile.length > 0;
  const [desktopSlides, setDesktopSlides] = useState(initialDesktop);
  const [mobileSlides, setMobileSlides] = useState(initialMobile);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(hasInitial);
  const timerRef = useRef(null);

  useEffect(() => {
    if (hasInitial) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const [desk, mob] = await Promise.all([
          getBanners("desktop"),
          getBanners("mobile"),
        ]);
        if (cancelled) return;
        setDesktopSlides(mapBannerSlides(desk.data));
        setMobileSlides(mapBannerSlides(mob.data));
      } catch {
        // leave empty — admin must add banners
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasInitial]);

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
            const isLcp = index === 0;
            return (
              <Link
                key={item.id}
                href={href}
                className={`${styles.bannerSlide} ${visible ? styles.slideVisible : ""}`}
                tabIndex={visible ? 0 : -1}
                aria-hidden={!visible}
              >
                <Image
                  src={item.image}
                  alt={`Banner ${index + 1}`}
                  fill
                  sizes="100vw"
                  priority={isLcp}
                  fetchPriority={isLcp ? "high" : "auto"}
                  loading={isLcp ? "eager" : "lazy"}
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
            const isLcp = index === 0;
            return (
              <Link
                key={item.id}
                href={href}
                className={`${styles.mobileSlide} ${visible ? styles.slideVisible : ""}`}
                tabIndex={visible ? 0 : -1}
                aria-hidden={!visible}
              >
                <Image
                  src={item.image}
                  alt={`Banner ${index + 1}`}
                  fill
                  sizes="100vw"
                  priority={isLcp}
                  fetchPriority={isLcp ? "high" : "auto"}
                  loading={isLcp ? "eager" : "lazy"}
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
