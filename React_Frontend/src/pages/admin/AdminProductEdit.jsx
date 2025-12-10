import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import AdminProductForm from "../../components/admin/AdminProductForm";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminProductEdit() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.getProductById(id).then(setInitialData);
  }, [id]);

  const handleUpdate = (data) => {
    adminApi.updateProduct(id, data).then(() => {
      toast.success("Product updated!");
      navigate("/admin/products");
    });
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-2xl text-center font-bold mb-6">Edit Product</h1>
      <AdminProductForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
}
