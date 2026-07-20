import api from "./api";

export const metafieldService = {
  getDefinitions: () => api.get("/metafields/").then((r) => r.data),
};
