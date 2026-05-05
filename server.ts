import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup Storage Directories
  const UPLOADS_DIR = path.join(__dirname, "uploads");
  const DATA_DIR = path.join(__dirname, "data");

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });

  // Multer Storage Setup
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
  const upload = multer({ storage });

  // Simple JSON-based database helper
  const getData = async (filename: string) => {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  const saveData = async (filename: string, data: any) => {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  };

  // API Routes
  
  // Auth (Mock for simplicity)
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    // For demo, any password works
    res.json({ id: "1", email, name: "Admin User", role: "Admin" });
  });

  // Employees
  app.get("/api/employees", async (req, res) => {
    const employees = await getData("employees");
    res.json(employees);
  });

  app.post("/api/employees", async (req, res) => {
    const employees = await getData("employees");
    const newEmployee = { ...req.body, id: uuidv4(), createdAt: new Date().toISOString() };
    employees.push(newEmployee);
    await saveData("employees", employees);
    res.json(newEmployee);
  });

  app.put("/api/employees/:id", async (req, res) => {
    const employees = await getData("employees");
    const index = employees.findIndex((e: any) => e.id === req.params.id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...req.body };
      await saveData("employees", employees);
      res.json(employees[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  // Documents
  app.get("/api/documents/:employeeId", async (req, res) => {
    const documents = await getData("documents");
    const filtered = documents.filter((d: any) => d.employeeId === req.params.employeeId);
    res.json(filtered);
  });

  app.post("/api/documents/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file" });
    
    const documents = await getData("documents");
    const newDoc = {
      id: uuidv4(),
      employeeId: req.body.employeeId,
      name: req.body.name || req.file.originalname,
      type: req.body.type,
      fileUrl: `/uploads/${req.file.filename}`,
      status: "Entregue",
      isRequired: req.body.isRequired === "true",
      expiryDate: req.body.expiryDate,
      createdAt: new Date().toISOString()
    };
    documents.push(newDoc);
    await saveData("documents", documents);
    res.json(newDoc);
  });

  // Vacancies
  app.get("/api/vacancies", async (req, res) => {
    const vacancies = await getData("vacancies");
    res.json(vacancies);
  });

  app.post("/api/vacancies", async (req, res) => {
    const vacancies = await getData("vacancies");
    const newVacancy = { ...req.body, id: uuidv4(), createdAt: new Date().toISOString() };
    vacancies.push(newVacancy);
    await saveData("vacancies", vacancies);
    res.json(newVacancy);
  });

  // Serve static uploads
  app.use("/uploads", express.static(UPLOADS_DIR));

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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
