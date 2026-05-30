const features = [
  {
    icon: "🌿",
    title: "Fresh Ingredients",
    description: "Locally sourced vegetables, dairy, and spices delivered to our kitchen every morning.",
  },
  {
    icon: "🍲",
    title: "Homestyle Cooking",
    description: "Slow-cooked curries and hand-rolled breads made with the same care as a family kitchen.",
  },
  {
    icon: "🚀",
    title: "Fast Delivery",
    description: "Your food leaves our kitchen hot and reaches your door within 35–45 minutes in the city.",
  },
];

export default function Features() {
  return (
    <section id="about" className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Why choose us
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-dark sm:text-4xl">
            Royal Olive Luxury, On Your Plate
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-cream bg-cream/40 p-8 text-center shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-cardHover"
            >
              <span className="text-4xl" role="img" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-dark">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-dark/70">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
