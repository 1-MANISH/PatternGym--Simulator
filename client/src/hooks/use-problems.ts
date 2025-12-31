import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { parseWithLogging } from "@/lib/utils";

export function useProblem(id: number) {
  return useQuery({
    queryKey: [api.problems.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.problems.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch problem");
      const data = await res.json();
      return parseWithLogging(api.problems.get.responses[200], data, "problems.get");
    },
    enabled: !!id,
  });
}

export function useSubmitProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, code, language }: { id: number; code: string; language: string }) => {
      const url = buildUrl(api.problems.submit.path, { id });
      const payload = { code, language };
      
      const res = await fetch(url, {
        method: api.problems.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to submit solution");
      const data = await res.json();
      return parseWithLogging(api.problems.submit.responses[200], data, "problems.submit");
    },
    onSuccess: (data, variables) => {
      // Invalidate problem query or user stats if we have them
      queryClient.invalidateQueries({ queryKey: [api.problems.get.path, variables.id] });
    },
  });
}
