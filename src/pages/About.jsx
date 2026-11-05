import { Link } from "react-router-dom";

function About() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f1e7",
        padding: "50px 25px",
        boxSizing: "border-box",
      }}
    >
      {/* Hero Section */}

      <div
        style={{
          textAlign: "center",
          padding: "45px 20px",
          backgroundColor: "#70452a",
          borderRadius: "15px",
          color: "#fff",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontFamily: "Georgia, serif",
            marginBottom: "15px",
          }}
        >
          About Craft Corner
        </h1>

        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.8",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          Discover creativity, explore unique crafts, and find something
          special for every occasion.
        </p>

        <Link
          to="/products"
          style={{
            display: "inline-block",
            marginTop: "25px",
            padding: "12px 28px",
            backgroundColor: "#f8f1e7",
            color: "#70452a",
            textDecoration: "none",
            borderRadius: "25px",
            fontWeight: "bold",
          }}
        >
          Explore Products
        </Link>
      </div>

      {/* Welcome Section */}

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "40px",
          padding: "20px",
        }}
      >
        <div
          style={{
            flex: "1 1 300px",
            minWidth: 0,
          }}
        >
          <h2
            style={{
              color: "#70452a",
              fontSize: "30px",
              fontFamily: "Georgia, serif",
            }}
          >
            Welcome to Craft Corner!
          </h2>

          <p
            style={{
              color: "#493326",
              fontSize: "16px",
              lineHeight: "1.9",
            }}
          >
            Craft Corner is your destination for creative and beautiful craft
            products. We bring together unique items that can make your home,
            gifts, and special occasions more memorable.
          </p>

          <p
            style={{
              color: "#705c4d",
              fontSize: "16px",
              lineHeight: "1.9",
            }}
          >
            We believe that every product can tell a story. Our goal is to
            provide a simple and enjoyable shopping experience where you can
            discover products that match your interests.
          </p>
        </div>

        <div
          style={{
            flex: "1 1 250px",
            minWidth: 0,
            minHeight: "250px",
            backgroundColor: "#e8d8c3",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <span style={{ fontSize: "85px" }}>🎨</span>

          <h2
            style={{
              color: "#70452a",
              fontFamily: "Georgia, serif",
            }}
          >
            Creativity Starts Here
          </h2>

          <p
            style={{
              color: "#493326",
              textAlign: "center",
              lineHeight: "1.7",
            }}
          >
            Find something beautiful, creative, and unique.
          </p>
        </div>
      </div>

      {/* Our Mission */}

      <div
        style={{
          maxWidth: "1000px",
          margin: "40px auto",
          padding: "35px 25px",
          backgroundColor: "#fff",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(73, 51, 38, 0.08)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            color: "#70452a",
            fontSize: "30px",
            fontFamily: "Georgia, serif",
          }}
        >
          Our Mission
        </h2>

        <p
          style={{
            maxWidth: "750px",
            margin: "15px auto",
            color: "#705c4d",
            fontSize: "16px",
            lineHeight: "1.9",
          }}
        >
          Our mission is to help customers discover creative products through
          a convenient online shopping experience. We want to make finding
          special items easy, enjoyable, and accessible.
        </p>
      </div>

      {/* Why Choose Us */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "50px auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#70452a",
            fontSize: "32px",
            fontFamily: "Georgia, serif",
            marginBottom: "30px",
          }}
        >
          Why Choose Craft Corner?
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "25px",
          }}
        >
          {[
            {
              icon: "🎨",
              title: "Creative Products",
              description:
                "Explore interesting products for your creative interests.",
            },
            {
              icon: "🛍️",
              title: "Easy Shopping",
              description:
                "Browse products and enjoy a convenient shopping experience.",
            },
            {
              icon: "🎁",
              title: "Gift Ideas",
              description:
                "Discover special items for birthdays and celebrations.",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                flex: "1 1 220px",
                maxWidth: "300px",
                padding: "30px 20px",
                backgroundColor: "#fff",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(73, 51, 38, 0.08)",
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: "45px" }}>{item.icon}</span>

              <h3
                style={{
                  color: "#70452a",
                  fontSize: "20px",
                  marginTop: "15px",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: "#705c4d",
                  fontSize: "15px",
                  lineHeight: "1.8",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}

      <div
        style={{
          textAlign: "center",
          padding: "35px 20px",
          backgroundColor: "#e8d8c3",
          borderRadius: "15px",
          marginTop: "40px",
        }}
      >
        <h2
          style={{
            color: "#70452a",
            fontFamily: "Georgia, serif",
          }}
        >
          Thank You for Visiting!
        </h2>

        <p
          style={{
            color: "#493326",
            fontSize: "16px",
            lineHeight: "1.8",
          }}
        >
          Thank you for being part of our creative journey.
        </p>

        <Link
          to="/contact"
          style={{
            display: "inline-block",
            marginTop: "10px",
            padding: "12px 25px",
            backgroundColor: "#70452a",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "25px",
            fontWeight: "bold",
          }}
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}

export default About;