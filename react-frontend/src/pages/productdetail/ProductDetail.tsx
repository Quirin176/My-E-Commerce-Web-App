import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductDetails } from "../../hooks/products/useProductDetails";

import type { ProductVariant } from "../../types/models/products/Product";

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

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  const images = product?.hasVariants ? (selectedVariant ? selectedVariant.images : variants[0].images)
    : (productImages.length > 0) ? productImages
      : product?.thumbnailUrl ? [{
        id: 1,
        imageUrl: product?.thumbnailUrl,
        displayOrder: 1,
        isMain: true,
        productId: Number(product?.id),
        variantId: null
      }] : [];

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

        <ProductGallery
          images={images}
          thumbnail={product.thumbnailUrl}
        />

        <ProductInfo product={product} onVariantChange={(variant) => setSelectedVariant(variant)} />
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