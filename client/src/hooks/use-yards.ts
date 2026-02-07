import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertYard } from "@shared/schema";

export function useYards() {
  return useQuery({
    queryKey: [api.yards.list.path],
    queryFn: async () => {
      const res = await fetch(api.yards.list.path);
      if (!res.ok) throw new Error("Failed to fetch yards");
      return api.yards.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateYard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertYard) => {
      const res = await fetch(api.yards.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create yard");
      return api.yards.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.yards.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}

export function useUpdateYard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertYard>) => {
      const url = buildUrl(api.yards.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update yard");
      return api.yards.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.yards.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}

export function useDeleteYard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.yards.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete yard");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.yards.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}
