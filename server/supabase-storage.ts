import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { type User, type InsertUser, type Skill, type InsertSkill, type Experience, type InsertExperience, type Project, type InsertProject, type Profile, type InsertProfile, type ProjectImage, type InsertProjectImage } from "@shared/schema";
import { randomUUID } from "crypto";

// Load environment variables
config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return data;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const { data, error } = await supabase
      .from('users')
      .insert({ ...insertUser, id })
      .select()
      .single();
    
    if (error || !data) throw new Error('Failed to create user');
    return data;
  }

  // Portfolio methods
  async getSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order');
    
    if (error) throw error;
    return data || [];
  }

  async getExperiences(): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order');
    
    if (error) throw error;
    return data || [];
  }

  async getProjects(): Promise<(Project & { images: ProjectImage[] })[]> {
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('order');
    
    if (projectsError) throw projectsError;
    if (!projects) return [];

    // Get all images for all projects
    const { data: images, error: imagesError } = await supabase
      .from('project_images')
      .select('*')
      .order('image_order');
    
    if (imagesError) throw imagesError;

    // Group images by projectId and map field names
    const imagesByProject = (images || []).reduce((acc, img) => {
      const mappedImage: ProjectImage = {
        id: img.id,
        projectId: img.project_id,
        imageUrl: img.image_url,
        imageData: img.image_data,
        caption: img.caption,
        imageOrder: img.image_order,
        createdAt: img.created_at,
        updatedAt: img.updated_at,
      };
      
      if (!acc[mappedImage.projectId]) acc[mappedImage.projectId] = [];
      acc[mappedImage.projectId].push(mappedImage);
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
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (projectsError || !projects) return undefined;
    
    const { data: images, error: imagesError } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', id)
      .order('image_order');
    
    if (imagesError) throw imagesError;
    
    // Map field names from snake_case to camelCase
    const mappedImages = (images || []).map(img => ({
      id: img.id,
      projectId: img.project_id,
      imageUrl: img.image_url,
      imageData: img.image_data,
      caption: img.caption,
      imageOrder: img.image_order,
      createdAt: img.created_at,
      updatedAt: img.updated_at,
    }));
    
    return {
      ...projects,
      tags: projects.tags ? JSON.parse(projects.tags) : [],
      images: mappedImages
    };
  }

  async getProfile(): Promise<Profile | undefined> {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single();
    
    if (error || !data) return undefined;
    return data;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = randomUUID();
    const { data, error } = await supabase
      .from('skills')
      .insert({
        ...skill,
        id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error || !data) throw new Error('Failed to create skill');
    return data;
  }

  async createExperience(exp: InsertExperience): Promise<Experience> {
    const id = randomUUID();
    const { data, error } = await supabase
      .from('experiences')
      .insert({
        ...exp,
        id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error || !data) throw new Error('Failed to create experience');
    return data;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = randomUUID();
    const projectWithTags = {
      ...project,
      tags: project.tags ? JSON.stringify(project.tags) : null,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('projects')
      .insert(projectWithTags)
      .select()
      .single();
    
    if (error || !data) throw new Error('Failed to create project');
    
    return {
      ...data,
      tags: data.tags ? JSON.parse(data.tags) : []
    };
  }

  async createProjectImage(image: InsertProjectImage): Promise<ProjectImage> {
    const id = randomUUID();
    const { data, error } = await supabase
      .from('project_images')
      .insert({
        ...image,
        id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error || !data) throw new Error('Failed to create project image');
    return data;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const { data, error } = await supabase
      .from('profile')
      .insert({
        ...profile,
        id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error || !data) throw new Error('Failed to create profile');
    return data;
  }
}

// Use Supabase storage
export const storage = new SupabaseStorage();
