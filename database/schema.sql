-- =========================================================================
-- SREE HARI REALTY PROMOTERS - DATABASE SCHEMA DDL
-- Database: PostgreSQL
-- =========================================================================

-- Enable pgcrypto / uuid-ossp extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE (Admin Authentication)
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

-- 2. PROJECTS TABLE (Gated Communities & Layouts)
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
    status VARCHAR(50) DEFAULT 'ONGOING' NOT NULL, -- 'UPCOMING', 'ONGOING', 'COMPLETED', 'SOLD_OUT'
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

-- 3. PROPERTIES / PLOTS TABLE
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    plot_number VARCHAR(50),
    property_type VARCHAR(50) DEFAULT 'RESIDENTIAL_PLOT' NOT NULL, -- 'RESIDENTIAL_PLOT', 'COMMERCIAL_PLOT', 'VILLA_PLOT'
    area_sqft NUMERIC(10, 2) NOT NULL,
    dimensions VARCHAR(100),
    facing VARCHAR(50),
    price NUMERIC(12, 2) NOT NULL,
    price_display VARCHAR(100),
    status VARCHAR(50) DEFAULT 'AVAILABLE' NOT NULL, -- 'AVAILABLE', 'BOOKED', 'SOLD'
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE NOT NULL,
    description TEXT,
    main_image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. MEDIA IMAGES TABLE
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

-- 5. MASTER AMENITIES TABLE
CREATE TABLE IF NOT EXISTS amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    category VARCHAR(50) DEFAULT 'GENERAL' NOT NULL
);

-- 6. PROJECT AMENITIES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS project_amenities (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, amenity_id)
);

-- 7. LEADS TABLE (Lead Capture)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    source VARCHAR(50) DEFAULT 'WEBSITE_FORM' NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'NEW' NOT NULL, -- 'NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'ARCHIVED'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. CONTACT ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS contact_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'UNREAD' NOT NULL, -- 'UNREAD', 'READ', 'RESPONDED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_visible ON projects(is_visible);
CREATE INDEX IF NOT EXISTS idx_properties_project_id ON properties(project_id);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_enquiries(created_at DESC);
