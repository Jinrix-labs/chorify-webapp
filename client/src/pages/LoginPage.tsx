import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import AvatarPicker from "@/components/AvatarPicker";
import { getAvatarTheme, applyAvatarTheme } from "@/lib/avatarThemes";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Member, Family } from "@shared/schema";

interface LoginPageProps {
  onLogin: (data: { 
    member: Member; 
    family: Family;
  }) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [avatar, setAvatar] = useState("🐱");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const currentTheme = getAvatarTheme(avatar);
  
  useEffect(() => {
    if (isSignup) {
      applyAvatarTheme(avatar);
    }
  }, [avatar, isSignup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !familyCode.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter your name and family code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const isParent = familyCode.toLowerCase().endsWith("boss");
      const cleanFamilyCode = isParent 
        ? familyCode.slice(0, -4).trim() 
        : familyCode.trim();

      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const response = await apiRequest("POST", endpoint, {
        name: name.trim(),
        familyCode: cleanFamilyCode.toUpperCase(),
        avatar: isSignup ? avatar : undefined,
        isParent,
      });

      const data = await response.json();

      if (data.success) {
        onLogin({
          member: data.member,
          family: data.family,
        });
      } else {
        throw new Error(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: isSignup ? "Signup failed" : "Login failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏡✨</div>
          <h1 className="text-4xl font-black mb-2">
            Family Chores
          </h1>
          <p className="text-lg text-muted-foreground">
            Join Your Family Adventure!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-base">
              👤 Your Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-12 text-lg"
              data-testid="input-name"
            />
          </div>

          <div>
            <Label htmlFor="familyCode" className="text-base">
              🔑 Family Code
            </Label>
            <Input
              id="familyCode"
              placeholder="e.g., SMITH2025"
              value={familyCode}
              onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
              className="mt-2 h-12 text-lg"
              data-testid="input-family-code"
            />
          </div>

          {isSignup && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base">Pick Your Avatar</Label>
                <Badge variant="outline" className="text-xs">
                  Colors change with your avatar!
                </Badge>
              </div>
              <AvatarPicker selected={avatar} onSelect={setAvatar} />
              <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-center">
                  <span className="font-semibold text-primary">{currentTheme.name}</span> theme selected
                </p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-14 text-xl"
            data-testid="button-submit-login"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isSignup ? "Join Family 🎉" : "Log In"}
          </Button>

          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-toggle-mode"
          >
            {isSignup
              ? "Already have an account? Log in"
              : "New here? Sign up"}
          </button>
        </form>
      </Card>
    </div>
  );
}
