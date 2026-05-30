export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
      >
        <source
          src="https://videos.pexels.com/video-files/4252754/4252754-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-dark/45" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-32 text-center sm:px-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-gold sm:text-sm">
          Fresh • Homestyle • Delivered
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
          The Butter Bowl
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg font-light text-cream sm:text-xl">
          Where every meal feels like home
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#menu"
            className="w-full max-w-xs rounded-full bg-primary px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto"
          >
            Explore Menu
          </a>
          <a
            href="#track"
            className="w-full max-w-xs rounded-full border-2 border-gold px-8 py-3.5 text-center text-sm font-semibold text-gold transition hover:-translate-y-0.5 hover:bg-gold hover:text-dark sm:w-auto"
          >
            Track Order
          </a>
        </div>
      </div>
    </section>
  );
}
