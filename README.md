# ChoreChampion - Family Chores Adventure

A gamified family chore tracking application that makes household tasks fun and engaging for all family members, ages 5-50.

## Features

- 🏡 **Family-Based System** - Create families with unique codes
- 👑 **Parent Dashboard** - Manage chores, approve completions, and adjust points
- ⭐ **Points System** - Earn points for completing chores
- 🏆 **Leaderboards** - Weekly and monthly competitions
- 🎁 **Rewards** - Redeem points for rewards
- 🎉 **Celebrations** - Voice celebrations and confetti when completing chores
- 📱 **PWA** - Installable on mobile devices
- 🎨 **Avatar Theming** - Custom color schemes based on your avatar

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle
- **Styling**: Tailwind CSS + Shadcn UI

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file:
   ```env
   DATABASE_URL=your_supabase_connection_string
   PORT=5000
   NODE_ENV=development
   ```

3. **Run database migrations**
   ```bash
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your Supabase connection string
   - `NODE_ENV=production`
3. Deploy!

The app will automatically build and deploy.

## Usage

### Creating a Family

1. Sign up with a family code ending in "boss" (e.g., `SMITH2025boss`)
2. This creates you as a parent and creates the family

### Adding Family Members

1. Other members sign up with the same family code (without "boss")
2. They'll be added to your family as children

### Parent Features

- Create and assign chores
- Approve completed chores
- Adjust points manually
- Manage rewards

### Child Features

- Claim available chores
- Complete chores (pending parent approval)
- View leaderboard
- Redeem rewards with points

## License

MIT

