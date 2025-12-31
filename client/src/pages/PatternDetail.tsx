import { usePattern, usePatternProblems } from "@/hooks/use-patterns";
import { Link, useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";

export default function PatternDetail() {
  const [, params] = useRoute("/gym/pattern/:id");
  const id = parseInt(params?.id || "0");
  const { data: pattern, isLoading: pLoading } = usePattern(id);
  const { data: problems, isLoading: prLoading } = usePatternProblems(id);

  if (pLoading || prLoading) return <div className="p-12 text-center">Loading pattern...</div>;
  if (!pattern) return <div className="p-12 text-center">Pattern not found</div>;

  const checklist = pattern.checklist as string[] || [];

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/gym" className="hover:text-primary transition-colors">Gym</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{pattern.title}</span>
        </div>
        
        <h1 className="text-4xl font-display font-bold mb-6">{pattern.title}</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="prose prose-zinc dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold mb-3">Intuition</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">{pattern.intuition}</p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4">Practice Problems</h3>
              <div className="space-y-3">
                {problems?.map((prob) => (
                  <Link key={prob.id} href={`/problem/${prob.id}`}>
                    <div className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <PlayCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold">{prob.title}</div>
                          <div className="text-xs text-muted-foreground capitalize">{prob.difficulty}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-24 border-primary/10 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Mental Checklist
                </h3>
                <ul className="space-y-3">
                  {checklist.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
