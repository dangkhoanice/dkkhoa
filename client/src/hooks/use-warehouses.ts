import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertWarehouse } from "@shared/schema";

export function useWarehouses() {
  return useQuery({
    queryKey: [api.warehouses.list.path],
    queryFn: async () => {
      const res = await fetch(api.warehouses.list.path);
      if (!res.ok) throw new Error("Failed to fetch warehouses");
      return api.warehouses.list.responses[200].parse(await res.json());
    },
  });
}

export function useWarehouse(id: number) {
  return useQuery({
    queryKey: [api.warehouses.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.warehouses.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch warehouse");
      return api.warehouses.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertWarehouse) => {
      const res = await fetch(api.warehouses.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create warehouse");
      return api.warehouses.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.warehouses.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertWarehouse>) => {
      const url = buildUrl(api.warehouses.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update warehouse");
      return api.warehouses.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.warehouses.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.warehouses.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete warehouse");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.warehouses.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}
