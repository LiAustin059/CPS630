import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-white/[0.06] bg-[#050506]/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-[-0.03em] text-foreground flex items-center gap-2.5 transition-all duration-300 hover:opacity-80">
          <div className="w-7 h-7 rounded-[8px] bg-primary flex items-center justify-center text-white shadow-[0_0_20px_rgba(94,106,210,0.4),0_0_0_1px_rgba(255,255,255,0.1)] text-sm">
            E
          </div>
          <span className="mt-0.5">EventHub</span>
        </Link>
        
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors hidden md:block">Explore</Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-white/10 hover:border-white/20 transition-colors p-0 ring-offset-background outline-none hover:bg-white/[0.05]">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt={user.name || "User"} />
                    <AvatarFallback className="bg-transparent text-primary font-medium text-xs">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#0a0a0c] border border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_80px_rgba(94,106,210,0.1)] rounded-xl" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1.5 leading-none py-1">
                    {user.name && <p className="font-semibold text-sm text-foreground">{user.name}</p>}
                    <p className="w-[180px] truncate text-xs text-muted-foreground font-mono">
                      {user.email || "user@example.com"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild className="focus:bg-white/[0.06] focus:text-foreground cursor-pointer rounded-lg m-1 transition-colors">
                  <Link to="/profile" className="w-full flex items-center text-muted-foreground hover:text-foreground">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg m-1 transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                Sign In
              </Link>
              <Link to="/register" className="h-9 px-4 rounded-lg bg-primary text-white font-medium flex items-center justify-center transition-all hover:bg-[#6872D9] active:scale-[0.98] shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
