"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Loader from "@/components/Loader/Loader";
import Testimonials from "@/pages-components/home/Testimonials";
import SubCategoryStrip from "@/pages-components/home/SubCategoryStrip";
import VideoProducts from "@/pages-components/home/VideoProducts";
import {
  ProductBenefitIcons,
  ProductImages,
  ProductInfo,
  ProductMetafields,
  ProductTrustBar,
  RelatedProducts,
} from "@/pages-components/product";
import { productService } from "@/services/productService";
import styles from "./product.module.css";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    productService
      .getProduct(slug)
      .then((data) => active && setProduct(data))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <Loader fullScreen />;

  if (error || !product) {
    return (
      <div className="container section" style={{ textAlign: "center" }}>
        <h2>Product not found</h2>
        <Link href="/shop" className={styles.back}>
          ← Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span className={styles.crumbCurrent}>{product.name}</span>
        </nav>

        <div className={styles.top}>
          <ProductImages images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>

        <ProductTrustBar />
        <ProductBenefitIcons />

        <ProductMetafields product={product} />
      </div>

      <VideoProducts />

      <RelatedProducts product={product} />

      <Testimonials />

      <div className={styles.subcats}>
        <SubCategoryStrip
          title="Shop our other collections"
          tag="Browse more"
        />
      </div>
    </div>
  );
}
