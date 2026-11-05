import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

import { createOrder } from "../services/orderService";
import { clearCart, syncUserCart } from "../redux/slices/cartSlice";

function Checkout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedProduct = location.state?.product;
  const cartItems = useSelector((state) => state.cart.items);
  const userId = localStorage.getItem("userId");

  const orderItems = selectedProduct
    ? [{ ...selectedProduct, quantity: 1 }]
    : cartItems;

  const totalPrice = orderItems.reduce(
    (total, product) =>
      total + Number(product.price) * Number(product.quantity || 1),
    0
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const paymentMethods = [
    {
      value: "COD",
      title: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: "💵",
    },
    {
      value: "UPI",
      title: "UPI Payment",
      description: "Google Pay, PhonePe, Paytm",
      icon: "📱",
    },
    {
      value: "CARD",
      title: "Credit / Debit Card",
      description: "Visa, Mastercard and other cards",
      icon: "💳",
    },
    {
      value: "NET_BANKING",
      title: "Net Banking",
      description: "Pay through your bank",
      icon: "🏦",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || message) return;

    if (!userId) {
      toast.error("Please log in to continue.");
      navigate("/login");
      return;
    }

    if (orderItems.length === 0) {
      setError("Your cart is empty. Please add products first.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      // CHECK LATEST USER STATUS BEFORE PLACING ORDER
      const userResponse = await axios.get(
        `http://localhost:3001/users/${userId}`
      );

      const currentUser = userResponse.data;

      if (currentUser.status === "blocked") {
        setError(
          "Your account has been blocked. You cannot place an order. Please contact the administrator."
        );

        toast.error("Your account is blocked. Order cannot be placed.");

        setSubmitting(false);
        return;
      }

      // CREATE ORDER ONLY IF USER IS ACTIVE
      const orderData = {
        userId,
        customer: formData,
        items: orderItems,
        totalPrice,
        paymentMethod,
        paymentStatus: "pending",
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await createOrder(orderData);

      if (!selectedProduct) {
        await dispatch(
          syncUserCart({
            userId,
            items: [],
          })
        ).unwrap();

        dispatch(clearCart());
      }

      setMessage("Your order has been placed successfully!");

      toast.success("Your order has been placed successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (err) {
      console.error("Order failed:", err);

      setError(
        "Unable to place your order. Please try again."
      );

      toast.error("Unable to place your order.");
    } finally {
      setSubmitting(false);
    }
  };

  const paymentOptionStyle = (selected) => ({
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    marginBottom: "12px",
    border: selected ? "2px solid #70452F" : "1px solid #D8C7B5",
    borderRadius: "10px",
    backgroundColor: selected ? "#FFF5E8" : "#FFFCF8",
    cursor: "pointer",
    boxSizing: "border-box",
    transition: "all 0.25s ease",
    minWidth: 0,
  });

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
          .checkout-title {
            font-size: 36px;
          }

          .checkout-layout {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 25px;
            max-width: 1100px;
            width: 100%;
            margin: 0 auto;
            align-items: start;
          }

          .checkout-panel {
            background-color: #FFFFFF;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(92,58,37,0.08);
            box-sizing: border-box;
            min-width: 0;
            width: 100%;
          }

          .checkout-product-row {
            display: flex;
            gap: 15px;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #E8D5BE;
            min-width: 0;
          }

          .checkout-product-image {
            width: 85px;
            height: 95px;
            object-fit: contain;
            background-color: #FFF9F1;
            border-radius: 8px;
            flex-shrink: 0;
          }

          .checkout-product-details {
            flex: 1;
            min-width: 0;
            overflow-wrap: anywhere;
          }

          .checkout-total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-top: 25px;
            padding-top: 15px;
            border-top: 2px solid #D8C7B5;
          }

          .checkout-total-price {
            margin: 0;
            color: #70452F;
            overflow-wrap: anywhere;
          }

          .checkout-success {
            max-width: 700px;
            width: 100%;
            box-sizing: border-box;
            margin: 0 auto 25px;
            padding: 20px;
            background-color: #E2F3E5;
            color: #246B35;
            border-radius: 10px;
            text-align: center;
          }

          .checkout-success-actions {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
          }

          .checkout-success-button {
            padding: 12px 22px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            max-width: 100%;
            box-sizing: border-box;
          }

          .checkout-input {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 12px;
            margin-top: 8px;
            border: 1px solid #D8C7B5;
            border-radius: 6px;
            font-size: 15px;
            background-color: #FFFCF8;
            color: #5C3A25;
          }

          .checkout-empty {
            max-width: 500px;
            width: 100%;
            box-sizing: border-box;
            margin: 30px auto;
            padding: 30px 20px;
            background-color: #FFFFFF;
            border-radius: 12px;
            text-align: center;
          }

          .checkout-button {
            padding: 12px 20px;
            background-color: #70452F;
            color: #FFFFFF;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
            box-sizing: border-box;
          }

          .checkout-payment-option {
            width: 100%;
            min-width: 0;
          }

          .checkout-payment-option span {
            overflow-wrap: anywhere;
          }

          @media (max-width: 900px) {
            .checkout-layout {
              grid-template-columns: minmax(0, 1fr);
              max-width: 650px;
            }
          }

          @media (max-width: 768px) {
            .checkout-title {
              font-size: 30px;
            }

            .checkout-panel {
              padding: 22px;
            }

            .checkout-success {
              padding: 18px;
            }
          }

          @media (max-width: 480px) {
            .checkout-title {
              font-size: 27px;
            }

            .checkout-subtitle {
              font-size: 14px;
              margin-bottom: 25px !important;
            }

            .checkout-layout {
              gap: 18px;
            }

            .checkout-panel {
              padding: 16px;
            }

            .checkout-section-heading {
              font-size: 21px !important;
            }

            .checkout-product-row {
              gap: 12px;
            }

            .checkout-product-image {
              width: 72px;
              height: 85px;
            }

            .checkout-product-name {
              font-size: 15px !important;
            }

            .checkout-total-row {
              align-items: flex-start;
              flex-wrap: wrap;
            }

            .checkout-total-row h3 {
              font-size: 16px;
            }

            .checkout-total-price {
              font-size: 22px;
            }

            .checkout-payment-option {
              gap: 9px !important;
              padding: 12px !important;
            }

            .checkout-payment-icon {
              font-size: 21px !important;
            }

            .checkout-payment-title {
              font-size: 14px !important;
            }

            .checkout-payment-description {
              font-size: 12px;
            }

            .checkout-success {
              padding: 16px 12px;
            }

            .checkout-success-actions {
              flex-direction: column;
              align-items: stretch;
            }

            .checkout-success-button {
              width: 100%;
              margin: 0 !important;
            }

            .checkout-empty {
              padding: 25px 16px;
            }

            .checkout-button {
              width: 100%;
            }
          }
        `}
      </style>

      <h1
        className="checkout-title"
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#5C3A25",
          overflowWrap: "break-word",
        }}
      >
        Checkout
      </h1>

      <p
        className="checkout-subtitle"
        style={{
          textAlign: "center",
          color: "#8B6B55",
          marginBottom: "35px",
        }}
      >
        Complete your details to place your order.
      </p>

      {message && (
        <div role="status" className="checkout-success">
          <h3 style={{ margin: "0 0 10px" }}>
            Order Successful!
          </h3>

          <p style={{ margin: "0 0 10px" }}>{message}</p>

          <p style={{ overflowWrap: "anywhere" }}>
            <strong>Payment Method:</strong>{" "}
            {paymentMethods.find(
              (method) => method.value === paymentMethod
            )?.title || paymentMethod}
          </p>

          {paymentMethod !== "COD" && (
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Your order has been recorded, but online payment has not
              been processed. Payment integration is required to
              complete the payment.
            </p>
          )}

          {paymentMethod === "COD" && (
            <p style={{ fontSize: "14px" }}>
              Please pay when your order arrives.
            </p>
          )}

          <div className="checkout-success-actions">
            <button
              type="button"
              className="checkout-success-button"
              onClick={() => navigate("/")}
              style={{
                backgroundColor: "#70452F",
                color: "#FFFFFF",
                border: "none",
              }}
            >
              Continue Shopping
            </button>

            <button
              type="button"
              className="checkout-success-button"
              onClick={() => navigate("/orderdetails")}
              style={{
                backgroundColor: "#FFFFFF",
                color: "#70452F",
                border: "1px solid #70452F",
              }}
            >
              View My Orders
            </button>
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          style={{
            color: "#B42318",
            textAlign: "center",
            marginBottom: "20px",
            overflowWrap: "anywhere",
          }}
        >
          {error}
        </p>
      )}

      {orderItems.length === 0 && !message ? (
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add some craft products before checkout.</p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="checkout-button"
          >
            Browse Products
          </button>
        </div>
      ) : (
        !message && (
          <div className="checkout-layout">
            <div className="checkout-panel">
              <h2
                style={sectionHeadingStyle}
                className="checkout-section-heading"
              >
                Order Summary
              </h2>

              {orderItems.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="checkout-product-row"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="checkout-product-image"
                  />

                  <div className="checkout-product-details">
                    <h3
                      className="checkout-product-name"
                      style={{
                        fontSize: "16px",
                        margin: "0 0 8px",
                        color: "#5C3A25",
                      }}
                    >
                      {product.name}
                    </h3>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#8B6B55",
                        margin: "5px 0",
                      }}
                    >
                      Quantity: {product.quantity || 1}
                    </p>

                    <p
                      style={{
                        fontWeight: "bold",
                        margin: "5px 0",
                        overflowWrap: "anywhere",
                      }}
                    >
                      ₹
                      {(
                        Number(product.price) *
                        Number(product.quantity || 1)
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}

              <div className="checkout-total-row">
                <h3 style={{ margin: 0 }}>Total Price</h3>

                <h2 className="checkout-total-price">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </h2>
              </div>

              <p
                style={{
                  fontSize: "13px",
                  color: "#8B6B55",
                  marginTop: "15px",
                  lineHeight: "1.6",
                }}
              >
                Delivery charges, if applicable, will be confirmed
                before order fulfillment.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="checkout-panel"
            >
              <h2
                style={sectionHeadingStyle}
                className="checkout-section-heading"
              >
                Delivery Details
              </h2>

              <label htmlFor="name" style={labelStyle}>
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                disabled={submitting}
                className="checkout-input"
              />

              <label htmlFor="email" style={labelStyle}>
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={submitting}
                className="checkout-input"
              />

              <label htmlFor="phone" style={labelStyle}>
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                pattern="[0-9+\\-\\s()]{7,20}"
                title="Enter a valid phone number"
                required
                disabled={submitting}
                className="checkout-input"
              />

              <label htmlFor="address" style={labelStyle}>
                Delivery Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete delivery address"
                autoComplete="street-address"
                required
                rows="4"
                disabled={submitting}
                className="checkout-input"
                style={{
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />

              <h2
                style={{
                  ...sectionHeadingStyle,
                  marginTop: "30px",
                }}
                className="checkout-section-heading"
              >
                Payment Method
              </h2>

              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className="checkout-payment-option"
                  style={paymentOptionStyle(
                    paymentMethod === method.value
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setError("");
                    }}
                    disabled={submitting}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#70452F",
                      flexShrink: 0,
                    }}
                  />

                  <span
                    className="checkout-payment-icon"
                    style={{ fontSize: "24px" }}
                  >
                    {method.icon}
                  </span>

                  <span style={{ flex: 1, minWidth: 0 }}>
                    <strong
                      className="checkout-payment-title"
                      style={{
                        display: "block",
                        fontSize: "15px",
                        marginBottom: "5px",
                      }}
                    >
                      {method.title}
                    </strong>

                    <small
                      className="checkout-payment-description"
                      style={{
                        color: "#8B6B55",
                        lineHeight: "1.5",
                      }}
                    >
                      {method.description}
                    </small>
                  </span>

                  {paymentMethod === method.value && (
                    <span
                      style={{
                        color: "#70452F",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </label>
              ))}

              {paymentMethod !== "COD" && (
                <div
                  style={{
                    padding: "13px",
                    backgroundColor: "#FFF5E8",
                    color: "#70452F",
                    borderRadius: "8px",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    marginTop: "15px",
                    overflowWrap: "anywhere",
                  }}
                >
                  <strong>Online payment notice</strong>

                  <p style={{ margin: "5px 0 0" }}>
                    This payment option can be selected and saved with
                    your order, but online payment processing has not
                    been integrated yet. Your payment will remain
                    pending until a payment gateway is connected.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="checkout-button"
                style={{
                  width: "100%",
                  marginTop: "22px",
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        )
      )}
    </div>
  );
}

const sectionHeadingStyle = {
  fontSize: "23px",
  color: "#5C3A25",
  margin: "0 0 20px",
  paddingBottom: "12px",
  borderBottom: "2px solid #E8D5BE",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#5C3A25",
  marginTop: "18px",
};

export default Checkout;