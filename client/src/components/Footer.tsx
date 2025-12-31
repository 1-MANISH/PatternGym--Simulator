export function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="container max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground font-medium">
          Pattern Gym &copy; {new Date().getFullYear()} — Built with the Babua Philosophy
        </p>
      </div>
    </footer>
  );
}
