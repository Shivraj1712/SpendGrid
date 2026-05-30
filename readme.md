# SpendGrid

SpendGrid is a high-performance full-stack expense tracker application built using a clean, decoupled architecture. The ecosystem features a secure Go (Golang) REST API powered by the Fiber web framework and GORM connected to a Neon PostgreSQL database, alongside a global-state Next.js App Router frontend deployed to Vercel.

## 🚀 Live Environments

- **Production Frontend Domain:** https://spend-grid-lovat.vercel.app
- **Production Backend API Domain:** https://spendgrid-2.onrender.com

---

## 🛠️ Tech Stack & Architecture

### Backend Core

- **Language:** Go (Golang) v1.26.3
- **Web Framework:** Fiber v2 (Configured with custom 16KB header buffers to prevent local cookie bloating)
- **ORM:** GORM (Object Relational Mapping)
- **Database:** Neon PostgreSQL (Serverless cloud instance)
- **Authentication:** Stateless JSON Web Tokens (JWT) handled via secure browser handshakes

### Frontend Core

- **Framework:** Next.js (App Router)
- **HTTP Client:** Axios (Configured explicitly with withCredentials: true for cross-site cookie transfers)
- **State Management:** React Context API (AuthContext) acting as global auth middleware
- **Architecture Note:** This project represents a backend-focused engineering study exploring robust Go system design and data mutations. To expedite production endpoint testing, the Next.js frontend client wrapper was rapidly prototyped using AI generation.

---

## 🔐 Security & Production Cookie Configuration

To ensure absolute cross-domain synchronization between the Next.js frontend (hosted on Vercel) and the Go backend (hosted on Render), the application bypasses third-party browser blocking rules using strict cookie permissions:

- **HTTPOnly:** Enabled to prevent client-side JavaScript execution blocks or Cross-Site Scripting (XSS) extraction.
- **Secure:** Explicitly set to true ensuring tokens are encrypted and transmitted solely over HTTPS.
- **SameSite:** Set strictly to CookieSameSiteNoneMode (SameSite=None) to declare cross-origin data passing safe between distinct web domains.
- **CORS Whitelisting:** Production origins tightly packed without trailing slashes or formatting spaces to avoid alignment validation rejections by modern browser engines.

---

## 📂 Complete Project Folder Structure

The complete SpendGrid repository maps out into two isolated root-level application spaces:

```text
SpendGrid/
├── client/                 # Next.js Frontend Application
│   ├── public/             # Static production assets
│   └── src/
│       ├── app/            # App Router pages and layouts
│       ├── components/     # UI elements and layout modules
│       └── context/        # React AuthContext global state managers
├── server/                 # Go (Golang) Backend API
│   ├── cmd/
│   │   └── api/
│   │       └── main.go     # Core server entry point & CORS definitions
│   ├── internal/
│   │   ├── config/         # Infrastructure validation models
│   │   ├── database/       # GORM connection pools
│   │   ├── handler/        # HTTP request parsers & structural response contexts
│   │   ├── middleware/     # Custom global error interceptors & JWT validators
│   │   ├── router/         # Modular route groups (User, Expense)
│   │   └── service/        # Pure isolated business and mutation logic
│   └── pkg/
│       ├── logger/         # Structured console monitors
│       ├── response/       # Universal JSON marshalling shapes
│       └── validator/      # Payload verification structs
└── README.md               # Unified workspace blueprint
```
