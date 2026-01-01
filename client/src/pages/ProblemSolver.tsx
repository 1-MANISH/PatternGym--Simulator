import { useState, useEffect, useRef } from "react";
import { useProblem, useSubmitProblem } from "@/hooks/use-problems";
import { Link, useRoute } from "wouter";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, ArrowLeft, Loader2, Maximize2, Minimize2, 
  Clock, RotateCcw, Monitor, FileText, CheckCircle2, XCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "JS" },
  { id: "python", name: "Python", icon: "PY" },
  { id: "cpp", name: "C++", icon: "C++" },
  { id: "java", name: "Java", icon: "JV" },
  { id: "go", name: "Go", icon: "GO" },
];

export default function ProblemSolver() {
  const [, params] = useRoute("/problem/:id");
  const id = parseInt(params?.id || "0");
  const { data: problem, isLoading } = useProblem(id);
  const { mutate: submit, isPending } = useSubmitProblem();
  
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [view, setView] = useState<"editor" | "excalidraw">("editor");
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [isNotesMaximized, setIsNotesMaximized] = useState(false);
  
  // Timer State
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Result State
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode || "");
    }
  }, [problem]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRun = () => {
    setIsActive(false);
    submit({ id, code, language }, {
      onSuccess: (data) => {
        setResultData(data);
        setShowResult(true);
        if (data.status === 'passed') {
          toast({ title: "Success!", description: "All test cases passed.", variant: "default" });
        } else {
          toast({ title: "Check Results", description: "Some test cases failed.", variant: "destructive" });
        }
      }
    });
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!problem) return <div>Problem not found</div>;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm z-20">
        <div className="flex items-center gap-4">
          <Link href="/gym">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover-elevate">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="font-bold font-display text-sm leading-tight">{problem.title}</h1>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Timer Display */}
          <div className="flex items-center gap-3 px-4 py-1.5 bg-secondary/50 rounded-full border border-border/50">
            <Clock className={cn("w-4 h-4", isActive ? "text-primary animate-pulse" : "text-muted-foreground")} />
            <span className="font-mono text-sm font-bold tabular-nums">{formatTime(time)}</span>
            <div className="flex gap-1 ml-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? <div className="w-2 h-2 bg-foreground rounded-sm" /> : <Play className="w-3 h-3 fill-current" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => { setTime(0); setIsActive(false); }}
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[130px] h-9 bg-background">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleRun} disabled={isPending} size="sm" className="h-9 gap-2 px-6">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel: Description & Excalidraw */}
        {!isEditorMaximized && (
          <ResizablePanel defaultSize={40} minSize={20} className={cn(isNotesMaximized && "flex-[1_1_100%]")}>
            <div className="h-full flex flex-col border-r border-border">
              <div className="h-12 border-b border-border flex items-center px-4 bg-muted/30 justify-between">
                <div className="flex gap-1">
                  <Button 
                    variant={view === 'editor' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="h-8 gap-2"
                    onClick={() => setView('editor')}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Description
                  </Button>
                  <Button 
                    variant={view === 'excalidraw' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="h-8 gap-2"
                    onClick={() => setView('excalidraw')}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    Whiteboard
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setIsNotesMaximized(!isNotesMaximized)}
                >
                  {isNotesMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>

              <div className="flex-1 relative overflow-hidden">
                {view === 'editor' ? (
                  <ScrollArea className="h-full">
                    <div className="p-8 prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-base leading-relaxed text-foreground/90">{problem.description}</p>
                      
                      <h3 className="text-lg font-display mt-10 mb-4">Examples</h3>
                      <div className="not-prose space-y-6">
                        {(problem.testCases as any[])?.slice(0, 2).map((tc, i) => (
                          <div key={i} className="group relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors" />
                            <div className="bg-muted/40 p-5 rounded-2xl border border-border/50">
                              <div className="mb-3">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Input</span>
                                <code className="text-sm font-mono text-primary/90">{JSON.stringify(tc.input)}</code>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Output</span>
                                <code className="text-sm font-mono text-foreground/90">{JSON.stringify(tc.output)}</code>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="absolute inset-0 bg-muted/20 flex items-center justify-center flex-col gap-4">
                    {/* Placeholder for real Excalidraw integration */}
                    <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
                      <Monitor className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground max-w-[200px] text-center">
                      Interactive Whiteboard for Algorithm Planning
                    </p>
                    <Button variant="outline" size="sm" className="rounded-full">Launch Workspace</Button>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        )}
        
        {!isEditorMaximized && !isNotesMaximized && <ResizableHandle withHandle />}
        
        {/* Right Panel: Code Editor */}
        {!isNotesMaximized && (
          <ResizablePanel defaultSize={60} className={cn(isEditorMaximized && "flex-[1_1_100%]")}>
            <div className="h-full flex flex-col bg-[#1e1e1e]">
              <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#252526]">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Editor</span>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <span className="text-xs text-white/60 font-mono">{language}.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'cpp'}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white/40 hover:text-white" 
                  onClick={() => setIsEditorMaximized(!isEditorMaximized)}
                >
                  {isEditorMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  theme="vs-dark"
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', monospace",
                    scrollBeyondLastLine: false,
                    padding: { top: 20 },
                    automaticLayout: true,
                    smoothScrolling: true,
                    cursorSmoothCaretAnimation: "on" as any,
                  }}
                />
              </div>
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-3xl p-0 gap-0 border-none shadow-2xl">
          <div className={cn(
            "p-8 text-white flex flex-col items-center text-center gap-4 transition-colors duration-500",
            resultData?.status === 'passed' ? "bg-emerald-600" : "bg-rose-600"
          )}>
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 mb-2">
              {resultData?.status === 'passed' ? (
                <CheckCircle2 className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </div>
            <DialogHeader className="gap-2">
              <DialogTitle className="text-3xl font-display font-bold text-white">
                {resultData?.status === 'passed' ? "Mission Accomplished!" : "Pattern Incomplete"}
              </DialogTitle>
              <p className="text-white/80 max-w-md mx-auto leading-relaxed">
                {resultData?.feedback}
              </p>
            </DialogHeader>
          </div>

          <div className="p-8 bg-background">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Accuracy Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-bold">{Math.round(resultData?.score || 0)}%</span>
                  <span className="text-muted-foreground">success rate</span>
                </div>
              </div>
              <div className="w-32">
                <Progress value={resultData?.score} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Test Case Summary</span>
              <div className="grid grid-cols-5 gap-3">
                {resultData?.testResults.map((test: any, i: number) => (
                  <div 
                    key={i} 
                    className={cn(
                      "aspect-square rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
                      test.passed 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" 
                        : "bg-rose-500/10 border-rose-500/20 text-rose-600"
                    )}
                  >
                    {test.passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              className="w-full mt-10 h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/10"
              onClick={() => setShowResult(false)}
            >
              Back to Workspace
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
