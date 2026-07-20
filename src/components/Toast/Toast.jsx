"use client";

import toast from "react-hot-toast";

/**
 * Thin wrapper around react-hot-toast so the rest of the app imports a single
 * notify helper instead of the library directly.
 */
export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  dismiss: (id) => toast.dismiss(id),
  custom: (message, opts) => toast(message, opts),
};

export default notify;
