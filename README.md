# Meeting Room Booking
A Next.js 14-based meeting room booking system with authentication, room management, and booking conflict resolution.

## admin email: fahimprodhan.official@gmail.com
## admin Password: Sroto@23

## Live Site
[Visit Website](https://room-booking-next.vercel.app)


## Key Features
- **Responsive Design:** Ensures optimal viewing across all devices, including mobile, tablet, and desktop, for a seamless browsing experience.

- **User Roles and Permissions:** The application supports three user roles: Admin and normal user. Each role has specific permissions and access controls to manage the blood donation process efficiently.

- **Interactive Navigation:** Features an intuitive navbar with active route highlighting, facilitating easy exploration throughout the website.

- **User Registration and Authentication:** Users can register and log in to the platform. New users are assigned the role of member by default. The registration process includes input fields for email, name, and password.

- **Search and Filter Functionality:** User can Search room filtering by capacity and amenities.

- **Environmental Security:** Sensitive information such as Clerk config keys and MongoDB credentials are stored in environment variables to enhance security and protect sensitive data.

## Technical Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS
- **Authentication**: Clerk
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form
- **Image Upload**: imgbb 
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/[your-username]/room-booking-next.git
cd room-booking-next

npm install

cp .env.example .env.local
npx prisma generate

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
# Database
DATABASE_URL="mysql://user:password@localhost:3306/db_name"
npm run dev
