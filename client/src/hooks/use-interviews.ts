import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { parseWithLogging } from "@/lib/utils";
import { z } from "zod";

type InterviewType = "dsa" | "system_design" | "behavioral";

export function useCreateInterview() {
  return useMutation({
    mutationFn: async (type: InterviewType) => {
      const payload = { type };
      const validatedPayload = api.interviews.create.input.parse(payload);
      
      const res = await fetch(api.interviews.create.path, {
        method: api.interviews.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedPayload),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create interview session");
      const data = await res.json();
      return parseWithLogging(api.interviews.create.responses[201], data, "interviews.create");
    },
  });
}

export function useSubmitInterview() {
  return useMutation({
    mutationFn: async ({ id, feedback, recordingUrl }: { id: number; feedback?: string; recordingUrl?: string }) => {
      const url = buildUrl(api.interviews.submit.path, { id });
      const payload = { feedback, recordingUrl };
      const validatedPayload = api.interviews.submit.input.parse(payload);

      const res = await fetch(url, {
        method: api.interviews.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedPayload),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to submit interview");
      const data = await res.json();
      return parseWithLogging(api.interviews.submit.responses[200], data, "interviews.submit");
    },
  });
}

export function useAnalyzeInterview() {
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.interviews.analyze.path, { id });
      
      const res = await fetch(url, {
        method: api.interviews.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: "{}", // Empty body
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to analyze interview");
      const data = await res.json();
      return parseWithLogging(api.interviews.analyze.responses[200], data, "interviews.analyze");
    },
  });
}
