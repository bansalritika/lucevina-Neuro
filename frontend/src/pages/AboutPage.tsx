import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import { useRef } from "react";
import Video from "@/assets/desktop-routine-finder.mp4";
import img1 from "@/assets/quiz1.png";
import logoblack from "../assets/logoblack.png";

const AboutPage = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Each text line appears at a different scroll range
  const line1Opacity = useTransform(smoothProgress, [0.05, 0.55], [1, 0]);
  const line2Opacity = useTransform(smoothProgress, [0.5, 0.75], [0, 1]);

  const line1Y = useTransform(scrollYProgress, [0.05, 0.45], [40, 0]);
  const line2Y = useTransform(scrollYProgress, [0.55, 0.85], [40, 0]);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* ===== HERO VIDEO SECTION ===== */}
      <div className="relative w-full h-[100vh] overflow-hidden top-[-64px]">
        <motion.video
          key="hero-video"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          src={Video}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white bg-black/30 backdrop-blur-[1px]">
          <h2 className="text-3xl md:text-4xl font-thin italic mb-2 tracking-wide">
            We are ...<br />
            on the dawn of<br />
            a new beauty vision.
          </h2>
        </div>
      </div>

      {/* ===== IMAGE + TEXT GRID ===== */}
      <div className="container mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:mx-10 lg:mx-30 xl:mx-40">
          <div className="flex flex-col items-center">
            <motion.div
              className="relative w-full h-[75vh] overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src={img1}
                alt="Emotional Impact"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
            <div className="mt-6 w-full">
              <h3 className="text-lg font-semibold mb-2">
                Our reactions to emotions shape our face
              </h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Recurring emotions influence our facial expressions and overall harmony.
                Our skin — the most visible expression of our being — reflects these internal changes.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center mt-0 md:mt-24">
            <motion.div
              className="relative w-full h-[75vh] overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <video
                key="video-right"
                src={Video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
            <div className="mt-6 w-full">
              <h3 className="text-lg font-semibold mb-2">
                Our emotions form an intrinsic link between our skin and brain
              </h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                This discovery offers a new approach to beauty — blending emotional well-being with skincare science.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STICKY SCROLL VIDEO SECTION ===== */}
      <section ref={sectionRef} className="relative w-full h-[200vh]">
        {/* Sticky video container */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <video
            src={Video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover brightness-75"
          />
          <div className="absolute bottom-0 left-0 w-full h-10 bg-background rounded-t-[100%]"></div>

          {/* Text Lines Appear Sequentially */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black/20 backdrop-blur-[1px] text-center">
            <motion.h5
              style={{ opacity: line1Opacity, y: line1Y }}
              className="absolute text-sm font-thin italic tracking-wide leading-relaxed"
            >
                <div className="flex justify-center mb-8">
            <img src={logoblack} alt="Lucevina Logo" className="w-auto h-32 tracking-[0.2em]"/>
          </div>
              <b>NEUR: from the greek neuron, "sinew, cord, nerve"</b><br/>
              As a reference to neuroscience.<br/>
              AÉ: for "Activated by Emotions".
            </motion.h5>

            <motion.h2
              style={{ opacity: line2Opacity, y: line2Y }}
              className="text-3xl md:text-4xl font-thin italic tracking-wide"
            >
              RESULTS YOU CAN SEE AND FEEL
              <p className="text-sm mt-2">The science of emotions is channelled into beautifying the skin over time.</p>
            </motion.h2>
          </div>
        </div>
      </section>
    
    <section className=" mx-auto py-20 max-w-4xl space-y-6">
    <div className="text-center text-4xl font-thin mt-10 tracking-widest">How to respond to the effects of tiredness, sadness and stress on the skin?</div>
    
    <p className="text-sm text-center px-40 leading-relaxed tracking-widest">
        Our Research Laboratories have targeted three emotional typologies: <b>tiredness, sadness and stress.</b></p>
        <p className="text-sm text-center px-40 leading-relaxed tracking-widest">
        With LUCEVINA we have created a <b>pioneering solution</b> to help <b>dull, tired or stressed skin regain optimum condition</b> while reharmonising your facial features.
        </p>
    </section>

      {/* ===== FOOTER ===== */}
      <NewsletterSection />
    </div>
  );
};

export default AboutPage;
