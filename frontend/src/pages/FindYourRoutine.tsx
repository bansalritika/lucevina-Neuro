import { useState } from "react";
import Navigation from "@/components/Navigation";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import NewsletterSection from "@/components/NewsletterSection";
import { motion, AnimatePresence } from "framer-motion";
import Video from "@/assets/desktop-routine-finder.mp4";
import img1 from "@/assets/quiz1.png";
import img2 from "@/assets/quiz2.png";

const questions = [
  {
    id: 1,
    title: "1/6 · SELF REFLECTION",
    text: "How does your skin feel when you wake up?",
    options: ["Dry & tight", "Oily & shiny", "Balanced"],
    image: img1,
  },
  {
    id: 2,
    title: "2/6 · EMOTIONAL ASPIRATION",
    text: "How often do you experience breakouts?",
    options: ["Rarely", "Sometimes", "Frequently"],
    image: img2,
  },
  {
    id: 3,
    title: "3/6 · DAILY ENERGY",
    text: "What best describes your skin sensitivity?",
    options: ["Very sensitive", "Moderate", "Not sensitive"],
    image: img1,
  },
  {
    id: 4,
    title: "4/6 · STRESS RESPONSE",
    text: "How does your skin react to stress?",
    options: ["Gets dull", "Breaks out", "No change"],
    image: img2,
  },
  {
    id: 5,
    title: "5/6 · HYDRATION BALANCE",
    text: "How hydrated do you feel throughout the day?",
    options: ["Dehydrated", "Normal", "Well hydrated"],
    image: img1,
  },
  {
    id: 6,
    title: "6/6 · SKINCARE HABITS",
    text: "How often do you use skincare products?",
    options: ["Rarely", "Sometimes", "Daily"],
    image: img2,
  },
];

const FindYourRoutine = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, answer]);
    if (step <= questions.length) {
      setTimeout(() => setStep(step + 1), 400);
    }
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Split Layout */}
      <div className="flex flex-col md:flex-row h-[110vh] overflow-hidden">
        {/* Left side — Video or Image */}
        <div className="w-full md:w-1/2 h-[110vh] relative overflow-hidden border border-black/40">
          <AnimatePresence mode="wait">
            {step === 0 || step > questions.length ? (
              <motion.video
                key="video"
                className="absolute inset-0 w-full h-full object-cover brightness-75"
                src={Video}
                autoPlay
                muted
                loop
                playsInline
                exit={{ opacity: 0 }}
              />
            ) : (
              <motion.img
                key={questions[step - 1]?.id}
                src={questions[step - 1]?.image}
                alt="Question background"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Right side — Text + Quiz */}
        <div className="w-full md:w-1/2 h-[110vh] flex flex-col justify-center items-center bg-[#b37c53] text-white p-8 md:p-16">
          <div className="max-w-md text-center md:text-left space-y-6">
            {/* Step 0 - Start screen */}
            {step === 0 ? (
              <>
                <p className="uppercase text-xs tracking-[0.2em] text-white/80">
                  Diagnosis
                </p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-xl md:text-2xl leading-relaxed font-light italic"
                >
                  Discover your ideal{" "}
                  <span className="font-semibold">LUCEVINA</span> skincare routine
                  by identifying the emotions that affect your skin.
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex justify-center md:justify-start"
                >
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-full bg-white/20 hover:bg-white/30 text-white px-10 py-4 text-sm tracking-widest font-medium transition backdrop-blur"
                  >
                    TAKE THE TEST
                  </button>
                </motion.div>
              </>
            ) : step <= questions.length ? (
              // Question screens
              <AnimatePresence mode="wait">
                <motion.div
                  key={questions[step - 1]?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >
                  <p className="uppercase text-center text-sm tracking-widest text-white/90 border-b border-white/30 pb-2">
                    {questions[step - 1].title}
                  </p>
                  <h3 className="text-lg md:text-xl font-light italic text-center md:text-left">
                    {questions[step - 1].text}
                  </h3>
                  <div className="space-y-3">
                    {questions[step - 1].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="block w-full rounded-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 text-sm tracking-widest font-medium transition backdrop-blur"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              // Thank-you screen
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-6"
              >
                <h3 className="text-2xl font-semibold italic">
                  Thank you! 🎉
                </h3>
                <p className="text-white/80">
                  Based on your answers, we’ll craft your personalized skincare
                  routine soon.
                </p>
                <button
                  onClick={restart}
                  className="rounded-full bg-white/20 hover:bg-white/30 text-white px-10 py-4 text-sm tracking-widest font-medium transition backdrop-blur"
                >
                  RESTART TEST
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
};

export default FindYourRoutine;
