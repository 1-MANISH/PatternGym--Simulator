import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Code2, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-grid-bg opacity-[0.4] pointer-events-none" />
      
      <main className="container max-w-6xl mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[0.95] tracking-tighter mb-8">
              Master the <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Hidden Patterns
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Stop memorizing solutions. Start recognizing patterns. 
              The intelligent gym for engineering interviews with real-time AI feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/gym">
                <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all">
                  Start Training
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/interview">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold bg-background/50 backdrop-blur-sm hover:bg-secondary/50">
                  Simulate Interview
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <FeatureCard 
              icon={Brain} 
              title="Pattern Recognition" 
              desc="Learn the underlying mental models behind complex problems."
              delay={0.3}
            />
            <FeatureCard 
              icon={Video} 
              title="Reality Simulator" 
              desc="Face the pressure with webcam & timer in realistic scenarios."
              delay={0.4}
            />
            <FeatureCard 
              icon={Code2} 
              title="System Design" 
              desc="Whiteboard and architect scalable systems from scratch."
              delay={0.5}
            />
            <div className="bg-primary/5 rounded-3xl p-8 flex items-center justify-center border border-primary/10">
              <div className="text-center">
                <span className="block text-4xl font-bold font-mono text-primary mb-2">AI</span>
                <span className="text-sm font-medium text-muted-foreground">Powered Analysis</span>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display font-bold text-xl mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
