import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SourceCitation({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sources</p>
      <div className="space-y-2">
        {sources.map((source, i) => (
          <div key={i} className="flex items-start gap-2 rounded-md border bg-muted/30 p-2.5 text-xs">
            <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{source.documentName}</span>
                {source.pageNumber && <Badge variant="outline">Page {source.pageNumber}</Badge>}
              </div>
              <p className="mt-1 text-muted-foreground line-clamp-2">{source.snippet}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
