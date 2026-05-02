import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data));
  }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map((product) => product.category))], [products]);
  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shop Groceries</h1>
          <p className="text-slate-500">Fresh staples for AI meal planning.</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <label className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input className="input pl-9" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <select className="input md:w-44" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </section>
  );
};

export default Products;
