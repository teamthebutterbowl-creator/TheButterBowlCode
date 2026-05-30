const steps = [
  {
    step: "01",
    title: "Choose your meal",
    description: "Browse our homestyle menu and pick your favourites — veg, non-veg, and combos.",
  },
  {
    step: "02",
    title: "Place your order",
    description: "Checkout as a guest or sign in. Pay online with Razorpay or choose Cash on Delivery.",
  },
  {
    step: "03",
    title: "Get it delivered",
    description: "Track your order with your order number and enjoy hot food at your doorstep.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-semibold text-dark sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-dark/70">
            Three simple steps from our kitchen to your table.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative text-center">
              {index < steps.length - 1 && (
                <div
                  className="absolute left-[calc(50%+2rem)] top-8 hidden h-0.5 w-[calc(100%-4rem)] bg-gold/40 md:block"
                  aria-hidden="true"
                />
              )}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-white shadow-lg">
                {item.step}
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-dark">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark/70">{item.description}</p>
            </div>
          ))}
        </div>

        <div id="track" className="mt-14 rounded-2xl bg-cream px-6 py-8 text-center sm:px-10">
          <h3 className="font-display text-2xl font-semibold text-dark">Track your order</h3>
          <p className="mt-2 text-sm text-dark/70">
            Enter your order number (e.g. ORD-1748513847362-X4KP) on our track page after checkout.
          </p>
          <a
            href="#contact"
            className="mt-5 inline-block rounded-full border-2 border-gold px-6 py-2.5 text-sm font-semibold text-dark transition hover:bg-gold"
          >
            Need help? Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
