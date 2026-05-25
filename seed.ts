import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const DB_PATH = path.join(process.cwd(), 'database.db');

// Realistic metadata for seeding
const DEPARTMENTS = {
  'Engineering': ['Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Engineering Manager', 'QA Engineer', 'DevOps Engineer', 'Data Engineer'],
  'Product': ['Product Manager', 'Senior Product Manager', 'UX Designer', 'UI Designer', 'Product Analyst'],
  'Sales': ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development Rep'],
  'Marketing': ['Marketing Specialist', 'SEO Specialist', 'Marketing Manager', 'Content Writer', 'Brand Lead'],
  'Finance': ['Financial Analyst', 'Senior Accountant', 'Finance Manager', 'Treasurer'],
  'Human Resources': ['HR Specialist', 'HR Generalist', 'Recruiter', 'HR Manager', 'Compensation Analyst'],
  'Operations': ['Operations Coordinator', 'Operations Manager', 'Facilities Specialist'],
  'Legal': ['Legal Counsel', 'Compliance Officer', 'Contract Specialist']
};

const COUNTRIES = [
  { name: 'United States', multiplier: 1.35, currency: 'USD', code: 'US' },
  { name: 'Singapore', multiplier: 1.15, currency: 'SGD', code: 'SG' },
  { name: 'Australia', multiplier: 1.10, currency: 'AUD', code: 'AU' },
  { name: 'Canada', multiplier: 1.05, currency: 'CAD', code: 'CA' },
  { name: 'Germany', multiplier: 0.98, currency: 'EUR', code: 'DE' },
  { name: 'United Kingdom', multiplier: 0.92, currency: 'GBP', code: 'GB' },
  { name: 'Japan', multiplier: 0.78, currency: 'JPY', code: 'JP' },
  { name: 'India', multiplier: 0.28, currency: 'INR', code: 'IN' }
];

// Base salaries for each job title (referenced as USD base)
const TITLE_BASE_SALARIES: { [key: string]: number } = {
  'Software Engineer': 95000,
  'Senior Software Engineer': 135000,
  'Tech Lead': 155000,
  'Engineering Manager': 165000,
  'QA Engineer': 72000,
  'DevOps Engineer': 105000,
  'Data Engineer': 100000,
  'Product Manager': 105000,
  'Senior Product Manager': 140000,
  'UX Designer': 85000,
  'UI Designer': 80000,
  'Product Analyst': 75000,
  'Sales Representative': 60000,
  'Account Executive': 85000,
  'Sales Manager': 110000,
  'Business Development Rep': 50000,
  'Marketing Specialist': 62000,
  'SEO Specialist': 58000,
  'Marketing Manager': 95000,
  'Content Writer': 55000,
  'Brand Lead': 88000,
  'Financial Analyst': 78000,
  'Senior Accountant': 82000,
  'Finance Manager': 115000,
  'Treasurer': 105000,
  'HR Specialist': 65000,
  'HR Generalist': 72000,
  'Recruiter': 68000,
  'HR Manager': 105000,
  'Compensation Analyst': 80000,
  'Operations Coordinator': 58000,
  'Operations Manager': 92000,
  'Facilities Specialist': 52000,
  'Legal Counsel': 135000,
  'Compliance Officer': 88000,
  'Contract Specialist': 72000
};

