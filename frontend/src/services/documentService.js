import api from "./api";

export const documentService = {
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return api
      .post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      })
      .then((r) => r.data);
  },
  list: (params) => api.get("/documents", { params }).then((r) => r.data),
  getById: (id) => api.get(`/documents/${id}`).then((r) => r.data),
  download: (id) => api.get(`/documents/${id}/download`, { responseType: "blob" }),
  remove: (id) => api.delete(`/documents/${id}`).then((r) => r.data),
};
