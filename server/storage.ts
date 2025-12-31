import { type User, type InsertUser, type Skill, type InsertSkill, type Experience, type InsertExperience, type Project, type InsertProject, type Profile, type InsertProfile, type ProjectImage, type InsertProjectImage } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { sql } from "drizzle-orm";
import * as schema from "../shared/schema.js";

// SQLite database connection
const dbPath = './portfolio.db';
const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Portfolio methods
  getSkills(): Promise<Skill[]>;
  getExperiences(): Promise<Experience[]>;
  getProjects(): Promise<(Project & { images: ProjectImage[] })[]>;
  getProjectsWithImages(): Promise<(Project & { images: ProjectImage[] })[]>;
  getProjectById(id: string): Promise<(Project & { images: ProjectImage[] }) | undefined>;
  getProfile(): Promise<Profile | undefined>;

  // Insert methods for seeding
  createSkill(skill: InsertSkill): Promise<Skill>;
  createExperience(exp: InsertExperience): Promise<Experience>;
  createProject(project: InsertProject): Promise<Project>;
  createProjectImage(image: InsertProjectImage): Promise<ProjectImage>;
  createProfile(profile: InsertProfile): Promise<Profile>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private skills: Map<string, Skill>;
  private experiences: Map<string, Experience>;
  private projects: Map<string, Project>;
  private projectImages: Map<string, ProjectImage>;
  private profileData: Profile | undefined;

  constructor() {
    this.users = new Map();
    this.skills = new Map();
    this.experiences = new Map();
    this.projects = new Map();
    this.projectImages = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Portfolio methods
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values()).sort((a, b) => a.order - b.order);
  }

  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values()).sort((a, b) => a.order - b.order);
  }

  async getProjects(): Promise<(Project & { images: ProjectImage[] })[]> {
    const projects = Array.from(this.projects.values()).sort((a, b) => a.order - b.order);
    return projects.map(project => ({
      ...project,
      images: Array.from(this.projectImages.values())
        .filter(img => img.projectId === project.id)
        .sort((a, b) => (a.imageOrder || 0) - (b.imageOrder || 0))
    }));
  }

  async getProjectsWithImages(): Promise<(Project & { images: ProjectImage[] })[]> {
    return this.getProjects();
  }

  async getProjectById(id: string): Promise<(Project & { images: ProjectImage[] }) | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const images = Array.from(this.projectImages.values())
      .filter(img => img.projectId === id)
      .sort((a, b) => (a.imageOrder || 0) - (b.imageOrder || 0));
    
    return { ...project, images };
  }

  async getProfile(): Promise<Profile | undefined> {
    return this.profileData;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = randomUUID();
    const newSkill: Skill = {
      ...skill,
      id,
      order: skill.order ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.skills.set(id, newSkill);
    return newSkill;
  }

  async createExperience(exp: InsertExperience): Promise<Experience> {
    const id = randomUUID();
    const newExp: Experience = {
      ...exp,
      id,
      order: exp.order ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.experiences.set(id, newExp);
    return newExp;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = randomUUID();
    const newProject: Project = {
      ...project,
      id,
      order: project.order ?? 0,
      client: project.client ?? null,
      location: project.location ?? null,
      tags: project.tags ?? null,
      featured: project.featured ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async createProjectImage(image: InsertProjectImage): Promise<ProjectImage> {
    const id = randomUUID();
    const newImage: ProjectImage = {
      ...image,
      id,
      imageUrl: image.imageUrl ?? null,
      imageData: image.imageData ?? null,
      caption: image.caption ?? null,
      imageOrder: image.imageOrder ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.projectImages.set(id, newImage);
    return newImage;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const newProfile: Profile = {
      ...profile,
      id,
      avatarUrl: profile.avatarUrl ?? null,
      avatarData: profile.avatarData ?? null,
      phone: profile.phone ?? null,
      location: profile.location ?? null,
      linkedinUrl: profile.linkedinUrl ?? null,
      twitterUrl: profile.twitterUrl ?? null,
      instagramUrl: profile.instagramUrl ?? null,
      resumeUrl: profile.resumeUrl ?? null,
      resumeData: profile.resumeData ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.profileData = newProfile;
    return newProfile;
  }
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(sql`${schema.users.id} = ${id}`);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(sql`${schema.users.username} = ${username}`);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const result = await db.insert(schema.users).values({
      ...user,
      id,
    }).returning();
    return result[0];
  }

  // Portfolio methods
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(schema.skills).orderBy(schema.skills.order);
  }

  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(schema.experiences).orderBy(schema.experiences.order);
  }

  async getProjects(): Promise<(Project & { images: ProjectImage[] })[]> {
    const projects = await db.select().from(schema.projects).orderBy(schema.projects.order);
    
    // Get all images for all projects
    const allImages = await db.select().from(schema.projectImages).orderBy(schema.projectImages.imageOrder);
    
    // Group images by projectId
    const imagesByProject = allImages.reduce((acc, img) => {
      if (!acc[img.projectId]) acc[img.projectId] = [];
      acc[img.projectId].push(img);
      return acc;
    }, {} as Record<string, ProjectImage[]>);
    
    // Parse tags from JSON string to array and attach images
    const result = projects.map(project => ({
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      images: imagesByProject[project.id] || []
    }));
    
    return result;
  }

  async getProjectsWithImages(): Promise<(Project & { images: ProjectImage[] })[]> {
    return this.getProjects();
  }

  async getProjectById(id: string): Promise<(Project & { images: ProjectImage[] }) | undefined> {
    const projects = await db.select().from(schema.projects).where(sql`${schema.projects.id} = ${id}`);
    if (!projects[0]) return undefined;
    
    const images = await db.select().from(schema.projectImages)
      .where(sql`${schema.projectImages.projectId} = ${id}`)
      .orderBy(schema.projectImages.imageOrder);
    
    return {
      ...projects[0],
      tags: projects[0].tags ? JSON.parse(projects[0].tags) : [],
      images
    };
  }

  async getProfile(): Promise<Profile | undefined> {
    const result = await db.select().from(schema.profile).limit(1);
    return result[0];
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = randomUUID();
    const result = await db.insert(schema.skills).values({
      ...skill,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    return result[0];
  }

  async createExperience(exp: InsertExperience): Promise<Experience> {
    const id = randomUUID();
    const result = await db.insert(schema.experiences).values({
      ...exp,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = randomUUID();
    const projectWithTags = {
      ...project,
      tags: project.tags ? JSON.stringify(project.tags) : null,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await db.insert(schema.projects).values(projectWithTags).returning();
    return {
      ...result[0],
      tags: result[0].tags ? JSON.parse(result[0].tags) : []
    };
  }

  async createProjectImage(image: InsertProjectImage): Promise<ProjectImage> {
    const id = randomUUID();
    const result = await db.insert(schema.projectImages).values({
      ...image,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const result = await db.insert(schema.profile).values({
      ...profile,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    return result[0];
  }
}

// Use database storage
export const storage = new DbStorage();
