import api from "./api";

export const dashboardService = {
  getStats: () => api.get("/dashboard").then((r) => r.data),
};
