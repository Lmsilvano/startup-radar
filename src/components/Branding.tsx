'use client';

export function Branding() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={scrollToTop}
            role="button"
            aria-label="Voltar para o topo"
        >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                SC
            </div>
            <h1 className="text-lg font-bold tracking-tight">
                Startup <span className="text-primary italic">Radar</span>
            </h1>
        </div>
    );
}
