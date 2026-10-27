import { pool } from "./db.js";
export async function initializeSchema() {
 await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;
 CREATE TABLE IF NOT EXISTS properties (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(180) NOT NULL,
 property_type VARCHAR(40) NOT NULL CHECK (property_type IN ('land','plot','apartment','flat','villa','independent_house','commercial','other')),
 status VARCHAR(40) NOT NULL DEFAULT 'available' CHECK (status IN ('available','reserved','sold','rented','inactive')),
 price NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (price >= 0), currency CHAR(3) NOT NULL DEFAULT 'INR',
 location TEXT NOT NULL, area_sqft NUMERIC(12,2), bedrooms INTEGER, bathrooms INTEGER,
 description TEXT, owner_name VARCHAR(180), owner_phone VARCHAR(40),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
 CREATE INDEX IF NOT EXISTS properties_status_idx ON properties(status);
 CREATE INDEX IF NOT EXISTS properties_type_idx ON properties(property_type);`);
}