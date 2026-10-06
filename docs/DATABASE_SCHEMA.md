# Sree Hari Realty Promoters – Database Architecture & Schema

Database Engine: **PostgreSQL**

---

## 1. Entity-Relationship Overview

```
users (Admin Accounts)
  └── Role-based authorization ('ADMIN', 'SUPER_ADMIN')

projects (Gated Communities & Layout Developments)
  ├── 1:N ── properties (Plots / Land Parcels)
  ├── 1:N ── media_images (Gallery Photos)
  ├── M:N ── project_amenities ── amenities (Master Specifications)
  └── 1:N ── leads (Enquiries received specifically for this project)

properties (Plots / Parcels)
  ├── N:1 ── projects
  ├── 1:N ── media_images
  └── 1:N ── leads (Plot-level enquiries)

leads (Lead Capture Pipeline)
  ├── Status: 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'ARCHIVED'
  └── Source: 'WEBSITE_FORM' | 'PROJECT_PAGE' | 'PROPERTY_PAGE' | 'WHATSAPP_CLICK' | 'DIRECT_CALL'

contact_enquiries (General Contact Submissions)
```

---

## 2. Table Definitions

### `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique User ID |
| `name` | `VARCHAR(100)` | `NOT NULL` | Admin full name |
| `email` | `VARCHAR(150)` | `UNIQUE NOT NULL` | Login email |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed password |
| `role` | `VARCHAR(30)` | `DEFAULT 'ADMIN' NOT NULL` | User role |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE NOT NULL` | Account status flag |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Creation time |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Last updated |

### `projects`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique Project ID |
| `name` | `VARCHAR(200)` | `NOT NULL` | Project Name |
| `slug` | `VARCHAR(220)` | `UNIQUE NOT NULL` | SEO-friendly URL slug |
| `tagline` | `VARCHAR(255)` | | Project tagline / USP |
| `description` | `TEXT` | `NOT NULL` | Full description |
| `location` | `VARCHAR(200)` | `NOT NULL` | Locality name |
| `address` | `TEXT` | | Full physical address |
| `city` | `VARCHAR(100)` | `DEFAULT 'Chennai'` | City |
| `state` | `VARCHAR(100)` | `DEFAULT 'Tamil Nadu'` | State |
| `total_area` | `VARCHAR(100)` | | Extent (e.g. '12 Acres') |
| `total_units` | `VARCHAR(100)` | | Total units (e.g. '140 Plots') |
| `price_range` | `VARCHAR(100)` | | Price label range |
| `price_per_sqft`| `NUMERIC(10,2)`| | Base rate per sqft |
| `status` | `VARCHAR(50)` | `DEFAULT 'ONGOING'` | Status |
| `is_featured` | `BOOLEAN` | `DEFAULT FALSE` | Homepage featured flag |
| `is_visible` | `BOOLEAN` | `DEFAULT TRUE` | Visibility flag |
| `main_image_url`| `VARCHAR(500)`| `NOT NULL` | Cover banner image URL |
| `highlights` | `JSONB` | `DEFAULT '[]'::jsonb` | Highlights array |
| `connectivity` | `JSONB` | `DEFAULT '[]'::jsonb` | Connectivity array |
| `seo_title` | `VARCHAR(255)` | | Custom meta title |
| `seo_description`| `TEXT` | | Custom meta description |

### `properties` (Plots)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Plot ID |
| `project_id` | `UUID` | `REFERENCES projects(id) ON DELETE SET NULL` | Parent project |
| `title` | `VARCHAR(200)` | `NOT NULL` | Title (e.g. Plot 14 East Facing) |
| `slug` | `VARCHAR(220)` | `UNIQUE NOT NULL` | SEO slug |
| `plot_number` | `VARCHAR(50)` | | Plot number |
| `property_type` | `VARCHAR(50)` | `DEFAULT 'RESIDENTIAL_PLOT'` | Type |
| `area_sqft` | `NUMERIC(10,2)`| `NOT NULL` | Size in sq.ft |
| `dimensions` | `VARCHAR(100)` | | e.g. '30 x 40 ft' |
| `facing` | `VARCHAR(50)` | | East, North, Corner, etc. |
| `price` | `NUMERIC(12,2)`| `NOT NULL` | Price in Rupees |
| `price_display` | `VARCHAR(100)` | | Formatted price string |
| `status` | `VARCHAR(50)` | `DEFAULT 'AVAILABLE'` | AVAILABLE / BOOKED / SOLD |

### `leads`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Lead ID |
| `name` | `VARCHAR(150)` | `NOT NULL` | Customer name |
| `phone` | `VARCHAR(30)` | `NOT NULL` | Customer phone number |
| `email` | `VARCHAR(150)` | | Customer email |
| `project_id` | `UUID` | `REFERENCES projects(id) ON DELETE SET NULL` | Project of interest |
| `property_id` | `UUID` | `REFERENCES properties(id) ON DELETE SET NULL` | Plot of interest |
| `source` | `VARCHAR(50)` | `DEFAULT 'WEBSITE_FORM'` | Lead source |
| `message` | `TEXT` | | Customer message |
| `status` | `VARCHAR(50)` | `DEFAULT 'NEW'` | Pipeline status |
| `notes` | `TEXT` | | Internal admin notes |
