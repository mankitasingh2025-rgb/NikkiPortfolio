import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../shared/schema";

const sqlite = new Database("./portfolio.db");
const db = drizzle(sqlite, { schema });

async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Seed skills
    console.log("📚 Seeding skills...");
    await db.insert(schema.skills).values({
      id: "skill-1",
      title: "Interior Design",
      description: "Modular kitchens, wardrobes, and office furniture with focus on aesthetics and functionality.",
      icon: "Palette",
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.insert(schema.skills).values({
      id: "skill-2",
      title: "Space Planning",
      description: "Architectural drafting and layout planning using AutoCAD, SketchUp, and modern design principles.",
      icon: "Code2",
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.insert(schema.skills).values({
      id: "skill-3",
      title: "3D Visualization",
      description: "Photorealistic renders using 3ds Max, SketchUp, and V-Ray for presentations.",
      icon: "Sparkles",
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Seed experiences
    console.log("💼 Seeding experiences...");
    await db.insert(schema.experiences).values({
      id: "exp-1",
      company: "Sogno Office Furniture",
      role: "Interior Designer",
      period: "Apr 2023 - June 2025",
      description: "Handled 45+ residential and office projects, focusing on modular designs and space planning.",
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.insert(schema.experiences).values({
      id: "exp-2",
      company: "Creator's Group Infra.",
      role: "Associate Architect",
      period: "Jan 2022 - Mar 2023",
      description: "Planned house layouts and designed modular interiors for 25+ residential projects.",
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.insert(schema.experiences).values({
      id: "exp-3",
      company: "Malla Consulting",
      role: "Assistant Architect",
      period: "Feb 2021 - Dec 2021",
      description: "Modified architectural plans for 100+ project files of IOCL across rural and urban sites.",
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Seed projects
    console.log("🎨 Seeding projects...");
    await db.insert(schema.projects).values({
      id: "project-1",
      title: "Modular Kitchen Series",
      description: "Efficient and stylish modular kitchen designs focused on ergonomic space utilization and modern finishes.",
      tags: JSON.stringify(["Modular Design", "3ds Max", "Space Planning"]),
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      featured: 1,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.insert(schema.projects).values({
      id: "project-2",
      title: "Residential Planning",
      description: "Complete house architectural layouts and interior detailing for modern urban living.",
      tags: JSON.stringify(["AutoCAD", "SketchUp", "Architectural Drafting"]),
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      featured: 1,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.insert(schema.projects).values({
      id: "project-3",
      title: "Office Workspace Design",
      description: "Modern corporate office interiors with focus on employee productivity, ergonomics, and collaborative spaces.",
      tags: JSON.stringify(["Office Design", "V-Ray", "3D Rendering"]),
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c",
      featured: 1,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.insert(schema.projects).values({
      id: "project-4",
      title: "Luxury Wardrobe Solutions",
      description: "Custom wardrobe designs with intelligent storage solutions, combining aesthetics with maximum functionality.",
      tags: JSON.stringify(["Wardrobe Design", "Storage Planning", "Interior Detailing"]),
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      featured: 1,
      order: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Seed profile
    console.log("👤 Seeding profile...");
    await db.insert(schema.profile).values({
      id: "profile-1",
      name: "Nikita Singh",
      title: "Interior Designer",
      bio: "Dynamic Executive Architect & Interior Designer with 4+ years of experience in modular design, space planning, and creating smart, efficient living spaces.",
      email: "iamnikita2911@gmail.com",
      phone: "+91 98765 43210",
      location: "New Delhi, India",
      linkedinUrl: "https://linkedin.com/in/nikita-singh",
      twitterUrl: "https://twitter.com/nikita_singh",
      instagramUrl: "https://instagram.com/nikita_singh",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase().then(() => {
  console.log("🎉 Seeding complete!");
  process.exit(0);
});