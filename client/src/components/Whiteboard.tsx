import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Eraser, 
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface WhiteboardRef {
  clear: () => void;
  getDataUrl: () => string;
}

const Whiteboard = forwardRef<WhiteboardRef, { className?: string }>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil");

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (canvas && context) {
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    },
    getDataUrl: () => {
      return canvasRef.current?.toDataURL() || "";
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const tempImage = canvas.toDataURL();
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        const context = canvas.getContext("2d");
        if (context) {
          context.fillStyle = "white";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.lineCap = "round";
          context.lineJoin = "round";
          const img = new Image();
          img.onload = () => context.drawImage(img, 0, 0);
          img.src = tempImage;
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: any) => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const { x, y } = getPos(e);
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const { x, y } = getPos(e);
    context.strokeStyle = tool === "eraser" ? "white" : "black";
    context.lineWidth = tool === "eraser" ? 20 : 3;
    context.lineTo(x, y);
    context.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className={cn("relative flex flex-col h-full bg-white border rounded-md overflow-hidden", props.className)}>
      <div className="absolute top-2 left-2 flex gap-1 z-10 p-1 bg-slate-100/80 backdrop-blur rounded-lg shadow-sm">
        <Button 
          variant={tool === 'pencil' ? 'secondary' : 'ghost'} 
          size="icon" 
          onClick={() => setTool('pencil')}
          className="w-8 h-8"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button 
          variant={tool === 'eraser' ? 'secondary' : 'ghost'} 
          size="icon" 
          onClick={() => setTool('eraser')}
          className="w-8 h-8"
        >
          <Eraser className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (canvas && ctx) {
              ctx.fillStyle = "white";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          }}
          className="w-8 h-8 text-rose-500"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        className="flex-1 touch-none cursor-crosshair"
      />
    </div>
  );
});

Whiteboard.displayName = "Whiteboard";
export default Whiteboard;
