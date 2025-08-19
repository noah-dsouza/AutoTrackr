// src/components/AdminLogin.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Lock, Eye, EyeOff, X } from "lucide-react";

type Props = {
  onLogin: () => void;
  onCancel: () => void;
};

export function AdminLogin({ onLogin, onCancel }: Props) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const actionBtn =
    "transition-all duration-200 border border-border shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary/30";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 300)); // demo delay

    const ok =
      email.trim().length > 0 &&
      pw === (import.meta.env.VITE_ADMIN_PASSWORD ?? "admin123");

    setLoading(false);
    if (!ok) {
      setErr("Invalid email or password.");
      return;
    }
    onLogin();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mx-auto max-w-md">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Admin Login</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onCancel}
                aria-label="Close"
                className="transition-all duration-200 hover:scale-105"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@yourco.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-200 border border-border hover:border-primary/40 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      required
                      className="pr-10 transition-all duration-200 border border-border hover:border-primary/40 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {err && (
                  <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {err}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Demo password: <code>admin123</code>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {/* Sign in now outlined + same hover/shadow as Cancel */}
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={loading}
                    className={`flex-1 ${actionBtn}`}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>

                  {/* Cancel with the exact same styling */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className={actionBtn}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
