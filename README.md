# PayFlex — 1Fi SDE1 Assignment

PayFlex is a modern, responsive full-stack product discovery and EMI financing application built for the **1Fi SDE1 Assignment**. It showcases products with multiple EMI plans backed by mutual funds, dynamic variant switching (color, storage, finish), real-time EMI recalculations, and an authoritative demo checkout flow.

> **Smart products. Flexible EMI plans backed by mutual funds.**

---

## Deliverables Checklist

- [x] **Dynamic product page** with product details (name, variant, MRP, price, product image)
- [x] **Available EMI plans** with Monthly payment amount, Tenure (in months), Interest rate (0% or 10.5%), Cashback information
- [x] **Selectable EMI plans** with keyboard accessibility and visual indicators
- [x] **Proceed button** with authoritative checkout intent and summary dialog
- [x] **Backend API connected to database** (no hardcoded data)
- [x] **Unique SEO-friendly URLs** for each product (`/products/iphone-17-pro`, `/products/samsung-s24-ultra`, etc.)
- [x] **3 products with 2+ variants each** (color, finish, storage options)
- [x] **API endpoints** (`/api/products`, `/api/products/:id`, `/api/products/:slug/emi-plans`, `/api/checkout/intent`)
- [x] **MongoDB NoSQL database** with Mongoose schema & seed script
- [x] **README.md** with setup instructions, API endpoints, responses, tech stack, and schema

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, React Router v7, Lucide Icons |
| **Backend** | Node.js (v20+), Express 5, TypeScript, tsx |
| **Database** | MongoDB Atlas / MongoDB |
| **ODM / Modeling** | Mongoose 9 |
| **Validation** | Zod |
| **Testing** | Vitest, React Testing Library, Supertest |

---

## Architecture

The browser and API communicate via REST endpoints with standard JSON response envelopes (`{ success: true, data: ... }`).

```text
Browser (React + Vite)
  └─ GET/POST /api/*
       └─ Express routes + Zod validation
            └─ Catalog service + EMI calculation engine
                 └─ Mongoose ODM
                      └─ MongoDB Atlas
```

- `src/client`: React storefront, catalog, product detail experience, EMI plan selector, checkout modal, loading skeletons, responsive Tailwind CSS styling.
- `server`: Express 5 app, route validation schemas, Mongoose models, and catalog service.
- `src/shared`: Shared TypeScript types/contracts and canonical EMI calculation formula.
- `server/models`: Normalized Mongoose schemas with embedded variants and EMI plans.
- `server/seed.ts`: Seed script populating 3 products with 7 variants and comprehensive EMI tenures.
- `public/products`: High-resolution SVG product artwork.

---

## Database Schema (MongoDB / Mongoose)

Defined in [`server/models/product.ts`](server/models/product.ts):

### `Product` (Document)
| Field | Type | Description |
| --- | --- | --- |
| `_id` | `ObjectId` | Auto-generated MongoDB primary key |
| `slug` | `String` | Unique SEO slug (e.g. `iphone-17-pro`) |
| `name` | `String` | Product name (e.g. `iPhone 17 Pro`) |
| `brand` | `String` | Brand name (e.g. `Apple`) |
| `badge` | `String` | Optional badge (e.g. `JUST IN`, `EDITOR’S PICK`) |
| `description` | `String` | Full marketing / product overview |
| `category` | `String` | Product category (e.g. `Smartphones`) |
| `basePrice` | `Number` | Base selling price in INR (e.g. `127400`) |
| `mrp` | `Number` | Maximum Retail Price in INR (e.g. `134900`) |
| `variants` | `[ProductVariant]` | Array of embedded variant sub-documents |
| `emiPlans` | `[EmiPlan]` | Array of embedded EMI plan sub-documents |
| `createdAt` | `Date` | Creation timestamp |
| `updatedAt` | `Date` | Update timestamp |

### `ProductVariant` (Embedded Sub-document)
| Field | Type | Description |
| --- | --- | --- |
| `_id` | `ObjectId` | Variant unique identifier |
| `color` | `String` | Display color name (e.g. `Cosmic Orange`) |
| `colorHex` | `String` | Hex color code for swatch preview |
| `storage` | `String` | Storage tier (e.g. `256GB`, `512GB`) |
| `finish` | `String` | Finish texture (e.g. `Satin titanium`) |
| `imageUrl` | `String` | Relative URL to product image |
| `priceAdjustment` | `Number` | Price delta added to basePrice (e.g. `0` or `20000`) |
| `inventory` | `Number` | Available stock count |

### `EmiPlan` (Embedded Sub-document)
| Field | Type | Description |
| --- | --- | --- |
| `_id` | `ObjectId` | Plan unique identifier |
| `tenureMonths` | `Number` | Tenure in months (3, 6, 12, 24, 36, 48, 60) |
| `interestRate` | `Number` | Annual interest rate (0% for no-cost, 10.5% standard) |
| `cashbackAmount` | `Number` | Cashback credited upon purchase (e.g. `7500`) |
| `processingFee` | `Number` | One-time processing fee |
| `isActive` | `Boolean` | Activation flag |

---

## EMI Calculation Formula

