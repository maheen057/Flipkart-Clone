import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from backend
  const fetchProducts = () => {
    fetch("https://6xszg2-8080.csb.app/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("🧪 Fetched products:", data);
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("❌ Expected products to be an array");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Add product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const price = parseFloat(e.target.price.value);
    const image = e.target.image.value;

    fetch("https://6xszg2-8080.csb.app/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, image }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        fetchProducts(); // reload after adding
        e.target.reset(); // clear form
      })
      .catch((err) => console.error("❌ Failed to add product:", err));
  };

  // ✅ Delete product
  const deleteProduct = (id) => {
    fetch(`https://6xszg2-8080.csb.app/product/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then(() => fetchProducts());
  };

  // ✅ Edit product
  const editProduct = (product) => {
    const newName = prompt("Enter new name", product.name);
    const newPrice = prompt("Enter new price", product.price);
    const newImage = prompt("Enter new image URL", product.image);

    fetch(`https://6xszg2-8080.csb.app/product/${product._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        price: parseFloat(newPrice),
        image: newImage,
      }),
    })
      .then((res) => res.text())
      .then(() => fetchProducts());
  };

  // ✅ Clear all products
  const handleClearProducts = () => {
    fetch("https://6xszg2-8080.csb.app/clear-products", {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then((msg) => {
        console.log(msg);
        setProducts([]); // Clear UI
      })
      .catch((err) => console.error("❌ Failed to clear products:", err));
  };

  return (
    <div className="p-5 font-sans">
      {/* ✅ Add Product Form */}
      <h1 className="text-3xl font-bold underline text-blue-600">
        🛒 Flipkart Clone
      </h1>

      <form onSubmit={handleAddProduct} style={{ marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Product Name"
          required
          className="border p-2 rounded w-full mb-2"
        />
        <input
          name="name"
          placeholder="Product Name"
          required
          className="border p-2 rounded w-full mb-2"
        />
        <input
          name="name"
          placeholder="Product Name"
          required
          className="border p-2 rounded w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>

      {/* ✅ Clear Products */}
      <button onClick={handleClearProducts}>🧹 Clear Products</button>

      {/* ✅ Product List */}
      <div className="flex flexWrap gap-4 justify-center mt-5">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product._id || product.name}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[120px] object-cover rounded"
                className="border border-gray-300 m-2 p-4 w-52 shadow-md rounded"
              />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <button onClick={() => deleteProduct(product._id)}>
                ❌ Delete
              </button>
              <button onClick={() => editProduct(product)}>✏️ Edit</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
