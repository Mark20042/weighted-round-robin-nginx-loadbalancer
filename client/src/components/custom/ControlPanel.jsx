import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Send, Zap } from "lucide-react";

const ControlPanel = ({
  onSendOne,
  onSendFive,
  onSendTen,
  onClear,
  loading,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center p-4 bg-muted/30 rounded-lg border border-border">
      <Button
        onClick={onSendOne}
        disabled={loading}
        className="w-full sm:w-auto gap-2"
      >
        <Send className="h-4 w-4" />
        Send 1 Request
      </Button>

      <Button
        onClick={onSendFive}
        disabled={loading}
        variant="secondary"
        className="w-full sm:w-auto gap-2"
      >
        <Send className="h-4 w-4" />
        Send 5 Requests
      </Button>

      <Button
        onClick={onSendTen}
        disabled={loading}
        variant="secondary"
        className="w-full sm:w-auto gap-2"
      >
        <Send className="h-4 w-4" />
        Send 10 Requests
      </Button>

      <div className="w-px h-8 bg-border hidden sm:block mx-2" />

      <Button
        onClick={onClear}
        variant="destructive"
        className="w-full sm:w-auto gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Clear Logs
      </Button>
    </div>
  );
};

export default ControlPanel;
