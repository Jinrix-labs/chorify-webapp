export interface AvatarTheme {
  primary: string;
  secondary: string;
  accent: string;
  name: string;
}

export const AVATAR_THEMES: Record<string, AvatarTheme> = {
  "🐱": {
    name: "Cat",
    primary: "210 100% 50%",
    secondary: "210 100% 60%",
    accent: "190 100% 50%",
  },
  "🦖": {
    name: "Dino",
    primary: "140 60% 50%",
    secondary: "140 60% 60%",
    accent: "100 60% 50%",
  },
  "🤖": {
    name: "Robot",
    primary: "200 70% 55%",
    secondary: "200 70% 65%",
    accent: "220 70% 55%",
  },
  "🦄": {
    name: "Unicorn",
    primary: "320 70% 65%",
    secondary: "320 70% 75%",
    accent: "280 70% 65%",
  },
  "🐻": {
    name: "Bear",
    primary: "30 50% 50%",
    secondary: "30 50% 60%",
    accent: "20 50% 50%",
  },
  "🦁": {
    name: "Lion",
    primary: "40 90% 55%",
    secondary: "40 90% 65%",
    accent: "30 90% 55%",
  },
  "🐶": {
    name: "Dog",
    primary: "35 80% 55%",
    secondary: "35 80% 65%",
    accent: "25 80% 55%",
  },
  "🐸": {
    name: "Frog",
    primary: "120 60% 50%",
    secondary: "120 60% 60%",
    accent: "100 60% 50%",
  },
  "🦊": {
    name: "Fox",
    primary: "20 90% 55%",
    secondary: "20 90% 65%",
    accent: "10 90% 55%",
  },
  "🐼": {
    name: "Panda",
    primary: "0 0% 20%",
    secondary: "0 0% 30%",
    accent: "0 0% 40%",
  },
  "🦅": {
    name: "Eagle",
    primary: "30 40% 45%",
    secondary: "30 40% 55%",
    accent: "200 60% 50%",
  },
  "🐢": {
    name: "Turtle",
    primary: "140 50% 45%",
    secondary: "140 50% 55%",
    accent: "160 50% 45%",
  },
};

export const getAvatarTheme = (avatar: string): AvatarTheme => {
  return AVATAR_THEMES[avatar] || AVATAR_THEMES["🐱"];
};

export const applyAvatarTheme = (avatar: string) => {
  const theme = getAvatarTheme(avatar);
  const root = document.documentElement;
  
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-foreground', '0 0% 100%');
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--secondary-foreground', '0 0% 100%');
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-foreground', '0 0% 100%');
  
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', `hsl(${theme.primary})`);
  }
};
