import api from "./api";

export const adminService = {
  getUsers: (params) => api.get("/admin/users", { params }).then((r) => r.data),
  getDocuments: (params) => api.get("/admin/documents", { params }).then((r) => r.data),
  getAnalytics: () => api.get("/admin/analytics").then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
  deleteDocument: (id) => api.delete(`/admin/documents/${id}`).then((r) => r.data),
};
