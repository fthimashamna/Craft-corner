import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { fetchProducts } from "../redux/slices/productSlice";
import { syncUserCart } from "../redux/slices/cartSlice";

import {
  addToWhishlist,
  syncUserWishlist,
} from "../redux/slices/wishlistSlice";

function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const categoryFromURL = searchParams.get("category");

  const products = useSelector(
    (state) => state.products?.products || []
  );

  const loading = useSelector(
    (state) => state.products?.loading
  );

  const error = useSelector(
    (state) => state.products?.error
  );

  const cartItems = useSelector(
    (state) => state.cart?.items || []
  );

  const wishlistItems = useSelector(
    (state) =>
      state.whishlist?.items ||
      state.wishlist?.items ||
      []
  );

  const [selectCategory, setSelectCategory] = useState(
    categoryFromURL || "All Categories"
  );

  const [sortOption, setSortOption] = useState("default");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const categoryRef = useRef(null);
  const sortRef = useRef(null);

  const categories = [
    { value: "frames", label: "Frames" },
    { value: "Pens", label: "Pens" },
    { value: "Inks", label: "Inks" },
    { value: "Nib", label: "Nib" },
    { value: "Papper", label: "Papper" },
    { value: "kit", label: "Kit" },
  ];

  const allCategories = [
    { value: "All Categories", label: "All Categories" },
    ...categories,
  ];

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "name", label: "Name" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortOption)?.label ||
    "Default";

  // FETCH PRODUCTS
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // UPDATE CATEGORY WHEN URL CHANGES
  useEffect(() => {
    setSelectCategory(categoryFromURL || "All Categories");
  }, [categoryFromURL]);

  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setCategoryOpen(false);
      }

      if (
        sortRef.current &&
        !sortRef.current.contains(event.target)
      ) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // CHECK CART
  const isInCart = (productId) => {
    return cartItems.some(
      (item) => String(item.id) === String(productId)
    );
  };

  // CHECK WISHLIST
  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => String(item.id) === String(productId)
    );
  };

  // SEARCH AND CATEGORY FILTER
  const filteredProducts = products.filter((product) => {
    const searchText = searchQuery.trim().toLowerCase();

    const searchableText = [
      product.name,
      product.category,
      product.brand,
      product.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !searchText || searchableText.includes(searchText);

    const matchesCategory =
      selectCategory === "All Categories" ||
      String(product.category).toLowerCase() ===
        selectCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // SORT PRODUCTS
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low") {
      return Number(a.price || 0) - Number(b.price || 0);
    }

    if (sortOption === "price-high") {
      return Number(b.price || 0) - Number(a.price || 0);
    }

    if (sortOption === "name") {
      return String(a.name || "").localeCompare(
        String(b.name || "")
      );
    }

    return 0;
  });

  // CHANGE CATEGORY
  const handleCategoryChange = (category) => {
    setSelectCategory(category);
    setCategoryOpen(false);

    const params = new URLSearchParams();

    if (category !== "All Categories") {
      params.set("category", category);
    }

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    const queryString = params.toString();

    navigate(
      queryString ? `/products?${queryString}` : "/products"
    );
  };

  // CHANGE SORT OPTION
  const handleSortChange = (option) => {
    setSortOption(option);
    setSortOpen(false);
  };

  // ADD TO CART
  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Please login to add products to your cart.");
      navigate("/login");
      return;
    }

    if (Number(product.stock) <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    const existingItem = cartItems.find(
      (item) => String(item.id) === String(product.id)
    );


   if(
    existingItem && 
    Number(existingItem.quantity)>=Number(product.stock)
  ){
    toast.error("Mzximum available stock reached");
    return;
   }
    

    const updatedCart = existingItem
      ? cartItems.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                quantity: (Number(item.quantity) || 1) + 1,
              }
            : item
        )
      : [...cartItems, { ...product, quantity: 1 }];

    try {
      await dispatch(
        syncUserCart({
          userId,
          items: updatedCart,
        })
      ).unwrap();

      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Cart error:", error);
      toast.error("Could not save cart. Please try again.");
    }
  };

  // ADD TO WISHLIST
  const handleAddToWishlist = async (product) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Please login to add products to your wishlist.");
      navigate("/login");
      return;
    }

    if (isInWishlist(product.id)) {
      toast("This product is already in your wishlist.");
      return;
    }

    const updatedWishlist = [...wishlistItems, product];

    try {
      await dispatch(
        syncUserWishlist({
          userId,
          items: updatedWishlist,
        })
      ).unwrap();

      dispatch(addToWhishlist(product));

      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Could not save wishlist.");
    }
  };

  // CLEAR FILTERS
  const handleClearFilters = () => {
    setSelectCategory("All Categories");
    setSortOption("default");
    setCategoryOpen(false);
    setSortOpen(false);
    navigate("/products");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAF7F2] px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* PAGE HEADING */}
      <div className="mx-auto mb-7 max-w-7xl text-center sm:mb-8">
        <h1 className="text-2xl font-bold text-[#493326] sm:text-3xl md:text-4xl">
          Our Products
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#80634D] sm:text-base">
          Discover something special for your calligraphy needs.
        </p>
      </div>

      {/* CATEGORY AND SORT SECTION */}
      <div className="mx-auto mb-7 flex max-w-7xl flex-col gap-5 rounded-2xl border border-[#D4B99B] bg-gradient-to-r from-[#F1E3D1] via-[#E8D8C3] to-[#DCC1A3] p-4 shadow-md sm:mb-8 sm:p-5 md:flex-row md:items-center md:justify-between">
        {/* CUSTOM CATEGORY DROPDOWN */}
        <div
          ref={categoryRef}
          className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
        >
          <label className="font-semibold text-[#5C3A25]">
            Category:
          </label>

          <div className="relative w-full min-w-0 sm:w-[220px]">
            {/* CATEGORY BUTTON */}
            <button
              type="button"
              onClick={() => {
                setCategoryOpen((previous) => !previous);
                setSortOpen(false);
              }}
              aria-haspopup="listbox"
              aria-expanded={categoryOpen}
              className={`flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border-2 px-3 py-3 text-sm font-medium shadow-sm transition-all duration-300 sm:px-4 sm:text-base ${
                categoryOpen
                  ? "border-[#5C3A25] bg-[#5C3A25] text-[#FFF8EF] shadow-lg"
                  : "border-[#B89572] bg-[#FFF8EF] text-[#5C3A25] hover:border-[#70452F] hover:bg-[#70452F] hover:text-white"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-lg">☷</span>

                <span className="truncate">
                  {
                    allCategories.find(
                      (category) =>
                        category.value === selectCategory
                    )?.label || "All Categories"
                  }
                </span>
              </span>

              <span
                className={`shrink-0 text-sm transition-transform duration-300 ${
                  categoryOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* CATEGORY OPTIONS */}
            {categoryOpen && (
              <div
                role="listbox"
                aria-label="Product categories"
                className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#B89572] bg-[#FFF8EF] p-1.5 shadow-2xl"
              >
                {allCategories.map((category) => {
                  const selected =
                    selectCategory === category.value;

                  return (
                    <button
                      key={category.value}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() =>
                        handleCategoryChange(category.value)
                      }
                      className={`mb-1 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-3 text-left text-sm transition-all duration-200 last:mb-0 sm:px-4 ${
                        selected
                          ? "bg-[#70452F] font-semibold text-[#FFF8EF] shadow-sm"
                          : "bg-transparent text-[#5C3A25] hover:translate-x-1 hover:bg-[#E8D8C3] hover:text-[#493326]"
                      }`}
                    >
                      <span>{category.label}</span>

                      {selected && (
                        <span className="font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* CUSTOM SORT DROPDOWN */}
        <div
          ref={sortRef}
          className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
        >
          <label className="font-semibold text-[#5C3A25]">
            Sort by:
          </label>

          <div className="relative w-full min-w-0 sm:w-[220px]">
            {/* SORT BUTTON */}
            <button
              type="button"
              onClick={() => {
                setSortOpen((previous) => !previous);
                setCategoryOpen(false);
              }}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              className={`flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border-2 px-3 py-3 text-sm font-medium shadow-sm transition-all duration-300 sm:px-4 sm:text-base ${
                sortOpen
                  ? "border-[#5C3A25] bg-[#5C3A25] text-[#FFF8EF] shadow-lg"
                  : "border-[#B89572] bg-[#FFF8EF] text-[#5C3A25] hover:border-[#70452F] hover:bg-[#70452F] hover:text-white"
              }`}
            >
              <span className="truncate">{selectedSortLabel}</span>

              <span
                className={`shrink-0 text-sm transition-transform duration-300 ${
                  sortOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* SORT OPTIONS */}
            {sortOpen && (
              <div
                role="listbox"
                aria-label="Sort products"
                className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#B89572] bg-[#FFF8EF] p-1.5 shadow-2xl"
              >
                {sortOptions.map((option) => {
                  const selected = sortOption === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() =>
                        handleSortChange(option.value)
                      }
                      className={`mb-1 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-3 text-left text-sm transition-all duration-200 last:mb-0 sm:px-4 ${
                        selected
                          ? "bg-[#70452F] font-semibold text-[#FFF8EF] shadow-sm"
                          : "bg-transparent text-[#5C3A25] hover:translate-x-1 hover:bg-[#E8D8C3] hover:text-[#493326]"
                      }`}
                    >
                      <span>{option.label}</span>

                      {selected && (
                        <span className="font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS */}
      {searchQuery && (
        <div className="mx-auto mb-6 max-w-7xl">
          <p className="break-words text-sm text-[#80634D] sm:text-base">
            Search results for:{" "}
            <span className="font-semibold text-[#493326]">
              {searchQuery}
            </span>
          </p>

          <button
            onClick={handleClearFilters}
            className="mt-2 text-sm font-medium text-[#70452F] underline hover:text-[#493326]"
          >
            Clear search and filters
          </button>
        </div>
      )}

      {/* PRODUCT COUNT */}
      {!loading && !error && (
        <div className="mx-auto mb-5 max-w-7xl">
          <p className="text-sm text-[#80634D]">
            Showing {sortedProducts.length} of {products.length} products
          </p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="py-16 text-center">
          <p className="text-base text-[#493326] sm:text-lg">
            Loading products...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="py-16 text-center">
          <p className="text-[#70452F]">
            Unable to load products. Please try again.
          </p>

          <button
            onClick={() => dispatch(fetchProducts())}
            className="mt-4 rounded-lg bg-[#70452F] px-5 py-2 text-white transition hover:bg-[#493326]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* PRODUCT GRID */}
      {!loading && !error && (
        <>
          {sortedProducts.length === 0 ? (
            <div className="mx-auto max-w-7xl rounded-xl border border-[#E0CEB8] bg-[#FFF8EF] px-4 py-12 text-center shadow-sm sm:py-16">
              <h2 className="text-xl font-semibold text-[#493326] sm:text-2xl">
                No Products Found
              </h2>

              <p className="mt-2 text-sm text-[#80634D] sm:text-base">
                Try another search or category.
              </p>

              <button
                onClick={handleClearFilters}
                className="mt-5 rounded-lg bg-[#70452F] px-6 py-3 text-white transition hover:bg-[#493326]"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 min-[420px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-[#E8D8C3] bg-[#FFFDF8] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9AD91] hover:shadow-xl"
                >
                  {/* PRODUCT IMAGE */}
                  <Link to={`/productdetails/${product.id}`}>
                    <div className="relative h-56 overflow-hidden bg-[#F3E8DA] min-[420px]:h-48 sm:h-56 md:h-60 lg:h-64">
                      <img
                        src={
                          product.image ||
                          product.imageUrl ||
                          "https://placehold.co/400x400?text=No+Image"
                        }
                        alt={product.name || "Product"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://placehold.co/400x400?text=Image+Not+Found";
                        }}
                      />

                      {Number(product.stock) <= 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#70452F] px-2 py-1 text-xs font-semibold text-white shadow sm:left-3 sm:top-3 sm:px-3">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* PRODUCT INFORMATION */}
                  <div className="p-3 sm:p-4">
                    <p className="mb-1 break-words text-xs uppercase tracking-wide text-[#A08062]">
                      {product.category || product.brand || "Product"}
                    </p>

                    <Link to={`/productdetails/${product.id}`}>
                      <h2 className="min-h-12 break-words text-base font-semibold text-[#493326] transition hover:text-[#8B5E3C] sm:text-lg">
                        {product.name}
                      </h2>
                    </Link>

                    <p className="mt-2 text-lg font-bold text-[#70452F] sm:text-xl">
                      ₹
                      {Number(product.price || 0).toLocaleString("en-IN")}
                    </p>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 break-words text-sm text-[#80634D]">
                        {product.description}
                      </p>
                    )}

                    {/* CART AND WISHLIST BUTTONS */}
                    <div className="mt-4 flex items-stretch gap-2">
                      {/* ADD TO CART */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={Number(product.stock) <= 0}
                        className="min-h-11 min-w-0 flex-1 rounded-xl bg-[#70452F] px-2 py-2.5 text-xs font-semibold text-white transition duration-300 hover:bg-[#493326] disabled:cursor-not-allowed disabled:bg-[#B9A18A] sm:px-3 sm:text-sm"
                      >
                        {Number(product.stock) <= 0
                          ? "Out of Stock"
                          : isInCart(product.id)
                          ? "Add Again"
                          : "Add to Cart"}
                      </button>

                      {/* WISHLIST HEART */}
                      <button
                        onClick={() => handleAddToWishlist(product)}
                        aria-label={
                          isInWishlist(product.id)
                            ? "Already in wishlist"
                            : "Add to wishlist"
                        }
                        title={
                          isInWishlist(product.id)
                            ? "Already in wishlist"
                            : "Add to wishlist"
                        }
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-2xl transition-all duration-300 ${
                          isInWishlist(product.id)
                            ? "scale-105 border-[#70452F] bg-[#E8D8C3] text-[#70452F]"
                            : "border-[#C9AD91] bg-[#FFF8EF] text-[#A89078] hover:scale-110 hover:border-[#70452F] hover:bg-[#E8D8C3] hover:text-[#70452F]"
                        }`}
                      >
                        {isInWishlist(product.id) ? "♥" : "♡"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products;