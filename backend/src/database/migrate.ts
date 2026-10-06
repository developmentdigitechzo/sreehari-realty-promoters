import { db, pool } from '../config/db.js';

export const runMigrations = async () => {
  console.log('--- Starting Database Migrations ---');

  const migrationQueries = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(30) DEFAULT 'ADMIN' NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(220) UNIQUE NOT NULL,
        tagline VARCHAR(255),
        description TEXT NOT NULL,
        location VARCHAR(200) NOT NULL,
        address TEXT,
        city VARCHAR(100) DEFAULT 'Chennai' NOT NULL,
        state VARCHAR(100) DEFAULT 'Tamil Nadu' NOT NULL,
        total_area VARCHAR(100),
        total_units VARCHAR(100),
        price_range VARCHAR(100),
        price_per_sqft NUMERIC(10, 2),
        status VARCHAR(50) DEFAULT 'ONGOING' NOT NULL,
        is_featured BOOLEAN DEFAULT FALSE NOT NULL,
        is_visible BOOLEAN DEFAULT TRUE NOT NULL,
        main_image_url VARCHAR(500) NOT NULL,
        brochure_url VARCHAR(500),
        highlights JSONB DEFAULT '[]'::jsonb NOT NULL,
        connectivity JSONB DEFAULT '[]'::jsonb NOT NULL,
        seo_title VARCHAR(255),
        seo_description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(220) UNIQUE NOT NULL,
        plot_number VARCHAR(50),
        property_type VARCHAR(50) DEFAULT 'RESIDENTIAL_PLOT' NOT NULL,
        area_sqft NUMERIC(10, 2) NOT NULL,
        dimensions VARCHAR(100),
        facing VARCHAR(50),
        price NUMERIC(12, 2) NOT NULL,
        price_display VARCHAR(100),
        status VARCHAR(50) DEFAULT 'AVAILABLE' NOT NULL,
        is_featured BOOLEAN DEFAULT FALSE NOT NULL,
        is_visible BOOLEAN DEFAULT TRUE NOT NULL,
        description TEXT,
        main_image_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        alt_text VARCHAR(255),
        sort_order INT DEFAULT 0 NOT NULL,
        is_featured BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS amenities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        icon VARCHAR(50),
        category VARCHAR(50) DEFAULT 'GENERAL' NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_amenities (
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
        PRIMARY KEY (project_id, amenity_id)
    );

    CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(150),
        project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
        property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
        source VARCHAR(50) DEFAULT 'WEBSITE_FORM' NOT NULL,
        message TEXT,
        status VARCHAR(50) DEFAULT 'NEW' NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_enquiries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(150) NOT NULL,
        subject VARCHAR(200),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'UNREAD' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_projects_is_visible ON projects(is_visible);
    CREATE INDEX IF NOT EXISTS idx_properties_project_id ON properties(project_id);
    CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
    CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_enquiries(created_at DESC);
  `;

  try {
    await db.query(migrationQueries);
    console.log('✅ Database migrations executed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    throw err;
  }
};

// If run directly via CLI
if (process.argv[1]?.includes('migrate')) {
  runMigrations()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
