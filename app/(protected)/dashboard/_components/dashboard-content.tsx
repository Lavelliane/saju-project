"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, MapPin, MoreHorizontal, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import type { SajuReadingRow } from "@/app/(protected)/dashboard/saju/_hooks";
import {
  useDeleteReading,
  useReadingStats,
  useReadings,
} from "@/app/(protected)/dashboard/saju/_hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth/client";

const chartData = [
  { period: "Jan", readings: 2 },
  { period: "Feb", readings: 5 },
  { period: "Mar", readings: 3 },
  { period: "Apr", readings: 8 },
  { period: "May", readings: 6 },
  { period: "Jun", readings: 11 },
];

const FORTUNE_TELLERS = [
  {
    name: "Master Kim Jisoo",
    role: "Saju Specialist",
    location: "Insadong, Seoul",
    initials: "KJ",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  },
  {
    name: "Grandmaster Park",
    role: "Tarot & Saju",
    location: "Hongdae, Seoul",
    initials: "GP",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
  {
    name: "Seer Choi Minjung",
    role: "Five Elements",
    location: "Bukchon, Seoul",
    initials: "CM",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  },
];

const BLOG_POSTS = [
  {
    tag: "SAJU BASICS",
    tagColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
    title: "Understanding Your Day Pillar: The Core of Your Identity",
    author: "Master Kim Jisoo",
    emoji: "🌟",
  },
  {
    tag: "FIVE ELEMENTS",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    title: "How Water and Fire Elements Shape Your Relationships",
    author: "Grandmaster Park",
    emoji: "💧",
  },
  {
    tag: "AI READING",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    title: "AI-Powered Saju: Bridging Ancient Wisdom and Modern Technology",
    author: "Seer Choi Minjung",
    emoji: "✨",
  },
];

export function DashboardContent() {
  const { data: session } = useSession();
  const { data: stats, isLoading: statsLoading } = useReadingStats();
  const { data: readings, isLoading: readingsLoading } = useReadings();
  const deleteMutation = useDeleteReading();

  const handleDelete = async (id: string, label: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`"${label}" deleted`);
    } catch {
      toast.error("Failed to delete reading");
    }
  };

  const router = useRouter();

  const recentReadings = readings?.slice(0, 3) ?? [];
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex min-h-full">
      {/* ── LEFT / MAIN ── */}
      <div className="flex-1 min-w-0 px-4 md:px-6 py-6 space-y-6 overflow-auto">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-7 py-7 text-white flex items-center justify-between gap-4">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[100px] leading-none opacity-10 select-none pointer-events-none font-bold">
            ✦
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-200 mb-1.5">
              사주팔자 · Four Pillars
            </p>
            <h3 className="text-xl font-bold leading-snug max-w-sm">
              Discover Your Destiny with AI-Powered Saju
            </h3>
            <p className="text-xs text-violet-200 mt-1.5">
              Unlock the secrets of your Four Pillars of Destiny
            </p>
          </div>
          <Button
            onClick={() => {
              router.push("/dashboard/saju/new");
            }}
            className="shrink-0 cursor-pointer bg-white text-violet-700 hover:bg-violet-50 border-0 font-semibold rounded-full px-6 h-9 text-sm shadow-lg"
          >
            New Reading →
          </Button>
        </div>

        {/* Recent Readings — horizontal scroll like "Continue Watching" */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Recent Readings</h3>
            <Link
              href="/dashboard/saju"
              className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium flex items-center gap-1"
            >
              See all <ArrowUpRight className="size-3" />
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {readingsLoading
              ? [...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)
              : recentReadings.length > 0
                ? recentReadings.map((r) => (
                    <ReadingCard
                      key={r.id}
                      label={r.label}
                      sub={r.aiInterpretation ? "AI reading done" : "Chart only"}
                      icon={r.aiInterpretation ? "✨" : "🔮"}
                      pct={r.aiInterpretation ? 100 : 50}
                      href={`/dashboard/saju/${r.id}`}
                      date={r.createdAt}
                    />
                  ))
                : [
                    { label: "Your First Chart", sub: "Not started", icon: "🌱", pct: 0 },
                    { label: "AI Interpretation", sub: "Not started", icon: "✨", pct: 0 },
                    { label: "Five Elements", sub: "Not started", icon: "⚖️", pct: 0 },
                  ].map((item) => (
                    <ReadingCard
                      key={item.label}
                      label={item.label}
                      sub={item.sub}
                      icon={item.icon}
                      pct={item.pct}
                      empty
                    />
                  ))}
          </div>
        </div>

        {/* Continue Reading — compact horizontal scroll */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Continue Reading</h3>
            <button type="button" className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {BLOG_POSTS.map((post) => (
              <BlogCard key={post.title} post={post} />
            ))}
          </div>
        </div>

        {/* Readings Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Your Readings</h3>
            <Link
              href="/dashboard/saju"
              className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
            >
              See all
            </Link>
          </div>
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Fortune Teller
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Label
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {readingsLoading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-3" colSpan={4}>
                          <Skeleton className="h-5 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : readings && readings.length > 0 ? (
                    readings
                      .slice(0, 5)
                      .map((r) => (
                        <ReadingTableRow
                          key={r.id}
                          reading={r}
                          onDelete={() => handleDelete(r.id, r.label)}
                          isDeleting={deleteMutation.isPending}
                        />
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-muted-foreground text-sm"
                      >
                        No readings yet —{" "}
                        <Link
                          href="/dashboard/saju/new"
                          className="text-violet-600 hover:underline font-medium"
                        >
                          create your first
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <aside className="hidden xl:flex flex-col w-72 shrink-0 border-l bg-muted/20 px-4 py-6 space-y-6 overflow-auto">
        {/* Greeting */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="size-11 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-base font-bold ring-2 ring-violet-100 dark:ring-violet-900">
              {firstName[0]?.toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 text-xs">🔮</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Good Day, {firstName}!</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Your destiny awaits exploration
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <Card className="border-0 shadow-sm bg-background">
          <CardHeader className="pb-0 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Reading Activity</CardTitle>
              <button type="button" className="text-muted-foreground">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-4 pt-2">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={chartData} barSize={18}>
                <XAxis dataKey="period" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  cursor={{ fill: "rgba(139,92,246,0.08)" }}
                />
                <Bar dataKey="readings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fortune Tellers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-bold">Fortune Tellers</h5>
            <button
              type="button"
              className="text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline"
            >
              See All
            </button>
          </div>
          <div className="space-y-3">
            {FORTUNE_TELLERS.map((ft) => (
              <div key={ft.name} className="flex items-center gap-3 py-1">
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className={`text-xs font-bold ${ft.color}`}>
                    {ft.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{ft.name}</p>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{ft.location}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-xs font-semibold text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-full px-3 py-1 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 w-full text-xs font-semibold text-center py-2 rounded-xl border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
          >
            See All
          </button>
        </div>

        {/* Stats */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Your Stats
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total", value: statsLoading ? "…" : String(stats?.total ?? 0), icon: "📚" },
              {
                label: "AI Reads",
                value: statsLoading ? "…" : String(stats?.withAi ?? 0),
                icon: "✨",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-background border-0 shadow-sm p-4 text-center"
              >
                <p className="text-2xl">{s.icon}</p>
                <p className="text-2xl font-bold leading-none mt-2">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function ReadingCard({
  label,
  sub,
  icon,
  pct,
  href,
  date,
  empty,
}: {
  label: string;
  sub: string;
  icon: string;
  pct: number;
  href?: string;
  date?: string;
  empty?: boolean;
}) {
  const inner = (
    <div
      className={`w-full rounded-xl border bg-background shadow-sm hover:shadow-md transition-shadow overflow-hidden group ${href ? "cursor-pointer" : ""} ${empty ? "opacity-50" : ""}`}
    >
      <div className="h-28 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 flex items-center justify-center text-5xl relative">
        {icon}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-xs font-semibold truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {label}
        </p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {date && (
          <p className="text-[10px] text-muted-foreground pt-0.5">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </p>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

function BlogCard({ post }: { post: (typeof BLOG_POSTS)[number] }) {
  return (
    <div className="w-full rounded-xl border bg-background shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer">
      <div className="h-28 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-5xl relative">
        {post.emoji}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      <div className="p-3 space-y-1.5">
        <span
          className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${post.tagColor}`}
        >
          {post.tag}
        </span>
        <p className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {post.title}
        </p>
        <div className="flex items-center gap-1.5 pt-1">
          <div className="size-4 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-[8px] font-bold text-violet-700 dark:text-violet-300">
            {post.author[0]}
          </div>
          <p className="text-[10px] text-muted-foreground truncate">{post.author}</p>
        </div>
      </div>
    </div>
  );
}

function ReadingTableRow({
  reading,
  onDelete,
  isDeleting,
}: {
  reading: SajuReadingRow;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const teller =
    ["Master Kim Jisoo", "Grandmaster Park", "Seer Choi Minjung"][
      Math.abs(reading.id.charCodeAt(5) ?? 0) % 3
    ] ?? "Master Kim Jisoo";

  return (
    <tr className="border-b hover:bg-muted/30 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-[10px] font-bold text-violet-700 dark:text-violet-300 shrink-0">
            {teller[0]}
          </div>
          <div>
            <p className="text-xs font-medium">{teller}</p>
            <p className="text-[10px] text-muted-foreground">
              {new Date(reading.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {reading.aiInterpretation ? (
          <Badge className="text-[9px] bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-0 font-semibold">
            <Sparkles className="size-2.5 mr-1" />
            AI READING
          </Badge>
        ) : (
          <Badge variant="outline" className="text-[9px] font-semibold">
            CHART
          </Badge>
        )}
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-xs text-muted-foreground truncate max-w-[140px]">{reading.label}</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard/saju/${reading.id}`}
            className="flex size-7 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-800 transition-colors"
          >
            <ArrowUpRight className="size-3.5" />
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
