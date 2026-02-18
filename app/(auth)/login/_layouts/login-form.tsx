"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await signIn.email({ email, password });

    if (error) {
      setError(error.message || "Failed to sign in");
      setIsLoading(false);
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left: Form panel (35%) ── */}
      <div className="relative flex w-full flex-col justify-between bg-background px-10 py-10 md:w-[35%] md:min-w-[35%]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 self-start">
          <span className="font-mono text-sm font-bold tracking-widest uppercase text-foreground">
            SAJU
          </span>
          <span className="text-xs text-muted-foreground font-mono">사주</span>
        </Link>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-foreground">Sign In</h3>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access your reading
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-widest font-mono text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-border bg-card px-4 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs uppercase tracking-widest font-mono text-muted-foreground"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline font-mono tracking-wide"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-border bg-card px-4 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-12 w-full rounded-xl text-sm font-semibold tracking-wide"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </motion.div>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Begin your journey
          </Link>
        </p>
      </div>

      {/* ── Right: Palace image banner (65%) ── */}
      <div className="relative hidden flex-1 md:block md:w-[65%]">
        <Image
          src="/palace.jpg"
          alt="Gyeongbokgung Palace"
          fill
          className="object-cover object-center"
          priority
          sizes="65vw"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-background/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        {/* Overlay text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-16 left-14 right-14 flex flex-col gap-4"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-white/60">사주팔자</span>
          <h3 className="text-white leading-tight drop-shadow-lg">
            Ancient wisdom,
            <br />
            <span style={{ color: "#C5A059" }}>your destiny revealed.</span>
          </h3>
          <p className="max-w-md text-sm text-white/70 leading-relaxed drop-shadow">
            For over 2,000 years, the Four Pillars have guided kings and scholars alike. Now, they
            guide you.
          </p>
          <Link
            href="/#about"
            className="self-start text-xs font-mono tracking-widest uppercase text-white/50 hover:text-white/90 transition-colors border-b border-white/20 hover:border-white/60 pb-0.5"
          >
            Learn about Saju →
          </Link>
        </motion.div>

        {/* Corner brand mark */}
        <div className="absolute top-8 right-8">
          <span className="font-mono text-xs tracking-widest uppercase text-white/30">
            SAJU · 사주
          </span>
        </div>
      </div>
    </div>
  );
}
