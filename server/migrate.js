require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  console.log('Connecting to the database...');
  let connection;
  try {
    if (process.env.MYSQL_URL) {
      connection = await mysql.createConnection(process.env.MYSQL_URL);
    } else {
      connection = await mysql.createConnection({
        host: process.env.MYSQLHOST || 'localhost',
        port: process.env.MYSQLPORT || 3306,
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD || '',
        database: process.env.MYSQLDATABASE || 'railway'
      });
    }

    console.log('Connected! Creating tables...');

    // Users (needed for foreign keys, simulating Supabase auth.users)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created table: users');

    // Categories
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(255) DEFAULT 'circle',
        color VARCHAR(255) DEFAULT '#3b82f6',
        type ENUM('income', 'expense') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Created table: categories');

    // Transactions
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        category_id VARCHAR(36),
        description TEXT NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        type ENUM('income', 'expense') NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);
    console.log('Created table: transactions');

    // Savings Settings
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS savings_settings (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        savings_percentage DECIMAL(5,2) NOT NULL DEFAULT 30.00,
        month DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_month (user_id, month),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Created table: savings_settings');

    // Suppliers
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        document VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Created table: suppliers');

    // Customers
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        document VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Created table: customers');

    // Accounts Payable
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accounts_payable (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        supplier_id VARCHAR(36),
        category_id VARCHAR(36),
        description TEXT NOT NULL,
        amount DECIMAL(14,2) NOT NULL CHECK (amount >= 0),
        due_date DATE NOT NULL,
        payment_date DATE,
        status ENUM('pending','paid','overdue','canceled') NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);
    
    // Add index if not exists (MySQL doesn't support IF NOT EXISTS for indexes directly in CREATE INDEX)
    try {
        await connection.execute('CREATE INDEX idx_ap_user_due ON accounts_payable(user_id, due_date)');
    } catch(e) {
        if(e.code !== 'ER_DUP_KEYNAME') throw e;
    }
    console.log('Created table: accounts_payable');

    // Accounts Receivable
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accounts_receivable (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        customer_id VARCHAR(36),
        category_id VARCHAR(36),
        description TEXT NOT NULL,
        amount DECIMAL(14,2) NOT NULL CHECK (amount >= 0),
        due_date DATE NOT NULL,
        receipt_date DATE,
        status ENUM('pending','received','overdue','canceled') NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    try {
        await connection.execute('CREATE INDEX idx_ar_user_due ON accounts_receivable(user_id, due_date)');
    } catch(e) {
        if(e.code !== 'ER_DUP_KEYNAME') throw e;
    }
    console.log('Created table: accounts_receivable');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();
