# CLAUDE.md

This project is an enterprise-grade frontend application.

The AI must strictly follow all architecture rules, folder structure, and coding conventions defined below.
Do not generate alternative patterns.

---

# Tech Stack

Framework:
- Next.js (App Router)
- React
- TypeScript

UI:
- TailwindCSS
- shadcn/ui
- Lucide React

State:
- Zustand

Validation:
- Zod

HTTP:
- Axios

---

# Folder Structure (STRICT)

src/
  app/                 → Next.js pages only
  components/
    ui/                → shadcn components ONLY
    common/            → shared components
    business/          → business components
  features/            → feature modules
  store/               → Zustand stores
  hooks/               → custom hooks
  lib/                 → utils / request
  types/               → global types
  schemas/             → zod schemas

AI must never place business logic inside app directory.

---

# Page Rules

Each page must follow:

page.tsx
loading.tsx (optional)
error.tsx (optional)

Page must only:

- compose components
- call hooks
- no business logic

---

# Component Rules

All components must be:

- functional component
- typed with TypeScript
- use Tailwind only
- use shadcn when possible

Do not create class components.

---

# Feature Module Structure

features/user/

index.ts
api.ts
types.ts
schema.ts
store.ts
components/
hooks/

AI must always follow this structure.

---

# API Rules

All API must:

- use Axios instance
- defined in features/*/api.ts
- never call axios directly in components

Bad:

useEffect(() => axios.get())

Good:

useUserList()

---

# Zustand Rules

Store location:

store/
or
features/*/store.ts

Rules:

- no business logic in components
- use selector
- no inline store

---

# Form Rules

Forms must use:

react-hook-form
zod
shadcn form components

Structure:

schema.ts
form.tsx

---

# UI Rules

Prefer shadcn components:

- Button
- Input
- Card
- Dialog
- Table
- Dropdown

Icons:

Use lucide-react only.

---

# Styling Rules

Only TailwindCSS.

Do not:

- write css files
- use styled-components
- inline style

---

# Table Rules

All tables must support:

- loading
- empty state
- pagination
- search (if needed)

Use shadcn table.

---

# Dialog Rules

All dialogs must:

- controlled open state
- form inside dialog
- submit + cancel

---

# Code Style

Always:

- use arrow function
- use const
- no any
- typed props
- export default page
- named export components

---

# Imports Order

1 react
2 next
3 third libs
4 ui
5 hooks
6 store
7 types

---

# Do Not

Do not:

- create duplicate components
- write inline axios
- mix business logic
- break folder structure
- create new UI system

AI must follow this strictly.