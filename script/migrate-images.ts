import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "../shared/schema.js";

// Run migration to add new tables
const sqlite = new Database('./portfolio.db');
const db = drizzle(sqlite, { schema });

async function runMigration() {
  console.log("🔄 Running database migration...");
  
  try {
    // This will create the new project_images table
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migration completed successfully!");
    
    // Migrate existing images from projects to project_images table
    console.log("🔄 Migrating existing project images...");
    
    const projects = await db.select().from(schema.projects);
    
    for (const project of projects) {
      if (project.imageUrl) {
        await db.insert(schema.projectImages).values({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          projectId: project.id,
          imageUrl: project.imageUrl,
          imageData: null, // We'll keep imageData in projects for now
          caption: `${project.title} - Main Image`,
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log(`✅ Migrated image for project: ${project.title}`);
      }
    }
    
    console.log("✅ All images migrated successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    sqlite.close();
  }
}

runMigration();
