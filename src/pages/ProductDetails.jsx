import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { fetchProducts } from "../redux/slices/productSlice";

import {
  syncUserCart,
} from "../redux/slices/cartSlice";

import {
  addToWhishlist,
  syncUserWishlist,
} from "../redux/slices/wishlistSlice";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // Fetch products if they are not available
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Find the selected product
  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  // Check whether the user is logged in
  const getUserId = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Please login to continue.");
      navigate("/login");
      return null;
    }

    return userId;
  };

  // Add product to cart
  const handleAddToCart = async () => {
    if (!product) return;

    const userId = getUserId();

    if (!userId) return;

    if (Number(product.stock) <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    const existingItem = cartItems.find(
      (item) => String(item.id) === String(product.id)
    );

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

      dispatch({
        type: "cart/setItems",
        payload: updatedCart,
      });

      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Cart error:", error);
      toast.error("Could not save cart. Please try again.");
    }
  };

  // Add product to wishlist
  const handleWishlist = async () => {
    if (!product) return;

    const userId = getUserId();

    if (!userId) return;

    const alreadyExists = wishlistItems.some(
      (item) => String(item.id) === String(product.id)
    );

    if (alreadyExists) {
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

      toast.success("Product added to wishlist!");
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Could not save wishlist. Please try again.");
    }
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div style={pageStyle}>
        <div style={messageCardStyle}>
          <h2>Loading product details...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div style={pageStyle}>
        <div style={messageCardStyle}>
          <h2>Unable to load products.</h2>

          <p>Please check whether your server is running.</p>

          <button
            onClick={() => dispatch(fetchProducts())}
            style={backButtonStyle}
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/products")}
            style={{ ...backButtonStyle, marginLeft: "10px" }}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div style={pageStyle}>
        <div style={messageCardStyle}>
          <h2>Product not found.</h2>

          <p>
            The product may not exist or its ID may be incorrect.
          </p>

          <button
            onClick={() => navigate("/products")}
            style={backButtonStyle}
          >
            Back to Products
          </button>

          <button
            onClick={() => dispatch(fetchProducts())}
            style={{ ...backButtonStyle, marginLeft: "10px" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const imageUrl =
    product.image ||
    product.imageUrl ||
    "https://placehold.co/500x500?text=Product";

  const isInWishlist = wishlistItems.some(
    (item) => String(item.id) === String(product.id)
  );

  return (
    <div style={pageStyle}>
      {/* Back button */}
      <button
        onClick={() => navigate("/products")}
        style={backButtonStyle}
      >
        ← Back to Products
      </button>

      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>

        {" / "}

        <Link to="/products" style={linkStyle}>
          Products
        </Link>

        {" / "}

        <span>{product.name}</span>
      </div>

      {/* Product details */}
      <div style={detailsStyle}>
        {/* Product image */}
        <div style={imageContainerStyle}>
          <img
            src={imageUrl}
            alt={product.name || "Product"}
            style={productImageStyle}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "https://placehold.co/500x500?text=Image+Not+Available";
            }}
          />
        </div>

        {/* Product information */}
        <div style={informationStyle}>
          <p style={categoryStyle}>
            {product.category || "Product"}
          </p>

          <h1 style={headingStyle}>
            {product.name}
          </h1>

          {product.brand && (
            <p style={brandStyle}>
              Brand: {product.brand}
            </p>
          )}

          <h2 style={priceStyle}>
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </h2>

          <p style={descriptionStyle}>
            {product.description ||
              "A beautiful craft item for your creative collection."}
          </p>

          {/* Stock information */}
          <p
            style={{
              color:
                Number(product.stock) > 0
                  ? "#287A42"
                  : "#C62828",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {Number(product.stock) > 0
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </p>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={Number(product.stock) <= 0}
            style={{
              ...buttonStyle,
              opacity: Number(product.stock) <= 0 ? 0.5 : 1,
              cursor:
                Number(product.stock) <= 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {Number(product.stock) <= 0
              ? "Out of Stock"
              : "Add To Cart"}
          </button>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            style={wishlistButtonStyle}
          >
            {isInWishlist
              ? "♥ Already in Wishlist"
              : "♡ Add To Wishlist"}
          </button>

          {/* Additional details */}
          <div style={extraDetailsStyle}>
            <p>
              <strong>Category:</strong>{" "}
              {product.category || "Not specified"}
            </p>

            <p>
              <strong>Product ID:</strong> {product.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// STYLES

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#E8D8C3",
  color: "#5C3A25",
  padding: "30px 20px",
  fontFamily: "Georgia, serif",
  boxSizing: "border-box",
};

const messageCardStyle = {
  maxWidth: "700px",
  margin: "50px auto",
  padding: "30px",
  backgroundColor: "#FFFDF8",
  border: "1px solid #E0CEB8",
  borderRadius: "12px",
  textAlign: "center",
  boxSizing: "border-box",
};

const detailsStyle = {
  maxWidth: "1100px",
  margin: "30px auto",
  padding: "30px",
  backgroundColor: "#FFFDF8",
  border: "1px solid #E0CEB8",
  borderRadius: "12px",
  display: "flex",
  gap: "40px",
  flexWrap: "wrap",
  alignItems: "flex-start",
  boxSizing: "border-box",
};

const imageContainerStyle = {
  flex: "1 1 350px",
  minWidth: "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: "10px",
  overflow: "hidden",
};

const productImageStyle = {
  width: "100%",
  maxWidth: "450px",
  height: "400px",
  objectFit: "contain",
  padding: "15px",
  boxSizing: "border-box",
};

const informationStyle = {
  flex: "1 1 350px",
  minWidth: "0",
  padding: "10px 0",
  overflowWrap: "anywhere",
};

const breadcrumbStyle = {
  maxWidth: "1100px",
  margin: "20px auto",
  fontSize: "14px",
  overflowWrap: "anywhere",
};

const linkStyle = {
  color: "#70452F",
  textDecoration: "none",
};

const categoryStyle = {
  color: "#80634D",
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const headingStyle = {
  fontSize: "clamp(25px, 4vw, 36px)",
  lineHeight: "1.3",
  margin: "12px 0",
  overflowWrap: "anywhere",
};

const brandStyle = {
  color: "#80634D",
  marginBottom: "15px",
};

const priceStyle = {
  color: "#70452F",
  fontSize: "28px",
  margin: "15px 0",
};

const descriptionStyle = {
  lineHeight: "1.8",
  color: "#665448",
  marginBottom: "20px",
};

const backButtonStyle = {
  padding: "10px 15px",
  backgroundColor: "#FFFDF8",
  color: "#70452F",
  border: "1px solid #70452F",
  borderRadius: "5px",
  cursor: "pointer",
};

const buttonStyle = {
  padding: "12px 20px",
  backgroundColor: "#70452F",
  color: "#FFF5E8",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "10px",
  marginBottom: "10px",
};

const wishlistButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#8B6B45",
};

const extraDetailsStyle = {
  marginTop: "25px",
  paddingTop: "15px",
  borderTop: "1px solid #E0CEB8",
  lineHeight: "1.8",
  fontSize: "14px",
};

export default ProductDetails;