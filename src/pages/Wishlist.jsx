import { useSelector, useDispatch } from "react-redux";
import {
  removeWhishlist,
  syncUserWishlist,
} from "../redux/slices/wishlistSlice";
import {
  addTocart,
  syncUserCart,
} from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const whishlistItems = useSelector((state) => state.whishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const handleRemove = async (index) => {
    if (!userId) {
      toast.error("Please login again.");
      navigate("/login");
      return;
    }

    const updatedWishlist = whishlistItems.filter(
      (_, itemIndex) => itemIndex !== index
    );

    dispatch(removeWhishlist(whishlistItems[index].id));

    try {
      await dispatch(
        syncUserWishlist({
          userId,
          items: updatedWishlist,
        })
      ).unwrap();

      toast.success("Product removed from wishlist");
    } catch (error) {
      console.error("Wishlist update error:", error);
      toast.error("Could not update wishlist in database.");
    }
  };

  const handleAddToCart = async (product) => {
    if (!userId) {
      toast.error("Please login to add products to cart.");
      navigate("/login");
      return;
    }

    const alreadyInCart = cartItems.some(
      (item) => String(item.id) === String(product.id)
    );

    if (alreadyInCart) {
      toast.error("Product is already in your cart.");
      return;
    }

    const updatedCart = [...cartItems, { ...product, quantity: 1 }];

    try {
      await dispatch(
        syncUserCart({
          userId,
          items: updatedCart,
        })
      ).unwrap();

      dispatch(addTocart(product));

      toast.success("Product added to cart!");

    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Could not add product to cart.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F5EBDD",
        minHeight: "100vh",
        padding: "30px 20px",
        color: "#5C3A25",
        boxSizing: "border-box",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <style>
        {`
          .wishlist-title {
            font-size: 36px;
            font-weight: bold;
          }

          .wishlist-grid {
            display: grid;
            grid-template-columns: repeat(
              auto-fit,
              minmax(min(100%, 200px), 250px)
            );
            justify-content: center;
            gap: 20px;
            width: 100%;
            max-width: 1250px;
            margin: 0 auto;
          }

          .wishlist-card {
            background-color: #FFFFFF;
            padding: 18px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 3px 10px rgba(92, 58, 37, 0.10);
            box-sizing: border-box;
            min-width: 0;
          }

          .wishlist-image {
            width: 100%;
            height: 170px;
            object-fit: contain;
            border-radius: 8px;
          }

          .wishlist-product-name {
            font-size: 18px;
            margin: 15px 0 8px;
            overflow-wrap: anywhere;
          }

          .wishlist-button {
            color: #FFFFFF;
            border: none;
            padding: 11px 12px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            box-sizing: border-box;
            transition: background-color 0.2s ease;
          }

          .wishlist-add-button {
            background-color: #8B6B45;
            margin-bottom: 10px;
          }

          .wishlist-add-button:hover {
            background-color: #6F5135;
          }

          .wishlist-remove-button {
            background-color: #70452F;
          }

          .wishlist-remove-button:hover {
            background-color: #5C3A25;
          }

          @media (max-width: 768px) {
            .wishlist-title {
              font-size: 30px;
            }

            .wishlist-grid {
              grid-template-columns: repeat(
                auto-fit,
                minmax(min(100%, 220px), 1fr)
              );
              gap: 16px;
            }

            .wishlist-card {
              padding: 16px;
            }
          }

          @media (max-width: 480px) {
            .wishlist-title {
              font-size: 26px;
              letter-spacing: 0.5px !important;
            }

            .wishlist-subtitle {
              font-size: 14px;
              margin-bottom: 25px !important;
            }

            .wishlist-grid {
              grid-template-columns: minmax(0, 1fr);
              gap: 16px;
            }

            .wishlist-card {
              padding: 18px 14px;
            }

            .wishlist-image {
              height: 160px;
            }

            .wishlist-product-name {
              font-size: 17px;
            }

            .wishlist-button {
              padding: 12px 10px;
            }
          }
        `}
      </style>

      <h1
        className="wishlist-title"
        style={{
          textAlign: "center",
          marginBottom: "10px",
          letterSpacing: "1px",
          color: "#5C3A25",
          overflowWrap: "break-word",
        }}
      >
        My Wishlist
      </h1>

      <p
        className="wishlist-subtitle"
        style={{
          textAlign: "center",
          color: "#8B6B55",
          marginBottom: "35px",
        }}
      >
        Your favourite crafts, all in one place.
      </p>

      {whishlistItems.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            marginTop: "40px",
            color: "#8B6B55",
          }}
        >
          Your wishlist is empty
        </p>
      ) : (
        <div className="wishlist-grid">
          {whishlistItems.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="wishlist-card"
            >
              <img
                src={product.image}
                alt={product.name}
                className="wishlist-image"
              />

              <h3 className="wishlist-product-name">
                {product.name}
              </h3>

              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Price: ₹{product.price}
              </p>

              <button
                onClick={() => handleAddToCart(product)}
                className="wishlist-button wishlist-add-button"
              >
                Add to Cart
              </button>

              <button
                onClick={() => handleRemove(index)}
                className="wishlist-button wishlist-remove-button"
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;