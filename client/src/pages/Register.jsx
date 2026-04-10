import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success("Account created! Welcome to EventHub.");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-16 animate-in fade-in duration-500">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden group border-transparent">
        <div 
          className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(94,106,210,0.5), transparent)'
          }}
        />
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-semibold tracking-tight text-gradient mb-2">Create Account</h2>
          <p className="text-[#8A8F98] text-sm">Join the community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <Label className="text-xs font-mono tracking-widest text-[#8A8F98]">USERNAME</Label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="bg-[#0F0F12] border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-1 focus-visible:border-primary transition-all rounded-lg"
              placeholder="e.g. johndoe123"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-mono tracking-widest text-[#8A8F98]">EMAIL</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-[#0F0F12] border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-1 focus-visible:border-primary transition-all rounded-lg"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
             <Label className="text-xs font-mono tracking-widest text-[#8A8F98]">PASSWORD</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="bg-[#0F0F12] border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-1 focus-visible:border-primary transition-all rounded-lg"
              placeholder="Create a strong password"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full accent-button text-sm h-11 tracking-wide font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] mt-6"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-[#8A8F98] relative z-10">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:text-[#6872D9] transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;