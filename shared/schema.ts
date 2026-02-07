import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const warehouses = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // Mã kho
  name: text("name").notNull(), // Tên kho
  address: text("address").notNull(), // Địa chỉ
  area: integer("area").notNull(), // Diện tích (m2)
  capacity: integer("capacity").notNull(), // Sức chứa
  status: text("status").notNull().default("active"), // Trạng thái: active/inactive
  manager: text("manager").notNull(), // Người phụ trách
  notes: text("notes"), // Ghi chú
  createdAt: timestamp("created_at").defaultNow(),
});

export const yards = pgTable("yards", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // Mã bãi
  name: text("name").notNull(), // Tên bãi
  warehouseId: integer("warehouse_id").references(() => warehouses.id), // Thuộc kho
  area: integer("area").notNull(), // Diện tích
  type: text("type").notNull(), // Loại bãi
  status: text("status").notNull().default("active"), // Trạng thái
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const warehousesRelations = relations(warehouses, ({ many }) => ({
  yards: many(yards),
}));

export const yardsRelations = relations(yards, ({ one }) => ({
  warehouse: one(warehouses, {
    fields: [yards.warehouseId],
    references: [warehouses.id],
  }),
}));

export const insertWarehouseSchema = createInsertSchema(warehouses).omit({ id: true, createdAt: true });
export const insertYardSchema = createInsertSchema(yards).omit({ id: true, createdAt: true });

export type Warehouse = typeof warehouses.$inferSelect;
export type InsertWarehouse = z.infer<typeof insertWarehouseSchema>;
export type Yard = typeof yards.$inferSelect;
export type InsertYard = z.infer<typeof insertYardSchema>;

// Stats for Dashboard
export type SystemStats = {
  totalWarehouses: number;
  totalYards: number;
  activeWarehouses: number;
  activeYards: number;
};
