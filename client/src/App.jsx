import { useState } from "react";
import LoadBalancerVisualizer from "@/components/custom/LoadBalancerVisualizer";
import ControlPanel from "@/components/custom/ControlPanel";
import StatsDashboard from "@/components/custom/StatsDashboard";
import ResponseLog from "@/components/custom/ResponseLog";

function App() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState({});

  const sendRequest = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sheeshable");
      const data = await res.json();
      const apiName = data.servedBy || "Unknown";
      const timestamp = new Date().toLocaleTimeString();

      const newResponse = {
        text: data.message,
        apiName,
        timestamp,
        id: Date.now(),
        isError: false,
      };

      setResponses((prev) => [newResponse, ...prev].slice(0, 50));

      // Update stats
      setApiStats((prev) => ({
        ...prev,
        [apiName]: (prev[apiName] || 0) + 1,
      }));
    } catch (error) {
      const newResponse = {
        text: "Error: Could not reach load balancer",
        apiName: "Error",
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now(),
        isError: true,
      };
      setResponses((prev) => [newResponse, ...prev].slice(0, 50));

      setApiStats((prev) => ({
        ...prev,
        Error: (prev["Error"] || 0) + 1,
      }));
    } finally {
      // Small delay to allow animations to complete if single request
      setTimeout(() => setLoading(false), 30);
    }
  };

  const sendMultipleRequests = async (count) => {
    setLoading(true);
    for (let i = 0; i < count; i++) {
      await sendRequest();
      await new Promise((r) => setTimeout(r, 30)); // Slower delay to enjoy the animation
    }
    setLoading(false);
  };

  const clearResponses = () => {
    setResponses([]);
    setApiStats({});
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="border-b bg-card py-4 px-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Load Balancer Tester
            </h1>
            <p className="text-sm text-muted-foreground">
              Visualizing Nginx Round Robin Distribution
            </p>
          </div>
          <div className="text-xs text-muted-foreground border px-2 py-1 rounded-md bg-secondary/50">
            AzoreDev
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Section: Visualizer & Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Visualizer (Takes up 2/3 on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <LoadBalancerVisualizer responses={responses} loading={loading} />
            <ControlPanel
              onSendOne={sendRequest}
              onSendFive={() => sendMultipleRequests(5)}
              onSendTen={() => sendMultipleRequests(20)}
              onClear={clearResponses}
              loading={loading}
            />
          </div>

          {/* Right Column: Response Log */}
          <div className="lg:col-span-1 h-[600px] lg:h-auto">
            <ResponseLog responses={responses} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
