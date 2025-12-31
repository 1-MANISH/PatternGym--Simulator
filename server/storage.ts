import { db } from "./db";
import {
  users, patterns, problems, submissions, interviews,
  type User, type InsertUser, type Pattern, type Problem, type Submission, type Interview, type InsertSubmission, type InsertInterview
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods are now handled by AuthStorage mostly, but we might need read access
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  // createUser is handled by Replit Auth blueprint (upsertUser)

  getPatterns(): Promise<Pattern[]>;
  getPattern(id: number): Promise<Pattern | undefined>;
  getPatternProblems(patternId: number): Promise<Problem[]>;
  
  getProblem(id: number): Promise<Problem | undefined>;
  
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  
  createInterview(interview: InsertInterview): Promise<Interview>;
  getInterview(id: number): Promise<Interview | undefined>;
  updateInterview(id: number, updates: Partial<Interview>): Promise<Interview>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Replit Auth users table has 'email', 'firstName', 'lastName', but 'username' might be missing or different
    // The blueprint definition has 'email' and 'firstName', 'lastName'. 
    // It DOES NOT have 'username' in the blueprint schema I saw earlier.
    // "email: varchar("email").unique(),"
    // So we should query by email if anything.
    // For now returning undefined as username isn't in standard Replit Auth schema unless I add it.
    // I will check if I can assume email is username.
    // Adapting to query by email:
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async getPatterns(): Promise<Pattern[]> {
    return await db.select().from(patterns);
  }

  async getPattern(id: number): Promise<Pattern | undefined> {
    const [pattern] = await db.select().from(patterns).where(eq(patterns.id, id));
    return pattern;
  }

  async getPatternProblems(patternId: number): Promise<Problem[]> {
    return await db.select().from(problems).where(eq(problems.patternId, patternId));
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [sub] = await db.insert(submissions).values(submission).returning();
    return sub;
  }

  async createInterview(interview: InsertInterview): Promise<Interview> {
    const [int] = await db.insert(interviews).values(interview).returning();
    return int;
  }

  async getInterview(id: number): Promise<Interview | undefined> {
    const [int] = await db.select().from(interviews).where(eq(interviews.id, id));
    return int;
  }

  async updateInterview(id: number, updates: Partial<Interview>): Promise<Interview> {
    const [int] = await db.update(interviews).set(updates).where(eq(interviews.id, id)).returning();
    return int;
  }
}

export const storage = new DatabaseStorage();
