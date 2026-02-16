import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import routineBg from "../assets/routine.jpeg"; // replace with your image path

const RoutineFinderSection = () => {
  return (
    <section className="relative w-full h-[500px] lg:h-[600px]">
      {/* Background Image */}
      <img
        src={routineBg}
        alt="Routine Finder Background"
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-center px-4">
        <h2 
          className="text-white italic text-3xl md:text-5xl mb-4"
          style={{ fontFamily: "sortsmillgoudy, Times New Roman, serif" }}
        >
          Your routine finder
        </h2>
        <p className="text-white text-base md:text-lg mb-4"
        style={{fontFamily: "ibmplexmono, Courier New, serif" }}
        >
          The beauty of our skin also depends on our emotional state.
        </p>
        <p className="text-white text-base md:text-lg mb-8"
        style={{fontFamily: "ibmplexmono, Courier New, serif" }}>
          Take our test to get our personalized recommendations.
        </p>
        <Link
          to="/routine"
          className="px-8 py-2 rounded-[1.5rem] text-white backdrop-blur-[1.6875rem] bg-white/10 border border-white/20 hover:bg-white/20 transition"
        >
          START
        </Link>
      </div>
    </section>
  );
};

export default RoutineFinderSection;
