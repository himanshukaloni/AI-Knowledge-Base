import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentService } from "@/services/documentService";
import { useToast } from "@/components/ui/use-toast";

/**
 * React Query wraps documentService calls: this hook owns caching,
 * loading/error state, and cache invalidation after mutations.
 */
export function useDocuments(params = {}) {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () => documentService.list(params),
    // Poll while any document might still be processing, so the UI updates
    // from "processing" to "processed" without a manual refresh.
    refetchInterval: (query) => {
      const docs = query.state.data?.data?.documents || [];
      const stillProcessing = docs.some((d) => d.status === "processing" || d.status === "uploaded");
      return stillProcessing ? 3000 : false;
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ file, onUploadProgress }) => documentService.upload(file, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({ title: "Upload started", description: "Your document is being processed." });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id) => documentService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({ title: "Document deleted" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });
}
