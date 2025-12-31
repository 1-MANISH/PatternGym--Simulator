import { usePatterns } from "@/hooks/use-patterns";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Layers } from "lucide-react";

export default function Gym() {
  const { data: patterns, isLoading } = usePatterns();

  if (isLoading) return <GymSkeleton />;

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-primary/20 bg-primary/5 text-primary">
          Pattern Gym
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Train Your Intuition</h1>
        <p className="text-lg text-muted-foreground">
          Don't just solve problems. Recognize the underlying patterns that solve hundreds of them.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patterns?.map((pattern, index) => (
          <motion.div
            key={pattern.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/gym/pattern/${pattern.id}`}>
              <Card className="group h-full cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="capitalize">
                      {pattern.category.replace('_', ' ')}
                    </Badge>
                    <Badge variant={pattern.difficulty === 'beginner' ? 'default' : pattern.difficulty === 'advanced' ? 'destructive' : 'secondary'} className="capitalize bg-opacity-10 text-opacity-100">
                      {pattern.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="font-display text-xl group-hover:text-primary transition-colors">
                    {pattern.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                    {pattern.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    Start Training <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GymSkeleton() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="space-y-4 max-w-2xl mx-auto text-center mb-16">
        <Skeleton className="h-6 w-24 mx-auto" />
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[240px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
