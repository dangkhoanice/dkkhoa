import { db } from "./db";
import {
  warehouses, yards,
  type InsertWarehouse, type Warehouse,
  type InsertYard, type Yard,
  type SystemStats
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Warehouses
  getWarehouses(): Promise<Warehouse[]>;
  getWarehouse(id: number): Promise<Warehouse | undefined>;
  createWarehouse(warehouse: InsertWarehouse): Promise<Warehouse>;
  updateWarehouse(id: number, warehouse: Partial<InsertWarehouse>): Promise<Warehouse>;
  deleteWarehouse(id: number): Promise<void>;

  // Yards
  getYards(): Promise<Yard[]>;
  getYard(id: number): Promise<Yard | undefined>;
  createYard(yard: InsertYard): Promise<Yard>;
  updateYard(id: number, yard: Partial<InsertYard>): Promise<Yard>;
  deleteYard(id: number): Promise<void>;

  // Stats
  getSystemStats(): Promise<SystemStats>;
}

export class DatabaseStorage implements IStorage {
  // Warehouses
  async getWarehouses(): Promise<Warehouse[]> {
    return await db.select().from(warehouses);
  }

  async getWarehouse(id: number): Promise<Warehouse | undefined> {
    const [warehouse] = await db.select().from(warehouses).where(eq(warehouses.id, id));
    return warehouse;
  }

  async createWarehouse(warehouse: InsertWarehouse): Promise<Warehouse> {
    const [newWarehouse] = await db.insert(warehouses).values(warehouse).returning();
    return newWarehouse;
  }

  async updateWarehouse(id: number, warehouse: Partial<InsertWarehouse>): Promise<Warehouse> {
    const [updated] = await db.update(warehouses)
      .set(warehouse)
      .where(eq(warehouses.id, id))
      .returning();
    return updated;
  }

  async deleteWarehouse(id: number): Promise<void> {
    await db.delete(warehouses).where(eq(warehouses.id, id));
  }

  // Yards
  async getYards(): Promise<Yard[]> {
    return await db.select().from(yards);
  }

  async getYard(id: number): Promise<Yard | undefined> {
    const [yard] = await db.select().from(yards).where(eq(yards.id, id));
    return yard;
  }

  async createYard(yard: InsertYard): Promise<Yard> {
    const [newYard] = await db.insert(yards).values(yard).returning();
    return newYard;
  }

  async updateYard(id: number, yard: Partial<InsertYard>): Promise<Yard> {
    const [updated] = await db.update(yards)
      .set(yard)
      .where(eq(yards.id, id))
      .returning();
    return updated;
  }

  async deleteYard(id: number): Promise<void> {
    await db.delete(yards).where(eq(yards.id, id));
  }

  // Stats
  async getSystemStats(): Promise<SystemStats> {
    const [totalWarehouses] = await db.select({ count: sql<number>`count(*)` }).from(warehouses);
    const [totalYards] = await db.select({ count: sql<number>`count(*)` }).from(yards);
    const [activeWarehouses] = await db.select({ count: sql<number>`count(*)` }).from(warehouses).where(eq(warehouses.status, 'active'));
    const [activeYards] = await db.select({ count: sql<number>`count(*)` }).from(yards).where(eq(yards.status, 'active'));

    return {
      totalWarehouses: Number(totalWarehouses.count),
      totalYards: Number(totalYards.count),
      activeWarehouses: Number(activeWarehouses.count),
      activeYards: Number(activeYards.count),
    };
  }
}

export const storage = new DatabaseStorage();
