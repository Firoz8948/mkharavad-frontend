"use client";

import { useEffect, useRef, useState } from "react";

import { mediaUrl } from "@/utils/mediaUrl";
import { fetchVideoProducts } from "@/utils/videoProduct";
import styles from "./ReelsCategoryPreview.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const CLIP_MS = 3000;
const MAX_VIDEOS = 4;

/**
 * Plays the first N video-product clips for ~3s each in a loop,
 * only while this tile is on screen (pauses + frees bandwidth when off-screen).
 */
export default function ReelsCategoryPreview({ className = "" }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [urls, setUrls] = useState([]);
  const [index, setIndex] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchVideoProducts().then((items) => {
      if (cancelled) return;
      const next = (items || [])
        .map((i) => i.video_url)
        .filter(Boolean)
        .slice(0, MAX_VIDEOS)
        .map((u) => mediaUrl(u, API_URL));
      setUrls(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.6] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Rotate clips every 3s while visible
  useEffect(() => {
    if (!onScreen || urls.length <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % urls.length);
    }, CLIP_MS);
    return () => clearInterval(id);
  }, [onScreen, urls.length]);

  // Play / pause based on visibility + current clip
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!onScreen || !urls[index]) {
      video.pause();
      try {
        video.removeAttribute("src");
        video.load();
      } catch {
        /* ignore */
      }
      return;
    }

    if (video.getAttribute("src") !== urls[index]) {
      video.src = urls[index];
      video.load();
    }
    video.muted = true;
    video.playsInline = true;
    const play = () => video.play().catch(() => {});
    play();
    video.addEventListener("loadeddata", play, { once: true });
    return () => {
      video.pause();
    };
  }, [onScreen, urls, index]);

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${className}`.trim()}>
      {urls.length > 0 ? (
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          loop={urls.length === 1}
          preload="none"
          aria-hidden
        />
      ) : (
        <div className={styles.fallback}>▶</div>
      )}
      <span className={styles.badge}>Reels</span>
    </div>
  );
}
