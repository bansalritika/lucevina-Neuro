import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const stores = [
  {
    id: 1,
    name: "Nordstrom PARK MEADOWS",
    address: "8465 Park Meadows Center Dr Colorado",
    city: "CO 80124 Lone Tree",
    lat: 39.5617,
    lng: -104.8767,
  },
  {
    id: 2,
    name: "Neiman Marcus WILLOWBEND",
    address: "2201 Dallas Pkwy Texas",
    city: "TX 75093 Plano",
    lat: 33.0198,
    lng: -96.8297,
  },
  {
    id: 3,
    name: "Nordstrom DOWNTOWN SEATTLE",
    address: "500 Pine Street",
    city: "WA 98101 Seattle",
    lat: 47.6101,
    lng: -122.3352,
  },
  {
    id: 4,
    name: "Neiman Marcus BEVERLY HILLS",
    address: "9700 Wilshire Boulevard",
    city: "CA 90212 Beverly Hills",
    lat: 34.0667,
    lng: -118.3975,
  },
];

const FindUs = () => {
  const [searchAddress, setSearchAddress] = useState("");
  const [filteredStores, setFilteredStores] = useState(stores);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    // Load Google Maps script dynamically
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY_HERE`;
    script.async = true;
    script.defer = true;
    script.onload = () => initMap();
    document.body.appendChild(script);

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
    };
  }, []);

  const createCustomMarkerIcon = (label: string) => {
    // SVG circle with text
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" fill="#000" stroke="#fff" stroke-width="3"/>
        <text x="20" y="25" text-anchor="middle" fill="#fff" font-size="16" font-family="Arial" font-weight="700">${label}</text>
      </svg>`;
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 20),
    };
  };

  const initMap = () => {
    if (!mapRef.current) return;

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
      zoom: 4,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    // Add markers for all stores
    stores.forEach((store) => {
      const marker = new google.maps.Marker({
        position: { lat: store.lat, lng: store.lng },
        map: mapInstance.current!,
        icon: createCustomMarkerIcon(store.id.toString()),
        title: store.name,
      });
      markersRef.current.push(marker);
    });
  };

  const handleSearch = () => {
    if (!searchAddress.trim()) {
      setFilteredStores(stores);
      return;
    }

    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchAddress.toLowerCase()) ||
        store.address.toLowerCase().includes(searchAddress.toLowerCase()) ||
        store.city.toLowerCase().includes(searchAddress.toLowerCase())
    );
    setFilteredStores(filtered);

    // Zoom map to first result if available
    if (filtered.length > 0 && mapInstance.current) {
      const firstStore = filtered[0];
      mapInstance.current.setCenter({ lat: firstStore.lat, lng: firstStore.lng });
      mapInstance.current.setZoom(8);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Left Panel - Store Search */}
        <div className="lg:w-2/5 w-full p-8 lg:p-12 flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-light tracking-wider mb-8">
            Store locator
          </h1>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Your address *
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter a location"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pr-10"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium tracking-wider"
            >
              SEARCH
            </Button>
          </div>

          {/* Search Results */}
          <div className="flex-1 flex flex-col min-h-0">
            <h2 className="text-xl font-light tracking-wider mb-6">
              Your search
            </h2>

            <div className="space-y-6 overflow-y-auto pr-2">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="border-b border-border pb-6 last:border-0"
                >
                  <h3 className="font-medium mb-2">
                    {store.id} - {store.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {store.address}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {store.city}
                  </p>
                  <button
                    className="text-sm underline hover:no-underline"
                    onClick={() => {
                      if (mapInstance.current) {
                        mapInstance.current.setCenter({
                          lat: store.lat,
                          lng: store.lng,
                        });
                        mapInstance.current.setZoom(10);
                      }
                    }}
                  >
                    See the store &gt;
                  </button>
                </div>
              ))}

              {filteredStores.length === 0 && (
                <p className="text-muted-foreground">
                  No stores found. Try a different search.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Google Map */}
        <div className="lg:w-3/5 w-full h-64 lg:h-full relative">
          <div ref={mapRef} className="absolute inset-0" />

          {/* API Key Notice */}
          <div className="absolute top-4 left-4 right-4 glass-morphism p-4 rounded-lg bg-white/80 backdrop-blur">
            <p className="text-xs text-muted-foreground">
              To enable the interactive map, please add your Google Maps API key in the script URL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindUs;
