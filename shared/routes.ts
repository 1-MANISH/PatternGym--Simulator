import { z } from 'zod';
import { insertSubmissionSchema, insertInterviewSchema, patterns, problems, submissions, interviews } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  patterns: {
    list: {
      method: 'GET' as const,
      path: '/api/patterns',
      responses: {
        200: z.array(z.custom<typeof patterns.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/patterns/:id',
      responses: {
        200: z.custom<typeof patterns.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    problems: {
      method: 'GET' as const,
      path: '/api/patterns/:id/problems',
      responses: {
        200: z.array(z.custom<typeof problems.$inferSelect>()),
      },
    }
  },
  problems: {
    get: {
      method: 'GET' as const,
      path: '/api/problems/:id',
      responses: {
        200: z.custom<typeof problems.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    submit: {
      method: 'POST' as const,
      path: '/api/problems/:id/submit',
      input: z.object({
        code: z.string(),
        language: z.string(),
      }),
      responses: {
        200: z.object({
          status: z.enum(['passed', 'failed']),
          feedback: z.string(),
        }),
      },
    },
  },
  interviews: {
    create: {
      method: 'POST' as const,
      path: '/api/interviews',
      input: z.object({
        type: z.enum(['dsa', 'system_design', 'behavioral']),
      }),
      responses: {
        201: z.custom<typeof interviews.$inferSelect>(),
      },
    },
    submit: {
      method: 'POST' as const,
      path: '/api/interviews/:id/submit',
      input: z.object({
        feedback: z.string().optional(), // Self reflection or notes
        recordingUrl: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof interviews.$inferSelect>(),
      },
    },
    analyze: {
      method: 'POST' as const,
      path: '/api/interviews/:id/analyze',
      input: z.object({}),
      responses: {
        200: z.object({
          feedback: z.string(),
          score: z.number(),
        }),
      },
    },
  },
  user: {
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.object({
          id: z.number(),
          username: z.string(),
        }).nullable(),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
