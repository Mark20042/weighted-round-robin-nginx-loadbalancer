import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

const SimpleScrollArea = ({ className, children }) => (
  <div className={cn("overflow-y-auto custom-scrollbar", className)}>
    {children}
  </div>
);

const ResponseLog = ({ responses }) => {
  const getApiColor = (apiName) => {
    const colors = {
      "API Server 1": "text-red-500 bg-red-500/10 border-red-500/20",
      "API Server 2": "text-teal-500 bg-teal-500/10 border-teal-500/20",
      "API Server 3": "text-sky-500 bg-sky-500/10 border-sky-500/20",
      "API Server 4":
        "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      "API 5": "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
      Error: "text-destructive bg-destructive/10 border-destructive/20",
    };
    return (
      colors[apiName] || "text-slate-500 bg-slate-500/10 border-slate-500/20"
    );
  };

  return (
    <Card className="h-full max-h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Response Log</span>
          <span className="text-xs font-normal text-muted-foreground px-2 py-1 bg-secondary rounded-full">
            {responses.length} events
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <SimpleScrollArea className="h-full p-4 space-y-3">
          {responses.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 gap-2">
              <Clock className="h-8 w-8" />
              <p>Awaiting requests...</p>
            </div>
          ) : (
            responses.map((res) => (
              <div
                key={res.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md border transition-all text-sm animate-in fade-in slide-in-from-top-2",
                  getApiColor(res.apiName),
                )}
              >
                <div className="flex items-center gap-3">
                  {res.isError ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold">{res.apiName}</span>
                    <span className="text-xs opacity-70 truncate max-w-[200px]">
                      {res.text}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-mono opacity-60 tabular-nums">
                  {res.timestamp}
                </div>
              </div>
            ))
          )}
        </SimpleScrollArea>
      </CardContent>
    </Card>
  );
};

export default ResponseLog;
