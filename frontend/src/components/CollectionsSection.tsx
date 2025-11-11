import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CollectionsSection = () => {
  const [products, setProducts] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/products/featured/four`);
      const data = await res.json();
      setProducts(data);
    };
    load();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Results you can see & feel
        </h2>
        <p className="text-lg text-muted-foreground"
        style={{fontFamily: "ibmplexmono, Courier New, serif" }}
        >
          LUCEVINA offers innovative and effective solutions to address conditions of dull, tired or tense skin.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <Link 
            to={`/product/${product._id}`} 
            key={index} 
            className="group cursor-pointer text-center"
          >
            <div className="aspect-[4/5] rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[0]}  
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-center">
              <p className="font-[cursive] text-sm mb-2">
                {product.subtitle}
              </p>
              <p className="text-sm font-medium tracking-wide underline hover:no-underline">
                {product.title} ;
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionsSection;
