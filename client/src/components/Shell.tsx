import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Car, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function Shell({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border/10">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          FleetCommand
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2">
        <Link href="/">
          <Button 
            variant={location === "/" ? "secondary" : "ghost"} 
            className="w-full justify-start gap-3 text-base h-12"
          >
            <LayoutDashboard className="w-5 h-5 opacity-70" />
            Dashboard
          </Button>
        </Link>
        {/* Future routes could go here like /settings */}
      </div>

      <div className="p-4 border-t border-border/10">
        <div className="flex items-center gap-3 px-2 py-3 mb-2">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="User" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {user?.firstName?.[0] || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border bg-card shadow-sm fixed h-full z-10">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-border bg-card flex items-center justify-between sticky top-0 z-20">
           <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
            <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            FleetCommand
          </Link>
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
