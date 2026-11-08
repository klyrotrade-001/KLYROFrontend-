# KLYRO Storefront

The storefront reads products, categories, orders, and newsletter subscriptions from the Express backend.

## Backend connection

Start the backend from the project root:

```bash
cd backend
npm install
npm run dev
```

The backend listens on `http://localhost:5001` by default. The frontend API client uses
`http://localhost:5001/api` unless `NEXT_PUBLIC_API_URL` is set. For example, set
`NEXT_PUBLIC_API_URL=https://api.example.com/api` in the frontend environment for a deployed backend.

The storefront updates product and category data from the backend. Bundled values remain available as initial fallbacks in the components that already use them.
# KLYROF
# KLYROFront-
