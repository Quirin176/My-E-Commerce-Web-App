import React from "react";
import { adminApi } from "../../api/adminApi";
import AdminProductForm from "../../components/admin/AdminProductForm";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminProductNew() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      console.log("Sending product data:", data);
      await adminApi.createProduct(data);
      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Create product error:", err);
      
      // Extract the actual error message from backend
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error ||
        (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(", ")) ||
        err.message ||
        "Failed to add new product";
      
      console.error("Error details:", err.response?.data);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-2xl text-center font-bold mb-6">Add New Product</h1>
      <AdminProductForm onSubmit={handleCreate} />
    </div>
  );
}