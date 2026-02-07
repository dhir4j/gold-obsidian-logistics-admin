# Waynex Logistics Admin Dashboard

A modern, responsive admin dashboard built with Next.js for managing logistics operations at Waynex.

## 🚀 Features

- **Dashboard**: Real-time analytics and key metrics overview
- **Shipments Management**: Track and manage all shipments with status updates
- **Customer Management**: View and manage customer accounts
- **Employee Management**: Monitor employee accounts and balances
- **Payment Requests**: Review and approve/reject payment submissions
- **Balance Codes**: Generate and manage employee top-up codes

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Charts**: Recharts (ready for integration)

## 📋 Prerequisites

- Node.js 18+ installed
- Waynex Logistics backend running (default: `http://localhost:5000`)

## 🔧 Installation

1. **Navigate to the admin frontend directory**:
   ```bash
   cd /home/dhir4j/Documents/Dhillon/Waynex/Template/waynex-logistics-backend/admin-frontend
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   The `.env.local` file is already set up with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

   Update this if your backend is running on a different URL.

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📱 Usage

### Login

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. You'll be redirected to the login page
3. **Demo Mode**: Use any email (e.g., `admin@waynex.com`) with any password to login
4. For production, integrate with the actual backend auth endpoint

### Navigation

The dashboard includes a collapsible sidebar with the following sections:

- **Dashboard**: Overview with key metrics
- **Shipments**: Manage all logistics shipments
- **Customers**: View and manage customer accounts
- **Employees**: Monitor employee accounts and balances
- **Payments**: Review payment requests
- **Balance Codes**: Generate top-up codes for employees

### Key Features

#### Dashboard
- View total shipments, revenue, and customer count
- Average revenue per shipment
- Recent activity feed
- Quick stats panel

#### Shipments
- Paginated shipment list with search
- Filter by status
- View shipment details
- Status indicators with color coding

#### Customers
- Search customers by name or email
- View total shipments per customer
- Paginated table view

#### Employees
- View employee list with balances
- Track shipments created by employees
- Monitor account status

#### Payments
- Review pending payment requests
- Approve or reject payments
- View UTR numbers and amounts
- Status tracking (Pending/Approved/Rejected)

#### Balance Codes
- Generate new balance codes with custom amounts
- Filter by active/redeemed status
- Delete unused codes
- View redemption details

## 🔐 Authentication

The current implementation uses localStorage for session management:

- **Session Storage**: `admin_session` key in localStorage
- **Session Data**: Email, first name, last name, and admin flag
- **Protected Routes**: All admin routes check for valid session

For production, implement proper JWT authentication with the backend.

## 🎨 Design System

The dashboard uses a consistent design system based on the Travels dashboard:

- **Primary Color**: Blue/Indigo (`#5865f2`)
- **Accent Color**: Purple (`#d946ef`)
- **Typography**: System fonts with clear hierarchy
- **Spacing**: Consistent padding and margins
- **Components**: Shadcn UI for consistency

### Status Colors

- **Pending Payment**: Yellow/Warning
- **Booked**: Blue/Default
- **In Transit**: Gray/Secondary
- **Out for Delivery**: Blue/Default
- **Delivered**: Green/Success
- **Cancelled**: Red/Destructive

## 📡 API Integration

The dashboard communicates with the backend using:

- **Base URL**: Set in `NEXT_PUBLIC_API_URL`
- **Authentication**: `X-User-Email` header for all admin requests
- **Hooks**: Custom `useApi` hook for GET requests
- **Mutations**: `apiMutate` helper for POST/PUT/DELETE

### API Endpoints Used

```typescript
// Dashboard
GET /admin/web_analytics

// Shipments
GET /admin/shipments?page=1&limit=10&q=search&status=Booked

// Customers
GET /admin/users?page=1&limit=10&q=search

// Employees
GET /admin/employees?page=1&limit=10&q=search

// Payments
GET /admin/payments
PUT /admin/payments/:id/status

// Balance Codes
GET /admin/balance-codes?status=active|redeemed
POST /admin/balance-codes
DELETE /admin/balance-codes/:id
```

## 📂 Project Structure

```
admin-frontend/
├── app/
│   ├── (admin)/              # Admin routes (protected)
│   │   ├── layout.tsx        # Admin layout with sidebar
│   │   ├── dashboard/        # Dashboard page
│   │   ├── shipments/        # Shipments management
│   │   ├── customers/        # Customer management
│   │   ├── employees/        # Employee management
│   │   ├── payments/         # Payment requests
│   │   └── balance-codes/    # Balance codes
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Redirects to login
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # Shadcn UI components
│   └── StatCard.tsx          # Dashboard stat card
├── hooks/
│   ├── use-api.ts            # API fetching hook
│   ├── use-session.ts        # Session management
│   └── use-mobile.tsx        # Mobile detection
├── lib/
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # TypeScript types
└── README.md                 # This file
```

## 🔄 State Management

- **Sessions**: localStorage with useSession hook
- **API Data**: useApi hook with SWR-like behavior
- **Local State**: React useState for component state

## 🎯 Future Enhancements

1. **Real Authentication**: Integrate with backend JWT auth
2. **Charts**: Add Recharts visualizations to dashboard
3. **Shipment Details**: Create detailed shipment view page
4. **Customer Details**: Create detailed customer profile page
5. **CRUD Operations**: Add create/edit/delete for employees
6. **Export**: Add CSV/Excel export for data
7. **Filters**: Advanced filtering options
8. **Real-time Updates**: WebSocket integration for live updates
9. **Notifications**: Toast notifications for actions
10. **Dark Mode**: Theme toggle for dark mode

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use:
```bash
npm run dev -- -p 3001
```

### API Connection Issues

1. Verify backend is running on `http://localhost:5000`
2. Check `.env.local` for correct `NEXT_PUBLIC_API_URL`
3. Ensure CORS is enabled on the backend

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## 📝 Notes

- This is a demo/development version with mock authentication
- For production, implement proper security measures
- All API calls require admin authentication via X-User-Email header
- The dashboard is fully responsive and works on mobile devices

## 🤝 Contributing

When making changes:

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Maintain consistent styling with Tailwind
4. Test on multiple screen sizes
5. Update this README if adding new features

## 📞 Support

For issues or questions, refer to:
- Backend API documentation
- Shadcn UI documentation
- Next.js documentation

---

Built with ❤️ for Waynex Logistics
