import { useState } from "react";
import toast from "react-hot-toast";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    toast.success("Thank you for contacting Craft Corner!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f1e7",
        padding: "50px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* Heading */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            color: "#70452a",
            fontSize: "38px",
            fontFamily: "Georgia, serif",
          }}
        >
          Contact Us
        </h1>

        <p
          style={{
            color: "#705c4d",
            fontSize: "16px",
            lineHeight: "1.8",
          }}
        >
          Have a question? We would love to hear from you!
        </p>
      </div>

      {/* Contact Content */}

      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          alignItems: "stretch",
        }}
      >
        {/* Contact Information */}

        <div
          style={{
            flex: "1 1 280px",
            backgroundColor: "#70452a",
            color: "#fff",
            padding: "35px",
            borderRadius: "15px",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              fontSize: "27px",
              fontFamily: "Georgia, serif",
              marginTop: 0,
            }}
          >
            Get in Touch
          </h2>

          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.9",
              color: "#f8f1e7",
            }}
          >
            We are happy to help you with questions about our products and
            your shopping experience.
          </p>

          <div style={{ marginTop: "35px" }}>
            <h3 style={{ fontSize: "17px" }}>📧 Email</h3>

            <p
              style={{
                color: "#f8f1e7",
                overflowWrap: "anywhere",
              }}
            >
              support@craftcorner.com
            </p>
          </div>

          <div style={{ marginTop: "25px" }}>
            <h3 style={{ fontSize: "17px" }}>🛍️ Shopping Support</h3>

            <p
              style={{
                color: "#f8f1e7",
                lineHeight: "1.8",
              }}
            >
              Need help with a product or order? Send us a message using the
              contact form.
            </p>
          </div>

          <div style={{ marginTop: "25px" }}>
            <h3 style={{ fontSize: "17px" }}>🌿 Craft Corner</h3>

            <p style={{ color: "#f8f1e7" }}>
              Creativity, quality, and a simple shopping experience.
            </p>
          </div>
        </div>

        {/* Contact Form */}

        <div
          style={{
            flex: "1 1 400px",
            backgroundColor: "#fff",
            padding: "35px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(73, 51, 38, 0.08)",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              color: "#70452a",
              fontSize: "26px",
              fontFamily: "Georgia, serif",
              marginTop: 0,
              marginBottom: "25px",
            }}
          >
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                color: "#493326",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Your Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label
              htmlFor="email"
              style={labelStyle}
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label
              htmlFor="subject"
              style={labelStyle}
            >
              Subject
            </label>

            <input
              id="subject"
              type="text"
              name="subject"
              placeholder="Enter the subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label
              htmlFor="message"
              style={labelStyle}
            >
              Your Message
            </label>

            <textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "120px",
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "10px",
                backgroundColor: "#70452a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  color: "#493326",
  marginBottom: "8px",
  marginTop: "18px",
  fontWeight: "500",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "5px",
  border: "1px solid #dfd2c5",
  borderRadius: "8px",
  outline: "none",
  fontSize: "14px",
  color: "#493326",
  backgroundColor: "#fff",
  boxSizing: "border-box",
  fontFamily: "Arial, sans-serif",
};

export default Contact;