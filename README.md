# 💰 Personal Finance Tracker - UI (Angular)

A modern, responsive web application built with **Angular 21** that helps users track their income, expenses, and manage their personal finances efficiently. This is the frontend component of the Personal Finance Tracker project.

## ✨ Features

### 🔐 Authentication System
- **User Registration** - Create new account with email and password validation
- **User Login** - Secure login with JWT token-based authentication
- **Password Reset** - OTP-based password reset functionality
- **Change Password** - Logged-in users can update their password
- **Session Validation** - Automatic token refresh to keep sessions alive

### 📊 Dashboard
- **Financial Summary** - Display total income, expenses, and remaining balance
- **Interactive Charts**
  - Bar chart for income vs expense trends
  - Donut chart for expense distribution by category
  - Area chart for revenue trends
  - Radial chart for overdue reminder percentage
- **Recent Transactions** - Quick view of latest transactions
- **Dashboard Analytics** - Comprehensive financial overview

### 💳 Transaction Management
- **Add Transactions** - Record income and expense transactions
- **View Transactions** - Display all transactions in a sortable table
- **Edit Transactions** - Modify existing transaction details
- **Delete Transactions** - Remove transactions with confirmation
- **Filter by Category** - Filter transactions by category
- **Filter by Type** - View only income or expense transactions

### 🏷️ Category Management
- **Create Categories** - Add custom income and expense categories
- **View Categories** - See all categories organized by type
- **Delete Categories** - Remove unused categories
- **Pre-defined Categories** - Food, Rent, Salary, etc.

### 🔔 Bill Reminders
- **Create Reminders** - Set bill payment reminders with due dates
- **Mark as Paid** - Update reminder status to completed
- **Mark as Read** - Track which reminders have been viewed
- **Edit Reminders** - Update reminder details via dialog
- **Delete Reminders** - Remove old reminders
- **Urgency Indicator** - Visual indication for bills due within 3 days

### 👤 User Profile
- **Profile Management** - View and manage user information
- **Change Password** - Securely update account password
- **Logout** - Clear session and return to login

---

## 🛠️ Tech Stack

### Frontend Framework
- **Angular 21** - Latest Angular framework with standalone components
- **TypeScript 5.9** - Strongly typed JavaScript
- **RxJS 7.8** - Reactive programming with Observables

### UI & Styling
- **Angular Material 21** - Professional Material Design components
- **SCSS** - Advanced CSS with variables and mixins
- **Responsive Design** - Mobile-first approach

### Charts & Visualization
- **ApexCharts 5.10** - Modern, interactive charts
- **ng-apexcharts 2.3** - Angular wrapper for ApexCharts

### Development Tools
- **Angular CLI 21** - Command-line tool for Angular development
- **Vitest 4.0** - Fast unit testing framework
- **Prettier 3.8** - Code formatting


## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - v18.x or higher ([Download](https://nodejs.org/))
- **npm** - v9.x or higher (comes with Node.js)
- **Angular CLI** - Latest version (install with `npm install -g @angular/cli`)
- **Git** - For version control

### Verify Installation
```bash
node --version
npm --version
ng version
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/personal-finance-tracker-ui.git
cd personal-finance-tracker-ui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Update the API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  apiUrl: 'http://localhost:8000/api'  // Update with your backend URL
};
```

For production (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  apiUrl: 'https://your-backend-domain.com/api'
};
```

### 4. Verify Installation
```bash
npm list  # Verify all dependencies are installed correctly
```

---

## 🏃 Running the Application

### Development Server
```bash
npm start
# or
ng serve
```

The application will be available at **http://localhost:4200**

### Watch Mode (For Development)
```bash
npm run watch
# or
ng build --watch --configuration development
```

### Running Tests
```bash
npm test
# or
ng test
```

---

## 📦 Building for Production

### Build the Project
```bash
npm run build
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

### Build Output
- Minified and optimized bundle
- Tree-shaking enabled for smaller size
- Source maps available for debugging
- Assets cached with hash-based naming

---

## 🧩 Key Components

### Authentication Components
- **Login** - User authentication with username/password
- **Register** - New user registration
- **ForgotPassword** - OTP-based password reset

### Dashboard Components
- **DashboardHome** - Main dashboard with charts and summary
- **DashboardLayout** - Layout wrapper with sidebar and header

### Transaction Components
- **Transactions** - CRUD operations for transactions
- **TransactionEdit** - Dialog for editing transactions

