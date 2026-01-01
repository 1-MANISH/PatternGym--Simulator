import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth and Chat models (Replit Integrations)
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// Patterns (DSA, System Design, LLD)
export const patterns = pgTable("patterns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'dsa', 'system_design', 'lld'
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  intuition: text("intuition"), // Why this pattern exists
  checklist: jsonb("checklist"), // Mental checklist items
});

// Problems associated with patterns
export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  patternId: integer("pattern_id").references(() => patterns.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  starterCode: jsonb("starter_code"), // { javascript: string, python: string, ... }
  testCases: jsonb("test_cases"), // Array of {input, output}
  expectedTimeComplexity: text("expected_time_complexity"),
  expectedSpaceComplexity: text("expected_space_complexity"),
  edgeCases: jsonb("edge_cases"), // Array of string
});

// User Submissions / Progress
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id), // Changed to varchar to match Auth
  problemId: integer("problem_id").references(() => problems.id),
  code: text("code").notNull(),
  status: text("status").notNull(), // 'passed', 'failed', 'pending'
  feedback: text("feedback"), // AI feedback
  createdAt: timestamp("created_at").defaultNow(),
});

// Interview Sessions
export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id), // Changed to varchar to match Auth
  type: text("type").notNull(), // 'dsa', 'system_design', 'behavioral'
  status: text("status").notNull(), // 'completed', 'in_progress'
  recordingUrl: text("recording_url"), // Optional URL if stored
  feedback: text("feedback"), // AI generated feedback
  score: integer("score"),
  durationSeconds: integer("duration_seconds"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertPatternSchema = createInsertSchema(patterns).omit({ id: true });
export const insertProblemSchema = createInsertSchema(problems).omit({ id: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, createdAt: true, feedback: true, status: true });
export const insertInterviewSchema = createInsertSchema(interviews).omit({ id: true, createdAt: true, feedback: true, score: true });

// Explicit Types
export type Pattern = typeof patterns.$inferSelect;
export type Problem = typeof problems.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Interview = typeof interviews.$inferSelect;

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
