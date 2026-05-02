# Cook-Cart AI

Cook-Cart AI is a full-stack grocery shopping website where users generate recipes with AI, add missing ingredients to cart, and test checkout through Stripe sandbox mode.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Auth: JWT, bcryptjs
- AI: Gemini API with local fallback demo recipe
- Payment: Stripe Checkout sandbox/test mode

## Setup

1. Install dependencies:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

2. Update `server/.env`:

```env
PORT=5010
MONGO_URI=mongodb://127.0.0.1:27017/cookcart_ai
JWT_SECRET=cookcart_super_secret_key
CLIENT_URL=http://localhost:5175
STRIPE_SECRET_KEY=your_stripe_test_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

3. Start MongoDB locally.

4. Seed products:

```bash
cd server
npm run seed
```

5. Run backend and frontend together from the project root:

```bash
npm run dev
```

Frontend: `http://localhost:5175`

Backend: `http://localhost:5010`

## Notes

- If the Gemini key is missing or Gemini fails, `/api/ai/generate-recipe` returns a fallback demo recipe.
- Stripe payment uses Checkout Sessions. Use only `sk_test_...` keys.
- If Stripe is not configured, checkout returns a local demo success URL and still creates the order.
- Admin-only product and order routes require a user with `role: "admin"` in MongoDB.
