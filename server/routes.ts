import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertWarehouseSchema, insertYardSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Warehouses
  app.get(api.warehouses.list.path, async (_req, res) => {
    const warehouses = await storage.getWarehouses();
    res.json(warehouses);
  });

  app.get(api.warehouses.get.path, async (req, res) => {
    const warehouse = await storage.getWarehouse(Number(req.params.id));
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
    res.json(warehouse);
  });

  app.post(api.warehouses.create.path, async (req, res) => {
    try {
      const data = insertWarehouseSchema.parse(req.body);
      const warehouse = await storage.createWarehouse(data);
      res.status(201).json(warehouse);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      throw e;
    }
  });

  app.put(api.warehouses.update.path, async (req, res) => {
    try {
      const data = insertWarehouseSchema.partial().parse(req.body);
      const warehouse = await storage.updateWarehouse(Number(req.params.id), data);
      res.json(warehouse);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.warehouses.delete.path, async (req, res) => {
    await storage.deleteWarehouse(Number(req.params.id));
    res.status(204).send();
  });

  // Yards
  app.get(api.yards.list.path, async (_req, res) => {
    const yards = await storage.getYards();
    res.json(yards);
  });

  app.get(api.yards.get.path, async (req, res) => {
    const yard = await storage.getYard(Number(req.params.id));
    if (!yard) return res.status(404).json({ message: "Yard not found" });
    res.json(yard);
  });

  app.post(api.yards.create.path, async (req, res) => {
    try {
      const data = insertYardSchema.parse(req.body);
      const yard = await storage.createYard(data);
      res.status(201).json(yard);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      throw e;
    }
  });

  app.put(api.yards.update.path, async (req, res) => {
    try {
      const data = insertYardSchema.partial().parse(req.body);
      const yard = await storage.updateYard(Number(req.params.id), data);
      res.json(yard);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
    }
  });

  app.delete(api.yards.delete.path, async (req, res) => {
    await storage.deleteYard(Number(req.params.id));
    res.status(204).send();
  });

  // Stats
  app.get(api.stats.get.path, async (_req, res) => {
    const stats = await storage.getSystemStats();
    res.json(stats);
  });

  // Seed data on startup
  seedDatabase().catch(console.error);

  return httpServer;
}

// Seed data function
async function seedDatabase() {
  const existing = await storage.getWarehouses();
  if (existing.length === 0) {
    console.log("Seeding database...");
    const w1 = await storage.createWarehouse({
      code: "KHO-01",
      name: "Kho Trung Tâm",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      area: 5000,
      capacity: 10000,
      status: "active",
      manager: "Nguyễn Văn A",
      notes: "Kho chính",
    });

    const w2 = await storage.createWarehouse({
      code: "KHO-02",
      name: "Kho Phía Bắc",
      address: "456 Đường XYZ, Hà Nội",
      area: 3000,
      capacity: 6000,
      status: "active",
      manager: "Trần Thị B",
      notes: "Kho lạnh",
    });

    await storage.createYard({
      code: "BAI-A1",
      name: "Bãi Container A1",
      warehouseId: w1.id,
      area: 1000,
      type: "Container",
      status: "active",
      notes: "Khu vực hàng nhập",
    });

    await storage.createYard({
      code: "BAI-B1",
      name: "Bãi Xe Tải B1",
      warehouseId: w2.id,
      area: 800,
      type: "Xe tải",
      status: "maintenance",
      notes: "Đang sửa chữa",
    });
    console.log("Database seeded!");
  }
}
