import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "minimal" | "ocean" | "forest" | "sunset" | "midnight";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("minimal");

  useEffect(() => {
    // Remove all theme attributes first
    document.documentElement.removeAttribute("data-theme");
    if (theme !== "minimal") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-secondary/80 transition-colors">
          <Palette className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 font-medium">
        <DropdownMenuItem onClick={() => setTheme("minimal")}>
          <div className="w-3 h-3 rounded-full bg-zinc-400 mr-2" />
          Minimal Gray
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("ocean")}>
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
          Ocean Blue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("forest")}>
          <div className="w-3 h-3 rounded-full bg-emerald-600 mr-2" />
          Forest Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sunset")}>
          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
          Sunset Orange
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("midnight")}>
          <div className="w-3 h-3 rounded-full bg-violet-600 mr-2" />
          Midnight Purple
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