export function runSeeder(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Starting DB Seeder...');
    const startTime = Date.now();

    // 1. Read first names and last names
    let firstNames: string[] = [];
    let lastNames: string[] = [];

    try {
      firstNames = fs.readFileSync(path.join(process.cwd(), 'first_names.txt'), 'utf-8')
        .split('\n')
        .map(n => n.trim())
        .filter(n => n.length > 0);

      lastNames = fs.readFileSync(path.join(process.cwd(), 'last_names.txt'), 'utf-8')
        .split('\n')
        .map(n => n.trim())
        .filter(n => n.length > 0);
    } catch (error) {
      console.error('Error reading first_names.txt or last_names.txt, using fallbacks.', error);
      firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
      lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    }

    if (firstNames.length === 0 || lastNames.length === 0) {
      reject(new Error('Seed names files are empty.'));
      return;
    }

    // 2. Initialize database
    const db = new sqlite3.Database(DB_PATH);

    db.serialize(() => {
      // Drop existing tables first if called explicitly
      db.run(`DROP TABLE IF EXISTS employees`);

      // Create pristine table
      db.run(`
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

      // Create indexes for extreme high-performance queries
      db.run(`CREATE INDEX IF NOT EXISTS idx_employees_country ON employees(country)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_employees_job_title ON employees(job_title)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_employees_salary ON employees(salary)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name)`);

      // 3. Prepare parameters for generation
      db.run('BEGIN TRANSACTION');

      const stmt = db.prepare(`
        INSERT INTO employees (name, email, job_title, department, country, salary, status, hire_date, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const totalEmployeesCount = 10000;
      const emailsSet = new Set<string>();

      console.log(`Generating ${totalEmployeesCount} realistic employee records...`);

      for (let i = 0; i < totalEmployeesCount; i++) {
        // Pick random first and last name
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${first} ${last}`;

        // Create unique email
        let email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;
        let suffix = 1;
        while (emailsSet.has(email)) {
          email = `${first.toLowerCase()}.${last.toLowerCase()}${suffix}@example.com`;
          suffix++;
        }
        emailsSet.add(email);

        // Pick random department
        const departmentsList = Object.keys(DEPARTMENTS);
        const department = departmentsList[Math.floor(Math.random() * departmentsList.length)];

        // Pick random job title within department
        const titlesInDept = DEPARTMENTS[department as keyof typeof DEPARTMENTS];
        const jobTitle = titlesInDept[Math.floor(Math.random() * titlesInDept.length)];

        // Pick random country
        const countryObj = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
        const country = countryObj.name;

        // Calculate realistic salary
        const baseUSD = TITLE_BASE_SALARIES[jobTitle] || 75000;
        const multiplier = countryObj.multiplier;
        // Fluctuating by ±15% around standard
        const fluctuation = 0.85 + Math.random() * 0.3;
        const finalSalaryRaw = baseUSD * multiplier * fluctuation;
        // Keep salary rounded to nearest hundred
        const salary = Math.round(finalSalaryRaw / 100) * 100;

        // Employee status: Active 90%, Leave 6%, Terminated 4%
        const statusRand = Math.random();
        const status = statusRand < 0.90 ? 'Active' : statusRand < 0.96 ? 'On Leave' : 'Terminated';

        // Rating: 1 to 5 (average around 3-4)
        const ratingRand = Math.random();
        const rating = ratingRand < 0.05 ? 1 : ratingRand < 0.15 ? 2 : ratingRand < 0.55 ? 3 : ratingRand < 0.85 ? 4 : 5;

        // Hire Date: Between 2018 and 2026
        const startYear = 2018;
        const currentYear = 2026;
        const year = startYear + Math.floor(Math.random() * (currentYear - startYear + 1));
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'); // Safety from leap year
        const hireDate = `${year}-${month}-${day}`;

        // Insert using prepared statement for extreme speed
        stmt.run(fullName, email, jobTitle, department, country, salary, status, hireDate, rating);
      }

      stmt.finalize();

      db.run('COMMIT', (err) => {
        if (err) {
          console.error('Error committing database transaction:', err);
          reject(err);
        } else {
          const duration = Date.now() - startTime;
          console.log(`Seeding complete! Successfully inserted 10,000 employees in ${duration}ms.`);
          db.close();
          resolve();
        }
      });
    });
  });
}

// Allow standalone execution of the seeder (npm run seed)
const isMain = process.argv[1] && (
  process.argv[1].endsWith('seed.ts') || 
  process.argv[1].endsWith('seed')
);

if (isMain) {
  runSeeder()
    .then(() => {
      console.log('Seeder ran successfully to database.db');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeder failed:', err);
      process.exit(1);
    });
}
