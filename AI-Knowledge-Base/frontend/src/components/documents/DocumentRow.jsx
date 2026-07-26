import { FileText, Download, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/date";
import { documentService } from "@/services/documentService";
import { useDeleteDocument } from "@/hooks/useDocuments";

const statusVariant = {
  processed: "success",
  processing: "warning",
  uploaded: "secondary",
  failed: "destructive",
};

export default function DocumentRow({ document }) {
  const deleteMutation = useDeleteDocument();

  const handleDownload = async () => {
    const response = await documentService.download(document._id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = window.document.createElement("a");
    link.href = url;
    link.download = document.originalName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <tr className="border-b last:border-0 hover:bg-muted/40">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate font-medium">{document.originalName}</span>
        </div>
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground uppercase">{document.fileType}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{formatFileSize(document.fileSize)}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{document.chunkCount || "—"}</td>
      <td className="py-3 pr-4">
        <Badge variant={statusVariant[document.status]} className="capitalize">
          {(document.status === "processing" || document.status === "uploaded") && (
            <Loader2 className="mr-1 h-3 w-3 animate-spin inline" />
          )}
          {document.status}
        </Badge>
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">
        {new Date(document.createdAt).toLocaleDateString()}
      </td>
      <td className="py-3 text-right">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={handleDownload} title="Download">
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate(document._id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
