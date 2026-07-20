export function isValidPhone(phone) {
  return /^\+?\d{10,15}$/.test(String(phone || "").replace(/\s/g, ""));
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

export function isValidOtp(otp, length = 6) {
  return new RegExp(`^\\d{${length}}$`).test(String(otp || ""));
}

export function isValidPincode(pincode) {
  return /^\d{6}$/.test(String(pincode || ""));
}

export function normalizePhone(phone) {
  const cleaned = String(phone || "").replace(/\s/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.length === 10) return `+91${cleaned}`;
  return cleaned;
}

export function required(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}
