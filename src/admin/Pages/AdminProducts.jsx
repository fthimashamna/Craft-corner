import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [serachTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCtegory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const limit = 5;

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    brand: "Craftiva",
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/products"
      );

      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const categories = [
    { value: "", label: "All Categories" },
    { value: "frames", label: "Frames" },
    { value: "Pens", label: "Pens" },
    { value: "Inks", label: "Inks" },
    { value: "Nib", label: "Nib" },
    { value: "Papper", label: "Papper" },
    { value: "kit", label: "Kit" },
  ];

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name", label: "Name: A–Z" },
    { value: "priceLow", label: "Price: Low to High" },
    { value: "priceHigh", label: "Price: High to Low" },
    { value: "stock", label: "Stock: Low to High" },
  ];

  const selectedCategoryLabel =
    categories.find(
      (category) => category.value === selectedCategory
    )?.label || "All Categories";

  const selectedSortLabel =
    sortOptions.find(
      (option) => option.value === sortBy
    )?.label || "Default";

  const filteredProducts = products
    .filter((item) => !item.isDeleted)
    .filter((item) => {
      const search = serachTerm.toLowerCase();

      return (
        String(item.name || "").toLowerCase().includes(search) ||
        String(item.category || "").toLowerCase().includes(search) ||
        String(item.brand || "").toLowerCase().includes(search)
      );
    })
    .filter((item) => {
      return (
        selectedCategory === "" ||
        item.category === selectedCategory
      );
    })
    .slice()
    .sort((a, b) => {
      if (sortBy === "name") {
        return String(a.name || "").localeCompare(
          String(b.name || "")
        );
      }

      if (sortBy === "priceLow") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === "priceHigh") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (sortBy === "stock") {
        return Number(b.stock || 0) - Number(a.stock || 0);
      }

      if (sortBy === "stockLow") {
        return Number(a.stock || 0) - Number(b.stock || 0);
      }

      return 0;
    });

  // Pagination logic
  const start = (page - 1) * limit;

  const displayedProducts = filteredProducts.slice(
    start,
    start + limit
  );

  const totalPages = Math.ceil(
    filteredProducts.length / limit
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset page when search, filter or sorting changes
  useEffect(() => {
    setPage(1);
  }, [serachTerm, selectedCategory, sortBy]);

  // Adjust page when products are deleted
  useEffect(() => {
    const lastPage = Math.max(
      1,
      Math.ceil(filteredProducts.length / limit)
    );

    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [filteredProducts.length, page]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleEditProduct = (item) => {
    setEditingId(item.id);

    setProduct({
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      description: item.description,
      image: item.image,
      brand: item.brand || "Craftiva",
    });

    setImagePreview(item.image);
    setShowForm(true);
  };

  const handleSoftDelete = async () => {
    try {
      await axios.patch(
        `http://localhost:3001/products/${selectedProduct.id}`,
        { isDeleted: true }
      );

      toast.success("Product moved to deleted products");
      setShowDeleteModel(false);
      setSelectedProduct(null);

      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleHardDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/products/${selectedProduct.id}`
      );

      toast.success("Product permanently deleted");

      setShowDeleteModel(false);
      setSelectedProduct(null);

      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 600;
        const maxHeight = 600;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(
            maxWidth / width,
            maxHeight / height
          );

          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const compressedImage = canvas.toDataURL(
          "image/jpeg",
          0.6
        );

        setProduct((prevProduct) => ({
          ...prevProduct,
          image: compressedImage,
        }));

        setImagePreview(compressedImage);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !product.name.trim() ||
      !product.category ||
      !product.price ||
      !product.stock ||
      !product.description.trim() ||
      !product.image
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const newProduct = {
        ...product,
        name: product.name.trim(),
        price: Number(product.price),
        stock: Number(product.stock),
        brand: product.brand || "Craftiva",
      };

      if (editingId !== null) {
        await axios.put(
          `http://localhost:3001/products/${editingId}`,
          newProduct
        );

        toast.success("Product updated successfully");
      } else {
        await axios.post(
          "http://localhost:3001/products",
          newProduct
        );

        toast.success("Product added successfully");
      }

      setProduct({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        image: "",
        brand: "Craftiva",
      });

      setImagePreview("");
      setEditingId(null);
      setShowForm(false);

      fetchProducts();
    } catch (error) {
      console.log("Product Error:", error);
      console.log("Error Response:", error.response?.data);
      console.log("Status Code:", error.response?.status);

      toast.error(
        error.response?.status === 413
          ? "Image is too large"
          : "Failed to add product"
      );
    }
  };

  const handleCancel = () => {
    setProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      brand: "Craftiva",
    });

    setImagePreview("");
    setShowForm(false);
    setEditingId(null);
  };

  const containerStyle = {
    padding: "30px",
    backgroundColor: "#FAF6F0",
    minHeight: "100vh",
    color: "#493326",
  };

  const headingStyle = {
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "25px",
    color: "#493326",
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #795438, #4A2E1D)",
    color: "#FFFFFF",
    padding: "14px 28px",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 5px 12px rgba(92, 58, 37, 0.20)",
    transition: "all 0.3s ease",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #D6C3AE",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#493326",
    backgroundColor: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#493326",
  };

  const fieldStyle = {
    marginBottom: "18px",
  };

  return (
    <div style={containerStyle}>
      {!showForm && (
        <>
          <h2 style={headingStyle}>Manage Products</h2>

          <div style={{ textAlign: "center", marginBottom: "35px" }}>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(92, 58, 37, 0.30)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 5px 12px rgba(92, 58, 37, 0.20)";
              }}
            >
              + Add Product
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "25px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search by name, category, or brand..."
              value={serachTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: "1",
                minWidth: "220px",
                padding: "13px 16px",
                border: "2px solid #B89572",
                borderRadius: "12px",
                fontSize: "14px",
                color: "#5C3A25",
                backgroundColor: "#FFF8EF",
                outline: "none",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#5C3A25";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(92,58,37,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#B89572";
                e.currentTarget.style.boxShadow = "none";
              }}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCtegory(e.target.value)}
              style={{
                ...inputStyle,
                flex: "1",
                minWidth: "160px",
              }}
            >
              <option value="">All Categories</option>
              <option value="frames">Frames</option>
              <option value="Pens">Pens</option>
              <option value="Inks">Inks</option>
              <option value="Papper">Papper</option>
              <option value="Nib">Nib</option>
              <option value="kit">Kits</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                ...inputStyle,
                flex: "1",
                minWidth: "160px",
              }}
            >
              <option value="">Sort By</option>
              <option value="name">Name: A-Z</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="stock">Stock: High to Low</option>
              <option value="stockLow">Stock: Low to High</option>
            </select>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 15px rgba(73, 51, 38, 0.08)",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#EDE0D1" }}>
                  {[
                    "Image",
                    "Name",
                    "Category",
                    "Price",
                    "Stock",
                    "Brand",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "14px",
                        color: "#493326",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((item) => (
                    <tr
                      key={item.id}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#FAF3EB";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }}
                      style={{
                        borderBottom: "1px solid #E8DDD1",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <td style={{ padding: "12px" }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </td>

                      <td style={{ padding: "12px" }}>{item.name}</td>
                      <td style={{ padding: "12px" }}>{item.category}</td>
                      <td style={{ padding: "12px" }}>₹{item.price}</td>
                      <td style={{ padding: "12px" }}>{item.stock}</td>
                      <td style={{ padding: "12px" }}>{item.brand}</td>

                      <td style={{ padding: "12px" }}>
                        <button
                          type="button"
                          onClick={() => handleEditProduct(item)}
                          style={{
                            marginRight: "8px",
                            padding: "8px 16px",
                            backgroundColor: "#795438",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#4A2E1D";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#795438";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct(item);
                            setShowDeleteModel(true);
                          }}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#F5E5DC",
                            color: "#8B3A2B",
                            border: "1px solid #D9B8A7",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#8B3A2B";
                            e.currentTarget.style.color = "#FFFFFF";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#F5E5DC";
                            e.currentTarget.style.color = "#8B3A2B";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: "25px",
                        textAlign: "center",
                        color: "#8B7563",
                      }}
                    >
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                style={{
                  padding: "9px 16px",
                  backgroundColor:
                    page === 1 ? "#D6C3AE" : "#795438",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "6px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>

              <span
                style={{
                  color: "#493326",
                  fontWeight: "600",
                }}
              >
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: "9px 16px",
                  backgroundColor:
                    page === totalPages ? "#D6C3AE" : "#795438",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "6px",
                  cursor:
                    page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showForm && (
        <>
          <h2 style={headingStyle}>Add New Product</h2>

          <form
            onSubmit={handleAddProduct}
            style={{
              maxWidth: "650px",
              margin: "0 auto",
              padding: "30px",
              backgroundColor: "#E9D2B7",
              borderRadius: "15px",
              boxShadow: "0 5px 20px rgba(73, 51, 38, 0.10)",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>Product Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Category</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Category</option>
                <option value="frames">Frames</option>
                <option value="Pens">Pens</option>
                <option value="Inks">Inks</option>
                <option value="Nib">Nib</option>
                <option value="Papper">Papper</option>
                <option value="kit">Kit</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Price</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Stock</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                min="0"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Brand</label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={inputStyle}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginTop: "12px",
                    border: "1px solid #D6C3AE",
                  }}
                />
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginTop: "30px",
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "13px 28px",
                  border: "1px solid #795438",
                  borderRadius: "9px",
                  backgroundColor: "#FFFFFF",
                  color: "#795438",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button type="submit" style={buttonStyle}>
                Save Product
              </button>
            </div>
          </form>
        </>
      )}

      {showDeleteModel && selectedProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "380px",
              maxWidth: "90%",
              padding: "28px",
              backgroundColor: "#FFFDF8",
              borderRadius: "14px",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#5C3A25", marginTop: 0 }}>
              Delete Product?
            </h2>

            <p style={{ color: "#795438" }}>
              Choose how you want to delete "{selectedProduct.name}".
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModel(false);
                  setSelectedProduct(null);
                }}
                style={{
                  padding: "11px",
                  backgroundColor: "#FFFFFF",
                  color: "#5C3A25",
                  border: "1px solid #A98467",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSoftDelete}
                style={{
                  padding: "11px",
                  backgroundColor: "#D2B99B",
                  color: "#493326",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Soft Delete
              </button>

              <button
                type="button"
                onClick={handleHardDelete}
                style={{
                  padding: "11px",
                  backgroundColor: "#8B3A2B",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Hard Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;