import api from "./api";

export async function requestOTP(phone, name = "") {
  const res = await api.post("/otp/send", {
    phone: phone.trim(),
    name: name.trim(),
  });

  const { phone: confirmedPhone, debug, otp } = res.data;
  return {
    success: true,
    phone: confirmedPhone,
    debug: debug || false,
    otp: debug ? otp : undefined,
  };
}

export async function verifyOTP(phone, otp, name = "") {
  const res = await api.post("/otp/verify", {
    phone: phone.trim(),
    otp: otp.trim(),
    name: name.trim(),
  });
  return res.data;
}

export async function checkOTPStatus(phone) {
  const res = await api.get("/otp/status", {
    params: { phone: phone.trim() },
  });
  return res.data;
}

export async function getMyProfile() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function updateProfile(data) {
  const res = await api.put("/auth/profile", data);
  return res.data;
}

export async function refreshAccessToken() {
  const res = await api.post("/auth/refresh");
  return res.data;
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore
  } finally {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
  }
}

/** @deprecated Use named exports */
export const authService = {
  sendOtp: (phone, name) => requestOTP(phone, name),
  verifyOtp: (phone, otp, name) => verifyOTP(phone, otp, name),
  refreshToken: refreshAccessToken,
  logout: logoutUser,
  me: getMyProfile,
};
