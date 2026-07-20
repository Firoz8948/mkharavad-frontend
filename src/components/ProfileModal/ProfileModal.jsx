"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "@/services/authService";
import { INDIAN_STATES, lookupPincode } from "@/utils/indiaAddress";
import styles from "./ProfileModal.module.css";

const emptyAddress = {
  address_line1: "",
  address_line2: "",
  address_landmark: "",
  address_city: "",
  address_state: "",
  address_pincode: "",
};

export default function ProfileModal({ onClose }) {
  const { user, refresh } = useAuth();
  const overlayRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState(emptyAddress);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinHint, setPinHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAddress({
        address_line1: user.address_line1 || "",
        address_line2: user.address_line2 || "",
        address_landmark: user.address_landmark || "",
        address_city: user.address_city || "",
        address_state: user.address_state || "",
        address_pincode: user.address_pincode || "",
      });
      setError("");
      setSuccess("");
      setPinHint("");
    }
  }, [user]);

  const setAddressField = (key, value) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handlePincodeChange = async (value) => {
    const pin = value.replace(/\D/g, "").slice(0, 6);
    setAddressField("address_pincode", pin);
    setPinHint("");

    if (pin.length !== 6) return;

    setPinLoading(true);
    const result = await lookupPincode(pin);
    setPinLoading(false);

    if (!result.ok) {
      setPinHint(result.error || "Pincode not found");
      return;
    }

    setAddress((prev) => ({
      ...prev,
      address_pincode: result.pincode,
      address_city: result.city || prev.address_city,
      address_state: result.state || prev.address_state,
    }));
    setPinHint(`Filled: ${result.city}, ${result.state}`);
  };

  if (!mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!address.address_line1.trim()) {
      setError("Address line 1 is required.");
      return;
    }
    if (!address.address_city.trim() || !address.address_state.trim()) {
      setError("City and state are required.");
      return;
    }
    if (!/^\d{6}$/.test(address.address_pincode)) {
      setError("Enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        address_line1: address.address_line1.trim(),
        address_line2: address.address_line2.trim(),
        address_landmark: address.address_landmark.trim(),
        address_city: address.address_city.trim(),
        address_state: address.address_state.trim(),
        address_pincode: address.address_pincode.trim(),
      });
      await refresh();
      setSuccess("Profile saved successfully.");
      setTimeout(() => onClose(), 900);
    } catch (err) {
      setError(err?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && !loading) onClose();
  };

  return createPortal(
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Complete profile"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Complete Profile</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit}>
          <p className={styles.subtitle}>
            Save your delivery address once — it will autofill at checkout.
          </p>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="profile-phone">
              Mobile Number
            </label>
            <input
              id="profile-phone"
              className={styles.input}
              type="tel"
              value={user?.phone ? `+91 ${user.phone}` : ""}
              disabled
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="profile-name">
              Full Name
            </label>
            <input
              id="profile-name"
              className={styles.input}
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="profile-line1">
              Address Line 1
            </label>
            <input
              id="profile-line1"
              className={styles.input}
              type="text"
              placeholder="House / flat no., street"
              value={address.address_line1}
              onChange={(e) => setAddressField("address_line1", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="profile-line2">
              Address Line 2
            </label>
            <input
              id="profile-line2"
              className={styles.input}
              type="text"
              placeholder="Area, locality (optional)"
              value={address.address_line2}
              onChange={(e) => setAddressField("address_line2", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="profile-landmark">
              Landmark
            </label>
            <input
              id="profile-landmark"
              className={styles.input}
              type="text"
              placeholder="Near temple / market (optional)"
              value={address.address_landmark}
              onChange={(e) =>
                setAddressField("address_landmark", e.target.value)
              }
            />
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="profile-pincode">
                Pin Code
              </label>
              <input
                id="profile-pincode"
                className={styles.input}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="401303"
                value={address.address_pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
              />
              {pinLoading ? (
                <span className={styles.hint}>Looking up city &amp; state…</span>
              ) : pinHint ? (
                <span className={styles.hint}>{pinHint}</span>
              ) : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="profile-city">
                City
              </label>
              <input
                id="profile-city"
                className={styles.input}
                type="text"
                placeholder="City"
                value={address.address_city}
                onChange={(e) => setAddressField("address_city", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="profile-state">
              State
            </label>
            <select
              id="profile-state"
              className={styles.input}
              value={address.address_state}
              onChange={(e) => setAddressField("address_state", e.target.value)}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}
          {success && <div className={styles.successBox}>{success}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner} /> Saving…
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
