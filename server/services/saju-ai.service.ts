import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { env } from "@/env/server";
import type { InterpretedAnalysis } from "@/lib/saju/types";

const model = new ChatOpenAI({
  apiKey: env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0.7,
});

const outputParser = new StringOutputParser();

const systemPrompt = `You are a master Korean Saju (사주팔자, Four Pillars of Destiny) reader with decades of experience.
You interpret Four Pillars charts with wisdom, nuance, and cultural depth.
Your readings are insightful, balanced, and written in a warm, encouraging tone.
Always acknowledge both strengths and challenges. Avoid fatalistic language.
Always respond in English unless explicitly instructed otherwise.`;

const interpretationPrompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  [
    "human",
    `Please provide a comprehensive Saju reading for the following chart:

## Four Pillars (사주팔자)
- Year Pillar (년주): {yearPillar}
- Month Pillar (월주): {monthPillar}
- Day Pillar (일주): {dayPillar}
- Hour Pillar (시주): {hourPillar}

## Five Elements Balance (오행)
- Wood (목): {mokCount}, Fire (화): {hwaCount}, Earth (토): {toCount}, Metal (금): {geumCount}, Water (수): {suCount}
- Strongest: {strongest}, Weakest: {weakest}, Missing: {missing}

## Twelve Life Stages (12운성)
{twelveStages}

## Spiritual Influences (신살)
Auspicious (길신): {gilsin}
Inauspicious (흉신): {hyungsin}

## Top Interpreted Influences (by effective power)
{topInterpreted}

Please provide:
1. **Overall Character & Destiny** (성격과 운명) — Core personality traits and life path based on the day pillar and overall chart balance
2. **Strengths & Talents** (강점과 재능) — What this person naturally excels at
3. **Life Challenges** (과제와 도전) — Areas requiring attention and growth
4. **Key Relationships** (인간관계) — Tendencies in love, family, and social connections
5. **Career & Wealth** (직업과 재물) — Best suited career paths and financial tendencies
6. **Spiritual Influences Summary** (신살 종합) — The most impactful spiritual influences and their real-world meaning
7. **Advice & Guidance** (조언) — Practical wisdom for living in harmony with this chart

Keep each section concise but meaningful (2-4 sentences). Use both Korean terms and English explanations.`,
  ],
]);

const chain = interpretationPrompt.pipe(model).pipe(outputParser);

function formatPillar(pillar: {
  cheongan: { name: string; hanja: string; oheng: string };
  jiji: { name: string; hanja: string; oheng: string };
}): string {
  return `${pillar.cheongan.name}${pillar.jiji.name} (${pillar.cheongan.hanja}${pillar.jiji.hanja}) — ${pillar.cheongan.oheng}/${pillar.jiji.oheng}`;
}

export const sajuAiService = {
  async interpret(analysis: InterpretedAnalysis, language: "ko" | "en" = "en"): Promise<string> {
    const { saju, sinsal, twelveStages, oheng, interpreted } = analysis;

    const gilsinList =
      sinsal
        .filter((s) => s.type === "gilsin")
        .map((s) => `${s.name}(${s.hanja}) @ ${s.pillar}`)
        .join(", ") || "없음";

    const hyungsinList =
      sinsal
        .filter((s) => s.type === "hyungsin")
        .map((s) => `${s.name}(${s.hanja}) @ ${s.pillar}`)
        .join(", ") || "없음";

    const twelveStagesText = twelveStages
      .map((ts) => `${ts.pillar}: ${ts.stage}(${ts.hanja}) — ${ts.description}`)
      .join("\n");

    const topInterpreted = interpreted
      .sort((a, b) => b.effectivePower - a.effectivePower)
      .slice(0, 5)
      .map(
        (i) =>
          `• ${i.sinsal.name}: ${i.powerLevel} (${(i.effectivePower * 100).toFixed(0)}%) — ${i.interpretation}`,
      )
      .join("\n");

    const langInstruction =
      language === "ko" ? " Please respond entirely in Korean (한국어로 답변해주세요)." : "";

    const result = await chain.invoke({
      yearPillar: formatPillar(saju.yearPillar),
      monthPillar: formatPillar(saju.monthPillar),
      dayPillar: formatPillar(saju.dayPillar),
      hourPillar: formatPillar(saju.hourPillar),
      mokCount: oheng.balance.mok,
      hwaCount: oheng.balance.hwa,
      toCount: oheng.balance.to,
      geumCount: oheng.balance.geum,
      suCount: oheng.balance.su,
      strongest: oheng.strongest,
      weakest: oheng.weakest,
      missing: oheng.missing.length > 0 ? oheng.missing.join(", ") : "none",
      twelveStages: twelveStagesText,
      gilsin: gilsinList,
      hyungsin: hyungsinList,
      topInterpreted: topInterpreted || "없음",
    });

    return result + langInstruction;
  },
};
