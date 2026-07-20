"use client";

import { useParams } from "next/navigation";

import ProductForm from "@/pages-components/admin/ProductForm/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  return <ProductForm mode="edit" productId={id} />;
}
