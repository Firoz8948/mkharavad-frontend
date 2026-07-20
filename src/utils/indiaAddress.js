export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

/**
 * Lookup city/state from Indian pincode via postalpincode.in
 */
export async function lookupPincode(pincode) {
  const pin = String(pincode || "").replace(/\D/g, "");
  if (pin.length !== 6) {
    return { ok: false, error: "Enter a valid 6-digit pincode" };
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const data = await res.json();
    const entry = Array.isArray(data) ? data[0] : null;
    if (!entry || entry.Status !== "Success" || !entry.PostOffice?.length) {
      return { ok: false, error: "Pincode not found" };
    }
    const office = entry.PostOffice[0];
    return {
      ok: true,
      city: office.District || office.Block || office.Name || "",
      state: office.State || "",
      pincode: pin,
    };
  } catch {
    return { ok: false, error: "Could not look up pincode" };
  }
}
