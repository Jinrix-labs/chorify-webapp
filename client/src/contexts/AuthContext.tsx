import { createContext, useContext, ReactNode } from "react";
import type { Member, Family } from "@shared/schema";

interface AuthContextType {
  member: Member | null;
  family: Family | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  member,
  family,
  children,
}: {
  member: Member | null;
  family: Family | null;
  children: ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ member, family }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
