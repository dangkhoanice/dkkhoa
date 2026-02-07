import { z } from 'zod';
import { insertWarehouseSchema, insertYardSchema, warehouses, yards } from './schema';

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
  warehouses: {
    list: {
      method: 'GET' as const,
      path: '/api/warehouses' as const,
      responses: {
        200: z.array(z.custom<typeof warehouses.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/warehouses/:id' as const,
      responses: {
        200: z.custom<typeof warehouses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/warehouses' as const,
      input: insertWarehouseSchema,
      responses: {
        201: z.custom<typeof warehouses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/warehouses/:id' as const,
      input: insertWarehouseSchema.partial(),
      responses: {
        200: z.custom<typeof warehouses.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/warehouses/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  yards: {
    list: {
      method: 'GET' as const,
      path: '/api/yards' as const,
      responses: {
        200: z.array(z.custom<typeof yards.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/yards/:id' as const,
      responses: {
        200: z.custom<typeof yards.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/yards' as const,
      input: insertYardSchema,
      responses: {
        201: z.custom<typeof yards.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/yards/:id' as const,
      input: insertYardSchema.partial(),
      responses: {
        200: z.custom<typeof yards.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/yards/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.object({
          totalWarehouses: z.number(),
          totalYards: z.number(),
          activeWarehouses: z.number(),
          activeYards: z.number(),
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
