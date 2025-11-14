export type SceneProduct = {
  id: number;
  timestamp: number;
  label: string;
  productSlug: string;
  product: {
    name: string;
    tagline: string;
    description: string;
    features: string[];
    image?: string;
    backgroundColor: string;
    accentColor: string;
  };
};

export const homeScenes: SceneProduct[] = [
  {
    id: 1,
    timestamp: 0,
    label: "DISCOVER",
    productSlug: "/",
    product: {
      name: "Rotoris",
      tagline: "Discover the Art of Precision",
      description: "Welcome to Rotoris, where timeless elegance meets Swiss precision. Each timepiece in our collection represents the pinnacle of horological craftsmanship.",
      features: [
        "Heritage craftsmanship",
        "Swiss precision movements",
        "Timeless design philosophy",
      ],
      backgroundColor: "#FFF8F0",
      accentColor: "#D4A574",
    },
  },
  {
    id: 2,
    timestamp: 16,
    label: "AURIQUA",
    productSlug: "/products/auriqua",
    product: {
      name: "Auriqua",
      tagline: "Where Elegance Meets Precision",
      description: "The Auriqua collection represents the pinnacle of horological artistry. Each timepiece is meticulously crafted by master watchmakers, combining centuries-old techniques with cutting-edge innovation.",
      features: [
        "Sapphire Crystal with anti-reflective coating",
        "Swiss Automatic Movement - 42hr power reserve",
        "Italian Nappa leather strap, hand-stitched",
        "Water resistant to 50 meters",
      ],
      image: "/assets/products/auriqua/detail-shot.jpg",
      backgroundColor: "#E9F7EF",
      accentColor: "#4A9B6E",
    },
  },
  {
    id: 3,
    timestamp: 31,
    label: "MONARCH",
    productSlug: "/products/monarch",
    product: {
      name: "Monarch",
      tagline: "Command Attention, Master Time",
      description: "The Monarch collection is designed for those who lead. Bold, sophisticated, and unapologetically distinctive, each piece makes a statement of power and refinement.",
      features: [
        "316L Surgical-grade stainless steel",
        "Scratch-proof ceramic bezel with engraved markers",
        "Swiss Super-LumiNova® luminous markers",
        "Water resistant to 200 meters",
      ],
      image: "/assets/products/monarch/detail-shot.jpg",
      backgroundColor: "#EAF2FF",
      accentColor: "#3B5998",
    },
  },
  {
    id: 4,
    timestamp: 35,
    label: "EXCELLENCE",
    productSlug: "/#newsletter",
    product: {
      name: "Join Our Journey",
      tagline: "Be Part of Something Timeless",
      description: "Subscribe to our newsletter for exclusive early access to new collections, behind-the-scenes insights into our craftsmanship, and special member-only offers.",
      features: [
        "Early access to new collections",
        "Exclusive launch pricing",
        "Craftmanship insights & stories",
        "Member-only events & offers",
      ],
      backgroundColor: "#FFF7E1",
      accentColor: "#C9A961",
    },
  },
];
