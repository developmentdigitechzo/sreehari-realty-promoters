# Sree Hari Realty Promoters – REST API Documentation

This document outlines the REST API endpoints available in the Sree Hari Realty backend.

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "admin@sreeharirealty.com",
    "password": "AdminPassword@2026"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "user": {
        "id": "uuid",
        "name": "Sree Hari Admin",
        "email": "admin@sreeharirealty.com",
        "role": "ADMIN"
      }
    }
  }
  ```

### `GET /api/auth/me`
- **Access**: Protected (Bearer Token)
- **Response**: Authenticated user object.

---

## 2. Project Endpoints

### `GET /api/projects`
- **Access**: Public
- **Query Params**:
  - `status`: `ONGOING` | `UPCOMING` | `COMPLETED` | `SOLD_OUT`
  - `featured`: `true` | `false`
  - `search`: `string`
- **Response**: Array of projects with amenities, available plots count, and highlights.

### `GET /api/projects/:slug`
- **Access**: Public
- **Response**: Single project with gallery, individual plot inventory, amenities, and location connectivity.

### `POST /api/projects`
- **Access**: Protected (Bearer Token)
- **Body**: Complete project payload (`name`, `description`, `location`, `price_range`, `status`, `main_image_url`, `highlights`, `connectivity`, `amenity_ids`).

### `PUT /api/projects/:id`
- **Access**: Protected (Bearer Token)
- **Body**: Partial project updates.

### `DELETE /api/projects/:id`
- **Access**: Protected (Bearer Token)

---

## 3. Properties / Plots Endpoints

### `GET /api/properties`
- **Access**: Public
- **Query Params**: `project_id`, `status`, `type`, `min_price`, `max_price`

### `GET /api/properties/:slug`
- **Access**: Public

### `POST /api/properties`
- **Access**: Protected (Bearer Token)
- **Body**: `project_id`, `title`, `plot_number`, `property_type`, `area_sqft`, `dimensions`, `facing`, `price`, `status`, `description`.

### `PUT /api/properties/:id`
- **Access**: Protected (Bearer Token)

### `DELETE /api/properties/:id`
- **Access**: Protected (Bearer Token)

---

## 4. Lead Capture Endpoints

### `POST /api/leads`
- **Access**: Public (Rate-limited)
- **Body**:
  ```json
  {
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "project_id": "optional-uuid",
    "property_id": "optional-uuid",
    "source": "WEBSITE_FORM",
    "message": "Interested in East facing 1200 sqft plot."
  }
  ```

### `GET /api/leads`
- **Access**: Protected (Bearer Token)
- **Query Params**: `status`, `project_id`, `search`, `page`, `limit`

### `PUT /api/leads/:id`
- **Access**: Protected (Bearer Token)
- **Body**: `{ "status": "CONTACTED", "notes": "Scheduled site visit on Sunday." }`

---

## 5. Contact Enquiry Endpoints

### `POST /api/contact`
- **Access**: Public (Rate-limited)
- **Body**: `{ "name": "...", "phone": "...", "email": "...", "subject": "...", "message": "..." }`

### `GET /api/contact`
- **Access**: Protected (Bearer Token)

---

## 6. Dashboard Endpoints

### `GET /api/dashboard/stats`
- **Access**: Protected (Bearer Token)
- **Response**: Summary metrics (Total Projects, Active Projects, Total Properties, Available Properties, Total Leads, New Leads, Recent Leads list).
