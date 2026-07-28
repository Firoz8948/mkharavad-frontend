"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiChevronUp, FiShare2, FiShoppingCart, FiX } from "react-icons/fi";

import BuyNowModal, { useBuyNow } from "@/components/BuyNowModal/BuyNowModal";
import { ProductImages } from "@/pages-components/product";
import { useCart } from "@/hooks/useCart";
import { calcDiscount, formatPrice } from "@/utils/formatPrice";
import { mediaUrl } from "@/utils/mediaUrl";
import { shareLink, videoShareUrl } from "@/utils/share";
import { getProductSocialProof } from "@/utils/socialProof";
import {
  fetchVideoProducts,
  toCartProduct,
  videoCartOptions,
} from "@/utils/videoProduct";
import styles from "./reels.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** iOS Safari needs these set as attributes + properties before play(). */
function prepareVideo(video) {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
}

function playVideo(video) {
  if (!video) return;
  prepareVideo(video);
  const run = () => {
    prepareVideo(video);
    return video.play().catch(() => {});
  };
  if (video.readyState >= 2) run();
  else {
    video.addEventListener("loadeddata", run, { once: true });
    video.addEventListener("canplay", run, { once: true });
  }
}

async function handleShare(item) {
  const res = await shareLink({
    title: item.name,
    text: `Check out ${item.name} on M Kharavad`,
    url: videoShareUrl(item.id),
  });
  if (res.method === "clipboard") toast.success("Link copied");
  else if (res.method === "failed") toast.error("Could not share");
}

export default function ReelsPage() {
  return (
    <Suspense fallback={<div className={styles.page} />}>
      <ReelsContent />
    </Suspense>
  );
}

function ReelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const buyNow = useBuyNow();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const videoRefs = useRef([]);
  const appliedDeepLink = useRef(false);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    fetchVideoProducts()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const syncActiveFromScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !items.length) return;
    const h = container.clientHeight || 1;
    const idx = Math.max(
      0,
      Math.min(items.length - 1, Math.round(container.scrollTop / h))
    );
    if (idx !== activeIndexRef.current) {
      activeIndexRef.current = idx;
      setActiveIndex(idx);
    }
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === idx) playVideo(video);
      else video.pause();
    });
    const id = items[idx]?.id;
    if (id != null && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("v", String(id));
      window.history.replaceState(null, "", url);
    }
  }, [items]);

  // Deep link: jump to the requested video once layout is ready.
  useEffect(() => {
    if (appliedDeepLink.current) return;
    if (!items.length || !containerRef.current) return;

    const vParam = searchParams.get("v");
    const go = () => {
      const container = containerRef.current;
      if (!container || appliedDeepLink.current) return;
      const h = container.clientHeight;
      if (!h) return;
      appliedDeepLink.current = true;
      if (!vParam) {
        syncActiveFromScroll();
        return;
      }
      const idx = items.findIndex((it) => String(it.id) === String(vParam));
      if (idx > 0) {
        container.scrollTo({ top: idx * h });
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
      // Allow scroll to settle, then play.
      window.requestAnimationFrame(() => syncActiveFromScroll());
    };

    go();
    const t = window.setTimeout(go, 120);
    return () => window.clearTimeout(t);
  }, [items, searchParams, syncActiveFromScroll]);

  // Scroll-based sync is more reliable than IntersectionObserver on real iOS.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !items.length) return undefined;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        syncActiveFromScroll();
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    // Initial play after paint.
    const kick = window.setTimeout(() => syncActiveFromScroll(), 50);
    const kick2 = window.setTimeout(() => syncActiveFromScroll(), 300);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.clearTimeout(kick);
      window.clearTimeout(kick2);
    };
  }, [items, syncActiveFromScroll]);

  // Keep active reel playing when index changes (and resume after expand).
  useEffect(() => {
    activeIndexRef.current = activeIndex;
    const video = videoRefs.current[activeIndex];
    playVideo(video);
    videoRefs.current.forEach((v, i) => {
      if (v && i !== activeIndex) v.pause();
    });
  }, [activeIndex, items.length]);

  useEffect(() => {
    setExpandedId(null);
  }, [activeIndex]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleAdd = (item, qty = 1) => {
    addToCart(toCartProduct(item), qty, videoCartOptions(item));
  };

  const handleBuyNow = (item, qty = 1) => {
    buyNow.openBuyNow(toCartProduct(item), qty, videoCartOptions(item));
  };

  const handleTapPlay = () => {
    playVideo(videoRefs.current[activeIndex]);
  };

  const activeItem = items[activeIndex];

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={handleBack}
        aria-label="Close reels"
      >
        <FiX size={22} />
      </button>

      <button
        type="button"
        className={styles.shareBtn}
        onClick={() => activeItem && handleShare(activeItem)}
        disabled={!activeItem}
        aria-label="Share this reel"
      >
        <FiShare2 size={18} />
      </button>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <p>No reels yet.</p>
          <Link href="/">Go home</Link>
        </div>
      ) : (
        <div className={styles.phoneFrame}>
          <div className={styles.scroller} ref={containerRef}>
            {items.map((item, idx) => (
              <ReelSlide
                key={item.id}
                item={item}
                index={idx}
                isActive={idx === activeIndex}
                slideRef={(el) => (slideRefs.current[idx] = el)}
                videoRef={(el) => (videoRefs.current[idx] = el)}
                expanded={expandedId === item.id}
                onToggleExpand={(val) => setExpandedId(val ? item.id : null)}
                onAdd={handleAdd}
                onBuyNow={handleBuyNow}
                onTapPlay={handleTapPlay}
              />
            ))}
          </div>
        </div>
      )}

      <BuyNowModal
        open={buyNow.open}
        onClose={buyNow.closeBuyNow}
        product={buyNow.product}
        quantity={buyNow.quantity}
        options={buyNow.options}
      />
    </div>
  );
}

