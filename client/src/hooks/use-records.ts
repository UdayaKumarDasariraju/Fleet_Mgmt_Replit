import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertServiceRecord } from "@shared/routes";

export function useRecords(vehicleId: number) {
  return useQuery({
    queryKey: [api.records.list.path, vehicleId],
    queryFn: async () => {
      const url = buildUrl(api.records.list.path, { vehicleId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch service records");
      return api.records.list.responses[200].parse(await res.json());
    },
    enabled: !!vehicleId,
  });
}

export function useCreateRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vehicleId, ...data }: { vehicleId: number } & Omit<InsertServiceRecord, 'vehicleId'>) => {
      const url = buildUrl(api.records.create.path, { vehicleId });
      const res = await fetch(url, {
        method: api.records.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create service record");
      return api.records.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: [api.records.list.path, vehicleId] });
      queryClient.invalidateQueries({ queryKey: [api.vehicles.get.path, vehicleId] });
      // Creating a record might update the vehicle mileage
      queryClient.invalidateQueries({ queryKey: [api.vehicles.list.path] }); 
    },
  });
}

export function useDeleteRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, vehicleId }: { id: number; vehicleId: number }) => {
      const url = buildUrl(api.records.delete.path, { id });
      const res = await fetch(url, {
        method: api.records.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete service record");
    },
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: [api.records.list.path, vehicleId] });
    },
  });
}
