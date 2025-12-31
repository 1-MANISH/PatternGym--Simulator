import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Award, Calendar, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Mon', score: 40 },
  { name: 'Tue', score: 65 },
  { name: 'Wed', score: 55 },
  { name: 'Thu', score: 80 },
  { name: 'Fri', score: 75 },
  { name: 'Sat', score: 90 },
  { name: 'Sun', score: 85 },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold mb-2">Welcome back, {user?.firstName || 'Engineer'}</h1>
        <p className="text-muted-foreground">Here is your training progress for the week.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={Activity} title="Problems Solved" value="42" change="+12% from last week" />
        <StatCard icon={TrendingUp} title="Average Score" value="85%" change="+5% improvement" />
        <StatCard icon={Calendar} title="Streak" value="5 Days" change="Keep it up!" />
        <StatCard icon={Award} title="Patterns Mastered" value="8" change="3 in progress" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Weak Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <WeakPatternItem name="Dynamic Programming" score={45} />
              <WeakPatternItem name="Graph Traversals" score={52} />
              <WeakPatternItem name="System Design: Caching" score={60} />
              <WeakPatternItem name="Heaps & Priority Queues" score={68} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, change }: any) {
  return (
    <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-primary/5 rounded-lg text-primary">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {change}
          </span>
        </div>
        <div className="text-3xl font-bold font-mono tracking-tight mb-1">{value}</div>
        <div className="text-sm text-muted-foreground font-medium">{title}</div>
      </CardContent>
    </Card>
  );
}

function WeakPatternItem({ name, score }: { name: string, score: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-2">
        <span>{name}</span>
        <span className="text-muted-foreground">{score}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-destructive/80 rounded-full" 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
}
