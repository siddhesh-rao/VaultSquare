import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
    {products.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
);

export default ProductGrid;
