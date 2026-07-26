import { useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUploadDocument } from "@/hooks/useDocuments";
import { UploadCloud, Loader2 } from "lucide-react";

const ACCEPTED_TYPES = ".pdf,.docx,.txt";

export default function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);
  const uploadMutation = useUploadDocument();

  const handleFile = (file) => {
    if (!file) return;
    setProgress(0);
    uploadMutation.mutate(
      {
        file,
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      },
      {
        onSuccess: () => {
          setOpen(false);
          setProgress(0);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a document</DialogTitle>
        </DialogHeader>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Drag & drop or click to browse</p>
          <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT — up to 15MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {uploadMutation.isPending && (
          <div className="space-y-1">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Uploading... {progress}%
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
