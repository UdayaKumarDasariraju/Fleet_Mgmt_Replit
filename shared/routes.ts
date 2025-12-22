import { z } from 'zod';
import { 
  insertVehicleSchema, 
  insertInsurancePolicySchema, 
  insertServiceReminderSchema, 
  insertServiceRecordSchema, 
  insertTransactionSchema,
  vehicles,
  insurancePolicies,
  serviceReminders,
  serviceRecords,
  transactions
} from './schema';

export * from './schema';

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
};

export const api = {
  vehicles: {
    list: {
      method: 'GET' as const,
      path: '/api/vehicles',
      responses: {
        200: z.array(z.custom<typeof vehicles.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/vehicles/:id',
      responses: {
        200: z.custom<typeof vehicles.$inferSelect & { upcomingReminders: typeof serviceReminders.$inferSelect[], activePolicy?: typeof insurancePolicies.$inferSelect }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/vehicles',
      input: insertVehicleSchema,
      responses: {
        201: z.custom<typeof vehicles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/vehicles/:id',
      input: insertVehicleSchema.partial(),
      responses: {
        200: z.custom<typeof vehicles.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/vehicles/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  insurance: {
    list: {
      method: 'GET' as const,
      path: '/api/vehicles/:vehicleId/insurance',
      responses: {
        200: z.array(z.custom<typeof insurancePolicies.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/vehicles/:vehicleId/insurance',
      input: insertInsurancePolicySchema.omit({ vehicleId: true }),
      responses: {
        201: z.custom<typeof insurancePolicies.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/insurance/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  reminders: {
    list: {
      method: 'GET' as const,
      path: '/api/vehicles/:vehicleId/reminders',
      responses: {
        200: z.array(z.custom<typeof serviceReminders.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/vehicles/:vehicleId/reminders',
      input: insertServiceReminderSchema.omit({ vehicleId: true }),
      responses: {
        201: z.custom<typeof serviceReminders.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/reminders/:id',
      input: insertServiceReminderSchema.partial().omit({ vehicleId: true }),
      responses: {
        200: z.custom<typeof serviceReminders.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/reminders/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  records: {
    list: {
      method: 'GET' as const,
      path: '/api/vehicles/:vehicleId/records',
      responses: {
        200: z.array(z.custom<typeof serviceRecords.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/vehicles/:vehicleId/records',
      input: insertServiceRecordSchema.omit({ vehicleId: true }),
      responses: {
        201: z.custom<typeof serviceRecords.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/records/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  transactions: {
    list: {
      method: 'GET' as const,
      path: '/api/vehicles/:vehicleId/transactions',
      responses: {
        200: z.array(z.custom<typeof transactions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/vehicles/:vehicleId/transactions',
      input: insertTransactionSchema.omit({ vehicleId: true }),
      responses: {
        201: z.custom<typeof transactions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/transactions/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/dashboard/stats',
      responses: {
        200: z.object({
          totalVehicles: z.number(),
          activeVehicles: z.number(),
          totalMonthlyExpenses: z.number(),
          upcomingRemindersCount: z.number(),
        }),
      },
    },
  },
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