### Category Components
- **Categories** - Create, view, and delete categories

### Reminder Components
- **Reminder** - Manage bill reminders
- **EditReminder** - Dialog for editing reminders

### Layout Components
- **Header** - Top navigation with user menu
- **Sidebar** - Left navigation with menu items
- **Home** - Landing page

---

## 🔌 API Integration

### API Service
The **ApiService** (`src/app/shared/service/api/api-service.ts`) handles all HTTP communication with the backend.

### Main API Endpoints

#### Authentication
```
POST   /auth/login              # User login
POST   /auth/register           # User registration
POST   /auth/change-password    # Change password
POST   /auth/verify             # Verify session
POST   /auth/otp-request        # Request OTP for password reset
POST   /auth/otp-confirm        # Confirm OTP and reset password
```

#### Categories
```
GET    /category/               # Get all categories
POST   /category/create         # Create new category
DELETE /category/{id}/delete    # Delete category
```

#### Transactions
```
GET    /transactions/           # Get all transactions
POST   /transactions/create     # Create transaction
PUT    /transactions/{id}/update  # Update transaction
DELETE /transactions/{id}/delete  # Delete transaction
```

#### Reminders
```
GET    /reminders/              # Get all reminders
POST   /reminders/create        # Create reminder
PUT    /reminders/{id}/update   # Update reminder
PATCH  /reminders/{id}/action   # Update reminder status
DELETE /reminders/{id}/delete   # Delete reminder
```

#### Dashboard
```
GET    /dashboard/summary       # Get dashboard summary with charts
```

---

## 🔐 Authentication

### JWT Token Management
- Tokens are stored in **localStorage**
- **Access Token** - Used for API requests (short-lived)
- **Refresh Token** - Used to get new access token (long-lived)
- Automatic token refresh via session validation

### Auth Guard
Routes under `/dashboard` are protected by `authGuardTsGuard`. Users must be logged in to access these routes.

### Session Validation
The `DashboardLayout` component validates the session on load and refreshes tokens if needed.

---

## 📄 Pages & Routes

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/` | Home | ❌ | Landing page |
| `/login` | Login | ❌ | User login |
| `/register` | Register | ❌ | User registration |
| `/forgot-password` | ForgotPassword | ❌ | Password reset |
| `/dashboard` | DashboardLayout | ✅ | Main layout |
| `/dashboard` (default) | DashboardHome | ✅ | Dashboard with charts |
| `/dashboard/transactions` | Transactions | ✅ | Transactions management |
| `/dashboard/categories` | Categories | ✅ | Categories management |
| `/dashboard/reminders` | Reminder | ✅ | Bill reminders |
| `/dashboard/change-password` | ChangePassword | ✅ | Change password |

---

## 🎯 Application Flow

```
1. User visits app → Home page
                  ↓
2. User logs in → Login page → Verify credentials → Token stored
                  ↓
3. Access Dashboard → Session validation → Token refresh if needed
                  ↓
4. View/Manage:
   - Transactions
   - Categories
   - Reminders
   - Dashboard analytics
                  ↓
5. Logout → Clear tokens → Redirect to Login
```

---

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** (1920px and above)
- **Tablet** (768px - 1024px)
- **Mobile** (320px - 767px)

Uses **Angular Material** and **CSS Media Queries** for responsive layouts.

---

## 🧪 Testing

### Unit Tests
```bash
ng test
```
---

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t personal-finance-tracker-ui .
```

### Run Docker Container
```bash
docker run -p 80:80 personal-finance-tracker-ui
```

---

## 📚 Global Services

### ApiService
Handles all HTTP requests to the backend API.

### AppStore
Global state management for:
- Authentication tokens
- User information
- UI state (sidebar)

### LoaderService
Manages loading spinner state across the application.

### NotificationService
Displays toast notifications for user feedback.

---

## 🎨 Styling

- **SCSS** for advanced styling features
- **Angular Material** for UI components
- **Material Design** principles
- Custom theme in `src/material-theme.scss`

---

## 📝 Code Standards

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for code formatting
- Comments added to classes and methods
- Single responsibility principle

---

## 🚀 Future Enhancements

- [ ] Dark mode theme
- [ ] Export reports to PDF
- [ ] Advanced filtering and search
- [ ] Recurring transactions
- [ ] Budget tracking and alerts
- [ ] Multi-currency support
- [ ] Data visualization improvements
- [ ] Mobile app version
