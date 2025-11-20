# 🎯 GoalTracker

> A modern goal management application built with React, TypeScript, and TailwindCSS.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Track personal and professional goals with role-based access control, category organization, and a responsive interface.

## 📸 Screenshots

[Home Page](./docs/screenshots/home.png) <br>
[Users Management](./docs/screenshots/userManagmentPage.png) <br>
[Register Page - Dark theme](./docs/screenshots/register-dark.png) <br>
[Goals Page - Dark theme](./docs/screenshots/goals-dark.png) <br>

## 🎬 Demo

[//]: # ([Demo]&#40;./docs/demo.gif&#41;)

**👉 Live Demo:** Coming Soon

---

## ✨ Features

- **Goal Management** - Create, edit, track, and delete goals with categories and due dates
- **JWT Authentication** - Secure login/registration with role-based access control
- **User Roles** - User, Admin, and SuperAdmin with different permissions
- **Category System** - Organize goals with custom categories
- **Dark/Light Theme** - Automatic system detection with manual toggle
- **Responsive Design** - Mobile-first, works on all devices
- **Form Validation** - Real-time validation with Zod and React Hook Form
- **Toast Notifications** - User-friendly feedback messages

---

## 🛠️ Tech Stack

**Core:**
- React 19.2, TypeScript 5.9, Vite 7.2, React Router 7.9

**UI & Styling:**
- TailwindCSS 4.1, Radix UI (Dialog, Label, Switch), Lucide Icons

**Forms & Validation:**
- React Hook Form 7.65, Zod 4.1

**Authentication:**
- JWT Decode 4.0, js-cookie 3.0, React Context API

**Notifications:**
- Sonner 2.0

---

## 🚀 Installation & Setup

**Prerequisites:**
- Node.js 18+ and npm 9+
- [GoalTracker API](https://github.com/vastriantafyllou/GoalTrackerAPI/blob/main/README.md) running

**Quick Start:**

```bash
# Clone repository
git clone https://github.com/vastriantafyllou/goal-tracker-react.git
cd goal-tracker-react

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set VITE_API_URL=https://localhost:5001

# Start development server
npm run dev
```

App runs at `http://localhost:5173`

**First Login:**
- Username: `superadmin`
- Password: Set in backend User Secrets

---

## 📁 Environment Configuration

Create a `.env` file:

```env
VITE_API_URL=https://localhost:5001
```

**Production:** Update `VITE_API_URL` to your deployed backend URL.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── pages/           # Route pages (HomePage, GoalsPage, etc.)
│   ├── ui/              # Reusable UI (Button, Input, Dialog, etc.)
│   ├── layout/          # Header, Footer, Layout
│   └── ProtectedRoute.tsx
├── context/             # AuthProvider, ThemeProvider
├── hooks/               # useAuth, useTheme
├── schemas/             # Zod validation schemas
├── services/            # API calls (api.goals.ts, api.users.ts, etc.)
├── utils/               # Cookie helpers
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

**Key Folders:**
- `components/pages/` - Page components
- `services/` - Backend API integration
- `schemas/` - Form validation
- `context/` - Global state (Auth, Theme)

---

## 🔑 Role-Based Features

| Role | Permissions |
|------|-------------|
| **User** | Manage own goals and categories |
| **Admin** | User permissions + view/manage all users |
| **SuperAdmin** | Admin permissions + promote/demote users |

**Routes:**
- `/` - Public home page
- `/login`, `/register` - Authentication
- `/goals` - Goal management (authenticated)
- `/categories` - Category management (authenticated)
- `/users` - User management (Admin/SuperAdmin only)

---

## 🎨 Dark/Light Theme

- Auto-detects system preference
- Manual toggle in header
- Persisted to localStorage
- Smooth CSS transitions

**Implementation:**
```typescript
const { theme, setTheme } = useTheme();
setTheme(theme === "dark" ? "light" : "dark");
```

---

## 🔌 API Communication

**Backend:** [GoalTracker API](https://github.com/vastriantafyllou/GoalTrackerAPI/tree/main) (.NET 8)

**Service Layer:** All API calls in `src/services/`
- `api.login.ts` - Authentication
- `api.users.ts` - User management
- `api.goals.ts` - Goal CRUD
- `api.categories.ts` - Category CRUD

**Auth Flow:**
1. Login → JWT token stored in cookie
2. Token decoded → User info extracted (ID, username, role)
3. Protected requests → JWT sent in `Authorization` header
4. 401 error → Auto-redirect to login

**Example:**
```typescript
const token = getCookie("access_token");
fetch(`${VITE_API_URL}/api/Goals/GetMyGoals`, {
  headers: { "Authorization": `Bearer ${token}` }
});
```

---

## 📜 Development Scripts

```bash
npm run dev      # Development server (localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vasileios Triantafyllou**

- [LinkedIn](https://www.linkedin.com/in/vasileios-triantafyllou-0b028710b/)
- [GitHub](https://github.com/vastriantafyllou)
- Email: triantafyllou.vasileios@gmail.com

---

## 🔗 Related

- **Backend API:** [GoalTrackerAPI](https://github.com/vastriantafyllou/GoalTrackerAPI/tree/main)

---

<p align="center">Made with ❤️ by Vasileios Triantafyllou</p>
<p align="center">⭐ Star this repo if you find it useful!</p>
