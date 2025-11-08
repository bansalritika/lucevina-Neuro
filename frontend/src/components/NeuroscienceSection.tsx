import face1 from "../assets/face1.jpg";
import face2 from "../assets/face2.jpg";

const NeuroscienceSection = () => {
  return (
    <section className="w-full flex flex-col lg:flex-row">
      
      {/* Left Image */}
      <div className="relative w-full lg:w-1/2 h-[500px] lg:h-[600px] overflow-hidden">
        <img
          src={face1}
          alt="Face 1"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/20 p-4">
          <h2 className="text-white font-[cursive] text-xl md:text-2xl font-bold mb-1">
            Skincare reinvented through neuroscience
          </h2>
          <p className="text-white text-xs md:text-sm mb-4"
          style={{fontFamily: "ibmplexmono, Courier New, serif" }}>
            Discover a cosmetics revolution dedicated to the beauty of your skin and your wellbeing.
          </p>
          <a 
            href="#"
            className="px-4 py-2 rounded-[1rem] text-white backdrop-blur-[1.6875rem] border border-white/20 hover:bg-white/10 transition"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Right Image */}
      <div className="relative w-full lg:w-1/2 h-[500px] lg:h-[600px] overflow-hidden">
        <img
          src={face2}
          alt="Face 2"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/20 p-4">
          <h2 className="text-white font-[cursive] text-xl md:text-2xl font-bold mb-1">
            N|A3™ Technology
          </h2>
          <p className="text-white text-xs md:text-sm mb-4"
          style={{fontFamily: "ibmplexmono, Courier New, serif" }}>
            Discover the power of our proprietary technology, a breakthrough combination of neuro-ingredients, neuro-fragrances and neuro-textures.
          </p>
          <a 
            href="#"
            className="px-4 py-2 rounded-[1rem] text-white backdrop-blur-[1.6875rem] border border-white/20 hover:bg-white/10 transition"
          >
            Learn More
          </a>
        </div>
      </div>

    </section>
  );
};

export default NeuroscienceSection;
