import { useSelector, useDispatch } from "react-redux";
import {
  removeCart,
  increaseQuantity,
  decreaseQuantity,
  syncUserCart,
} from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const totalPrice = cartItems.reduce(
    (total, product) =>
      total + Number(product.price) * Number(product.quantity),
    0
  );

  const saveCart = async (items) => {
    if (!userId) {
      toast.error("Please login to manage your cart.");
      navigate("/login");
      return;
    }

    try {
      await dispatch(
        syncUserCart({
          userId,
          items,
        })
      ).unwrap();
    } catch (error) {
      console.error("Cart save error:", error);
      toast.error("Could not save your cart. Please try again.");
    }
  };

  // INCREASE QUANTITY
  const handleIncrease = (index) => {
    const product = cartItems[index];

    if (!product) return;

    const currentQuantity = Number(product.quantity) || 1;

    const updatedItems = cartItems.map((item, i) =>
      i === index
        ? { ...item, quantity: currentQuantity + 1 }
        : item
    );

    dispatch(increaseQuantity(index));
    saveCart(updatedItems);
  };

  // DECREASE QUANTITY
  const handleDecrease = (index) => {
    const product = cartItems[index];

    if (!product || Number(product.quantity) <= 1) return;

    const currentQuantity = Number(product.quantity);

    const updatedItems = cartItems.map((item, i) =>
      i === index
        ? { ...item, quantity: currentQuantity - 1 }
        : item
    );

    dispatch(decreaseQuantity(index));
    saveCart(updatedItems);
  };

  // REMOVE PRODUCT
  const handleRemove = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);

    dispatch(removeCart(index));
    saveCart(updatedItems);
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
          .cart-page-title {
            font-size: 36px;
          }

          .cart-items-grid {
            display: grid;
            grid-template-columns: repeat(
              auto-fit,
              minmax(min(100%, 250px), 1fr)
            );
            gap: 20px;
            max-width: 1250px;
            margin: 0 auto;
            align-items: stretch;
          }

          .cart-product-card {
            background-color: #FFFFFF;
            padding: 20px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            box-sizing: border-box;
            min-height: 420px;
            min-width: 0;
          }

          .cart-product-image {
            width: 100%;
            max-width: 160px;
            height: 190px;
            object-fit: contain;
            margin-bottom: 8px;
          }

          .cart-product-name {
            font-size: 18px;
            overflow-wrap: anywhere;
          }

          .cart-quantity-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-top: 15px;
          }

          .cart-total-box {
            max-width: 600px;
            width: 100%;
            box-sizing: border-box;
            margin: 40px auto;
            padding: 30px;
            background-color: #FFF9F1;
            border: 1px solid #D8BFA3;
            border-radius: 18px;
            box-shadow: 0 8px 24px rgba(92,58,37,0.12);
            text-align: center;
          }

          .cart-total-title {
            font-size: 28px;
          }

          .cart-buy-button {
            max-width: 100%;
            box-sizing: border-box;
          }

          @media (max-width: 768px) {
            .cart-page-title {
              font-size: 30px;
            }

            .cart-items-grid {
              grid-template-columns: repeat(
                auto-fit,
                minmax(min(100%, 220px), 1fr)
              );
              gap: 16px;
            }

            .cart-product-card {
              padding: 16px;
            }

            .cart-total-box {
              margin: 30px auto;
              padding: 24px 18px;
            }

            .cart-total-title {
              font-size: 24px;
            }
          }

          @media (max-width: 480px) {
            .cart-page-title {
              font-size: 26px;
              letter-spacing: 0.5px;
            }

            .cart-page-subtitle {
              font-size: 14px;
              margin-bottom: 25px !important;
            }

            .cart-items-grid {
              grid-template-columns: minmax(0, 1fr);
              gap: 16px;
            }

            .cart-product-card {
              min-height: auto;
              padding: 18px 14px;
            }

            .cart-product-image {
              height: 170px;
            }

            .cart-product-name {
              font-size: 17px;
            }

            .cart-quantity-controls {
              gap: 18px;
            }

            .cart-total-box {
              margin: 25px auto;
              padding: 22px 14px;
            }

            .cart-total-title {
              font-size: 22px;
              overflow-wrap: anywhere;
            }

            .cart-buy-button {
              width: 100%;
              padding: 13px 20px !important;
            }
          }
        `}
      </style>

      <h1
        className="cart-page-title"
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#5C3A25",
          marginBottom: "10px",
          letterSpacing: "1px",
          overflowWrap: "break-word",
        }}
      >
        My Shopping Cart
      </h1>

      <p
        className="cart-page-subtitle"
        style={{
          textAlign: "center",
          color: "#8B6B55",
          marginBottom: "35px",
        }}
      >
        Your favourite crafts, all in one place.
      </p>

      {cartItems.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            fontSize: "16px",
            color: "#8B6B55",
            marginTop: "0",
            marginBottom: "30px",
          }}
        >
          Your cart is empty
        </p>
      ) : (
        <div className="cart-items-grid">
          {cartItems.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="cart-product-card"
            >
              <img
                src={product.image}
                alt={product.name}
                className="cart-product-image"
              />

              <h2
                className="cart-product-name"
                style={{
                  color: "#5C3A25",
                  margin: "10px 0",
                  minHeight: "48px",
                }}
              >
                {product.name}
              </h2>

              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: "5px 0",
                }}
              >
                Price: ₹{product.price}
              </p>

              <p
                style={{
                  fontSize: "14px",
                  color: "#8B6B55",
                  margin: "5px 0",
                  overflowWrap: "anywhere",
                }}
              >
                Category: {product.category}
              </p>

              <div className="cart-quantity-controls">
                <button
                  onClick={() => handleDecrease(index)}
                  disabled={Number(product.quantity) <= 1}
                  style={{
                    width: "38px",
                    height: "38px",
                    flexShrink: 0,
                    border: "1px solid #70452F",
                    borderRadius: "8px",
                    backgroundColor:
                      Number(product.quantity) <= 1
                        ? "#D8C7B5"
                        : "#F5EBDD",
                    color: "#5C3A25",
                    fontSize: "22px",
                    cursor:
                      Number(product.quantity) <= 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  -
                </button>

                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  {product.quantity}
                </span>

                <button
                  onClick={() => handleIncrease(index)}
                  style={{
                    width: "38px",
                    height: "38px",
                    flexShrink: 0,
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#70452F",
                    color: "#FFFFFF",
                    fontSize: "22px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemove(index)}
                style={{
                  backgroundColor: "#70452F",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "15px",
                  maxWidth: "100%",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="cart-total-box">
        <h2
          className="cart-total-title"
          style={{
            color: "#5C3A25",
            fontWeight: "bold",
            marginBottom: "20px",
            overflowWrap: "anywhere",
          }}
        >
          Total Price: ₹{totalPrice}
        </h2>

        <button
          className="cart-buy-button"
          onClick={() => navigate("/checkout")}
          disabled={cartItems.length === 0}
          style={{
            backgroundColor: "#70452F",
            color: "#FFFFFF",
            border: "none",
            padding: "14px 45px",
            fontSize: "16px",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
            opacity: cartItems.length === 0 ? 0.5 : 1,
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default Cart;