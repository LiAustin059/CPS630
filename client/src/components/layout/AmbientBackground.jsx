export function AmbientBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-x-hidden selection:bg-primary/30 selection:text-white dark text-foreground">
      {/* Base radial gradient - Layer 1 */}
      <div className="pointer-events-none fixed inset-0 z-[-4] bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />

      {/* Grid overlay - Layer 2 */}
      <div className="pointer-events-none fixed inset-0 z-[-3] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Floating Blobs - Layer 3 */}
      {/* Primary Blob */}
      <div className="pointer-events-none fixed left-1/2 top-0 z-[-2] h-[900px] w-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[#5E6AD2]/20 blur-[150px] mix-blend-screen animate-float" />
      
      {/* Secondary Left Blob */}
      <div className="pointer-events-none fixed -left-[10%] top-[20%] z-[-2] h-[800px] w-[600px] rounded-[100%] bg-[#D25E96]/10 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
      
      {/* Tertiary Right Blob */}
      <div className="pointer-events-none fixed -right-[10%] top-[40%] z-[-2] h-[700px] w-[500px] rounded-[100%] bg-[#4F46E5]/10 blur-[100px] mix-blend-screen animate-float" style={{ animationDelay: '4s', animationDuration: '12s' }} />

      {/* Bottom Accent */}
      <div className="pointer-events-none fixed bottom-[-20%] left-1/2 z-[-2] h-[600px] w-[1000px] -translate-x-1/2 rounded-[100%] bg-[#5E6AD2]/10 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: '6s', animationDuration: '9s' }} />

      {/* Noise Texture - Layer 4 */}
      <div 
        className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.015] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-0 min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default AmbientBackground;
