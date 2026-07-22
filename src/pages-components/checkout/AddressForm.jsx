"use client";

import { useState } from "react";

import { INDIAN_STATES, lookupPincode } from "@/utils/indiaAddress";
import styles from "./AddressForm.module.css";

export default function AddressForm({
  address,
  onChange,
  phoneReadOnly = false,
  onAddNewAddress,
}) {
  const [pinHint, setPinHint] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  const handleChange = (e) =>
    onChange({ ...address, [e.target.name]: e.target.value });

  const handlePincode = async (value) => {
    const pin = value.replace(/\D/g, "").slice(0, 6);
    onChange({ ...address, pincode: pin });
    setPinHint("");
    if (pin.length !== 6) return;

    setPinLoading(true);
    const result = await lookupPincode(pin);
    setPinLoading(false);
    if (!result.ok) {
      setPinHint(result.error || "Pincode not found");
      return;
    }
    onChange({
      ...address,
      pincode: result.pincode,
      city: result.city || address.city,
      state: result.state || address.state,
    });
    setPinHint(`Filled: ${result.city}, ${result.state}`);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h3>Shipping Details</h3>
        {onAddNewAddress ? (
          <button
            type="button"
            className={styles.addNewBtn}
            onClick={onAddNewAddress}
          >
            + Add new address
          </button>
        ) : null}
      </div>

      <div className={styles.grid}>
        <div>
          <label>Full Name</label>
          <input
            name="full_name"
            placeholder=""
            value={address.full_name || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mobile</label>
          <input
            name="phone"
            placeholder=""
            value={address.phone || ""}
            onChange={handleChange}
            readOnly={phoneReadOnly}
            disabled={phoneReadOnly}
          />
        </div>

        <div className={styles.full}>
          <label>Email (optional)</label>
          <input
            name="email"
            placeholder=""
            value={address.email || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.full}>
          <label>Address Line 1</label>
          <input
            name="line1"
            placeholder=""
            value={address.line1 || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.full}>
          <label>Address Line 2</label>
          <input
            name="line2"
            placeholder=""
            value={address.line2 || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.full}>
          <label>Landmark</label>
          <input
            name="landmark"
            placeholder=""
            value={address.landmark || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Pin Code</label>
          <input
            name="pincode"
            placeholder=""
            inputMode="numeric"
            maxLength={6}
            value={address.pincode || ""}
            onChange={(e) => handlePincode(e.target.value)}
          />
          {pinLoading ? (
            <span className={styles.hint}>Looking up city &amp; state…</span>
          ) : pinHint ? (
            <span className={styles.hint}>{pinHint}</span>
          ) : null}
        </div>

        <div>
          <label>City</label>
          <input
            name="city"
            placeholder=""
            value={address.city || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.full}>
          <label>State</label>
          <select
            name="state"
            value={address.state || ""}
            onChange={handleChange}
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
