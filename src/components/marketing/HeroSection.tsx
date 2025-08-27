const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden lg:py-32 ">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-blue-50/60 to-purple-50/80 dark:from-emerald-950/20 dark:via-blue-950/15 dark:to-purple-950/20"></div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full -top-40 -right-40 size-80 bg-gradient-to-br from-emerald-400/30 to-blue-500/30 blur-3xl animate-pulse-slow"></div>
        <div className="absolute delay-1000 rounded-full size-80 bg-gradient-to-tr from-blue-400/30 to-purple-500/30 -bottom-40 -left-40 blur-3xl animate-pulse-slow "></div>
        <div className="absolute delay-500 transform -translate-x-1/2 -translate-y-1/2 rounded-full size-96 bg-gradient-to-r from-emerald-300/20 via-blue-300/20 to-purple-300/20 top-1/2 left-1/2 blur-3xl animate-pulse-slow "></div>
      </div>

      <div className="container mx-auto px-4 md:px-20">
        <h1 className="relative z-40 text-center text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight ">
          Invest in{' '}
          <span className="block bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tomorrow&apos;s Leaders
          </span>
          <span className="block">Today</span>
        </h1>
      </div>
    </section>
  );
};

export default Hero;
