import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Instagram, Music } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border text-sm">
      {/* --- Top Section: Newsletter + Customer Service --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-border">
        {/* Left: Newsletter */}
        <div style={{fontFamily: "ibmplexmono, Courier New, serif" }}>
          <h2 className="uppercase text-sm font-medium tracking-widest mb-4">
            LET’S KEEP IN TOUCH
          </h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter and discover new ways to prioritize your overall well-being
          </p>

          <form className="space-y-4">
            <Input
              type="email"
              placeholder="Email*"
              className="rounded-none border border-border py-5 px-4 text-sm focus-visible:ring-0 focus-visible:border-black"
              required
            />
            <Button
              type="submit"
              className="rounded-none bg-white text-black hover:text hover:bg-black/80 px-8 py-5 text-sm font-medium tracking-wide"
            >
              SUBSCRIBE
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4" >
            For more information on our personal data protection policy,{" "}
            <a href="#" className="underline hover:no-underline">
              click here.
            </a>
          </p>
        </div>

        {/* Right: Customer Service */}
        <div style={{fontFamily: "ibmplexmono, Courier New, serif" }}>
          <h3 className="uppercase text-sm font-medium tracking-widest mb-4">
            CUSTOMER SERVICE
          </h3>
          <p className="text-muted-foreground mb-2">
            Need personalized advice or product information? Our beauty advisers are on-hand at
          </p>
          <p className="text-muted-foreground font-mono mb-2">
            customercareus@lucevina.com
          </p>
          <p className="text-muted-foreground mb-6">
            to help you from Monday to Friday from 8 am to 12 pm.
          </p>
          <Link to="/findus" className="underline text-foreground text-sm hover:no-underline">
            Find us &gt;
          </Link>
        </div>
      </div>

      {/* --- Middle Section: Country + Help/Services/Enterprise --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-border">
        {/* Country & Description */}
        <div>
          <h4 className="uppercase text-sm font-medium tracking-widest mb-4">COUNTRY</h4>
          <div className="relative inline-block mb-4">
            <select
              className="appearance-none border border-border py-3 pl-4 pr-8 text-sm focus:outline-none bg-transparent"
              defaultValue="United States"
            >
              <option className="text-black">United States</option>
              <option className="text-black">France</option>
              <option className="text-black">United Kingdom</option>
            </select>
            <Globe className="absolute right-2 top-3 w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Instagram className="w-5 h-5 cursor-pointer hover:text-black" />
            <Music className="w-5 h-5 cursor-pointer hover:text-black" />
          </div>

          <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
            Inspired by neuroscience, LUCEVINA is a new skincare brand based on the connection
            between the skin and emotions. Neuraé aims to reduce the emotional toll of time on our
            facial features by finding effective solutions to visibly target dull, tired, or tense
            skin.
          </p>
        </div>

        {/* Need Help */}
        <div>
          <h4 className="uppercase text-sm font-medium tracking-widest mb-4">NEED HELP?</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>FREQUENTLY ASKED QUESTIONS</li>
            <li>FORGOT PASSWORD</li>
            <li>CONTACT US</li>
            <li>SITE MAP</li>
            <li>FIND US</li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h4 className="uppercase text-sm font-medium tracking-widest mb-4">OUR SERVICES</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>ROUTINE FINDER</li>
            <li>VIRTUAL CONSULTATIONS</li>
            <li>EMOTION XPLORER</li>
          </ul>
        </div>

        {/* Entreprise */}
        <div>
          <h4 className="uppercase text-sm font-medium tracking-widest mb-4">ENTREPRISE</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>NEUROSCIENCE</li>
            <li>WE ARE NEURAÉ</li>
            <li>NEURAÉ IN THE MEDIA</li>
          </ul>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-center items-center gap-3 text-xs text-muted-foreground">
        <a href="#" className="hover:underline">
          Purchase Policy
        </a>
        <span>·</span>
        <a href="#" className="hover:underline">
          Terms of Use
        </a>
        <span>·</span>
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <span>·</span>
        <a href="#" className="hover:underline">
          Accessibility
        </a>
      </div>
    </footer>
  );
};

export default Footer;
