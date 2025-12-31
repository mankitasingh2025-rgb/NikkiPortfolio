export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: number;
  client: string;
  description: string;
  challenge: string;
  solution: string;
  highlights: string[];
  images: string[];
  services: string[];
  tags: string[];
}

export const projects: Record<string, Project> = {
  "modular-kitchen-series": {
    id: "modular-kitchen-series",
    title: "Modular Kitchen Series",
    category: "Interior Design",
    location: "New Delhi, India",
    year: 2024,
    client: "Premium Homes Solutions",
    description: "Efficient and stylish modular kitchen designs focused on ergonomic space utilization and modern finishes. This comprehensive project involved designing multiple kitchen configurations for residential apartments, ensuring maximum functionality without compromising on aesthetics.",
    challenge: "The main challenge was to optimize space in compact urban apartments while providing luxury finishes and smart storage solutions.",
    solution: "We developed a modular system that could be customized for different apartment sizes, incorporating premium materials, innovative storage, and ergonomic work zones.",
    highlights: [
      "3D visualization and floor plans",
      "Premium Italian fixtures and finishes",
      "Smart storage optimization",
      "Eco-friendly materials used",
      "Custom cabinetry design"
    ],
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&random=1",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&random=2"
    ],
    services: ["3D Design", "Space Planning", "Material Selection", "Project Management"],
    tags: ["Modular Design", "3ds Max", "Space Planning"]
  },
  "residential-planning": {
    id: "residential-planning",
    title: "Residential Planning",
    category: "Architectural Design",
    location: "Mumbai, India",
    year: 2023,
    client: "Urban Living Developers",
    description: "Complete house architectural layouts and interior detailing for modern urban living. This project encompasses comprehensive floor plans, 3D visualizations, and detailed specifications for a 3-bedroom residential apartment.",
    challenge: "Creating an open-plan layout that maximizes natural light while maintaining privacy zones.",
    solution: "Strategic placement of load-bearing walls, large windows, and thoughtful zoning created the perfect balance between openness and privacy.",
    highlights: [
      "Open-plan living areas",
      "Natural light optimization",
      "Functional zoning",
      "Detailed specifications",
      "AutoCAD drafting"
    ],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&random=1",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&random=2"
    ],
    services: ["Floor Planning", "3D Visualization", "Architectural Drafting", "Interior Design"],
    tags: ["AutoCAD", "SketchUp", "Architectural Drafting"]
  },
  "office-workspace-design": {
    id: "office-workspace-design",
    title: "Office Workspace Design",
    category: "Commercial Design",
    location: "Bangalore, India",
    year: 2024,
    client: "Tech Startup Co.",
    description: "Modern corporate office interiors with focus on employee productivity, ergonomics, and collaborative spaces. This 5000 sq ft office space includes open work areas, private meeting rooms, breakout zones, and executive offices.",
    challenge: "Designing an office that fosters collaboration while providing focused work areas for concentration.",
    solution: "Created a balanced design with activity-based zones, soundproofing, flexible furniture, and inspiring communal spaces.",
    highlights: [
      "Activity-based working zones",
      "Ergonomic furniture",
      "Collaborative spaces",
      "Acoustic treatment",
      "Green elements integration"
    ],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&random=1",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&random=2"
    ],
    services: ["Space Planning", "Furniture Selection", "Color Consultation", "Lighting Design"],
    tags: ["Office Design", "V-Ray", "3D Rendering"]
  },
  "luxury-wardrobe-solutions": {
    id: "luxury-wardrobe-solutions",
    title: "Luxury Wardrobe Solutions",
    category: "Interior Design",
    location: "Gurgaon, India",
    year: 2023,
    client: "Luxury Homes Ltd.",
    description: "Custom wardrobe designs with intelligent storage solutions, combining aesthetics with maximum functionality. Featuring premium materials, custom hardware, and innovative organization systems.",
    challenge: "Maximizing storage while maintaining luxury aesthetics and minimizing visual clutter.",
    solution: "Designed custom built-in wardrobes with hidden storage, custom lighting, and premium finishes.",
    highlights: [
      "Custom cabinetry",
      "Integrated lighting",
      "Luxury finishes",
      "Smart organization",
      "3D rendering"
    ],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&random=1",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&random=2"
    ],
    services: ["Wardrobe Design", "Storage Planning", "Hardware Selection", "Installation Supervision"],
    tags: ["Wardrobe Design", "Storage Planning", "Interior Detailing"]
  }
};
