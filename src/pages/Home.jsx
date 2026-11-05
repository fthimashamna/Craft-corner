import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { fetchProducts } from "../redux/slices/productSlice";

function Home() {
  const dispatch = useDispatch();
  const location = useLocation();

  const products = useSelector(
    (state) => state.products.products
  );

  const loading = useSelector(
    (state) => state.products.loading
  );

  const error = useSelector(
    (state) => state.products.error
  );

  const username = location.state?.username;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Get unique categories
  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // Featured products
  const featuredProducts = products.slice(0, 4);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#F8F1E7] text-[#4B3328]">

      {/* HERO SECTION */}
      <section
        className="relative flex min-h-[calc(100svh-80px)] items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        style={{
          backgroundImage:
            "url('/images/calligraphy%20sets/Warm%20Handmade%20Stationery%20Studio.png')",
        }}
      >
        {/* Brown Overlay */}
        <div className="absolute inset-0 bg-[#3B281F]/45" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-2 py-10 text-center sm:px-4 sm:py-16 md:py-20">

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#F1D6B8] sm:mb-5 sm:text-sm sm:tracking-[0.35em] md:text-base">
            Art • Creativity • Elegance
          </p>

          <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to
            <span className="mt-2 block text-[#E6C5A5]">
              Craftiva
            </span>
          </h1>

          <div className="mx-auto mb-5 h-1 w-16 rounded-full bg-[#C49A76] sm:mb-6 sm:w-20" />

          <p className="mx-auto mb-5 max-w-2xl text-sm leading-7 text-[#FFF7ED] sm:text-base sm:leading-8 md:text-lg">
            Discover the beauty of handmade creations,
            elegant calligraphy frames, and artistic stationery
            made to bring warmth and creativity into your life.
          </p>

          {username && (
            <p className="mb-6 break-words text-base font-medium text-[#F1D6B8] sm:text-lg">
              Welcome back, {username}!
            </p>
          )}

          <Link
            to="/products"
            className="inline-flex max-w-full items-center justify-center rounded-full border border-[#E6C5A5] bg-[#6B4632] px-5 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#8B6045] hover:shadow-xl sm:px-9 sm:py-4 sm:text-base"
          >
            Explore Our Collection
            <span className="ml-2 sm:ml-3">→</span>
          </Link>

        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="bg-[#EFE2D1] px-4 py-12 sm:px-8 sm:py-16 lg:py-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-8 text-center sm:mb-12">

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#98704E] sm:text-sm sm:tracking-[0.3em]">
              Find Your Favourite
            </p>

            <h2 className="text-2xl font-bold text-[#4B3328] sm:text-3xl md:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-4 text-sm text-[#78604D] sm:text-base">
              Explore our beautiful collections.
            </p>

          </div>

          {loading ? (
            <p className="py-10 text-center text-[#78604D]">
              Loading categories...
            </p>
          ) : error ? (
            <p className="py-10 text-center text-red-700">
              Unable to load categories.
            </p>
          ) : categories.length === 0 ? (
            <p className="py-10 text-center text-[#78604D]">
              No categories available.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">

              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="group rounded-2xl border border-[#D7BFA5] bg-[#FFF9F1] p-6 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#A77B56] hover:bg-[#E4CFB8] hover:shadow-lg sm:p-8"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#E9D8C4] text-2xl text-[#6B4632] transition group-hover:bg-[#6B4632] group-hover:text-white">
                    ✦
                  </div>

                  <h3 className="break-words text-lg font-semibold capitalize text-[#5C3D2E] sm:text-xl">
                    {category.replace(/[-_]/g, " ")}
                  </h3>

                  <p className="mt-3 text-sm text-[#8B7059]">
                    Explore Collection →
                  </p>

                </Link>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="bg-[#F8F1E7] px-4 py-12 sm:px-8 sm:py-16 lg:py-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex flex-col items-center justify-between gap-5 sm:mb-12 sm:flex-row">

            <div className="text-center sm:text-left">

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#98704E] sm:text-sm sm:tracking-[0.3em]">
                Handpicked for You
              </p>

              <h2 className="text-2xl font-bold text-[#4B3328] sm:text-3xl md:text-4xl">
                Featured Products
              </h2>

            </div>

            <Link
              to="/products"
              className="rounded-full border border-[#8B6045] px-5 py-3 text-sm font-semibold text-[#6B4632] transition duration-300 hover:bg-[#6B4632] hover:text-white sm:px-7 sm:text-base"
            >
              View All Products →
            </Link>

          </div>

          {loading && (
            <p className="py-12 text-center text-[#78604D]">
              Loading products...
            </p>
          )}

          {!loading && error && (
            <div className="rounded-2xl bg-[#F0DDD4] p-6 text-center sm:p-8">
              <p className="text-red-800">
                Failed to load products.
              </p>

              <button
                onClick={() => dispatch(fetchProducts())}
                className="mt-4 rounded-full bg-[#5C3D2E] px-7 py-3 font-semibold text-white transition hover:bg-[#80583F]"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="py-12 text-center text-[#78604D]">
              No products available at the moment.
            </p>
          )}

          {!loading && !error && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4">

              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-[#E3CFB8] bg-[#FFFDF9] shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  {/* Product Image */}
                  <div className="h-56 overflow-hidden bg-[#E9D8C4] sm:h-64">

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#8B7059]">
                        No Image Available
                      </div>
                    )}

                  </div>

                  {/* Product Details */}
                  <div className="p-4 sm:p-5">

                    {product.category && (
                      <p className="mb-2 break-words text-xs font-semibold uppercase tracking-widest text-[#A17B5B]">
                        {product.category}
                      </p>
                    )}

                    <h3 className="mb-4 line-clamp-2 break-words text-base font-semibold text-[#5C3D2E] transition group-hover:text-[#A17B5B] sm:text-lg">
                      {product.name}
                    </h3>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E9D8C4] pt-4">

                      <p className="text-base font-bold text-[#5C3D2E] sm:text-lg">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>

                      <span className="text-xs font-medium text-[#98704E] sm:text-sm">
                        View Details →
                      </span>

                    </div>

                  </div>

                </Link>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* ABOUT / CALL TO ACTION SECTION */}
      <section className="px-4 py-12 sm:px-8 sm:py-16 lg:py-20">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#6B4632] px-5 py-10 text-center shadow-lg sm:px-12 sm:py-16">

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#E6C5A5] sm:text-sm sm:tracking-[0.3em]">
            Make Every Moment Special
          </p>

          <h2 className="mb-6 text-2xl font-bold text-[#FFF8EF] sm:text-4xl md:text-5xl">
            Find Something Beautiful
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-[#F1E0CE] sm:text-base sm:leading-8">
            Add a touch of creativity and warmth to your everyday
            life with the unique collection at Craftiva.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex max-w-full items-center justify-center rounded-full bg-[#F1E0CE] px-6 py-3.5 text-sm font-semibold text-[#5C3D2E] transition duration-300 hover:bg-white sm:px-8 sm:text-base"
          >
            Shop Our Collection →
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#3B281F] px-4 py-8 text-center text-[#FFF8EF] sm:px-8 sm:py-10">

        <h2 className="text-2xl font-bold tracking-wide sm:text-3xl">
          Craftiva
        </h2>

        <p className="mt-3 text-xs text-[#E6C5A5] sm:text-sm">
          Creativity, elegance, and beautiful little things.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-4 text-sm sm:gap-x-7">

          <Link
            to="/"
            className="transition hover:text-[#D5AD88]"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="transition hover:text-[#D5AD88]"
          >
            Products
          </Link>

          <Link
            to="/about"
            className="transition hover:text-[#D5AD88]"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="transition hover:text-[#D5AD88]"
          >
            Contact
          </Link>

        </div>

        <div className="mx-auto my-7 h-px max-w-md bg-[#8B7059]" />

        <p className="text-xs text-[#D5C0AC]">
          © {new Date().getFullYear()} Craftiva. All rights reserved.
        </p>

      </footer>

    </main>
  );
}

export default Home;