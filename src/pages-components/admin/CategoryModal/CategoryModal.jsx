"use client";

import { useEffect, useRef, useState } from "react";
import {
  createCategory,
  updateCategory,
  uploadCategoryImage,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  uploadSubCategoryImage,
  getProductsForMapping,
  getCategory,
} from "@/services/adminService";
import styles from "./CategoryModal.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function mediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export default function CategoryModal({ category, onClose, onSuccess }) {
  const isEdit = !!category;
  const fileRef = useRef();
  const subFileRef = useRef();

  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    is_active: category?.is_active ?? true,
    position: category?.position ?? 0,
  });
  const [imageUrl, setImageUrl] = useState(category?.image_url || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(
    category?.image_url ? mediaUrl(category.image_url) : ""
  );

  const [subcategories, setSubcategories] = useState(
    category?.subcategories || []
  );
  const [activeTab, setActiveTab] = useState("details");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [categoryId, setCategoryId] = useState(category?.id || null);

  // Subcategory editor
  const [editingSub, setEditingSub] = useState(null);
  const [subForm, setSubForm] = useState({
    name: "",
    description: "",
    is_active: true,
    position: 0,
  });
  const [subImageFile, setSubImageFile] = useState(null);
  const [subPreview, setSubPreview] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [productSearch, setProductSearch] = useState("");
  const [subSaving, setSubSaving] = useState(false);

  const refreshCategory = async (id) => {
    const res = await getCategory(id);
    setSubcategories(res.data.subcategories || []);
    setImageUrl(res.data.image_url || "");
    setPreview(res.data.image_url ? mediaUrl(res.data.image_url) : "");
    return res.data;
  };

  useEffect(() => {
    getProductsForMapping()
      .then((res) => setAllProducts(res.data || []))
      .catch(console.error);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Category name is required";
    return e;
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        is_active: form.is_active,
        position: parseInt(form.position, 10) || 0,
      };

      let saved;
      if (isEdit || categoryId) {
        const res = await updateCategory(categoryId || category.id, payload);
        saved = res.data;
      } else {
        const res = await createCategory(payload);
        saved = res.data;
        setCategoryId(saved.id);
      }

      if (imageFile && saved?.id) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const imgRes = await uploadCategoryImage(saved.id, fd);
        saved = imgRes.data;
        setImageFile(null);
        setImageUrl(saved.image_url || "");
        setPreview(saved.image_url ? mediaUrl(saved.image_url) : preview);
      }

      if (!isEdit && !category) {
        // stay open so user can add subcategories
        setActiveTab("subcategories");
        await refreshCategory(saved.id);
      } else {
        onSuccess();
      }
    } catch (err) {
      alert(err?.response?.data?.detail || err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const openNewSub = () => {
    setEditingSub({ id: null });
    setSubForm({ name: "", description: "", is_active: true, position: 0 });
    setSubImageFile(null);
    setSubPreview("");
    setSelectedIds(new Set());
    setProductSearch("");
  };

  const openEditSub = (sub) => {
    setEditingSub(sub);
    setSubForm({
      name: sub.name || "",
      description: sub.description || "",
      is_active: sub.is_active ?? true,
      position: sub.position ?? 0,
    });
    setSubImageFile(null);
    setSubPreview(sub.image_url ? mediaUrl(sub.image_url) : "");
    const pre = new Set(
      allProducts.filter((p) => p.subcategory_id === sub.id).map((p) => p.id)
    );
    setSelectedIds(pre);
    setProductSearch("");
  };

  const handleSubImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubImageFile(file);
    setSubPreview(URL.createObjectURL(file));
  };

  const saveSubcategory = async () => {
    if (!categoryId && !category?.id) {
      alert("Save the category details first.");
      setActiveTab("details");
      return;
    }
    if (!subForm.name.trim()) {
      alert("Subcategory name is required");
      return;
    }

    const parentId = categoryId || category.id;
    setSubSaving(true);
    try {
      const payload = {
        name: subForm.name.trim(),
        description: subForm.description.trim(),
        is_active: subForm.is_active,
        position: parseInt(subForm.position, 10) || 0,
        product_ids: Array.from(selectedIds),
      };

      let saved;
      if (editingSub?.id) {
        const res = await updateSubCategory(editingSub.id, payload);
        saved = res.data;
      } else {
        const res = await createSubCategory(parentId, payload);
        saved = res.data;
      }

      if (subImageFile && saved?.id) {
        const fd = new FormData();
        fd.append("file", subImageFile);
        await uploadSubCategoryImage(saved.id, fd);
      }

      const productsRes = await getProductsForMapping();
      setAllProducts(productsRes.data || []);
      await refreshCategory(parentId);
      setEditingSub(null);
    } catch (err) {
      alert(err?.response?.data?.detail || err.message || "Failed to save subcategory.");
    } finally {
      setSubSaving(false);
    }
  };

  const handleDeleteSub = async (sub) => {
    if (!confirm(`Delete subcategory "${sub.name}"? Products will be unmapped.`)) {
      return;
    }
    try {
      await deleteSubCategory(sub.id);
      await refreshCategory(categoryId || category.id);
      if (editingSub?.id === sub.id) setEditingSub(null);
    } catch {
      alert("Failed to delete subcategory.");
    }
  };

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const toggleProduct = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>
              {isEdit || categoryId
                ? `Edit — ${form.name || category?.name}`
                : "New Category"}
            </h2>
            <p className={styles.modalSub}>
              Categories hold subcategories. Products map to subcategories only.
            </p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "details" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "subcategories" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("subcategories")}
            disabled={!isEdit && !categoryId}
          >
            Subcategories
            {subcategories.length > 0 && (
              <span className={styles.tabBadge}>{subcategories.length}</span>
            )}
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === "details" && (
            <form onSubmit={handleSubmitDetails} className={styles.detailsTab}>
              <div className={styles.detailsLeft}>
                <div className={styles.field}>
                  <label className={styles.label}>Category Name *</label>
                  <input
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    placeholder="e.g. Tawas"
                    value={form.name}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, name: e.target.value }));
                      if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                    }}
                  />
                  {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                  />
                </div>

                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label className={styles.label}>Display Order</label>
                    <input
                      className={styles.input}
                      type="number"
                      min="0"
                      value={form.position}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, position: e.target.value }))
                      }
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Visibility</label>
                    <div className={styles.toggleRow}>
                      <span className={styles.toggleLabel}>
                        {form.is_active ? "Active" : "Hidden"}
                      </span>
                      <button
                        type="button"
                        className={`${styles.toggle} ${form.is_active ? styles.toggleOn : ""}`}
                        onClick={() =>
                          setForm((p) => ({ ...p, is_active: !p.is_active }))
                        }
                      >
                        <span className={styles.toggleThumb} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.imagePanel}>
                <label className={styles.label}>Category Image</label>
                <div
                  className={styles.imageDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  {preview ? (
                    <img src={preview} alt="" className={styles.imagePreview} />
                  ) : (
                    <span>Click to upload image</span>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImagePick}
                />
                {(imageUrl || imageFile) && (
                  <button
                    type="button"
                    className={styles.bulkBtn}
                    onClick={() => {
                      setImageFile(null);
                      setPreview(imageUrl ? mediaUrl(imageUrl) : "");
                      if (!imageUrl) setPreview("");
                    }}
                  >
                    Reset image
                  </button>
                )}
              </div>
            </form>
          )}

          {activeTab === "subcategories" && (
            <div className={styles.productsTab}>
              {!editingSub ? (
                <>
                  <div className={styles.selectedInfo}>
                    <span className={styles.selectedCount}>
                      {subcategories.length} subcategories
                    </span>
                    <button
                      type="button"
                      className={styles.addSelectedBtn}
                      onClick={openNewSub}
                    >
                      + Add Subcategory
                    </button>
                  </div>
                  <div className={styles.productList}>
                    {subcategories.length === 0 ? (
                      <div className={styles.noProducts}>
                        No subcategories yet. Add one to place products under this category.
                      </div>
                    ) : (
                      subcategories.map((sub) => (
                        <div key={sub.id} className={styles.productItem}>
                          <div className={styles.productThumb}>
                            {sub.image_url ? (
                              <img src={mediaUrl(sub.image_url)} alt={sub.name} />
                            ) : (
                              <span>—</span>
                            )}
                          </div>
                          <div className={styles.productInfo}>
                            <span className={styles.productName}>{sub.name}</span>
                            <span className={styles.productCategory}>
                              {sub.product_count || 0} products · /{sub.slug}
                            </span>
                          </div>
                          <button
                            type="button"
                            className={styles.bulkBtn}
                            onClick={() => openEditSub(sub)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.bulkBtn}
                            onClick={() => handleDeleteSub(sub)}
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.detailsTab}>
                  <div className={styles.detailsLeft}>
                    <div className={styles.field}>
                      <label className={styles.label}>Subcategory Name *</label>
                      <input
                        className={styles.input}
                        value={subForm.name}
                        onChange={(e) =>
                          setSubForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="e.g. Flat Tawa"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Description</label>
                      <textarea
                        className={styles.textarea}
                        rows={2}
                        value={subForm.description}
                        onChange={(e) =>
                          setSubForm((p) => ({ ...p, description: e.target.value }))
                        }
                      />
                    </div>
                    <div className={styles.row2}>
                      <div className={styles.field}>
                        <label className={styles.label}>Order</label>
                        <input
                          className={styles.input}
                          type="number"
                          value={subForm.position}
                          onChange={(e) =>
                            setSubForm((p) => ({ ...p, position: e.target.value }))
                          }
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Visibility</label>
                        <button
                          type="button"
                          className={`${styles.toggle} ${subForm.is_active ? styles.toggleOn : ""}`}
                          onClick={() =>
                            setSubForm((p) => ({ ...p, is_active: !p.is_active }))
                          }
                        >
                          <span className={styles.toggleThumb} />
                        </button>
                      </div>
                    </div>

                    <div className={styles.imagePanel}>
                      <label className={styles.label}>Subcategory Image</label>
                      <div
                        className={styles.imageDrop}
                        onClick={() => subFileRef.current?.click()}
                      >
                        {subPreview ? (
                          <img src={subPreview} alt="" className={styles.imagePreview} />
                        ) : (
                          <span>Click to upload image</span>
                        )}
                      </div>
                      <input
                        ref={subFileRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleSubImagePick}
                      />
                    </div>
                  </div>

                  <div className={styles.productsTab} style={{ flex: 1 }}>
                    <div className={styles.productsToolbar}>
                      <input
                        className={styles.searchInput}
                        placeholder="Search products to map…"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>
                    <div className={styles.selectedInfo}>
                      <span className={styles.selectedCount}>
                        {selectedIds.size} products selected
                      </span>
                    </div>
                    <div className={styles.productList}>
                      {filteredProducts.map((product) => {
                        const checked = selectedIds.has(product.id);
                        return (
                          <label
                            key={product.id}
                            className={`${styles.productItem} ${checked ? styles.productChecked : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleProduct(product.id)}
                              className={styles.checkbox}
                            />
                            <div className={styles.productInfo}>
                              <span className={styles.productName}>{product.name}</span>
                              <span className={styles.productCategory}>
                                {product.category || "Uncategorised"}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Close
          </button>

          {activeTab === "details" && (
            <button
              type="button"
              className={styles.saveBtn}
              disabled={saving}
              onClick={handleSubmitDetails}
            >
              {saving
                ? "Saving…"
                : isEdit || categoryId
                  ? "Save Details"
                  : "Create & Add Subcategories"}
            </button>
          )}

          {activeTab === "subcategories" && editingSub && (
            <>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setEditingSub(null)}
              >
                Back
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                disabled={subSaving}
                onClick={saveSubcategory}
              >
                {subSaving ? "Saving…" : editingSub.id ? "Save Subcategory" : "Create Subcategory"}
              </button>
            </>
          )}

          {activeTab === "subcategories" && !editingSub && (
            <button type="button" className={styles.saveBtn} onClick={onSuccess}>
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
