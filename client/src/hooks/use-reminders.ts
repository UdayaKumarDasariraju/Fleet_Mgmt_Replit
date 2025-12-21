import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertServiceReminder } from "@shared/routes";

export function useReminders(vehicleId: number) {
  return useQuery({
    queryKey: [api.reminders.list.path, vehicleId],
    queryFn: async () => {
      const url = buildUrl(api.reminders.list.path, { vehicleId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reminders");
      return api.reminders.list.responses[200].parse(await res.json());
    },
    enabled: !!vehicleId,
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vehicleId, ...data }: { vehicleId: number } & Omit<InsertServiceReminder, 'vehicleId'>) => {
      const url = buildUrl(api.reminders.create.path, { vehicleId });
      const res = await fetch(url, {
        method: api.reminders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create reminder");
      return api.reminders.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: [api.reminders.list.path, vehicleId] });
      queryClient.invalidateQueries({ queryKey: [api.vehicles.get.path, vehicleId] });
      queryClient.invalidateQueries({ queryKey: [api.dashboard.stats.path] });
    },
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, vehicleId, ...data }: { id: number; vehicleId: number } & Partial<InsertServiceReminder>) => {
      const url = buildUrl(api.reminders.update.path, { id });
      const res = await fetch(url, {
        method: api.reminders.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update reminder");
      return api.reminders.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: [api.reminders.list.path, vehicleId] });
      queryClient.invalidateQueries({ queryKey: [api.vehicles.get.path, vehicleId] });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number; vehicleId: number }) => {
      const url = buildUrl(api.reminders.delete.path, { id });
      const res = await fetch(url, {
        method: api.reminders.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete reminder");
    },
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: [api.reminders.list.path, vehicleId] });
      queryClient.invalidateQueries({ queryKey: [api.vehicles.get.path, vehicleId] });
    },
  });
}
