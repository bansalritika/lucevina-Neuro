import harmonieImg from "../assets/showcase1.png";
import energieImg from "../assets/showcase2.png";
import joieImg from "../assets/showcase1.png";
import sereniteImg from "../assets/showcase2.png";

const CollectionsSection = () => {
  const collections = [
    {
      name: "harmonie",
      title: "A reset for your skin & well-being",
      collectionLink: "/harmonie",
      image: harmonieImg
    },
    {
      name: "énergie",
      title: "A wakeup call for your tired skin & well-being",
      collectionLink: "/energie",
      image: energieImg
    },
    {
      name: "joie",
      title: "A feeling of joy for your skin & well-being",
      collectionLink: "/joie",
      image: joieImg
    },
    {
      name: "sérénité",
      title: "A veil of serenity for your skin & well-being",
      collectionLink: "/serenite",
      image: sereniteImg
    }
  ];

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
        {collections.map((collection, index) => (
          <div key={index} className="group cursor-pointer text-center">
            <div className="aspect-[4/5] rounded-lg overflow-hidden mb-4">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-center">
              <p className="font-[cursive] text-sm mb-2">
                {collection.title}
              </p>
              <a 
                href={collection.collectionLink} 
                className="text-sm font-medium tracking-wide underline hover:no-underline"
              >
                {collection.name} collection ;
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionsSection;
