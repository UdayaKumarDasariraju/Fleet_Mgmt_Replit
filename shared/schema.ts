import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Linked to auth users
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  vin: text("vin"),
  licensePlate: text("license_plate"),
  status: text("status", { enum: ["active", "maintenance", "sold"] }).default("active").notNull(),
  initialMileage: integer("initial_mileage").default(0).notNull(),
  currentMileage: integer("current_mileage").default(0).notNull(), // Can be updated by logs
  createdAt: timestamp("created_at").defaultNow(),
});

export const insurancePolicies = pgTable("insurance_policies", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull(),
  provider: text("provider").notNull(),
  policyNumber: text("policy_number").notNull(),
  coverageDetails: text("coverage_details"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  premiumAmount: integer("premium_amount").notNull(), // In cents
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceReminders = pgTable("service_reminders", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull(),
  serviceType: text("service_type").notNull(), // Oil Change, Tire Rotation, etc.
  intervalMileage: integer("interval_mileage"),
  intervalMonths: integer("interval_months"),
  lastServiceDate: timestamp("last_service_date"),
  lastServiceMileage: integer("last_service_mileage"),
  nextDueDate: timestamp("next_due_date"), // Calculated
  nextDueMileage: integer("next_due_mileage"), // Calculated
  isDismissed: boolean("is_dismissed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceRecords = pgTable("service_records", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull(),
  date: timestamp("date").notNull(),
  mileage: integer("mileage").notNull(),
  cost: integer("cost").notNull(), // In cents
  description: text("description").notNull(),
  provider: text("provider"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull(),
  date: timestamp("date").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  category: text("category").notNull(), // Fuel, Maintenance, Insurance, Lease, Income
  amount: integer("amount").notNull(), // In cents
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  insurancePolicies: many(insurancePolicies),
  serviceReminders: many(serviceReminders),
  serviceRecords: many(serviceRecords),
  transactions: many(transactions),
}));

export const insurancePoliciesRelations = relations(insurancePolicies, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [insurancePolicies.vehicleId],
    references: [vehicles.id],
  }),
}));

export const serviceRemindersRelations = relations(serviceReminders, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [serviceReminders.vehicleId],
    references: [vehicles.id],
  }),
}));

export const serviceRecordsRelations = relations(serviceRecords, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [serviceRecords.vehicleId],
    references: [vehicles.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [transactions.vehicleId],
    references: [vehicles.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertVehicleSchema = createInsertSchema(vehicles).omit({ 
  id: true, 
  userId: true, // Set by backend
  createdAt: true
});

export const insertInsurancePolicySchema = createInsertSchema(insurancePolicies).omit({ 
  id: true, 
  createdAt: true 
});

export const insertServiceReminderSchema = createInsertSchema(serviceReminders).omit({ 
  id: true, 
  createdAt: true,
  nextDueDate: true, // Calculated by backend
  nextDueMileage: true, // Calculated by backend
  lastServiceDate: true, // Updated when record is added
  lastServiceMileage: true // Updated when record is added
});

export const insertServiceRecordSchema = createInsertSchema(serviceRecords).omit({ 
  id: true, 
  createdAt: true 
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ 
  id: true, 
  createdAt: true 
});

// === TYPES ===

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

export type InsurancePolicy = typeof insurancePolicies.$inferSelect;
export type InsertInsurancePolicy = z.infer<typeof insertInsurancePolicySchema>;

export type ServiceReminder = typeof serviceReminders.$inferSelect;
export type InsertServiceReminder = z.infer<typeof insertServiceReminderSchema>;

export type ServiceRecord = typeof serviceRecords.$inferSelect;
export type InsertServiceRecord = z.infer<typeof insertServiceRecordSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// === API RESPONSE TYPES ===

export type DashboardStats = {
  totalVehicles: number;
  activeVehicles: number;
  totalMonthlyExpenses: number;
  upcomingRemindersCount: number;
};

export type VehicleWithDetails = Vehicle & {
  upcomingReminders: ServiceReminder[];
  activePolicy?: InsurancePolicy;
};
