import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import { productApi } from "../../api/productApi";
import AdminProductForm from "../../components/admin/AdminProductForm";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminProductEdit() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Use productApi.getById instead of adminApi.getProductById
        // because it returns images and options
        const data = await productApi.getById(id);

        // Map the API response to match AdminProductForm expectations
        const formattedData = {
          id: data.id,
          name: data.name,
          slug: data.slug,
          categoryId: data.categoryId,
          price: data.price,
          imageUrl: data.imageUrl,
          shortDescription: data.shortDescription,
          description: data.description,
          Images: data.images || [], // Images array from API
          options: data.options || [], // Options/attributes from API
        };

        setInitialData(formattedData);
        console.log("Product loaded:", formattedData);
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product");
      }
    };

    loadProduct();
  }, [id]);

  const handleUpdate = (data) => {
    try {
      adminApi.updateProduct(id, data).then(() => {
        toast.success("Product updated!");
        navigate("/admin/products");
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  if (!initialData) return <div className="p-4">Loading product...</div>;

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-2xl text-center font-bold mb-6">Edit Product</h1>
      <AdminProductForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
}
