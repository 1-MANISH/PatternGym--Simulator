import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCreateInterview } from "@/hooks/use-interviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Code2, Monitor, Loader2 } from "lucide-react";

export default function Interview() {
  const [, navigate] = useLocation();
  const { mutate: createSession, isPending } = useCreateInterview();
  const [type, setType] = useState<"dsa" | "system_design" | "behavioral">("dsa");

  const handleStart = () => {
    createSession(type, {
      onSuccess: (session) => {
        navigate(`/interview/session/${session.id}`);
      }
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Reality Simulator</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience the pressure of a real interview. Webcam on, timer running, no second chances.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <TypeCard 
          id="dsa" 
          selected={type === "dsa"} 
          onClick={() => setType("dsa")}
          icon={Code2}
          title="DSA Interview"
          desc="Algorithms & Data Structures. 45 minutes."
        />
        <TypeCard 
          id="system_design" 
          selected={type === "system_design"} 
          onClick={() => setType("system_design")}
          icon={Monitor}
          title="System Design"
          desc="Architecture & Scalability. 60 minutes."
        />
        <TypeCard 
          id="behavioral" 
          selected={type === "behavioral"} 
          onClick={() => setType("behavioral")}
          icon={Brain}
          title="Behavioral"
          desc="Leadership principles & soft skills. 30 minutes."
        />
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="h-14 px-12 text-lg rounded-full shadow-xl shadow-primary/20"
          onClick={handleStart}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Setting up Environment...
            </>
          ) : (
            "Start Simulation"
          )}
        </Button>
      </div>
    </div>
  );
}

function TypeCard({ id, selected, onClick, icon: Icon, title, desc }: any) {
  return (
    <div 
      onClick={onClick}
      className={`
        relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300
        ${selected 
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 scale-[1.02]" 
          : "border-border bg-card hover:border-primary/30 hover:bg-secondary/30"}
      `}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${selected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold font-display mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
