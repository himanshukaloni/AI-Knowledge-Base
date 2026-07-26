import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { Copy, RotateCw, Check, User, Bot } from "lucide-react";
import { useState } from "react";
import SourceCitation from "./SourceCitation";
import { Button } from "@/components/ui/button";

function CodeBlock({ inline, className, children }) {
  const match = /language-(\w+)/.exec(className || "");
  if (inline) {
    return <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{children}</code>;
  }
  return (
    <SyntaxHighlighter style={oneDark} language={match?.[1] || "text"} PreTag="div" customStyle={{ borderRadius: 8 }}>
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
}

export default function MessageBubble({ role, content, sources, onRegenerate, isStreaming }) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`group max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            isUser ? "bg-primary text-primary-foreground" : "bg-card border"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown components={{ code: CodeBlock }}>{content || " "}</ReactMarkdown>
              {isStreaming && <span className="inline-block w-1.5 h-4 bg-current animate-pulse ml-0.5" />}
            </div>
          )}
          {!isUser && !isStreaming && <SourceCitation sources={sources} />}
        </div>

        {!isUser && !isStreaming && (
          <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            {onRegenerate && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRegenerate}>
                <RotateCw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
