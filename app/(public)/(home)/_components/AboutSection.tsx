"use client";

import { RevealOnScroll, fadeIn, fadeUp, scaleIn, slideLeft, slideRight } from "./MotionWrapper";

const PILLARS = [
  {
    korean: "年柱",
    romanized: "Nyeonju",
    label: "Year Pillar",
    description: "Reveals your ancestral roots, early childhood, and the karmic energy you inherited at birth.",
    color: "#A63232",
  },
  {
    korean: "月柱",
    romanized: "Wolju",
    label: "Month Pillar",
    description: "Governs your parents, siblings, and the social environment that shaped your formative years.",
    color: "#2D5A43",
  },
  {
    korean: "日柱",
    romanized: "Ilju",
    label: "Day Pillar",
    description: "The most personal pillar — it defines your core self, your spouse, and your inner nature.",
    color: "#4A8B82",
  },
  {
    korean: "時柱",
    romanized: "Siju",
    label: "Hour Pillar",
    description: "Points to your children, your ambitions, and the legacy you will leave in this world.",
    color: "#C5A059",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-5 pointer-events-none select-none flex items-center justify-center">
        <span className="text-[28rem] font-bold text-foreground leading-none">사</span>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="max-w-2xl mb-20">
          <RevealOnScroll variants={fadeIn} custom={0}>
            <span className="text-xs tracking-widest uppercase font-mono text-primary">What is Saju?</span>
          </RevealOnScroll>
          <RevealOnScroll variants={fadeUp} custom={1} className="mt-4">
            <h2 className="text-foreground">
              Four Pillars,<br />
              <span className="text-primary">One Destiny</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll variants={fadeUp} custom={2} className="mt-6">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Saju (사주), literally "Four Pillars," is a 2,000-year-old Korean system of destiny reading rooted in Chinese metaphysics. Your exact birth date and time generate four pillars — each a pair of Heavenly Stem and Earthly Branch — that map the cosmic forces shaping your life.
            </p>
          </RevealOnScroll>
        </div>

        {/* Two-column layout: text + visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <RevealOnScroll variants={slideLeft} custom={0}>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Unlike Western astrology which focuses on the sun sign alone, Saju reads the interplay of <strong className="text-foreground">Ten Heavenly Stems (천간)</strong> and <strong className="text-foreground">Twelve Earthly Branches (지지)</strong> across four time dimensions — creating a unique 60-year cycle that has never repeated in recorded history.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Practitioners read the balance of the <strong className="text-foreground">Five Elements</strong> — Wood (목), Fire (화), Earth (토), Metal (금), Water (수) — within your chart to reveal personality, relationships, career, health, and the timing of life events.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {["목 Wood", "화 Fire", "토 Earth", "금 Metal", "수 Water"].map((el, i) => (
                  <span
                    key={el}
                    className="px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-foreground"
                  >
                    {el}
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Decorative Saju chart visual */}
          <RevealOnScroll variants={slideRight} custom={0}>
            <div className="relative flex items-center justify-center">
              <div className="grid grid-cols-4 gap-3 w-full max-w-sm mx-auto">
                {PILLARS.map((pillar, i) => (
                  <div
                    key={pillar.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm"
                  >
                    <span className="text-2xl font-bold" style={{ color: pillar.color }}>
                      {pillar.korean.charAt(0)}
                    </span>
                    <div className="w-full h-px bg-border" />
                    <span className="text-2xl font-bold text-foreground/40">
                      {["甲", "乙", "丙", "丁"][i]}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono text-center leading-tight">
                      {pillar.romanized}
                    </span>
                  </div>
                ))}
              </div>
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-3xl blur-2xl opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #A63232, #C5A059, transparent)" }}
              />
            </div>
          </RevealOnScroll>
        </div>

        {/* Four Pillars cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map((pillar, i) => (
            <RevealOnScroll key={pillar.label} variants={scaleIn} custom={i}>
              <div className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 h-full overflow-hidden">
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
                  style={{ background: pillar.color }}
                />
                <div className="flex items-start justify-between">
                  <span className="text-4xl font-bold leading-none" style={{ color: pillar.color }}>
                    {pillar.korean}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{pillar.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
