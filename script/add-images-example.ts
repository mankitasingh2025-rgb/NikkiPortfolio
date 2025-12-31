import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../shared/schema.js";

const sqlite = new Database('./portfolio.db');
const db = drizzle(sqlite, { schema });

async function addMultipleImages() {
  console.log("🖼️ Adding multiple images to projects...");

  try {
    // Example: Add 7 images to Modular Kitchen (project-1)
    const kitchenImages = [
      {
        id: "img-kitchen-1",
        projectId: "project-1",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
        caption: "Modern kitchen with island and cabinets",
        order: 0
      },
      {
        id: "img-kitchen-2", 
        projectId: "project-1",
        imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c8b5c9c?w=1200&q=80",
        caption: "Kitchen cabinet details and finishes",
        order: 1
      },
      {
        id: "img-kitchen-3",
        projectId: "project-1", 
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80&random=1",
        caption: "Kitchen island with seating area",
        order: 2
      },
      {
        id: "img-kitchen-4",
        projectId: "project-1",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80&random=2",
        caption: "Upper cabinets and lighting design",
        order: 3
      },
      {
        id: "img-kitchen-5",
        projectId: "project-1",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80&random=3",
        caption: "Appliance integration and storage",
        order: 4
      },
      {
        id: "img-kitchen-6",
        projectId: "project-1",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80&random=4",
        caption: "Countertop and backsplash details",
        order: 5
      },
      {
        id: "img-kitchen-7",
        projectId: "project-1",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80&random=5",
        caption: "Overall kitchen view with natural lighting",
        order: 6
      }
    ];

    // Insert all kitchen images
    for (const image of kitchenImages) {
      await db.insert(schema.projectImages).values({
        ...image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Added image: ${image.caption}`);
    }

    // Example: Add 6 images to Residential Planning (project-2)
    const residentialImages = [
      {
        id: "img-residential-1",
        projectId: "project-2",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
        caption: "Living room with open floor plan",
        order: 0
      },
      {
        id: "img-residential-2",
        projectId: "project-2", 
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&random=1",
        caption: "Dining area and kitchen connection",
        order: 1
      },
      {
        id: "img-residential-3",
        projectId: "project-2",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&random=2",
        caption: "Master bedroom with natural light",
        order: 2
      },
      {
        id: "img-residential-4",
        projectId: "project-2",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&random=3",
        caption: "Bathroom design and fixtures",
        order: 3
      },
      {
        id: "img-residential-5",
        projectId: "project-2",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&random=4",
        caption: "Exterior facade and entrance",
        order: 4
      },
      {
        id: "img-residential-6",
        projectId: "project-2",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&random=5",
        caption: "Floor plan and layout overview",
        order: 5
      }
    ];

    // Insert all residential images
    for (const image of residentialImages) {
      await db.insert(schema.projectImages).values({
        ...image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Added image: ${image.caption}`);
    }

    console.log("🎉 All images added successfully!");
    console.log("📊 Total images added:", kitchenImages.length + residentialImages.length);

  } catch (error) {
    console.error("❌ Error adding images:", error);
  } finally {
    sqlite.close();
  }
}

addMultipleImages();
