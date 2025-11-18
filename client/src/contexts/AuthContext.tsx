import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Member, Family } from "@shared/schema";
import { applyAvatarTheme } from "@/lib/avatarThemes";

interface AuthContextType {
  member: Member | null;
  family: Family | null;
  isLoading: boolean;
  login: (member: Member, family: Family) => void;
  logout: () => void;
  refreshMember: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [memberId, setMemberId] = useState<string | null>(() => {
    return localStorage.getItem("memberId");
  });
  const [familyId, setFamilyId] = useState<string | null>(() => {
    return localStorage.getItem("familyId");
  });

  const { data: member, isLoading: memberLoading, refetch: refetchMember, error: memberError } = useQuery<Member>({
    queryKey: ["/api/members", memberId],
    enabled: !!memberId,
    retry: false,
  });

  const { data: family, isLoading: familyLoading, error: familyError } = useQuery<Family>({
    queryKey: ["/api/families", familyId],
    enabled: !!familyId,
    retry: false,
  });

  useEffect(() => {
    if (member) {
      applyAvatarTheme(member.avatar);
    }
  }, [member?.avatar]);

  useEffect(() => {
    if (memberError || familyError) {
      console.error("Auth query error, clearing session:", { memberError, familyError });
      localStorage.removeItem("memberId");
      localStorage.removeItem("familyId");
      setMemberId(null);
      setFamilyId(null);
    }
  }, [memberError, familyError]);

  const login = (newMember: Member, newFamily: Family) => {
    localStorage.setItem("memberId", newMember.id);
    localStorage.setItem("familyId", newFamily.id);
    setMemberId(newMember.id);
    setFamilyId(newFamily.id);
    applyAvatarTheme(newMember.avatar);
  };

  const logout = () => {
    localStorage.removeItem("memberId");
    localStorage.removeItem("familyId");
    setMemberId(null);
    setFamilyId(null);
  };

  const refreshMember = () => {
    refetchMember();
  };

  const isLoading = (!!memberId || !!familyId) && (memberLoading || familyLoading);

  return (
    <AuthContext.Provider value={{ member: member || null, family: family || null, isLoading, login, logout, refreshMember }}>
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
