import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertInsurancePolicy } from "@shared/routes";

export function useInsurancePolicies(vehicleId: number) {
  return useQuery({
    queryKey: [api.insurance.list.path, vehicleId],
    queryFn: async () => {
      const url = buildUrl(api.insurance.list.path, { vehicleId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch insurance policies");
      return api.insurance.list.responses[200].parse(await res.json());
    },
    enabled: !!vehicleId,
  });
}

export function useCreateInsurance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vehicleId, ...data }: { vehicleId: number } & Omit<InsertInsurancePolicy, 'vehicleId'>) => {
      const url = buildUrl(api.insurance.create.path, { vehicleId });
      // Helper to ensure dates are properly converted if needed, though zodcoerce handles it on backend
      const res = await fetch(url, {
        method: api.insurance.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create insurance policy");
      return api.insurance.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: [api.insurance.list.path, vehicleId] });
      queryClient.invalidateQueries({ queryKey: [api.vehicles.get.path, vehicleId] });
    },
  });
}

export function useDeleteInsurance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number; vehicleId: number }) => {
      const url = buildUrl(api.insurance.delete.path, { id });
      const res = await fetch(url, {
        method: api.insurance.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete insurance policy");
    },
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: [api.insurance.list.path, vehicleId] });
      queryClient.invalidateQueries({ queryKey: [api.vehicles.get.path, vehicleId] });
    },
  });
}
