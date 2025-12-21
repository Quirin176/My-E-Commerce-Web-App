import MainLayout from "../../layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero">
        <h2>Welcome to Our Store</h2>
        <p>Best products, best prices</p>
      </section>

      {/* Categories */}
      <section className="categories">
        <h3>Shop by Category</h3>
        <div className="category-list">
          <div className="category-item">Electronics</div>
          <div className="category-item">Fashion</div>
          <div className="category-item">Home</div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products">
        <h3>Featured Products</h3>
        <div className="product-grid">
          {/* ProductCard will go here later */}
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
