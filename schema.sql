-- LUMINAFLEX OS | MASTER DATABASE SCHEMA MIRROR
-- DB_NODE: qhosting_luminaflex-db
-- PROTOCOLO: 741 8 520

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('CEO', 'Admin', 'Colaborador', 'Cliente')),
    status VARCHAR(20) DEFAULT 'Online',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(12,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 100,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_insumos (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(20),
    stock_current DECIMAL(12,2) DEFAULT 0,
    stock_min DECIMAL(12,2) DEFAULT 0,
    provider VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendiente',
    production_stage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    module VARCHAR(50),
    message TEXT,
    level VARCHAR(10)
);
