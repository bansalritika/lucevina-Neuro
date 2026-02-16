import Navigation from "@/components/Navigation";

const stores = [
  {
    id: 1,
    name: "Lucevina cosmetic pvt ltd",
    address:
      "SCO 15A EMPORIOR ENCLAVE, Near Sec-30 Market Umri Road, Kurukshetra",
    city: "Thanesar, Kurukshetra- 136118, Haryana",
    directionsLink:
      "https://maps.app.goo.gl/8YkyHZzLu1LQRBmV7",
  },
];

const FindUs = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        
        {/* Left Panel - Store Info */}
        <div className="lg:w-2/5 w-full p-8 lg:p-12 flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-light tracking-wider mb-8">
            Store Location
          </h1>

          <div className="space-y-6 overflow-y-auto pr-2">
            {stores.map((store) => (
              <div
                key={store.id}
                className="border-b border-border pb-6 last:border-0"
              >
                <h3 className="font-medium mb-2 text-lg">
                  {store.id} - {store.name}
                </h3>

                <p className="text-sm text-muted-foreground mb-1">
                  {store.address}
                </p>

                <p className="text-sm text-muted-foreground mb-4">
                  {store.city}
                </p>

                <a
                  href={store.directionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline hover:no-underline"
                >
                  Get Directions →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Embedded Google Map */}
        <div className="lg:w-3/5 w-full h-64 lg:h-full relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8654.72706949461!2d76.88506690323126!3d29.952139347985536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e4141fee62c59%3A0xf0f554d5ffcabe46!2sLucevina%20cosmetic%20pvt%20ltd!5e0!3m2!1sen!2sin!4v1771246742390!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lucevina Cosmetic Location"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default FindUs;
