var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// seed.ts
var seed_exports = {};
__export(seed_exports, {
  runSeeder: () => runSeeder
});
function runSeeder() {
  return new Promise((resolve, reject) => {
    console.log("Starting DB Seeder...");
    const startTime = Date.now();
    let firstNames = [];
    let lastNames = [];
    try {
      firstNames = import_fs.default.readFileSync(import_path.default.join(process.cwd(), "first_names.txt"), "utf-8").split("\n").map((n) => n.trim()).filter((n) => n.length > 0);
      lastNames = import_fs.default.readFileSync(import_path.default.join(process.cwd(), "last_names.txt"), "utf-8").split("\n").map((n) => n.trim()).filter((n) => n.length > 0);
    } catch (error) {
      console.error("Error reading first_names.txt or last_names.txt, using fallbacks.", error);
      firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth"];
      lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    }
    if (firstNames.length === 0 || lastNames.length === 0) {
      reject(new Error("Seed names files are empty."));
      return;
    }
    const db2 = new import_sqlite3.default.Database(DB_PATH);
    db2.serialize(() => {
      db2.run(`DROP TABLE IF EXISTS employees`);
      db2.run(`
        CREATE TABLE IF NOT EXISTS employees (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          job_title TEXT NOT NULL,
          department TEXT NOT NULL,
          country TEXT NOT NULL,
          salary REAL NOT NULL,
          status TEXT NOT NULL,
          hire_date TEXT NOT NULL,
          rating INTEGER NOT NULL
        )
      `);
      db2.run(`CREATE INDEX IF NOT EXISTS idx_employees_country ON employees(country)`);
      db2.run(`CREATE INDEX IF NOT EXISTS idx_employees_job_title ON employees(job_title)`);
      db2.run(`CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department)`);
      db2.run(`CREATE INDEX IF NOT EXISTS idx_employees_salary ON employees(salary)`);
      db2.run(`CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name)`);
      db2.run("BEGIN TRANSACTION");
      const stmt = db2.prepare(`
        INSERT INTO employees (name, email, job_title, department, country, salary, status, hire_date, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const totalEmployeesCount = 1e4;
      const emailsSet = /* @__PURE__ */ new Set();
      console.log(`Generating ${totalEmployeesCount} realistic employee records...`);
      for (let i = 0; i < totalEmployeesCount; i++) {
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${first} ${last}`;
        let email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;
        let suffix = 1;
        while (emailsSet.has(email)) {
          email = `${first.toLowerCase()}.${last.toLowerCase()}${suffix}@example.com`;
          suffix++;
        }
        emailsSet.add(email);
        const departmentsList = Object.keys(DEPARTMENTS);
        const department = departmentsList[Math.floor(Math.random() * departmentsList.length)];
        const titlesInDept = DEPARTMENTS[department];
        const jobTitle = titlesInDept[Math.floor(Math.random() * titlesInDept.length)];
        const countryObj = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
        const country = countryObj.name;
        const baseUSD = TITLE_BASE_SALARIES[jobTitle] || 75e3;
        const multiplier = countryObj.multiplier;
        const fluctuation = 0.85 + Math.random() * 0.3;
        const finalSalaryRaw = baseUSD * multiplier * fluctuation;
        const salary = Math.round(finalSalaryRaw / 100) * 100;
        const statusRand = Math.random();
        const status = statusRand < 0.9 ? "Active" : statusRand < 0.96 ? "On Leave" : "Terminated";
        const ratingRand = Math.random();
        const rating = ratingRand < 0.05 ? 1 : ratingRand < 0.15 ? 2 : ratingRand < 0.55 ? 3 : ratingRand < 0.85 ? 4 : 5;
        const startYear = 2018;
        const currentYear = 2026;
        const year = startYear + Math.floor(Math.random() * (currentYear - startYear + 1));
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
        const hireDate = `${year}-${month}-${day}`;
        stmt.run(fullName, email, jobTitle, department, country, salary, status, hireDate, rating);
      }
      stmt.finalize();
      db2.run("COMMIT", (err) => {
        if (err) {
          console.error("Error committing database transaction:", err);
          reject(err);
        } else {
          const duration = Date.now() - startTime;
          console.log(`Seeding complete! Successfully inserted 10,000 employees in ${duration}ms.`);
          db2.close();
          resolve();
        }
      });
    });
  });
}
var import_fs, import_path, import_sqlite3, DB_PATH, DEPARTMENTS, COUNTRIES, TITLE_BASE_SALARIES, isMain;
var init_seed = __esm({
  "seed.ts"() {
    import_fs = __toESM(require("fs"), 1);
    import_path = __toESM(require("path"), 1);
    import_sqlite3 = __toESM(require("sqlite3"), 1);
    DB_PATH = import_path.default.join(process.cwd(), "database.db");
    DEPARTMENTS = {
      "Engineering": ["Software Engineer", "Senior Software Engineer", "Tech Lead", "Engineering Manager", "QA Engineer", "DevOps Engineer", "Data Engineer"],
      "Product": ["Product Manager", "Senior Product Manager", "UX Designer", "UI Designer", "Product Analyst"],
      "Sales": ["Sales Representative", "Account Executive", "Sales Manager", "Business Development Rep"],
      "Marketing": ["Marketing Specialist", "SEO Specialist", "Marketing Manager", "Content Writer", "Brand Lead"],
      "Finance": ["Financial Analyst", "Senior Accountant", "Finance Manager", "Treasurer"],
      "Human Resources": ["HR Specialist", "HR Generalist", "Recruiter", "HR Manager", "Compensation Analyst"],
      "Operations": ["Operations Coordinator", "Operations Manager", "Facilities Specialist"],
      "Legal": ["Legal Counsel", "Compliance Officer", "Contract Specialist"]
    };
    COUNTRIES = [
      { name: "United States", multiplier: 1.35, currency: "USD", code: "US" },
      { name: "Singapore", multiplier: 1.15, currency: "SGD", code: "SG" },
      { name: "Australia", multiplier: 1.1, currency: "AUD", code: "AU" },
      { name: "Canada", multiplier: 1.05, currency: "CAD", code: "CA" },
      { name: "Germany", multiplier: 0.98, currency: "EUR", code: "DE" },
      { name: "United Kingdom", multiplier: 0.92, currency: "GBP", code: "GB" },
      { name: "Japan", multiplier: 0.78, currency: "JPY", code: "JP" },
      { name: "India", multiplier: 0.28, currency: "INR", code: "IN" }
    ];
    TITLE_BASE_SALARIES = {
      "Software Engineer": 95e3,
      "Senior Software Engineer": 135e3,
      "Tech Lead": 155e3,
      "Engineering Manager": 165e3,
      "QA Engineer": 72e3,
      "DevOps Engineer": 105e3,
      "Data Engineer": 1e5,
      "Product Manager": 105e3,
      "Senior Product Manager": 14e4,
      "UX Designer": 85e3,
      "UI Designer": 8e4,
      "Product Analyst": 75e3,
      "Sales Representative": 6e4,
      "Account Executive": 85e3,
      "Sales Manager": 11e4,
      "Business Development Rep": 5e4,
      "Marketing Specialist": 62e3,
      "SEO Specialist": 58e3,
      "Marketing Manager": 95e3,
      "Content Writer": 55e3,
      "Brand Lead": 88e3,
      "Financial Analyst": 78e3,
      "Senior Accountant": 82e3,
      "Finance Manager": 115e3,
      "Treasurer": 105e3,
      "HR Specialist": 65e3,
      "HR Generalist": 72e3,
      "Recruiter": 68e3,
      "HR Manager": 105e3,
      "Compensation Analyst": 8e4,
      "Operations Coordinator": 58e3,
      "Operations Manager": 92e3,
      "Facilities Specialist": 52e3,
      "Legal Counsel": 135e3,
      "Compliance Officer": 88e3,
      "Contract Specialist": 72e3
    };
    isMain = process.argv[1] && (process.argv[1].endsWith("seed.ts") || process.argv[1].endsWith("seed"));
    if (isMain) {
      runSeeder().then(() => {
        console.log("Seeder ran successfully to database.db");
        process.exit(0);
      }).catch((err) => {
        console.error("Seeder failed:", err);
        process.exit(1);
      });
    }
  }
});

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_sqlite32 = __toESM(require("sqlite3"), 1);
var import_child_process = require("child_process");
var import_vite = require("vite");
var PORT = 3e3;
var DB_PATH2 = import_path2.default.join(process.cwd(), "database.db");
var db = new import_sqlite32.default.Database(DB_PATH2);
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}
async function initDatabase() {
  console.log("Validating database table structure...");
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        job_title TEXT NOT NULL,
        department TEXT NOT NULL,
        country TEXT NOT NULL,
        salary REAL NOT NULL,
        status TEXT NOT NULL,
        hire_date TEXT NOT NULL,
        rating INTEGER NOT NULL
      )
    `);
    const countRow = await dbGet("SELECT COUNT(*) as total FROM employees");
    if (!countRow || countRow.total === 0) {
      console.log("Database empty on boot. Auto-seeding 10,000 employees...");
      const { runSeeder: runSeeder2 } = await Promise.resolve().then(() => (init_seed(), seed_exports));
      await runSeeder2();
      console.log("Seeder completed successfully.");
    } else {
      console.log(`Database is ready with ${countRow.total} employees.`);
    }
  } catch (err) {
    console.error("Database initialization failed:", err);
    throw err;
  }
}
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json());
  await initDatabase();
  app.get("/api/employees", async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 15));
      const offset = (page - 1) * limit;
      const search = (req.query.search || "").trim();
      const country = (req.query.country || "").trim();
      const department = (req.query.department || "").trim();
      const jobTitle = (req.query.jobTitle || "").trim();
      const status = (req.query.status || "").trim();
      const sortBy = req.query.sortBy || "id";
      const sortOrder = req.query.sortOrder || "ASC";
      const allowedSortColumns = ["id", "name", "email", "job_title", "department", "country", "salary", "status", "hire_date", "rating"];
      const finalSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "id";
      const finalSortOrder = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
      const whereClauses = [];
      const params = [];
      if (search) {
        whereClauses.push("(name LIKE ? OR email LIKE ? OR job_title LIKE ?)");
        const wildSearch = `%${search}%`;
        params.push(wildSearch, wildSearch, wildSearch);
      }
      if (country && country !== "ALL") {
        whereClauses.push("country = ?");
        params.push(country);
      }
      if (department && department !== "ALL") {
        whereClauses.push("department = ?");
        params.push(department);
      }
      if (jobTitle && jobTitle !== "ALL") {
        whereClauses.push("job_title = ?");
        params.push(jobTitle);
      }
      if (status && status !== "ALL") {
        whereClauses.push("status = ?");
        params.push(status);
      }
      const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM employees ${whereSQL}`;
      const countRes = await dbGet(countQuery, params);
      const totalCount = countRes ? countRes.total : 0;
      const dataQuery = `
        SELECT * FROM employees 
        ${whereSQL} 
        ORDER BY ${finalSortBy} ${finalSortOrder} 
        LIMIT ? OFFSET ?
      `;
      const finalParams = [...params, limit, offset];
      const items = await dbAll(dataQuery, finalParams);
      res.json({
        data: items,
        pagination: {
          totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: error.message || "Failed to list database rows." });
    }
  });
  app.get("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await dbGet("SELECT * FROM employees WHERE id = ?", [id]);
      if (!employee) {
        res.status(404).json({ error: "Employee not found." });
        return;
      }
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/employees", async (req, res) => {
    try {
      const { name, email, job_title, department, country, salary, status, hire_date, rating } = req.body;
      if (!name || !email || !job_title || !department || !country || salary === void 0) {
        res.status(400).json({ error: "Missing mandatory fields: name, email, job_title, department, country, salary" });
        return;
      }
      const existingEmail = await dbGet("SELECT id FROM employees WHERE email = ?", [email]);
      if (existingEmail) {
        res.status(400).json({ error: "Email already exists in organization directory." });
        return;
      }
      const finalStatus = status || "Active";
      const finalHireDate = hire_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const finalRating = rating !== void 0 ? parseInt(rating) : 3;
      const runRes = await dbRun(`
        INSERT INTO employees (name, email, job_title, department, country, salary, status, hire_date, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [name.trim(), email.trim(), job_title.trim(), department.trim(), country.trim(), parseFloat(salary), finalStatus, finalHireDate, finalRating]);
      const newRecord = await dbGet("SELECT * FROM employees WHERE id = ?", [runRes.lastID]);
      res.status(201).json({ message: "Employee added successfully", employee: newRecord });
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.put("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, email, job_title, department, country, salary, status, hire_date, rating } = req.body;
      const current = await dbGet("SELECT id, email FROM employees WHERE id = ?", [id]);
      if (!current) {
        res.status(404).json({ error: "Employee not found." });
        return;
      }
      if (email && email !== current.email) {
        const emailCheck = await dbGet("SELECT id FROM employees WHERE email = ? AND id != ?", [email, id]);
        if (emailCheck) {
          res.status(400).json({ error: "Email already registered to another employee." });
          return;
        }
      }
      await dbRun(`
        UPDATE employees
        SET name = COALESCE(?, name),
            email = COALESCE(?, email),
            job_title = COALESCE(?, job_title),
            department = COALESCE(?, department),
            country = COALESCE(?, country),
            salary = COALESCE(?, salary),
            status = COALESCE(?, status),
            hire_date = COALESCE(?, hire_date),
            rating = COALESCE(?, rating)
        WHERE id = ?
      `, [name, email, job_title, department, country, salary, status, hire_date, rating, id]);
      const updated = await dbGet("SELECT * FROM employees WHERE id = ?", [id]);
      res.json({ message: "Employee updated successfully", employee: updated });
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const current = await dbGet("SELECT id FROM employees WHERE id = ?", [id]);
      if (!current) {
        res.status(404).json({ error: "Employee not found." });
        return;
      }
      await dbRun("DELETE FROM employees WHERE id = ?", [id]);
      res.json({ message: "Employee deleted successfully", id });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/api/analytics/summary", async (req, res) => {
    try {
      const countRes = await dbGet('SELECT COUNT(*) as total FROM employees WHERE status != "Terminated"');
      const budgetRes = await dbGet('SELECT SUM(salary) as sum, AVG(salary) as avg FROM employees WHERE status != "Terminated"');
      const ratingsRes = await dbGet('SELECT AVG(rating) as avg FROM employees WHERE status != "Terminated"');
      res.json({
        activeHeadcount: countRes ? countRes.total : 0,
        totalBudget: budgetRes?.sum ? Math.round(budgetRes.sum) : 0,
        averageSalary: budgetRes?.avg ? Math.round(budgetRes.avg) : 0,
        averagePerformance: ratingsRes?.avg ? parseFloat(ratingsRes.avg.toFixed(2)) : 0
      });
    } catch (error) {
      console.error("Summary analytics error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/api/analytics/country-stats", async (req, res) => {
    try {
      const sql = `
        SELECT country,
               COUNT(*) as count,
               ROUND(MIN(salary)) as minSalary,
               ROUND(MAX(salary)) as maxSalary,
               ROUND(AVG(salary)) as averageSalary,
               ROUND(SUM(salary)) as totalBudget
        FROM employees
        WHERE status != 'Terminated'
        GROUP BY country
        ORDER BY averageSalary DESC
      `;
      const stats = await dbAll(sql);
      res.json(stats);
    } catch (error) {
      console.error("Country stats analytics error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/api/analytics/job-stats", async (req, res) => {
    try {
      const selectedCountry = req.query.country || "";
      const selectedJobTitle = req.query.jobTitle || "";
      let sql = `
        SELECT job_title,
               country,
               COUNT(*) as count,
               ROUND(AVG(salary)) as averageSalary,
               ROUND(MIN(salary)) as minSalary,
               ROUND(MAX(salary)) as maxSalary
        FROM employees
        WHERE status != 'Terminated'
      `;
      const params = [];
      if (selectedCountry && selectedCountry !== "ALL") {
        sql += ` AND country = ?`;
        params.push(selectedCountry);
      }
      if (selectedJobTitle && selectedJobTitle !== "ALL") {
        sql += ` AND job_title = ?`;
        params.push(selectedJobTitle);
      }
      sql += ` GROUP BY job_title, country ORDER BY averageSalary DESC`;
      const stats = await dbAll(sql, params);
      res.json(stats);
    } catch (error) {
      console.error("Job stats analytics error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/api/analytics/department-stats", async (req, res) => {
    try {
      const sql = `
        SELECT department,
               COUNT(*) as count,
               ROUND(AVG(salary)) as averageSalary,
               ROUND(SUM(salary)) as totalBudget
        FROM employees
        WHERE status != 'Terminated'
        GROUP BY department
        ORDER BY totalBudget DESC
      `;
      const stats = await dbAll(sql);
      res.json(stats);
    } catch (error) {
      console.error("Department stats analytics error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/api/analytics/salary-distribution", async (req, res) => {
    try {
      const sql = `
        SELECT 
          CASE 
            WHEN salary < 30000 THEN 'Under $30k'
            WHEN salary >= 30000 AND salary < 60000 THEN '$30k - $60k'
            WHEN salary >= 60000 AND salary < 90000 THEN '$60k - $90k'
            WHEN salary >= 90000 AND salary < 120000 THEN '$90k - $120k'
            WHEN salary >= 120000 AND salary < 150000 THEN '$120k - $150k'
            WHEN salary >= 150000 AND salary < 180000 THEN '$150k - $180k'
            WHEN salary >= 180000 AND salary < 210000 THEN '$180k - $210k'
            ELSE 'Over $210k'
          END as rangeLabel,
          COUNT(*) as count,
          CASE 
            WHEN salary < 30000 THEN 1
            WHEN salary >= 30000 AND salary < 60000 THEN 2
            WHEN salary >= 60000 AND salary < 90000 THEN 3
            WHEN salary >= 90000 AND salary < 120000 THEN 4
            WHEN salary >= 120000 AND salary < 150000 THEN 5
            WHEN salary >= 150000 AND salary < 180000 THEN 6
            WHEN salary >= 180000 AND salary < 210000 THEN 7
            ELSE 8
          END as rangeOrder
        FROM employees
        WHERE status != 'Terminated'
        GROUP BY rangeLabel
        ORDER BY rangeOrder ASC
      `;
      const stats = await dbAll(sql);
      res.json(stats);
    } catch (error) {
      console.error("Salary distribution error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/api/filters", async (req, res) => {
    try {
      const countries = await dbAll("SELECT DISTINCT country FROM employees ORDER BY country ASC");
      const departments = await dbAll("SELECT DISTINCT department FROM employees ORDER BY department ASC");
      const jobTitles = await dbAll("SELECT DISTINCT job_title FROM employees ORDER BY job_title ASC");
      res.json({
        countries: countries.map((c) => c.country),
        departments: departments.map((d) => d.department),
        jobTitles: jobTitles.map((j) => j.job_title)
      });
    } catch (error) {
      console.error("Filters fetching error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/seed", async (req, res) => {
    try {
      const { runSeeder: runSeeder2 } = await Promise.resolve().then(() => (init_seed(), seed_exports));
      await runSeeder2();
      res.json({ message: "Seeder completed successfully over database.db successfully seeding 10,000 employees." });
    } catch (error) {
      console.error("Seeder execution error:", error);
      res.status(500).json({ error: error.message || "Seeder failed inside the container runtime." });
    }
  });
  app.post("/api/tests/run", (req, res) => {
    (0, import_child_process.exec)("NO_COLOR=1 npx vitest run --coverage", (error, stdout, stderr) => {
      res.json({
        success: !error,
        stdout,
        stderr,
        error: error ? error.message : null
      });
    });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Salary Management Server listening on http://localhost:${PORT}`);
  });
}
startServer().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
