import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BarChart, Activity, Server } from "lucide-react";

const StatsDashboard = ({ apiStats, responses }) => {
  const total = responses.length;

  const getApiColor = (apiName) => {
    const colors = {
      "API 1": "bg-red-500",
      "API 2": "bg-teal-500",
      "API 3": "bg-sky-500",
      "API 4": "bg-emerald-500",
      "API 5": "bg-yellow-500",
      Error: "bg-destructive",
    };
    return colors[apiName] || "bg-slate-500";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="h-4 w-4" /> Distribution Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(apiStats).length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">
            No data available. Send some requests!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(apiStats).map(([api, count]) => (
              <div
                key={api}
                className="flex flex-col p-4 rounded-lg bg-secondary/50 border border-border/50 relative overflow-hidden"
              >
                <div
                  className={cn(
                    "absolute bottom-0 left-0 h-1 transition-all duration-500",
                    getApiColor(api),
                  )}
                  style={{ width: `${(count / total) * 100}%` }}
                />

                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">{api}</span>
                  <Server className="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
                <div className="mt-auto">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground">
                    {((count / total) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsDashboard;
