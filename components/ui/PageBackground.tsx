interface PageBackgroundProps {
  variant?: 'default' | 'auth' | 'analyze';
}

export function PageBackground({ variant = 'default' }: PageBackgroundProps) {
  const gradient =
    variant === 'auth'
      ? 'from-primary/8 via-surface to-surface'
      : variant === 'analyze'
        ? 'from-surface-muted via-surface to-surface'
        : 'from-primary-muted/60 via-surface to-surface-muted/40';

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
      <div className="absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-float-slower" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(17 24 39 / 0.04) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
}
