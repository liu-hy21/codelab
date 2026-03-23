When user requests a new page:

Example:
"Create user management page"

Follow steps strictly:

Step 1

Create feature folder

features/user/

Step 2

Create files:

api.ts
types.ts
schema.ts
store.ts

Step 3

Create components

components/
UserTable.tsx
UserForm.tsx
UserDialog.tsx

Step 4

Create hooks

hooks/
useUserList.ts
useUserMutation.ts

Step 5

Create page

app/users/page.tsx

Step 6

Wire everything

page
-> hook
-> store
-> api

Step 7

Add:

loading
empty
error

Step 8

Ensure:

typed
clean
production ready

Never skip steps.