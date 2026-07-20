"use client";

import { useCallback, useEffect, useState } from "react";

import { productService } from "@/services/productService";

export function useProducts(initialParams = {}) {
  const [data, setData] = useState({ items: [], total: 0, total_pages: 0, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchProducts = useCallback(async (queryParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts(queryParams);
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(params);
  }, [fetchProducts, params]);

  return {
    products: data.items,
    pagination: data,
    loading,
    error,
    params,
    setParams,
    refetch: () => fetchProducts(params),
  };
}

export default useProducts;
