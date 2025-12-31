import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { parseWithLogging } from "@/lib/utils";

export function usePatterns() {
  return useQuery({
    queryKey: [api.patterns.list.path],
    queryFn: async () => {
      const res = await fetch(api.patterns.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch patterns");
      const data = await res.json();
      return parseWithLogging(api.patterns.list.responses[200], data, "patterns.list");
    },
  });
}

export function usePattern(id: number) {
  return useQuery({
    queryKey: [api.patterns.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.patterns.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch pattern");
      const data = await res.json();
      return parseWithLogging(api.patterns.get.responses[200], data, "patterns.get");
    },
    enabled: !!id,
  });
}

export function usePatternProblems(patternId: number) {
  return useQuery({
    queryKey: [api.patterns.list.path, patternId, 'problems'],
    queryFn: async () => {
      const url = buildUrl(api.patterns.problems.path, { id: patternId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch pattern problems");
      const data = await res.json();
      return parseWithLogging(api.patterns.problems.responses[200], data, "patterns.problems");
    },
    enabled: !!patternId,
  });
}
