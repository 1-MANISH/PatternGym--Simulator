import { useProblem, useSubmitProblem } from "@/hooks/use-problems";
import { Link, useRoute } from "wouter";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ProblemSolver() {
  const [, params] = useRoute("/problem/:id");
  const id = parseInt(params?.id || "0");
  const { data: problem, isLoading } = useProblem(id);
  const { mutate: submit, isPending } = useSubmitProblem();
  const [code, setCode] = useState("");

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!problem) return <div>Problem not found</div>;

  const handleRun = () => {
    submit({ id, code: code || problem.starterCode || "", language: "javascript" }, {
      onSuccess: (data) => {
        if (data.status === 'passed') {
          toast({ title: "Success!", description: "All test cases passed.", variant: "default" });
        } else {
          toast({ title: "Failed", description: data.feedback, variant: "destructive" });
        }
      }
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-background">
        <div className="flex items-center gap-4">
          <Link href="/gym">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="font-bold font-display text-sm md:text-base">{problem.title}</h1>
        </div>
        <Button onClick={handleRun} disabled={isPending} size="sm" className="gap-2">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Run Code
        </Button>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={40} minSize={30}>
          <ScrollArea className="h-full">
            <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 rounded bg-secondary text-xs font-medium uppercase text-muted-foreground">
                  {problem.difficulty}
                </span>
              </div>
              <h3>Description</h3>
              <p>{problem.description}</p>
              
              <h3 className="mt-8">Examples</h3>
              <div className="not-prose space-y-4">
                {(problem.testCases as any[])?.slice(0, 2).map((tc, i) => (
                  <div key={i} className="bg-muted/50 p-4 rounded-lg font-mono text-xs border border-border">
                    <div className="mb-2"><span className="text-muted-foreground">Input:</span> {JSON.stringify(tc.input)}</div>
                    <div><span className="text-muted-foreground">Output:</span> {JSON.stringify(tc.output)}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={60}>
          <div className="h-full bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              defaultValue={problem.starterCode || "// Write your code here"}
              theme="vs-dark"
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                scrollBeyondLastLine: false,
                padding: { top: 20 }
              }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
