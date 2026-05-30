import { bestsellers } from "../data/dishes";

export default function PopularDishes({ onAddToCart }) {
  return (
    <section id="menu" className="bg-cream px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            From our kitchen
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-dark sm:text-4xl">
            Our Bestsellers
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-dark/70">
            Customer favourites — rich, comforting, and made fresh to order.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((dish) => (
            <article
              key={dish.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-cardHover"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  {dish.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-dark">{dish.name}</h3>
                <p className="mt-1 text-lg font-bold text-primary">₹{dish.price}</p>
                <button
                  type="button"
                  onClick={() => onAddToCart(dish)}
                  className="mt-4 w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-dark transition hover:bg-gold/90 hover:shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
