# Family Chores App - Design Guidelines

## Design Approach: Gamified Experience
**Reference Inspiration:** Duolingo (playful gamification), Habitica (task rewards), Pokemon GO (collectible avatars)
**Core Principle:** Make chores feel like a fun family game, not a boring task list, with vibrant visual energy that appeals to ages 5-50.

## Typography System
- **Primary Font:** Fredoka (Google Fonts) - rounded, friendly, highly readable for kids
- **Secondary Font:** Inter (Google Fonts) - clean for smaller text and data
- **Hierarchy:**
  - Hero text/Page titles: text-4xl to text-5xl, font-bold (Fredoka)
  - Section headers: text-2xl to text-3xl, font-bold (Fredoka)
  - Chore titles: text-lg, font-semibold (Fredoka)
  - Body/descriptions: text-base, font-normal (Inter)
  - Point counters: text-6xl, font-black (Fredoka) - make them huge and exciting

## Layout & Spacing System
**Tailwind Units:** Primarily use 4, 6, 8, 12, 16 for consistency (p-4, m-6, gap-8, etc.)
- Mobile-first approach with generous padding
- Cards: p-6 on mobile, p-8 on desktop
- Section spacing: py-12 on mobile, py-16 on desktop
- Component gaps: gap-4 for tight groups, gap-8 for section separation

## Core Components

### 1. Login/Signup Screen
- Centered card layout (max-w-md mx-auto)
- Large welcoming illustration/emoji at top (🏡✨)
- Big friendly headline: "Join Your Family Adventure!"
- Input fields with emoji prefixes (👤 Name, 🔑 Family Code)
- Avatar selection grid (3 columns mobile, 4-5 desktop) with large tap targets (min-h-20)
- Submit button should be extra large and inviting (h-14, text-xl)

### 2. Avatar Selection Component
- Grid of 8-12 animal emoji options: 🐱🦖🤖🦄🐻🦁🐶🐸🦊🐼
- Each avatar in rounded-2xl card with p-4
- Selected state: bold border, subtle shadow lift
- Display chosen avatar prominently in profile header (text-6xl emoji)

### 3. Main Dashboard Layout
**Header (sticky top-0):**
- Family member's avatar (large, text-5xl emoji) + name + point total
- Notification badge (absolute top-right of avatar, red dot with number)
- Quick stats bar below: "🏆 Rank #2 | ⭐ 340 points this week"

**Content Sections (stack vertically):**

**"Needs a Hero!" Section** (if unassigned chores exist):
- Attention-grabbing banner treatment with playful icon
- Grid of chore cards (1 column mobile, 2 columns tablet)
- Prominent "I'll Do It!" button on each card

**Your Assigned Chores:**
- List with clear visual separation per chore
- Emoji icon + chore title + assigned by info
- Large checkbox/complete button (min-h-12) for easy tapping
- Each card: rounded-xl, p-6, shadow

**Add New Chore Button:**
- Floating action button (fixed bottom-right on mobile)
- Or prominent full-width card with dashed border + large plus icon
- Modal/slide-up form: emoji picker, title input, assign dropdown

### 4. Chore Card Design
- Rounded-xl with shadow-md
- Emoji icon (text-4xl) prominent on left
- Chore title (text-lg font-semibold)
- Metadata row: assigned avatar (text-2xl), points value (🌟 +10)
- Action button takes full width on mobile
- Hover lift effect on desktop (subtle scale transform)

### 5. Completion Celebration
- Full-screen overlay when marking complete
- Animated confetti falling from top (canvas element)
- Giant point burst: "+10 POINTS! 🎉" (text-7xl, animate bounce)
- Updated total prominently displayed
- "Nice work!" message with encouraging emoji
- Auto-dismiss after 3 seconds with satisfying sound cue

### 6. Leaderboard View
- Tab switcher at top: "This Week" | "This Month" (rounded-full pill style)
- Podium display for top 3: larger cards with trophy emojis (🥇🥈🥉)
- Ranked list below with position numbers, avatars, names, points
- Current user highlighted with subtle background treatment
- Each row: flex with space-between, p-4, items-center

### 7. Rewards Section
- Card-based grid (1-2 columns)
- Each reward card shows:
  - Point cost (large, text-3xl: "100 🌟")
  - Reward description with emoji
  - Progress bar showing how close user is
  - "Claim!" button when achievable

### 8. Navigation
- Bottom tab bar on mobile (fixed bottom-0): Chores | Leaderboard | Rewards | Profile
- Icons should be large emoji or simple icons (text-2xl)
- Active state: bolder weight, underline or background fill
- Desktop: Sidebar with same navigation, always visible

## Visual Personality
- **Energy Level:** High - use playful bounce animations, scale transforms on interactions
- **Emoji Usage:** Everywhere - prefix inputs, decorate headers, represent categories
- **White Space:** Generous - don't cram, let elements breathe (min p-6 on all cards)
- **Borders:** Rounded corners throughout (rounded-xl standard, rounded-2xl for major containers)
- **Shadows:** Liberal use for depth (shadow-md standard, shadow-lg for emphasis)
- **Icons:** Heroicons for UI controls, but emojis take precedence for thematic elements

## Responsive Behavior
- Mobile (< 768px): Single column, stacked layout, bottom navigation
- Tablet (768-1024px): 2-column grids where applicable, side navigation appears
- Desktop (> 1024px): 3-column max for grids, persistent sidebar, hover states active

## Interaction States
- Buttons: scale-105 on hover, scale-95 on active (add transition-transform)
- Cards: subtle lift (shadow-lg) on hover for interactive elements
- Checkboxes: Large tap targets (min 48px), animated checkmark appearance
- No distracting continuous animations - only on user actions

## Images
No large hero images needed - this app is emoji and UI-driven. Any illustrations should be simple, cheerful spot illustrations for empty states (e.g., "No chores yet! 🎉" with celebratory graphic).