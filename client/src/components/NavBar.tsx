import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { BrainCircuit, Dumbbell, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function NavBar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/gym", label: "Pattern Gym", icon: Dumbbell },
    { href: "/interview", label: "Simulator", icon: BrainCircuit },
  ];

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold font-display text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline-block">
              Pattern<span className="text-primary/70">Gym</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/15" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}
                  `}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 rounded-full">
              <User className="w-4 h-4" />
              <span>{user.username || 'Profile'}</span>
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => logout()}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
