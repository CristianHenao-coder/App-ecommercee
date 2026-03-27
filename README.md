# 🛍️ Look God – Ecommerce

> **A luxury ecommerce platform built with excellence and faith**  
> *"We are one – Look God"*

A modern, full-featured ecommerce application built by **Cristian Henao P** ([CristianHenao-coder](https://github.com/CristianHenao-coder)). This platform combines cutting-edge technology with a mission-driven approach, offering a seamless shopping experience with multi-language support, admin dashboard, and integrated payment processing.

---

## 📋 Description

Look God Ecommerce is a comprehensive online shopping platform featuring:

- **Multi-language support** (Spanish/English) with a complete i18n system
- **Admin dashboard** for complete product management (CRUD operations)
- **Product collection** with advanced filtering and search
- **Shopping cart** with persistent storage
- **Secure checkout** with PayPal payment gateway integration
- **User authentication** and profile management
- **Cloudinary integration** for optimized image storage and delivery

Built with the philosophy: *"And he will carry the Gospel to every nation"* – combining faith, excellence, and modern technology.

---

## 🚀 Tech Stack

### Core Framework
- **Next.js 16** (App Router) – React framework with server-side rendering
- **React 19** – UI library
- **TypeScript** – Type-safe development

### Backend & Database
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object modeling
- **Next.js API Routes** – Serverless API endpoints

### Payment & Media
- **PayPal SDK** (`@paypal/react-paypal-js`) – Payment processing
- **Cloudinary** – Cloud-based image management and optimization

### UI & Styling
- **Tailwind CSS 4** – Utility-first CSS framework
- **Material-UI (MUI)** – React component library
- **React Toastify** – Toast notifications

### Internationalization
- **Custom i18n system** – Spanish/English language support

### Additional Libraries
- **Axios** – HTTP client
- **Yup** – Schema validation
- **React Hook Form** – Form management
- **Bcrypt** – Password hashing
- **NextAuth** – Authentication

---

## 📦 Installation & Running

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** database (local or cloud instance like MongoDB Atlas)
- **Cloudinary account** (for image storage)
- **PayPal developer account** (for payment processing)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd App-ecommercee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_FOLDER=lookgod/products
   
   # PayPal
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   PAYPAL_MODE=sandbox
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
   
   # NextAuth (if using Google OAuth)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## ✨ Main Features

### 🔐 Authentication & User Management
- User registration and login
- Google OAuth integration (optional)
- Protected routes and admin authorization
- User profile management with avatar upload
- Secure password hashing with bcrypt

### 🛍️ Product Management (Admin)
- **Create** products with multilingual support (ES/EN)
- **Read** product listings with images
- **Update** product details and images
- **Delete** products with confirmation
- Image upload to Cloudinary with automatic optimization
- Category management (T-shirts, Hoodies, Accessories)

### 🎨 Product Collection
- Browse all products with responsive grid layout
- **Search** by product name (case-insensitive)
- **Filter** by category (case-insensitive matching)
- **Sort** by price (ascending/descending)
- Multi-language product names and descriptions

### 🛒 Shopping Cart
- Add/remove items from cart
- Quantity management
- Persistent cart storage (user-based)
- Real-time total calculation
- Empty cart handling

### 💳 Checkout & Payments
- Secure checkout flow
- **PayPal integration** (sandbox/live modes)
- Order creation and capture
- Order history storage in database
- Automatic cart clearing after successful payment

### 🌍 Internationalization
- Complete Spanish/English translation system
- Language switcher in navigation
- All user-facing text translated
- Dynamic language context

### 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS for responsive layouts
- Modern UI with dark/light theme support
- Professional footer with social links

---

## 📁 Project Structure

```
App-ecommercee/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── products/      # Product CRUD endpoints
│   │   │   ├── paypal/        # PayPal payment endpoints
│   │   │   ├── profile/       # User profile endpoints
│   │   │   └── ...
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout page
│   │   ├── collections/       # Product collection page
│   │   ├── dashboard/         # Admin dashboard
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── profile/           # User profile page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── layout/            # Layout components (Footer, etc.)
│   │   ├── modals/            # Modal components
│   │   ├── navMain/           # Navigation component
│   │   └── ...
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx    # Authentication context
│   │   ├── CartContext.tsx    # Shopping cart context
│   │   └── LanguageContext.tsx # i18n context
│   ├── helpers/               # Utility functions
│   │   ├── i18n/              # Translation files (es.json, en.json)
│   │   └── ...
│   ├── interfaces/            # TypeScript interfaces
│   ├── lib/                   # Library configurations
│   │   ├── db.ts              # MongoDB connection
│   │   └── cloudinary.ts      # Cloudinary configuration
│   ├── models/                # Mongoose models
│   │   ├── Product.ts         # Product model
│   │   ├── User.ts            # User model
│   │   └── Order.ts           # Order model
│   ├── schema/                # Validation schemas
│   ├── services/              # API service functions
│   │   ├── products.ts        # Product API calls
│   │   ├── payments.ts        # Payment API calls
│   │   └── profile.ts        # Profile API calls
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB database (local or MongoDB Atlas)
2. Get your connection string
3. Add `MONGODB_URI` to `.env.local`

### Cloudinary Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret
3. Add credentials to `.env.local`
4. Configure folder structure (default: `lookgod/products`)

### PayPal Setup
1. Create a PayPal developer account
2. Create a new app to get Client ID and Secret
3. Use sandbox mode for testing
4. Add credentials to `.env.local`
5. Set `PAYPAL_MODE=sandbox` for testing or `live` for production

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Open Cypress
npm run test:e2e:open
```

---

## 📝 Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm start` – Start production server
- `npm run lint` – Run ESLint
- `npm test` – Run Jest tests
- `npm run test:e2e` – Run Cypress E2E tests

---

## 👤 Author

**Cristian Henao P**

- **GitHub**: [@CristianHenao-coder](https://github.com/CristianHenao-coder)
- **Instagram**: [@soy_crishrey](https://www.instagram.com/soy_crishrey/)

---

## 🙏 Mission

> *"And he will carry the Gospel to every nation"*

This project is built with faith, excellence, and a commitment to quality. Every line of code reflects the mission to create technology that serves a higher purpose.

**"We are one – Look God"**

---

## 📄 License

This project is private and proprietary.

---

## 🎯 Future Enhancements

- [ ] Order tracking system
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] Additional payment gateways

---

**Built with ❤️ and faith by Cristian Henao P**

*God bless you* 🙏
