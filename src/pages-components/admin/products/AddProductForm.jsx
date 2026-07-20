"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import Button from "@/components/Button/Button";
import { getAdminCategories } from "@/services/adminService";
import styles from "./AddProductForm.module.css";

const defaultValues = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  category_id: "",
  subcategory_id: "",
  stock: "",
  unit: "piece",
  weight: "",
  images: [],
  is_featured: false,
  is_active: true,
};

export default function AddProductForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Product",
  submitting,
}) {
  const [form, setForm] = useState({ ...defaultValues, ...initialValues });
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  const selectedCategory = categories.find(
    (c) => String(c.id) === String(form.category_id)
  );
  const subcategoryOptions = selectedCategory?.subcategories || [];

  useEffect(() => {
    getAdminCategories()
      .then((res) => {
        const list = res.data || [];
        setCategories(list);
        setForm((f) => {
          if (f.category_id) return f;
          const cat = list.find((c) => (c.subcategories || []).length) || list[0];
          if (!cat) return f;
          const sub = (cat.subcategories || [])[0];
          return {
            ...f,
            category_id: String(cat.id),
            subcategory_id: sub ? String(sub.id) : "",
          };
        });
      })
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "category_id") {
      const cat = categories.find((c) => String(c.id) === value);
      const sub = (cat?.subcategories || [])[0];
      setForm((f) => ({
        ...f,
        category_id: value,
        subcategory_id: sub ? String(sub.id) : "",
      }));
      return;
    }
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.error("Use the main Add Product form to upload images.");
    e.target.value = "";
  };

  const removeImage = (url) =>
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.subcategory_id) {
      toast.error("Name, price and subcategory are required");
      return;
    }
    onSubmit({
      ...form,
      category: selectedCategory?.name || "",
      subcategory_id: parseInt(form.subcategory_id, 10),
      price: Number(form.price),
      mrp: form.mrp ? Number(form.mrp) : null,
      stock: Number(form.stock || 0),
      weight: form.weight ? Number(form.weight) : null,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Product Name *</label>
        <input name="name" value={form.name} onChange={handleChange} />
      </div>

      <div className={styles.field}>
        <label>Description</label>
        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Price (₹) *</label>
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label>MRP (₹)</label>
          <input
            name="mrp"
            type="number"
            min="0"
            value={form.mrp}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Category *</label>
          <select name="category_id" value={form.category_id} onChange={handleChange}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Subcategory *</label>
          <select
            name="subcategory_id"
            value={form.subcategory_id}
            onChange={handleChange}
            disabled={!form.category_id}
          >
            <option value="">Select subcategory</option>
            {subcategoryOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label>Weight</label>
          <input
            name="weight"
            type="number"
            min="0"
            value={form.weight}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label>Unit</label>
          <select name="unit" value={form.unit} onChange={handleChange}>
            <option value="grams">grams</option>
            <option value="kg">kg</option>
            <option value="pieces">pieces</option>
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label>Images</label>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        <div className={styles.thumbs}>
          {form.images.map((url) => (
            <div key={url} className={styles.thumb}>
              <img src={url} alt="" />
              <button type="button" onClick={() => removeImage(url)} aria-label="Remove">
                <FiX />
              </button>
            </div>
          ))}
        </div>
      </div>

      <label className={styles.check}>
        <input
          type="checkbox"
          name="is_featured"
          checked={form.is_featured}
          onChange={handleChange}
        />
        Featured
      </label>

      <label className={styles.check}>
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />
        Active
      </label>

      <Button type="submit" disabled={submitting || uploading}>
        {submitLabel}
      </Button>
    </form>
  );
}
