import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Summarize the key points of my uploaded documents",
  "What are the main topics covered in my documents?",
  "List any important dates or figures mentioned",
];

export default function SuggestedQuestions({ onSelect }) {
  return (
    <div className="max-w-xl mx-auto text-center py-10">
      <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
      <h2 className="text-lg font-semibold mb-1">Ask anything about your documents</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Upload documents first, then ask questions — answers are grounded in your content with sources cited.
      </p>
      <div className="grid gap-2">
        {SUGGESTIONS.map((question) => (
          <Button
            key={question}
            variant="outline"
            className="justify-start text-left h-auto py-3 whitespace-normal"
            onClick={() => onSelect(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}
