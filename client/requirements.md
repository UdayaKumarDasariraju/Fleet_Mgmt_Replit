## Packages
recharts | For financial cashflow charts and dashboard visualization
date-fns | For date formatting and manipulation
react-day-picker | Calendar component dependency (usually peer dep of shadcn calendar)

## Notes
- Tailwind config must include "font-display" and "font-body" families
- Backend provides cents for money values, frontend must format to currency
- Using existing shadcn/ui components in @/components/ui
- Authentication is handled via /api/login and /api/logout (Replit Auth)
