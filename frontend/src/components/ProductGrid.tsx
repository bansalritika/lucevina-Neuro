import Slider from "react-slick";
import { Card, CardContent } from "@/components/ui/card";
import Temps from "../assets/Temps1.jpg";
import harmonieImg from "../assets/harmonie.png";

const ProductSlider = () => {
  const products = [
    {
      name: "harmonie",
      title: "The Sleeping Mask",
      subtitle: "Replenishing & Renewing",
      price: "$140.00",
      image: harmonieImg
    },
    {
      name: "énergie",
      title: "The Cream",
      subtitle: "Energizing & Firming",
      price: "$170.00",
      image: harmonieImg
    },
    {
      name: "énergie",
      title: "The Cream",
      subtitle: "Energizing & Firming",
      price: "$170.00",
      image: harmonieImg
    },
    {
      name: "énergie",
      title: "The Cream",
      subtitle: "Energizing & Firming",
      price: "$170.00",
      image: harmonieImg
    },
  ];

  const settings = {
    dots: false,
    infinite: false, // loop removed
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Headline */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Proven results on skin's emotional aging.
        </h2>
        <p className="text-lg text-gray-300"
        style={{fontFamily: "ibmplexmono, Courier New, serif" }}>
          The brand everyone is talking about with over 20 international awards
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Image with Overlay */}
        <div className="lg:w-1/3 relative h-[500px] lg:h-[600px]">
          <img
            src={Temps}
            alt="Sleeping Mask"
            className="w-full h-full object-cover rounded-lg opacity-90"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-start p-6 bg-black/20 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Reset and Strengthen</h3>
            <p className="mb-4"
            style={{fontFamily: "ibmplexmono, Courier New, serif" }}
            >Discover how our products rejuvenate your skin.</p>
            <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition">
              Discover New Product
            </button>
          </div>
        </div>

        {/* Right Product Slider */}
        <div className="lg:w-2/3">
          <Slider {...settings}>
            {products.map((product, i) => (
              <div key={i} className="px-2"> {/* spacing between cards */}
                <Card className="bg-black border border-gray-700 text-white h-[500px] lg:h-[600px] flex flex-col">
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="flex-1 overflow-hidden rounded-lg mb-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm italic mb-1">{product.name}</div>
                    <h3 className="font-luxury text-lg font-semibold mb-1">{product.title}</h3>
                    {product.subtitle && <p className="text-sm italic mb-3">{product.subtitle}</p>}
                    <div className="text-lg font-semibold">{product.price}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

// Custom Arrows
const SampleNextArrow = ({ className, style, onClick, currentSlide, slideCount }: any) => {
  if (currentSlide >= slideCount - 2) return null; // hide if no more slides
  return <div className={`${className} text-white`} onClick={onClick} />;
};

const SamplePrevArrow = ({ className, style, onClick, currentSlide }: any) => {
  if (currentSlide === 0) return null; // hide if first slide
  return <div className={`${className} text-white`} onClick={onClick} />;
};

export default ProductSlider;
