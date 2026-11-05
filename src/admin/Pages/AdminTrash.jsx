import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminTrash() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3001";

   const fetchTrash = async () => {
    try {
    const response = await axios.get(`${API_URL}/products`);
    setProducts(
    response.data.filter(
    (product) => product.isDeleted === true
    )
  );
} catch (error) {
    console.error("Fetch trash error:", error);
    toast.error("Failed to load Trash");
    } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    // RESTORE PRODUCT
    const handleRestoreProduct = async (product) => {
        try {
        await axios.patch(
        `${API_URL}/products/${product.id}`,
        { isDeleted: false });
        toast.success("Product restored successfully!");
        await fetchTrash();
        } catch (error) {
            toast.error("Failed to restore product");
        }
    };

    // PERMANENTLY DELETE PRODUCT
    const handlePermanentDeleteProduct = async (product) => {
        if (
            !window.confirm(
                `Permanently delete "${product.name}"? This cannot be undone.`
            )
        ) {
            return;
        }
        try {
            await axios.delete(
                `${API_URL}/products/${product.id}`
            );
            toast.success("Product permanently deleted!");
            await fetchTrash();
        } catch (error) {
            toast.error("Failed to permanently delete product");
        }
    };
    const styles = {
        page: {
            padding: "30px",
            backgroundColor: "#FAF6F0",
            minHeight: "100vh",
            color: "#493326",
            fontFamily: "Georgia, serif",
            fontSize: "16px",
        },

        heading: {
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "25px",
            color: "#493326",
        },

        card: {
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "30px",
            boxShadow: "0 4px 15px rgba(73, 51, 38, 0.08)",
            overflowX: "auto",
        },

        sectionHeading: {
            fontSize: "16px",
            fontWeight: "bold",
        },

        table: {
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            minWidth: "650px",
            fontFamily: "Georgia, serif",
            fontSize: "16px",
        },

        th: {
            padding: "14px",
            color: "#493326",
            fontSize: "16px",
            whiteSpace: "nowrap",
            backgroundColor: "#EDE0D1",
            fontWeight: "bold",
        },

        td: {
            padding: "12px",
            borderBottom: "1px solid #E8DDD1",
            fontSize: "16px",
        },

        restoreButton: {
            marginRight: "8px",
            marginBottom: "5px",
            padding: "8px 14px",
            backgroundColor: "#795438",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            fontSize: "16px",
        },

        deleteButton: {
            padding: "8px 14px",
            backgroundColor: "#8B3A2B",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            fontSize: "16px",
        },
    };

    return (
    <div style={styles.page}>
    <h2 style={styles.heading}>Trash Bin</h2>

    {loading ? (
    <p style={{ textAlign: "center", fontSize: "16px" }}>  Loading Trash...</p>
    ) : (
    <div style={styles.card}>
    <h3 style={styles.sectionHeading}>Deleted Products ({products.length})</h3>

    <table style={styles.table}>
        <thead>
            <tr>
            {["Image","Name","Category","Price","Actions",]
            .map((heading) => (
            <th key={heading} style={styles.th}>
            {heading}
            </th>
            ))}
            </tr>
        </thead>

        <tbody>
            {products.length > 0 ? (
            products.map((product) => (
            <tr key={product.id}>
            <td style={styles.td}>
             <img
                src={product.image}
                alt={product.name}
                style={{
                    width: "55px",
                    height: "55px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}/>
                </td>

                <td style={styles.td}>
                {product.name}
                </td>

                <td style={styles.td}>
                {product.category}
                </td>

                <td style={styles.td}>
                ₹{product.price}
                </td>

                <td style={styles.td}>
                <button
                    type="button"
                    onClick={() => handleRestoreProduct(product)}style={styles.restoreButton}>Restore
                </button>

                <button
                    type="button"
                    onClick={() =>handlePermanentDeleteProduct(product)}style={styles.deleteButton} >
                          Delete Permanently
                </button>
                 </td>
                </tr>
                ))
                ) : (
                     <tr>
                     <td
                        colSpan="5"
                        style={{
                        ...styles.td,
                        textAlign: "center",
                        }}>
                         No deleted products found.
                        </td>
                        </tr>
                    )}
            </tbody>
    </table>
    </div>
    )}
    </div>
    );
}

export default AdminTrash;