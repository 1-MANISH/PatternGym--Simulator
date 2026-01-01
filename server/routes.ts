import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { patterns, problems } from "@shared/schema";
// Replit Auth setup
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // -- API Routes --

  // Patterns
  app.get(api.patterns.list.path, async (req, res) => {
    const allPatterns = await storage.getPatterns();
    res.json(allPatterns);
  });

  app.get(api.patterns.get.path, async (req, res) => {
    const pattern = await storage.getPattern(Number(req.params.id));
    if (!pattern) return res.status(404).json({ message: "Pattern not found" });
    res.json(pattern);
  });

  app.get(api.patterns.problems.path, async (req, res) => {
    const probs = await storage.getPatternProblems(Number(req.params.id));
    res.json(probs);
  });

  // Problems
  app.get(api.problems.get.path, async (req, res) => {
    const problem = await storage.getProblem(Number(req.params.id));
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  });

  app.post(api.problems.submit.path, async (req, res) => {
    const problem = await storage.getProblem(Number(req.params.id));
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Mock test case execution
    const testCases = (problem.testCases as any[]) || [];
    const mockCases = testCases.length >= 5 ? testCases : [
      ...testCases,
      ...Array(Math.max(0, 5 - testCases.length)).fill(null).map((_, i) => ({
        input: `Case ${i + 1}`,
        output: "Success"
      }))
    ];

    const testResults = mockCases.map((tc, i) => {
      const passed = Math.random() > 0.1;
      return {
        input: tc ? String(tc.input) : `Case ${i+1}`,
        expected: tc ? String(tc.output) : "Success",
        actual: passed ? (tc ? String(tc.output) : "Success") : "Error: Expected " + (tc ? tc.output : "Success"),
        passed,
      };
    });

    const passedCount = testResults.filter(r => r.passed).length;
    const score = (passedCount / testResults.length) * 100;

    res.json({
      status: passedCount === testResults.length ? "passed" : "failed",
      score,
      testResults,
      feedback: passedCount === testResults.length 
        ? "Excellent pattern recognition! Your solution is optimal and handles all edge cases."
        : `You're close! Your solution passed ${passedCount} out of ${testResults.length} cases. Consider the boundary conditions.`,
    });
  });

  // Interviews
  app.post(api.interviews.create.path, async (req, res) => {
    const { type } = req.body;
    const userId = (req.user as any)?.claims?.sub; 
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const interview = await storage.createInterview({
      userId,
      type,
      status: "in_progress",
    });
    res.status(201).json(interview);
  });

  app.post(api.interviews.submit.path, async (req, res) => {
    const id = Number(req.params.id);
    const { feedback, recordingUrl, code, whiteboardData, notes } = req.body;
    
    // Store comprehensive submission data
    const interview = await storage.updateInterview(id, {
      status: "completed",
      feedback: feedback || "Submission received.",
      recordingUrl,
    });
    
    res.json(interview);
  });

  app.post(api.interviews.analyze.path, async (req, res) => {
    // In a real app, we would process code, notes, and whiteboard data here
    res.json({
      feedback: "Analysis complete. Your technical explanation was clear. You correctly used the Sliding Window pattern. Recommended improvement: optimize memory usage by using a circular buffer.",
      score: 88,
    });
  });

  app.get(api.user.me.path, (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.json(null);
    }
  });

  await seedDatabase();

  return httpServer;
}

// Seed Data
export async function seedDatabase() {
  const existingPatterns = await storage.getPatterns();
  if (existingPatterns.length === 0) {
    const p1 = await db.insert(patterns).values({
      title: "Two Pointers",
      description: "Use two pointers to iterate through data structures.",
      category: "dsa",
      difficulty: "beginner",
      intuition: "Efficiently search pairs in sorted arrays.",
      checklist: ["Sorted array?", "Find pair?", "Reduce O(N^2) to O(N)?"],
    }).returning();

    await db.insert(problems).values({
      patternId: p1[0].id,
      title: "Pair Sum",
      description: "Find two numbers that add up to target.",
      difficulty: "easy",
      expectedTimeComplexity: "O(n)",
      expectedSpaceComplexity: "O(1)",
      edgeCases: ["Empty array", "Target not found", "Multiple pairs", "Single element array"],
      starterCode: {
        javascript: "function solution(arr, target) {\n  // Implement your solution\n  return [];\n}",
        python: "def solution(arr, target):\n    # Implement your solution\n    return []",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solution(vector<int>& arr, int target) {\n        return {};\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int[] solution(int[] arr, int target) {\n        return new int[]{};\n    }\n}",
        go: "package main\n\nfunc solution(arr []int, target int) []int {\n    return []int{}\n}"
      },
      testCases: [{input: "[1,2,3], 5", output: "[2,3]"}],
    });
    
    const p2 = await db.insert(patterns).values({
      title: "Sliding Window",
      description: "Maintain a window of elements to satisfy condition.",
      category: "dsa",
      difficulty: "intermediate",
      intuition: "Subarray or substring problems.",
      checklist: ["Contiguous subarray?", "Min/Max size?", "Longest substring?"],
    }).returning();

    await db.insert(problems).values({
      patternId: p2[0].id,
      title: "Max Sum Subarray",
      description: "Find max sum of subarray of size K.",
      difficulty: "medium",
      expectedTimeComplexity: "O(n)",
      expectedSpaceComplexity: "O(1)",
      edgeCases: ["k > arr.length", "arr.length = 0", "Negative numbers", "k = 1"],
      starterCode: {
        javascript: "function solution(arr, k) {\n  // Implement your solution\n  return 0;\n}",
        python: "def solution(arr, k):\n    # Implement your solution\n    return 0",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solution(vector<int>& arr, int k) {\n        return 0;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int solution(int[] arr, int k) {\n        return 0;\n    }\n}",
        go: "package main\n\nfunc solution(arr []int, k int) int {\n    return 0\n}"
      },
      testCases: [{input: "[1,2,3,4], 2", output: "7"}],
    });
  }
}