Implemented in [`src/shared/emi.ts`](src/shared/emi.ts):

### 1. Zero-Interest (No-Cost EMI)
$$\text{Monthly Payment} = \frac{\text{Principal}}{\text{Tenure Months}}$$

### 2. Standard Interest-Bearing EMI (Reducing Balance)
$$r = \frac{\text{Annual Interest Rate}}{12 \times 100}$$
$$\text{EMI} = P \times r \times \frac{(1 + r)^n}{(1 + r)^n - 1}$$

Where:
- $P$ = Selected variant price ($\text{basePrice} + \text{priceAdjustment}$)
- $r$ = Monthly interest rate
- $n$ = Tenure in months

---

## API Endpoints & Example Responses

All responses adhere to a consistent `{ success: boolean, data?: ..., error?: ... }` envelope.

### 1. `GET /api/products`
Lists all products with summary pricing, variant counts, zero-interest flag, and starting monthly payment.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "67cb2a98f7e8b61c9e8d4a10",
      "slug": "iphone-17-pro",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "badge": "JUST IN",
      "category": "Smartphones",
      "price": 127400,
      "mrp": 134900,
      "imageUrl": "/products/iphone-orange.svg",
      "startingMonthlyPayment": 2739,
      "hasZeroInterest": true,
      "variantCount": 3
    }
  ]
}
```

### 2. `GET /api/products/:id` (or `:slug`)
Retrieves full details for a product by its unique slug or MongoDB ObjectId, including all variants and server-computed EMI plans.

**Example Request:** `GET /api/products/iphone-17-pro`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "67cb2a98f7e8b61c9e8d4a10",
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "badge": "JUST IN",
    "description": "A refined pro phone experience with a vivid display...",
    "category": "Smartphones",
    "basePrice": 127400,
    "mrp": 134900,
    "variants": [
      {
        "id": "67cb2a98f7e8b61c9e8d4a11",
        "color": "Cosmic Orange",
        "colorHex": "#d96a32",
        "storage": "256GB",
        "finish": "Satin titanium",
        "imageUrl": "/products/iphone-orange.svg",
        "priceAdjustment": 0,
        "inventory": 12,
        "price": 127400
      }
    ],
    "emiPlans": [
      {
        "id": "67cb2a98f7e8b61c9e8d4a14",
        "tenureMonths": 3,
        "interestRate": 0,
        "cashbackAmount": 7500,
        "processingFee": 0,
        "monthlyPayment": 42467,
        "totalPayable": 127400
      }
    ]
  }
}
```

### 3. `GET /api/products/:slug/emi-plans?variantId=:id`
Recalculates active EMI plans for a specific variant price.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "67cb2a98f7e8b61c9e8d4a14",
      "tenureMonths": 12,
      "interestRate": 0,
      "cashbackAmount": 5000,
      "processingFee": 0,
      "monthlyPayment": 10617,
      "totalPayable": 127400
    }
  ]
}
```

### 4. `POST /api/checkout/intent`
Validates variant inventory and EMI plan before issuing an authoritative demo confirmation.

**Request Body:**
```json
{
  "productSlug": "iphone-17-pro",
  "variantId": "67cb2a98f7e8b61c9e8d4a11",
  "emiPlanId": "67cb2a98f7e8b61c9e8d4a14"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "intentId": "e9b21f9c-5a9d-43cb-b092-1c70e303d7c5",
    "status": "ready",
    "product": {
      "name": "iPhone 17 Pro",
      "slug": "iphone-17-pro"
    },
    "variant": {
      "id": "67cb2a98f7e8b61c9e8d4a11",
      "label": "256GB · Cosmic Orange",
      "imageUrl": "/products/iphone-orange.svg"
    },
    "price": 127400,
    "plan": {
      "id": "67cb2a98f7e8b61c9e8d4a14",
      "tenureMonths": 12,
      "interestRate": 0,
      "cashbackAmount": 5000,
      "processingFee": 0,
      "monthlyPayment": 10617,
      "totalPayable": 127400
    },
    "disclaimer": "Demo only — no payment or credit application will be created."
  }
}
```

### 5. `GET /api/health`
Health check endpoint returning `{ "success": true, "data": { "status": "ok" } }`.

---

## Getting Started

### Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **MongoDB**: MongoDB Atlas connection string or local MongoDB (`mongodb://localhost:27017/payflex`)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd "1Fi Assignment"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

   Set your MongoDB URI in `.env`:
   ```env
   DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/payflex?retryWrites=true&w=majority"
   PORT=4000
   CLIENT_ORIGIN="http://localhost:5173"
   ```

4. **Seed the database:**
   ```bash
   npm run db:seed
   ```
   This inserts 3 flagship smartphone products, 7 variants, and full EMI plans into MongoDB.

5. **Start the development servers:**
   ```bash
   npm run dev
   ```
   - **Frontend (Vite)**: [http://localhost:5173](http://localhost:5173)
   - **API (Express)**: [http://localhost:4000](http://localhost:4000)

---

## Testing & Quality Checks

Run all automated unit and integration tests:
```bash
npm test
```

Run TypeScript and production build checks:
```bash
npm run build
```

Run linter:
```bash
npm run lint
```
