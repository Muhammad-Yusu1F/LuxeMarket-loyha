import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Path to local orders.json file for persistent orders db
  const ordersFilePath = path.join(process.cwd(), "orders.json");

  // Helper to load orders securely
  function getOrdersList() {
    try {
      if (fs.existsSync(ordersFilePath)) {
        const fileContent = fs.readFileSync(ordersFilePath, "utf8");
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error("Error reading orders file:", e);
    }
    // Return initial default orders if no file exists
    return [
      {
        id: 'LUXE-748923',
        customerName: 'Kamil Gulyamov',
        customerPhone: '+998 90 999 44 22',
        customerEmail: 'kamil@uzbekistan.com',
        customerAddress: 'Tashkent, Oybek Business Center Apt 12',
        items: [
          {
            product: {
              id: "velocity-pro-runner",
              name: "Velocity Pro Runner",
              brand: "APEX",
              price: 145.00,
              image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
            },
            quantity: 1
          }
        ],
        totalPrice: 156.60,
        status: 'SHIPPED',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        notes: 'Deliver to reception desk, please'
      }
    ];
  }

  // Helper to save orders securely
  function saveOrdersList(orders: any[]) {
    try {
      fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf8");
    } catch (e) {
      console.error("Error writing orders file:", e);
    }
  }

  // API Endpoints
  // GET all orders from the centralized database (visible across all devices / browsers!)
  app.get("/api/orders", (req, res) => {
    res.json(getOrdersList());
  });

  // POST create a new order
  app.post("/api/orders", (req, res) => {
    const newOrder = req.body;
    if (!newOrder || !newOrder.id) {
       res.status(400).json({ error: "Invalid order data" });
       return;
    }
    const currentOrders = getOrdersList();
    // Prepend the new order so it is at the top of the admin panel
    const updatedOrders = [newOrder, ...currentOrders];
    saveOrdersList(updatedOrders);
    res.status(201).json(newOrder);
  });

  // PUT update order status
  app.put("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
       res.status(400).json({ error: "Status field is required" });
       return;
    }
    const currentOrders = getOrdersList();
    const index = currentOrders.findIndex((o: any) => o.id === id);
    if (index !== -1) {
      currentOrders[index].status = status;
      saveOrdersList(currentOrders);
      res.json(currentOrders[index]);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  // POST reset/clear all orders
  app.post("/api/orders/reset", (req, res) => {
    saveOrdersList([]);
    res.json({ message: "All orders cleared" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
