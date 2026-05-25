import express from 'express';
import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { exec } from 'child_process';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'database.db');

interface PromiseRunResult {
  lastID: number;
  changes: number;
}

// Ensure database sits at root
const db = new sqlite3.Database(DB_PATH);

// Create async wrappers to avoid callback nests and maintain professional code quality
function dbGet<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });
}

function dbAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

function dbRun(sql: string, params: any[] = []): Promise<PromiseRunResult> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// Auto-seed on start if DB table structure is missing or empty
async function initDatabase() {
  console.log('Validating database table structure...');
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

    // Verify if records exist
    const countRow = await dbGet<{ total: number }>('SELECT COUNT(*) as total FROM employees');
    if (!countRow || countRow.total === 0) {
      console.log('Database empty on boot. Auto-seeding 10,000 employees...');
      const { runSeeder } = await import('./seed.ts');

      await runSeeder();
      console.log('Seeder completed successfully.');
    } else {
      console.log(`Database is ready with ${countRow.total} employees.`);
    }
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Wait for Database Initialization before handling any requests
  await initDatabase();

  // ==========================================
  // EMPLOYEE CRUD ENDPOINTS (Backend Logic)
  // ==========================================

  // 1. Paginated & Filtered Browse Employees
  app.get('/api/employees', async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 15));
      const offset = (page - 1) * limit;

      const search = (req.query.search as string || '').trim();
      const country = (req.query.country as string || '').trim();
      const department = (req.query.department as string || '').trim();
      const jobTitle = (req.query.jobTitle as string || '').trim();
      const status = (req.query.status as string || '').trim();

      const sortBy = (req.query.sortBy as string) || 'id';
      const sortOrder = (req.query.sortOrder as string) || 'ASC';

      // Safe column validation to prevent SQL Injection on order-by definitions
      const allowedSortColumns = ['id', 'name', 'email', 'job_title', 'department', 'country', 'salary', 'status', 'hire_date', 'rating'];
      const finalSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'id';
      const finalSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      // Dynamic Query Building
      const whereClauses: string[] = [];
      const params: any[] = [];

      if (search) {
        whereClauses.push('(name LIKE ? OR email LIKE ? OR job_title LIKE ?)');
        const wildSearch = `%${search}%`;
        params.push(wildSearch, wildSearch, wildSearch);
      }

      if (country && country !== 'ALL') {
        whereClauses.push('country = ?');
        params.push(country);
      }

      if (department && department !== 'ALL') {
        whereClauses.push('department = ?');
        params.push(department);
      }

      if (jobTitle && jobTitle !== 'ALL') {
        whereClauses.push('job_title = ?');
        params.push(jobTitle);
      }

      if (status && status !== 'ALL') {
        whereClauses.push('status = ?');
        params.push(status);
      }

      const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      // Get count
      const countQuery = `SELECT COUNT(*) as total FROM employees ${whereSQL}`;
      const countRes = await dbGet<{ total: number }>(countQuery, params);
      const totalCount = countRes ? countRes.total : 0;

      // Get records with sorting & pagination
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
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ error: error.message || 'Failed to list database rows.' });
    }
  });

  // 2. Fetch Single Employee details
  app.get('/api/employees/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await dbGet('SELECT * FROM employees WHERE id = ?', [id]);
      if (!employee) {
        res.status(404).json({ error: 'Employee not found.' });
        return;
      }
      res.json(employee);
    } catch (error: any) {
      console.error('Error fetching employee:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 3. Create Employee
  app.post('/api/employees', async (req, res) => {
    try {
      const { name, email, job_title, department, country, salary, status, hire_date, rating } = req.body;

      // Clean validation
      if (!name || !email || !job_title || !department || !country || salary === undefined) {
        res.status(400).json({ error: 'Missing mandatory fields: name, email, job_title, department, country, salary' });
        return;
      }

      // Check unique email
      const existingEmail = await dbGet('SELECT id FROM employees WHERE email = ?', [email]);
      if (existingEmail) {
        res.status(400).json({ error: 'Email already exists in organization directory.' });
        return;
      }

      const finalStatus = status || 'Active';
      const finalHireDate = hire_date || new Date().toISOString().split('T')[0];
      const finalRating = rating !== undefined ? parseInt(rating) : 3;

      const runRes = await dbRun(`
        INSERT INTO employees (name, email, job_title, department, country, salary, status, hire_date, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [name.trim(), email.trim(), job_title.trim(), department.trim(), country.trim(), parseFloat(salary), finalStatus, finalHireDate, finalRating]);

      const newRecord = await dbGet('SELECT * FROM employees WHERE id = ?', [runRes.lastID]);
      res.status(201).json({ message: 'Employee added successfully', employee: newRecord });
    } catch (error: any) {
      console.error('Error creating employee:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 4. Update Employee
  app.put('/api/employees/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, email, job_title, department, country, salary, status, hire_date, rating } = req.body;

      const current = await dbGet('SELECT id, email FROM employees WHERE id = ?', [id]);
      if (!current) {
        res.status(404).json({ error: 'Employee not found.' });
        return;
      }

      // Email uniqueness validation
      if (email && email !== current.email) {
        const emailCheck = await dbGet('SELECT id FROM employees WHERE email = ? AND id != ?', [email, id]);
        if (emailCheck) {
          res.status(400).json({ error: 'Email already registered to another employee.' });
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

      const updated = await dbGet('SELECT * FROM employees WHERE id = ?', [id]);
      res.json({ message: 'Employee updated successfully', employee: updated });
    } catch (error: any) {
      console.error('Error updating employee:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 5. Delete Employee
  app.delete('/api/employees/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const current = await dbGet('SELECT id FROM employees WHERE id = ?', [id]);
      if (!current) {
        res.status(404).json({ error: 'Employee not found.' });
        return;
      }

      await dbRun('DELETE FROM employees WHERE id = ?', [id]);
      res.json({ message: 'Employee deleted successfully', id });
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==========================================
  // SALARY INSIGHT DELIVERABLES (Analytics)
  // ==========================================

  // A. Summary Aggregations
  app.get('/api/analytics/summary', async (req, res) => {
    try {
      const countRes = await dbGet<{ total: number }>('SELECT COUNT(*) as total FROM employees WHERE status != "Terminated"');
      const budgetRes = await dbGet<{ sum: number, avg: number }>('SELECT SUM(salary) as sum, AVG(salary) as avg FROM employees WHERE status != "Terminated"');
      const ratingsRes = await dbGet<{ avg: number }>('SELECT AVG(rating) as avg FROM employees WHERE status != "Terminated"');

      res.json({
        activeHeadcount: countRes ? countRes.total : 0,
        totalBudget: budgetRes?.sum ? Math.round(budgetRes.sum) : 0,
        averageSalary: budgetRes?.avg ? Math.round(budgetRes.avg) : 0,
        averagePerformance: ratingsRes?.avg ? parseFloat(ratingsRes.avg.toFixed(2)) : 0
      });
    } catch (error: any) {
      console.error('Summary analytics error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // B. Country Salaries Metrics (Requirement: Min, Max, Average salary per country)
  app.get('/api/analytics/country-stats', async (req, res) => {
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
    } catch (error: any) {
      console.error('Country stats analytics error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // C. Job Title Salaries per Country (Requirement: Average salary for a given job title within a specific country)
  app.get('/api/analytics/job-stats', async (req, res) => {
    try {
      const selectedCountry = req.query.country as string || '';
      const selectedJobTitle = req.query.jobTitle as string || '';

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
      const params: any[] = [];

      if (selectedCountry && selectedCountry !== 'ALL') {
        sql += ` AND country = ?`;
        params.push(selectedCountry);
      }
      if (selectedJobTitle && selectedJobTitle !== 'ALL') {
        sql += ` AND job_title = ?`;
        params.push(selectedJobTitle);
      }

      sql += ` GROUP BY job_title, country ORDER BY averageSalary DESC`;

      const stats = await dbAll(sql, params);
      res.json(stats);
    } catch (error: any) {
      console.error('Job stats analytics error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // D. Department Budgets & Headcount distribution (Meaningful HR metric)
  app.get('/api/analytics/department-stats', async (req, res) => {
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
    } catch (error: any) {
      console.error('Department stats analytics error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // E. Salary Ranges Distribution (Deciles or Buckets for salary bell curves)
  app.get('/api/analytics/salary-distribution', async (req, res) => {
    try {
      // Define dynamic bucket queries
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
    } catch (error: any) {
      console.error('Salary distribution error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // F. Structural lists for filters (dropdown options)
  app.get('/api/filters', async (req, res) => {
    try {
      const countries = await dbAll('SELECT DISTINCT country FROM employees ORDER BY country ASC');
      const departments = await dbAll('SELECT DISTINCT department FROM employees ORDER BY department ASC');
      const jobTitles = await dbAll('SELECT DISTINCT job_title FROM employees ORDER BY job_title ASC');

      res.json({
        countries: countries.map(c => c.country),
        departments: departments.map(d => d.department),
        jobTitles: jobTitles.map(j => j.job_title)
      });
    } catch (error: any) {
      console.error('Filters fetching error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // G. Command Route for manual seeding
  app.post('/api/seed', async (req, res) => {
    try {
      const { runSeeder } = await import('./seed.ts');
      await runSeeder();
      res.json({ message: 'Seeder completed successfully over database.db successfully seeding 10,000 employees.' });
    } catch (error: any) {
      console.error('Seeder execution error:', error);
      res.status(500).json({ error: error.message || 'Seeder failed inside the container runtime.' });
    }
  });

  // H. Command Route for running tests (TDD System)
  app.post('/api/tests/run', (req, res) => {
    // Using NO_COLOR=1 to ensure plain text for the frontend
    exec('NO_COLOR=1 npx vitest run --coverage', (error: any, stdout: string, stderr: string) => {
      res.json({
        success: !error,
        stdout,
        stderr,
        error: error ? error.message : null
      });
    });
  });

  // ==========================================
  // VITE & FRONTEND INTEGRATION
  // ==========================================

  // Check if we are running the compiled CJS or running via TSX in dev
  const isCompiled = process.argv[1]?.endsWith('server.cjs') || process.env.NODE_ENV === 'production';


  if (!isCompiled) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // production static routing
    const distPath = path.join(process.cwd(), 'dist');
    // Explicitly handle nested base paths (e.g. if built for GitHub pages with a base)
    // It rewrites anything ending in /assets/... to just /assets/...
    app.use((req, res, next) => {
      const assetsMatch = req.url.match(/(\/assets\/.*)$/);
      if (assetsMatch) {
        req.url = assetsMatch[1];
      }
      next();
    });

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Prevent returning the HTML document for static asset requests to avoid MIME type errors
      if (req.path.match(/\.(js|css|json|png|jpg|jpeg|svg|ico)$/i)) {
        return res.status(404).send('Static asset not found');
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Salary Management Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
