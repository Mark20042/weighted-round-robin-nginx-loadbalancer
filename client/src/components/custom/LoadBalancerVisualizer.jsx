import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  ShieldCheck,
  Activity,
  Database,
  Plus,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const useElementSize = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
};

const LoadBalancerVisualizer = ({ responses }) => {
  const [clientQueue, setClientQueue] = useState([]);
  const [activePacket, setActivePacket] = useState(null);
  const [serverQueues, setServerQueues] = useState({
    "API Server 1": [],
    "API Server 2": [],
    "API Server 3": [],
    "API Server 4": [],
    "API Server 5": [],
  });
  const [processingNodes, setProcessingNodes] = useState({});
  const [svgContainerRef, svgSize] = useElementSize();
  const lastProcessedIdRef = useRef(null);

  const [nodes, setNodes] = useState([
    { id: "API Server 1", label: "Server 1", color: "bg-red-500", weight: 1 },
    { id: "API Server 2", label: "Server 2", color: "bg-teal-500", weight: 2 },
    { id: "API Server 3", label: "Server 3", color: "bg-sky-500", weight: 1 },
    {
      id: "API Server 4",
      label: "Server 4",
      color: "bg-emerald-500",
      weight: 3,
    },
    {
      id: "API Server 5",
      label: "Server 5",
      color: "bg-yellow-500",
      weight: 1,
    },
  ]);

  const handleWeightChange = (id, newWeight) => {
    const val = parseInt(newWeight);
    // Limit weight between 1 and 10 for safety
    if (!isNaN(val) && val > 0 && val <= 10) {
      setNodes((prev) =>
        prev.map((node) => (node.id === id ? { ...node, weight: val } : node)),
      );
    }
  };

  useEffect(() => {
    if (responses.length > 0) {
      const latest = responses[0];
      if (
        latest &&
        !latest.isError &&
        latest.id !== lastProcessedIdRef.current
      ) {
        lastProcessedIdRef.current = latest.id;
        setClientQueue((prev) => [
          ...prev,
          {
            id: latest.id,
            targetApi: latest.apiName,
            color:
              nodes.find((n) => n.id === latest.apiName)?.color ||
              "bg-gray-500",
          },
        ]);
      }
    }
  }, [responses, nodes]);

  useEffect(() => {
    if (activePacket === null && clientQueue.length > 0) {
      const nextRequest = clientQueue[0];
      setClientQueue((prev) => prev.slice(1));
      setActivePacket({ ...nextRequest, phase: "toLoadBalancer" });
    }
  }, [activePacket, clientQueue]);

  useEffect(() => {
    nodes.forEach((node) => {
      const nodeId = node.id;
      const queue = serverQueues[nodeId];
      const isBusy = processingNodes[nodeId];

      if (!isBusy && queue && queue.length > 0) {
        setServerQueues((prev) => ({
          ...prev,
          [nodeId]: prev[nodeId].slice(1),
        }));
        setProcessingNodes((prev) => ({ ...prev, [nodeId]: true }));

        const processingTime = 6000 / node.weight;

        setTimeout(() => {
          setProcessingNodes((prev) => {
            const next = { ...prev };
            delete next[nodeId];
            return next;
          });
        }, processingTime);
      }
    });
  }, [serverQueues, processingNodes, nodes]);

  const handlePhaseComplete = () => {
    if (activePacket?.phase === "toLoadBalancer") {
      setActivePacket((prev) => ({ ...prev, phase: "toApi" }));
    } else if (activePacket?.phase === "toApi") {
      const target = activePacket.targetApi;
      setServerQueues((prev) => ({
        ...prev,
        [target]: [...(prev[target] || []), activePacket],
      }));
      setActivePacket(null);
    }
  };

  const CONTAINER_HEIGHT = 600;
  const HEADER_HEIGHT = 60;
  const CONTENT_HEIGHT = CONTAINER_HEIGHT - HEADER_HEIGHT;
  const CENTER_Y = CONTENT_HEIGHT / 2;

  const NODE_HEIGHT = 80;
  const NODE_GAP = 20;
  const TOTAL_SPACE = NODE_HEIGHT + NODE_GAP;

  const getTargetY = (index) => {
    const centerIndex = 2;
    return CENTER_Y + (index - centerIndex) * TOTAL_SPACE;
  };

  return (
    <Card
      className="w-full bg-slate-950 text-white border-slate-800 shadow-2xl overflow-hidden font-sans flex flex-col"
      style={{ height: CONTAINER_HEIGHT }}
    >
      <CardHeader
        className="pb-2 pt-4 border-b border-slate-900 bg-slate-900/50 shrink-0 flex justify-center"
        style={{ height: HEADER_HEIGHT }}
      >
        <CardTitle className="flex items-center justify-between text-lg w-full px-2">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-500 h-5 w-5" />
            <span className="font-semibold tracking-tight">
              Weighted Round Robin
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400">
            <span>
              Pending:{" "}
              <span className="text-white font-bold">{clientQueue.length}</span>
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 relative flex-1 overflow-hidden">
        <div className="h-full w-full flex items-center px-4 lg:px-6 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />

          <div className="flex items-center flex-shrink-0 z-10 mr-2">
            <div className="w-24 flex flex-col items-center gap-2 mt-12">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/50 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                  <Network className="w-7 h-7 text-blue-400" />
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono font-bold">
                  CLIENT
                </div>
              </div>
              <div className="h-6 w-full flex items-center justify-center gap-0.5 flex-wrap px-2">
                <AnimatePresence>
                  {clientQueue.slice(0, 12).map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-1.5 h-4 bg-blue-500 rounded-sm"
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className="w-16 h-[2px] bg-slate-800 relative mx-2">
              <AnimatePresence>
                {activePacket?.phase === "toLoadBalancer" && (
                  <motion.div
                    key="packet-incoming"
                    initial={{ left: "0%" }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 0.2, ease: "linear" }}
                    onAnimationComplete={handlePhaseComplete}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full z-30 shadow-lg"
                  >
                    <div
                      className={`absolute inset-0 rounded-full blur-[2px] ${nodes.find((n) => n.id === activePacket.targetApi)?.color}`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col items-center gap-1 relative">
              <div
                className={cn(
                  "w-20 h-20 bg-slate-900 border-2 rounded-xl flex items-center justify-center transition-all duration-300 z-20",
                  activePacket?.phase === "toLoadBalancer"
                    ? "border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                    : "border-slate-700",
                )}
              >
                <ShieldCheck className="w-9 h-9 text-indigo-500" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 absolute -bottom-5">
                NGINX-LB
              </span>
            </div>
          </div>

          <div className="flex-1 flex items-center h-full relative min-w-0">
            <div
              ref={svgContainerRef}
              className="h-full relative flex-1 min-w-[150px]"
            >
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                {nodes.map((node, index) => {
                  const targetY = getTargetY(index);
                  const isActive =
                    activePacket?.targetApi === node.id &&
                    activePacket?.phase === "toApi";
                  const width = svgSize.width || 100;
                  return (
                    <path
                      key={node.id}
                      d={`M 0,${CENTER_Y} C ${width * 0.5},${CENTER_Y} ${width * 0.5},${targetY} ${width},${targetY}`}
                      fill="none"
                      stroke={isActive ? "white" : "#334155"}
                      strokeWidth={isActive ? 2 : 1}
                      strokeDasharray={isActive ? "none" : "4,4"}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>
              <AnimatePresence>
                {activePacket?.phase === "toApi" && svgSize.width > 0 && (
                  <motion.div
                    key="packet-outgoing"
                    initial={{ left: 0, top: CENTER_Y }}
                    animate={() => ({
                      left: svgSize.width,
                      top: getTargetY(
                        nodes.findIndex((n) => n.id === activePacket.targetApi),
                      ),
                    })}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    onAnimationComplete={handlePhaseComplete}
                    className="absolute w-3 h-3 bg-white rounded-full z-30 shadow-md -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      className={`absolute inset-0 rounded-full ${nodes.find((n) => n.id === activePacket.targetApi)?.color}`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="flex flex-col relative z-10 flex-shrink-0 -ml-[2px]"
              style={{ gap: `${NODE_GAP}px` }}
            >
              {nodes.map((node) => {
                const isProcessing = processingNodes[node.id];
                const queue = serverQueues[node.id] || [];

                return (
                  <div
                    key={node.id}
                    className="flex items-center"
                    style={{ height: `${NODE_HEIGHT}px` }}
                  >
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full -mr-1.5 z-20 transition-colors border-2 border-slate-950",
                        isProcessing ? "bg-green-500" : "bg-slate-700",
                      )}
                    />

                    <div
                      className={cn(
                        "w-[320px] h-full bg-slate-900 border rounded-lg flex items-center p-2 relative transition-all shadow-xl gap-3",
                        isProcessing
                          ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                          : "border-slate-800",
                      )}
                    >
                      <div className="flex items-center gap-2 w-[130px] flex-shrink-0 border-r border-slate-800 pr-2">
                        <div className="relative">
                          <Database
                            className={cn(
                              "w-6 h-6",
                              isProcessing
                                ? "text-green-400"
                                : "text-slate-600",
                            )}
                          />
                          {isProcessing && (
                            <motion.div
                              className="absolute -inset-1 border-2 border-transparent border-t-green-500 rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 3 / node.weight,
                                ease: "linear",
                              }}
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex flex-col w-full">
                          <div
                            className={cn(
                              "text-xs font-bold truncate",
                              isProcessing ? "text-white" : "text-slate-500",
                            )}
                          >
                            {node.label}
                          </div>

                          {/* 3. IMPROVED WEIGHT CONTROL */}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-slate-600 font-mono">
                              W:
                            </span>
                            <div className="flex items-center bg-slate-950 border border-slate-800 rounded px-1 gap-1">
                              <button
                                onClick={() =>
                                  handleWeightChange(node.id, node.weight - 1)
                                }
                                className="w-4 h-4 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>

                              <span className="text-[10px] font-mono text-yellow-500 min-w-[14px] text-center font-bold">
                                {node.weight}
                              </span>

                              <button
                                onClick={() =>
                                  handleWeightChange(node.id, node.weight + 1)
                                }
                                className="w-4 h-4 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 h-full flex flex-col justify-center">
                        <div className="text-[8px] text-gray-200 font-mono mb-1 flex justify-between uppercase">
                          <span>Queue</span>
                          <span>{queue.length}</span>
                        </div>
                        <div className="h-8 w-full bg-black/40 rounded border border-slate-800/60 p-1 flex items-center gap-1 overflow-hidden relative shadow-inner">
                          {queue.length === 0 && (
                            <span className="text-[8px] text-slate-700 w-full text-center italic">
                              Idle
                            </span>
                          )}
                          <AnimatePresence>
                            {queue.map((req) => (
                              <motion.div
                                key={req.id}
                                layout
                                initial={{ opacity: 0, scale: 0, x: -5 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className={cn(
                                  "h-full w-1.5 rounded-[1px] shrink-0 shadow-sm",
                                  req.color,
                                )}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadBalancerVisualizer;
