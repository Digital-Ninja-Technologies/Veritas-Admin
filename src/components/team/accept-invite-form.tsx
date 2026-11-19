"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { acceptInviteAction } from "@/lib/data/invite-actions";
import { AVATAR_SEEDS, avatarUrl } from "@/lib/avatars";

export function AcceptInviteForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarSeed, setAvatarSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    setError(null);
    if (!avatarSeed) {
      setError("Pick an avatar to continue.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    startTransition(async () => {
      const result = await acceptInviteAction(token, {
        full_name: fullName,
        phone,
        password,
        avatar_seed: avatarSeed,
      });
      if (result.ok) {
        toast.success("Account created");
        router.push("/support");
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>You&apos;ve been invited as customer care for {email}.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label>Choose an avatar</Label>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
            {AVATAR_SEEDS.map((seed) => (
              <button
                key={seed}
                type="button"
                onClick={() => setAvatarSeed(seed)}
                aria-label={`Avatar ${seed}`}
                aria-pressed={avatarSeed === seed}
                className={cn(
                  "overflow-hidden rounded-full border-2 transition-colors",
                  avatarSeed === seed ? "border-primary" : "border-transparent hover:border-muted-foreground/30",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- external avatar catalog, no next/image domain to configure for this mock phase */}
                <img src={avatarUrl(seed)} alt="" className="size-10 bg-muted" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="full-name">Full name</Label>
          <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 800 000 0000"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button onClick={onSubmit} disabled={pending || fullName.trim().length === 0 || password.length === 0}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </CardContent>
    </Card>
  );
}
