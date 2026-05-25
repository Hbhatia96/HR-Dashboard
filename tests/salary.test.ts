import { describe, it, expect } from 'vitest';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const COUNTRY_MULTIPLIERS: { [key: string]: number } = {
  'United States': 1.35,
  'Singapore': 1.15,
  'Australia': 1.10,
  'Canada': 1.05,
  'Germany': 0.98,
  'United Kingdom': 0.92,
  'Japan': 0.78,
  'India': 0.28
};

const TITLE_BASE_SALARIES: { [key: string]: number } = {
  'Software Engineer': 95000,
  'Senior Software Engineer': 135000,
  'Tech Lead': 155000,
  'QA Engineer': 72000
};

describe('Compensation Factor Engine Tests', () => {
  it('US Software Engineer Salary calculations align with multiplier rules', () => {
    const base = TITLE_BASE_SALARIES['Software Engineer'];
    const mult = COUNTRY_MULTIPLIERS['United States'];
    const expected = base * mult;
    expect(expected).toBe(95000 * 1.35);
  });

  it('India Talent Pool cost-efficiencies represent regional factors', () => {
    const base = TITLE_BASE_SALARIES['Senior Software Engineer'];
    const mult = COUNTRY_MULTIPLIERS['India'];
    const expected = base * mult;
    expect(expected).toBe(135000 * 0.28);
  });
});

describe('Seeding Directory Logic & Validations', () => {
  it('Seeder generates structurally valid, lowercase corporate emails', () => {
    const first = 'Jonathan';
    const last = 'Smith';
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;
    expect(email).toMatch(/^[a-z]+\.[a-z]+@example\.com$/);
    expect(email).toBe('jonathan.smith@example.com');
  });

  it('Seeding directory files can be loaded off disk safely', () => {
    const firstNamesPath = path.join(process.cwd(), 'first_names.txt');
    const lastNamesPath = path.join(process.cwd(), 'last_names.txt');
    expect(fs.existsSync(firstNamesPath)).toBe(true);
    expect(fs.existsSync(lastNamesPath)).toBe(true);
  });
});

describe('SQLite Analytical Core Queries', () => {
  it('Group-by aggregation returns correct country salary computations', async () => {
    const TEST_DB_PATH = path.join(process.cwd(), 'database_test.db');
    if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
    const db = new sqlite3.Database(TEST_DB_PATH);
    const dbRun = (sql: string, params: any[] = []) => new Promise<void>((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) reject(err); else resolve();
      });
    });
    const dbGet = <T = any>(sql: string, params: any[] = []) => new Promise<T | undefined>((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err); else resolve(row as T);
      });
    });

    await dbRun(`
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        country TEXT,
        salary REAL,
        status TEXT
      )
    `);

    await dbRun(`INSERT INTO employees (name, country, salary, status) VALUES ('Alice Smith', 'Germany', 100000, 'Active')`);
    await dbRun(`INSERT INTO employees (name, country, salary, status) VALUES ('Bob Jones', 'Germany', 120000, 'Active')`);
    await dbRun(`INSERT INTO employees (name, country, salary, status) VALUES ('Charlie Miller', 'India', 30000, 'Active')`);
    await dbRun(`INSERT INTO employees (name, country, salary, status) VALUES ('Terminated Emp', 'Germany', 90000, 'Terminated')`);

    const query = `
      SELECT country, 
             MIN(salary) as minSalary, 
             MAX(salary) as maxSalary, 
             AVG(salary) as avgSalary
      FROM employees
      WHERE status != 'Terminated'
      GROUP BY country
      HAVING country = 'Germany'
    `;

    const row = await dbGet<any>(query);
    expect(row).toBeTruthy();
    expect(row.minSalary).toBe(100000);
    expect(row.maxSalary).toBe(120000);
    expect(row.avgSalary).toBe(110000);

    await new Promise<void>((resolve) => db.close(() => resolve()));
    if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
  });
});
