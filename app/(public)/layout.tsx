import { Navbar } from "@/components/ui/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full">
      <div className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <Navbar />
        </div>
      </div>
      {children}
    </main>
  );
}
