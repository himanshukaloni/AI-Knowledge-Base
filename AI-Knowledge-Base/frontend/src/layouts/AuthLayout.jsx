import { Outlet } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: branding panel (hidden on small screens) */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-primary/60 text-primary-foreground p-12">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <BrainCircuit className="h-7 w-7" />
          AI Knowledge Base
        </div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            Ask questions. Get answers grounded in your own documents.
          </h2>
          <p className="text-primary-foreground/80">
            Upload PDFs, DOCX, or TXT files and chat with an AI assistant that only
            answers from what you've uploaded — with sources cited every time.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/60">
          Retrieval-Augmented Generation, powered by OpenAI & MongoDB Atlas Vector Search
        </p>
      </div>

      {/* Right: auth form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
