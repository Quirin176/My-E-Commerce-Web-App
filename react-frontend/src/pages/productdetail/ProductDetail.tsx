import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProductDetails } from "../../hooks/products/useProductDetails";

import type { ProductVariant, ImagePayload } from "../../types/models/products/Product";

import ProductGallery from "../../components/productDetail/ProductGallery";
import ProductInfo from "../../components/productDetail/ProductInfo";
import ProductSpecifications from "../../components/productDetail/ProductSpecifications";

import LoadingState from "../../components/pageState/LoadingState";
import ErrorState from "../../components/pageState/ErrorState";

export default function ProductDetails() {
  const { slug } = useParams();
  const {
    product,
    variants,
    productImages,
    loading,
    error,
  } = useProductDetails(slug);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const activeVariant = selectedVariant;

  const images: ImagePayload[] = (() => {
    if (product?.hasVariants && activeVariant) {
      return activeVariant.images ?? [];
    }

    if (productImages.length > 0) {
      return productImages;
    }

    if (product?.thumbnailUrl) {
      return [{
        id: 0,
        imageUrl: product.thumbnailUrl,
        displayOrder: 0,
        isMain: true,
        productId: Number(product.id),
        variantId: null,
      }];
    }

    return [];
  })();

  if (loading)
    return (
      <LoadingState
        message="Loading product's detail..."
        subMessage="Please wait while we fetch the product's detail."
      />
    );

  if (error || !product)
    return (
      <ErrorState title="Product not found" />
    );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">

      <div className="grid lg:grid-cols-2 gap-10">

        {images.length > 0 && (
          <ProductGallery
            images={images}
            thumbnail={product.thumbnailUrl}
          />
        )}

        {images.length === 0 && (
          <div className="flex items-center justify-center bg-gray-100 rounded-lg h-96">
            <p className="text-gray-400 text-sm">No images available</p>
          </div>
        )}

        <ProductInfo
          product={product}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
        />

      </div>

      <ProductSpecifications options={product.options} />

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Description
        </h2>

        <p className="whitespace-pre-wrap">
          {product.description}
        </p>
      </div>

    </div>
  );
}