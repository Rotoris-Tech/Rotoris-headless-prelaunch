export interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  overview: string;
  features: string[];
  specifications: string;
  category: string;
  icon: string;
}

export const productsData: Record<string, Product> = {
  arvion: {
    id: "arvion",
    name: "Arvion",
    title: "Discover Excellence",
    description: "Hero reveal and cinematic introduction to premium craftsmanship.",
    overview:
      "Arvion represents the pinnacle of innovation and design. A masterpiece that combines cutting-edge technology with timeless elegance, crafted for those who demand nothing but the best.",
    features: [
      "Premium materials sourced from sustainable origins",
      "Handcrafted with precision and attention to detail",
      "Advanced engineering for superior performance",
      "Limited edition with exclusive design elements",
    ],
    specifications:
      "Built with aerospace-grade materials and featuring state-of-the-art technology. Each Arvion unit is individually numbered and comes with a certificate of authenticity.",
    category: "Discover",
    icon: "✨",
  },
  astonia: {
    id: "astonia",
    name: "Astonia",
    title: "Sustainable Innovation",
    description: "Eco-materials, responsible production, and innovative green technology.",
    overview:
      "Astonia embodies our commitment to sustainability without compromising on quality. Every aspect of Astonia is designed with the environment in mind, from material selection to production processes.",
    features: [
      "100% recycled and recyclable materials",
      "Carbon-neutral manufacturing process",
      "Biodegradable packaging solutions",
      "Partnership with environmental conservation initiatives",
    ],
    specifications:
      "Certified eco-friendly materials with zero-waste production. Energy-efficient design that reduces environmental impact by 60% compared to traditional manufacturing.",
    category: "Sustainability",
    icon: "🌿",
  },
  auriqua: {
    id: "auriqua",
    name: "Auriqua",
    title: "Technological Precision",
    description: "Macro transitions highlighting technical precision and engineering excellence.",
    overview:
      "Auriqua showcases the future of technology. Incorporating advanced engineering and cutting-edge innovation, it represents the perfect marriage of form and function.",
    features: [
      "AI-powered intelligent systems",
      "3D modeling and motion-capture integration",
      "Advanced sensor technology for precision",
      "Real-time data processing capabilities",
    ],
    specifications:
      "Equipped with next-generation processors and smart sensors. Features include automated calibration, predictive maintenance alerts, and seamless connectivity.",
    category: "Technology",
    icon: "⚙️",
  },
  manifesta: {
    id: "manifesta",
    name: "Manifesta",
    title: "Artisan Craftsmanship",
    description: "Showcasing artisan details and handcrafted perfection.",
    overview:
      "Manifesta celebrates the art of traditional craftsmanship. Each piece is meticulously handcrafted by master artisans, ensuring unparalleled quality and uniqueness.",
    features: [
      "Hand-finished by expert craftspeople",
      "Heritage techniques passed through generations",
      "Premium material selection and curation",
      "Individually inspected for perfection",
    ],
    specifications:
      "Created using time-honored techniques combined with modern quality standards. Each unit requires over 100 hours of skilled labor to complete.",
    category: "Craftsmanship",
    icon: "🏆",
  },
  monarch: {
    id: "monarch",
    name: "Monarch",
    title: "Driven by Passion",
    description: "Emotion-driven segment exploring purpose, vision, and brand personality.",
    overview:
      "Monarch represents the culmination of our vision and passion. It's more than a product—it's a statement of purpose and a testament to what's possible when creativity meets dedication.",
    features: [
      "Inspired by our founding vision and philosophy",
      "Behind-the-scenes craftsmanship stories",
      "Limited edition collector's series",
      "Exclusive brand personality elements",
    ],
    specifications:
      "The flagship product that embodies our brand essence. Features exclusive design elements and comes with a complete brand story documentation.",
    category: "Passion",
    icon: "🔥",
  },
};

// Scene to product mapping
export const sceneProductMap: Record<number, string> = {
  1: "auriqua",   // DISCOVER → Auriqua (Technology)
  2: "monarch",   // SUSTAINABILITY → Monarch (Passion)
  3: "astonia",   // TECHNOLOGY → Astonia (Sustainability)
};
