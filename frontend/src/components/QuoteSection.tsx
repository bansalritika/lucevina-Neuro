import { Button } from "@/components/ui/button";
import quoteImg from "../assets/quote.png"; // replace with your image path
import { Link } from "react-router-dom";

const QuoteSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Image */}
          <div className="overflow-hidden ">
            <img
              src={quoteImg}
              alt="Quote visual"
              className="w-full h-[650px] lg:h-[600px] object-cover "
            />
          </div>

          {/* Right: Quote */}
          <div className="flex flex-col items-center text-center">
            <blockquote
              className="text-xl md:text-2xl mb-6"
              style={{
                fontFamily: "sortsmillgoudy, Times New Roman, serif",
                fontStyle: "normal",
                fontWeight: 400,
                letterSpacing: ".35rem",
                lineHeight: "2.625rem",
                overflowWrap: "break-word",
                textAlign: "center",
              }}
            >
              "While the links between the skin and the brain have been known for a long time, recent research advancements are opening up new avenues of action for cosmetics."
            </blockquote>
            <cite
              className="text-sm font-medium italic mb-8"
              style={{ 
                fontFamily: "ibmplexmono, Courier New, serif",
                textAlign: "center"
              }}
            >
              ELLE FRANCE
            </cite>
            <Link to="/ourproducts" className="bg-white text-black px-6 py-2 rounded-[1.5rem] hover:bg-gray-200 transition"
            style={{ fontFamily: "ibmplexmono, Courier New, serif" }}>
              Discover The Products
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
