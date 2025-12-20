import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {siteConfig} from "../../config/siteConfig";
const Categories = () => {
  const [products, setProducts] = useState([]);

  // Mock data for now
  useEffect(() => {
    const productCategories = siteConfig.categories;

    setProducts(productCategories);}, []);

  return (
    <div>
      <h1 style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>Categories</h1>

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", }}>
        {products.map((item, index) => (
          <Link key={index} to={`/category/${encodeURIComponent(item.link)}`}
          style={{border: "1px solid #ccc", borderRadius: 8, padding: 10, textAlign: "center"}}>
            <img src={item.image} alt={item.label} style={{ width: "100%", height: 150, objectFit: "cover" }}/>
            <h3 style={{fontWeight: "bold"}}>{item.label}</h3>
          </Link>))}
      </div>
    </div>
  );
};

export default Categories;
