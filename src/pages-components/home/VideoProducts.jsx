"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiShare2,
  FiShoppingCart,
  FiVolume2,
  FiVolumeX,
  FiX,
} from "react-icons/fi";

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
import styles from "./VideoProducts.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

async function handleShareClick(item) {
  const res = await shareLink({
    title: item.name,
    text: `Check out ${item.name} on M Kharavad`,
    url: videoShareUrl(item.id),
  });
  if (res.method === "clipboard") toast.success("Link copied");
  else if (res.method === "failed") toast.error("Could not share");
}

export default function VideoProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [scrollState, setScrollState] = useState({ left: false, right: true });
  const rowRef = useRef(null);
  const router = useRouter();
  const isMobile = useIsMobile(768);
  const { addToCart } = useCart();
  const buyNow = useBuyNow();

  useEffect(() => {
    fetchVideoProducts()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const updateScrollState = () => {
    const el = rowRef.current;
    if (!el) return;
    setScrollState({
      left: el.scrollLeft > 4,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 4,
    });
  };

  useEffect(() => {
    updateScrollState();
  }, [items]);

  const scrollByCards = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.8, 240);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const handleOpen = (item) => {
    if (isMobile) {
      router.push(`/reels?v=${item.id}`);
    } else {
      setActiveItem(item);
    }
  };

  const handleAdd = (item, qty = 1) => {
    addToCart(toCartProduct(item), qty, videoCartOptions(item));
  };

  const handleBuyNow = (item, qty = 1) => {
    buyNow.openBuyNow(toCartProduct(item), qty, videoCartOptions(item));
    setActiveItem(null);
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-tag">In Action</span>
          <h2 className={`section-title ${styles.title}`}>See Our Products Live</h2>
          <p className="section-subtitle">Watch before you buy</p>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`skeleton ${styles.skeletonCard}`} />
            ))}
          </div>
        ) : (
          <div className={styles.rowWrap}>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navBtnLeft}`}
              onClick={() => scrollByCards(-1)}
              disabled={!scrollState.left}
              aria-label="Scroll left"
            >
              <FiChevronLeft size={20} />
            </button>

            <div
              className={styles.grid}
              ref={rowRef}
              onScroll={updateScrollState}
            >
              {items.map((item) => (
                <VideoProductCard
                  key={item.id}
                  item={item}
                  isMobile={isMobile}
                  onOpen={() => handleOpen(item)}
                  onAdd={() => handleAdd(item, 1)}
                  onBuyNow={() => handleBuyNow(item, 1)}
                  onShare={() => handleShareClick(item)}
                />
              ))}
            </div>

            <button
              type="button"
              className={`${styles.navBtn} ${styles.navBtnRight}`}
              onClick={() => scrollByCards(1)}
              disabled={!scrollState.right}
              aria-label="Scroll right"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {!isMobile && activeItem && (
        <VideoProductModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onAdd={handleAdd}
          onBuyNow={handleBuyNow}
        />
      )}

      <BuyNowModal
        open={buyNow.open}
        onClose={buyNow.closeBuyNow}
        product={buyNow.product}
        quantity={buyNow.quantity}
        options={buyNow.options}
      />
    </section>
  );
}

function VideoProductCard({ item, isMobile, onOpen, onAdd, onBuyNow, onShare }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const discount = calcDiscount(item.mrp, item.price);
  const soldOut = item.stock === 0;
  const proof = getProductSocialProof(item.product_id || item.id);

  // Mobile: autoplay only while the card is mostly on screen
  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!isMobile || !video || !card || !item.video_url) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.35, 0.55, 0.75, 1], root: null, rootMargin: "0px" }
    );

    observer.observe(card);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [isMobile, item.video_url]);

  // Desktop: play on hover
  useEffect(() => {
    const video = videoRef.current;
    if (isMobile || !video || !item.video_url) return;

    if (hovered) {
      video.muted = true;
      video.play().catch(() => {});
    } else {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek errors */
      }
    }
  }, [hovered, isMobile, item.video_url]);

  const stopAnd = (fn) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className={styles.videoWrap}>
        {item.video_url ? (
          <video
            ref={videoRef}
            className={styles.video}
            src={mediaUrl(item.video_url, API_URL)}
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={item.name}
          />
        ) : (
          <div className={styles.videoPlaceholder}>
            <svg
              width="40"
              height="40"
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
        {!isMobile && item.video_url && !hovered && (
          <div className={styles.playHint} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        )}
        {discount > 0 && (
          <span className={styles.discount}>{discount}% OFF</span>
        )}
        <button
          type="button"
          className={styles.shareBtn}
          onClick={stopAnd(onShare)}
          aria-label="Share this product"
        >
          <FiShare2 size={13} />
        </button>
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{item.category}</span>
        <h3 className={styles.name}>{item.name}</h3>
        <div className={styles.cardRating} aria-label={`${proof.rating} stars`}>
          <span>★★★★★</span>
          <span>{proof.rating}</span>
          <span className={styles.reviews}>{proof.label}</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatPrice(item.price)}</span>
            {item.mrp > item.price && (
              <span className={styles.mrp}>{formatPrice(item.mrp)}</span>
            )}
          </div>
          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.cartIconBtn}
              onClick={stopAnd(onAdd)}
              disabled={soldOut}
              aria-label="Add to cart"
            >
              <FiShoppingCart size={15} />
            </button>
            <button
              type="button"
              className={styles.buyBtn}
              onClick={stopAnd(onBuyNow)}
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

function VideoProductModal({ item, onClose, onAdd, onBuyNow }) {
  const [qty, setQty] = useState(1);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const proof = getProductSocialProof(item.product_id || item.id);
  const discount = calcDiscount(item.mrp, item.price);
  const soldOut = item.stock === 0;

  useEffect(() => {
    const { body, documentElement } = document;
    const prevBody = body.style.overflow;
    const prevHtml = documentElement.style.overflow;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    return () => {
      body.style.overflow = prevBody;
      documentElement.style.overflow = prevHtml;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="presentation">
      <div
        className={styles.modalPanel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
      >
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={20} />
        </button>

        <div className={styles.modalVideo}>
          {item.video_url ? (
            <video
              ref={videoRef}
              className={styles.modalVideoEl}
              src={mediaUrl(item.video_url, API_URL)}
              autoPlay
              loop
              muted={muted}
              playsInline
            />
          ) : (
            <div className={styles.videoPlaceholder}>
              <svg
                width="48"
                height="48"
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
          {item.video_url && (
            <button
              type="button"
              className={styles.muteBtn}
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? <FiVolumeX size={17} /> : <FiVolume2 size={17} />}
            </button>
          )}
        </div>

        <div className={styles.modalInfo}>
          <div className={styles.modalInfoScroll}>
            <ProductImages images={item.images} name={item.name} />

            <div className={styles.modalHeadRow}>
              {item.category && (
                <span className={styles.category}>{item.category}</span>
              )}
              <button
                type="button"
                className={styles.modalShareBtn}
                onClick={() => handleShareClick(item)}
                aria-label="Share this product"
              >
                <FiShare2 size={14} />
                Share
              </button>
            </div>

            <h2 className={styles.modalName}>{item.name}</h2>

            <div className={styles.rating} aria-label={`${proof.rating} stars`}>
              <span className={styles.stars}>★★★★★</span>
              <span className={styles.ratingNum}>{proof.rating}</span>
              <span className={styles.reviews}>{proof.label}</span>
            </div>

            <div className={styles.modalPriceRow}>
              <span className={styles.modalPrice}>{formatPrice(item.price)}</span>
              {item.mrp > item.price && (
                <>
                  <span className={styles.modalMrp}>{formatPrice(item.mrp)}</span>
                  <span className={styles.modalSave}>{discount}% off</span>
                </>
              )}
            </div>

            {item.description && (
              <p className={styles.modalDesc}>{item.description}</p>
            )}
          </div>

          <div className={styles.modalActions}>
            {!soldOut && (
              <div className={styles.qty}>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={14} />
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQty((q) => Math.min(item.stock || 99, q + 1))
                  }
                  aria-label="Increase quantity"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            )}
            <button
              type="button"
              className={styles.modalAddBtn}
              onClick={() => onAdd(item, qty)}
              disabled={soldOut}
            >
              <FiShoppingCart size={16} />
              Add to Cart
            </button>
            <button
              type="button"
              className={styles.modalBuyBtn}
              onClick={() => onBuyNow(item, qty)}
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
