import { useEffect, useState, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import Webcam from "react-webcam";
import Editor from "@monaco-editor/react";
import { useSubmitInterview, useAnalyzeInterview } from "@/hooks/use-interviews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Timer } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Whiteboard, { WhiteboardRef } from "@/components/Whiteboard";
import { toast } from "@/hooks/use-toast";

export default function InterviewSession() {
  const [, params] = useRoute("/interview/session/:id");
  const [, navigate] = useLocation();
  const id = parseInt(params?.id || "0");
  
  const { mutate: endSession, isPending: isEnding } = useSubmitInterview();
  const { mutate: analyze, isPending: isAnalyzing } = useAnalyzeInterview();
  
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 mins
  const [step, setStep] = useState<"interview" | "analyzing">("interview");
  
  const [code, setCode] = useState("// Start coding here...");
  const [notes, setNotes] = useState("");
  const whiteboardRef = useRef<WhiteboardRef>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = () => {
    setStep("analyzing");
    const whiteboardData = whiteboardRef.current?.getDataUrl();
    
    endSession({ 
      id,
      code,
      notes,
      whiteboardData,
      feedback: "User completed interview simulation." 
    }, {
      onSuccess: () => {
        analyze(id, {
          onSuccess: () => {
            toast({ title: "Interview Complete", description: "Analysis finished." });
            navigate("/dashboard");
          }
        });
      }
    });
  };

  if (step === "analyzing" || isEnding || isAnalyzing) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8" />
        <h2 className="text-2xl font-display font-bold mb-2">Analyzing Performance</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Our AI is reviewing your code quality, communication patterns, and problem-solving approach.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-red-500 text-red-400 gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            LIVE
          </Badge>
          <div className="text-zinc-400 text-sm">Session #{id}</div>
        </div>

        <div className="flex items-center gap-4 bg-zinc-800 rounded-full px-4 py-1.5">
          <Timer className="w-4 h-4 text-primary" />
          <span className="font-mono font-bold text-xl tabular-nums">{formatTime(timeLeft)}</span>
        </div>

        <Button variant="destructive" onClick={handleEndInterview} className="gap-2">
          <PhoneOff className="w-4 h-4" />
          End Session
        </Button>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left: Editor & Whiteboard Tabs */}
        <ResizablePanel defaultSize={70}>
          <Tabs defaultValue="editor" className="h-full flex flex-col">
            <div className="px-4 bg-zinc-900 border-b border-white/5">
              <TabsList className="bg-transparent border-none">
                <TabsTrigger value="editor" className="data-[state=active]:bg-zinc-800">Editor</TabsTrigger>
                <TabsTrigger value="whiteboard" className="data-[state=active]:bg-zinc-800">Whiteboard</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="editor" className="flex-1 m-0 p-0 overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                theme="vs-dark"
                onChange={(v) => setCode(v || "")}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  padding: { top: 20 }
                }}
              />
            </TabsContent>
            <TabsContent value="whiteboard" className="flex-1 m-0 p-0 overflow-hidden bg-white">
              <Whiteboard ref={whiteboardRef} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle className="bg-zinc-800" />

        {/* Right: Video & Notes */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full flex flex-col bg-zinc-900 border-l border-white/10">
            {/* Webcam */}
            <div className="aspect-video bg-black relative group">
              {camOn ? (
                <Webcam 
                  audio={false}
                  className="w-full h-full object-cover mirror-mode"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  Camera Off
                </div>
              )}
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full backdrop-blur-sm">
                <Button 
                  size="icon" 
                  variant={micOn ? "secondary" : "destructive"} 
                  className="w-8 h-8 rounded-full"
                  onClick={() => setMicOn(!micOn)}
                >
                  {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button 
                  size="icon" 
                  variant={camOn ? "secondary" : "destructive"} 
                  className="w-8 h-8 rounded-full"
                  onClick={() => setCamOn(!camOn)}
                >
                  {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Prompt / Notes Tabs */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Tabs defaultValue="prompt" className="flex-1 flex flex-col">
                <TabsList className="bg-transparent border-b border-white/5 rounded-none px-4">
                  <TabsTrigger value="prompt">Prompt</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="prompt" className="flex-1 p-6 overflow-auto">
                  <h3 className="font-bold text-lg mb-4 text-white">Interviewer Prompt</h3>
                  <div className="prose prose-invert prose-sm">
                    <p>
                      Design a rate limiter that allows a maximum of N requests per minute for a given user ID. 
                      Discuss the tradeoffs between different algorithms (Token Bucket, Leaky Bucket, Sliding Window).
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="notes" className="flex-1 p-4">
                  <Textarea 
                    className="h-full bg-zinc-800 border-zinc-700 text-white resize-none"
                    placeholder="Capture your thoughts here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