function ReelSlide({
  item,
  index,
  isActive,
  slideRef,
  videoRef,
  expanded,
  onToggleExpand,
  onAdd,
  onBuyNow,
  onTapPlay,
}) {
  const touchStartY = useRef(null);
  const proof = getProductSocialProof(item.product_id || item.id);
  const discount = calcDiscount(item.mrp, item.price);
  const soldOut = item.stock === 0;
  const poster = mediaUrl(item.images?.[0], API_URL);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current == null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta < -28 && !expanded) {
      onToggleExpand(true);
      touchStartY.current = null;
    } else if (delta > 28 && expanded) {
      onToggleExpand(false);
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  const handleMouseDown = (e) => {
    touchStartY.current = e.clientY;
  };

  const handleMouseUp = (e) => {
    if (touchStartY.current == null) return;
    const delta = e.clientY - touchStartY.current;
    if (delta < -28 && !expanded) onToggleExpand(true);
    else if (delta > 28 && expanded) onToggleExpand(false);
    touchStartY.current = null;
  };

  return (
    <div className={styles.slide} ref={slideRef} data-index={index}>
      {item.video_url ? (
        <video
          ref={videoRef}
          className={styles.slideVideo}
          src={mediaUrl(item.video_url, API_URL)}
          poster={poster || undefined}
          loop
          muted
          playsInline
          preload={isActive ? "auto" : "metadata"}
          aria-label={item.name}
          onClick={onTapPlay}
        />
      ) : (
        <div className={styles.slideNoVideo}>
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="2" width="20" height="20" rx="3" />
            <polygon points="10,8 16,12 10,16" fill="currentColor" />
          </svg>
          <span>No video yet</span>
        </div>
      )}

      {discount > 0 && <span className={styles.slideDiscount}>{discount}% OFF</span>}

      <div className={`${styles.panel} ${expanded ? styles.panelExpanded : ""}`}>
        <div
          className={styles.panelHandleArea}
          onClick={() => onToggleExpand(!expanded)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggleExpand(!expanded);
            }
          }}
        >
          <span className={styles.dragHandle} />
          <div className={styles.panelTeaser}>
            <div className={styles.panelTeaserText}>
              {item.category && <span className={styles.category}>{item.category}</span>}
              <h3 className={styles.panelName}>{item.name}</h3>
              <div className={styles.rating} aria-label={`${proof.rating} stars`}>
                <span className={styles.stars}>{"\u2605\u2605\u2605\u2605\u2605"}</span>
                <span className={styles.ratingNum}>{proof.ratingLabel}</span>
                <span className={styles.reviews}>{proof.label}</span>
              </div>
            </div>
            <div className={styles.panelTeaserRight}>
              <div className={styles.panelTeaserBuyCol}>
                <button
                  type="button"
                  className={styles.panelTeaserBuyBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onBuyNow(item);
                  }}
                  disabled={soldOut}
                >
                  {soldOut ? "Sold out" : "Buy"}
                </button>
                <div className={styles.panelTeaserPrice}>
                  <span className={styles.panelPrice}>{formatPrice(item.price)}</span>
                  {item.mrp > item.price && (
                    <span className={styles.panelMrp}>{formatPrice(item.mrp)}</span>
                  )}
                </div>
              </div>
              <FiChevronUp
                size={16}
                className={`${styles.panelChevron} ${expanded ? styles.panelChevronOpen : ""}`}
              />
            </div>
          </div>
        </div>

        <div className={styles.panelBody}>
          <ProductImages images={item.images} name={item.name} />

          <div className={styles.panelPriceRow}>
            <span className={styles.panelPriceLg}>{formatPrice(item.price)}</span>
            {item.mrp > item.price && (
              <>
                <span className={styles.panelMrp}>{formatPrice(item.mrp)}</span>
                <span className={styles.panelSave}>{discount}% off</span>
              </>
            )}
          </div>

          {item.description && <p className={styles.panelDesc}>{item.description}</p>}

          <div className={styles.panelActions}>
            <button
              type="button"
              className={styles.panelAddBtn}
              onClick={() => onAdd(item)}
              disabled={soldOut}
            >
              <FiShoppingCart size={16} />
              Add to Cart
            </button>
            <button
              type="button"
              className={styles.panelBuyBtn}
              onClick={() => onBuyNow(item)}
              disabled={soldOut}
            >
              {soldOut ? "Sold out" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
