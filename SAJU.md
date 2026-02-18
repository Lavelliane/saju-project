# Saju Service

A Korean Four Pillars of Destiny (사주팔자, Four Pillars) analysis library + REST API server.

Given a birth date and time, it calculates the Four Pillars based on the traditional Korean Manseryeok (만세력) calendar system. It provides **Sinsal (spiritual influences) analysis**, **Twelve Life Stages**, **Five Elements balance**, and a **combined Sinsal x Twelve Stages interpretation** with effective power scoring.

## Quick Start

```bash
npm install
npm test        # 34 tests
npm run dev     # Dev server on port 3000
npm run build   # TypeScript build → dist/
```

---

## Project Structure

```
src/
├── index.ts                         # Library main exports
├── types/                           # TypeScript type definitions
├── constants/                       # Cheongan/Jiji/Oheng/Sinsal/Twelve Stages lookup tables
├── core/
│   ├── saju-calculator.ts           # Four Pillars calculation
│   ├── pillar-resolver.ts           # manseryeok → internal type bridge
│   └── lunar-converter.ts           # Solar ↔ Lunar calendar conversion
├── analysis/
│   ├── sinsal-calculator.ts         # 28 Sinsal detection
│   ├── twelve-stages-calculator.ts  # Twelve Life Stages calculation
│   ├── oheng-analyzer.ts            # Five Elements analysis
│   └── interpreter.ts               # Combined Sinsal × Twelve Stages interpreter
└── server/                          # Express API server
```

---

## Domain Glossary

Understanding these terms is essential for working with the API responses.

### Core Concepts

| Term | Korean | Chinese | Description |
|------|--------|---------|-------------|
| **Saju** | 사주 | 四柱 | "Four Pillars" — the core chart derived from birth date/time |
| **Pillar** | 주 | 柱 | One of four columns: Year, Month, Day, Hour |
| **Cheongan** | 천간 | 天干 | "Heavenly Stems" — 10 cyclic characters (upper row of each pillar) |
| **Jiji** | 지지 | 地支 | "Earthly Branches" — 12 cyclic characters (lower row of each pillar) |

### Cheongan (10 Heavenly Stems)

| ID | Name | Hanja | Oheng (Element) | Umyang |
|----|------|-------|-----------------|--------|
| 0 | 갑 | 甲 | mok (Wood) | yang |
| 1 | 을 | 乙 | mok (Wood) | um |
| 2 | 병 | 丙 | hwa (Fire) | yang |
| 3 | 정 | 丁 | hwa (Fire) | um |
| 4 | 무 | 戊 | to (Earth) | yang |
| 5 | 기 | 己 | to (Earth) | um |
| 6 | 경 | 庚 | geum (Metal) | yang |
| 7 | 신 | 辛 | geum (Metal) | um |
| 8 | 임 | 壬 | su (Water) | yang |
| 9 | 계 | 癸 | su (Water) | um |

### Jiji (12 Earthly Branches)

| ID | Name | Hanja | Oheng (Element) | Umyang | Zodiac |
|----|------|-------|-----------------|--------|--------|
| 0 | 자 | 子 | su (Water) | yang | Rat |
| 1 | 축 | 丑 | to (Earth) | um | Ox |
| 2 | 인 | 寅 | mok (Wood) | yang | Tiger |
| 3 | 묘 | 卯 | mok (Wood) | um | Rabbit |
| 4 | 진 | 辰 | to (Earth) | yang | Dragon |
| 5 | 사 | 巳 | hwa (Fire) | um | Snake |
| 6 | 오 | 午 | hwa (Fire) | yang | Horse |
| 7 | 미 | 未 | to (Earth) | um | Goat |
| 8 | 신 | 申 | geum (Metal) | yang | Monkey |
| 9 | 유 | 酉 | geum (Metal) | um | Rooster |
| 10 | 술 | 戌 | to (Earth) | yang | Dog |
| 11 | 해 | 亥 | su (Water) | um | Pig |

### Oheng (Five Elements)

| Key | Korean | Chinese | English |
|-----|--------|---------|---------|
| `mok` | 목 | 木 | Wood |
| `hwa` | 화 | 火 | Fire |
| `to` | 토 | 土 | Earth |
| `geum` | 금 | 金 | Metal |
| `su` | 수 | 水 | Water |

### Sinsal Types

| Type | Korean | Meaning |
|------|--------|---------|
| `gilsin` | 길신 (吉神) | Auspicious spirit — positive influence |
| `hyungsin` | 흉신 (凶神) | Inauspicious spirit — negative influence |

### Twelve Life Stages

| Stage | Hanja | Meaning | Power Score |
|-------|-------|---------|-------------|
| 제왕 | 帝旺 | Peak / Emperor | 1.0 |
| 건록 | 建祿 | Prosperity | 0.9 |
| 관대 | 冠帶 | Capping / Maturity | 0.8 |
| 장생 | 長生 | Birth / New beginning | 0.75 |
| 목욕 | 沐浴 | Bathing / Vulnerability | 0.6 |
| 양 | 養 | Nurturing | 0.5 |
| 태 | 胎 | Conception | 0.4 |
| 쇠 | 衰 | Decline | 0.3 |
| 병 | 病 | Sickness | 0.2 |
| 사 | 死 | Death | 0.1 |
| 묘 | 墓 | Tomb / Storage | 0.05 |
| 절 | 絶 | Extinction | 0.0 |

---

## REST API

Base URL: `http://localhost:3000`

### Common Request Format

All saju endpoints accept `POST` with JSON body:

```json
{
  "year": 1997,
  "month": 7,
  "day": 23,
  "hour": 21,
  "minute": 48,
  "isLunar": false,
  "isLeapMonth": false,
  "longitude": 127
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `year` | number | Yes | Year (1900–2050) |
| `month` | number | Yes | Month (1–12) |
| `day` | number | Yes | Day (1–31) |
| `hour` | number | Yes | Hour (0–23) |
| `minute` | number | No | Minute (0–59, default: 0) |
| `isLunar` | boolean | No | Whether the date is lunar calendar (default: false) |
| `isLeapMonth` | boolean | No | Whether it's a leap month in lunar calendar (default: false) |
| `longitude` | number | No | Longitude for time correction (default: 127 = Seoul) |

---

### `POST /api/saju/pillars`

Returns the Four Pillars only (no analysis).

**Request:**
```bash
curl -X POST http://localhost:3000/api/saju/pillars \
  -H "Content-Type: application/json" \
  -d '{"year":1997,"month":7,"day":23,"hour":21,"minute":48}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "yearPillar": {
      "cheongan": { "id": 3, "name": "정", "hanja": "丁", "oheng": "hwa", "umyang": "um" },
      "jiji": { "id": 1, "name": "축", "hanja": "丑", "oheng": "to", "umyang": "um" }
    },
    "monthPillar": {
      "cheongan": { "id": 3, "name": "정", "hanja": "丁", "oheng": "hwa", "umyang": "um" },
      "jiji": { "id": 7, "name": "미", "hanja": "未", "oheng": "to", "umyang": "um" }
    },
    "dayPillar": {
      "cheongan": { "id": 2, "name": "병", "hanja": "丙", "oheng": "hwa", "umyang": "yang" },
      "jiji": { "id": 2, "name": "인", "hanja": "寅", "oheng": "mok", "umyang": "yang" }
    },
    "hourPillar": {
      "cheongan": { "id": 5, "name": "기", "hanja": "己", "oheng": "to", "umyang": "um" },
      "jiji": { "id": 11, "name": "해", "hanja": "亥", "oheng": "su", "umyang": "um" }
    }
  }
}
```

Each pillar has:
- `cheongan` — Heavenly Stem with `id` (0–9), Korean `name`, Chinese `hanja`, five element `oheng`, and `umyang` polarity
- `jiji` — Earthly Branch with `id` (0–11), same fields as above

---

### `POST /api/saju/analyze`

Returns Four Pillars + Sinsal + Twelve Stages + Five Elements analysis.

**Request:**
```bash
curl -X POST http://localhost:3000/api/saju/analyze \
  -H "Content-Type: application/json" \
  -d '{"year":1997,"month":7,"day":23,"hour":21,"minute":48}'
```

**Response structure:**
```json
{
  "success": true,
  "data": {
    "saju": {
      "yearPillar": {...}, "monthPillar": {...}, "dayPillar": {...}, "hourPillar": {...}
    },
    "sinsal": [
      {
        "name": "천을귀인",
        "hanja": "天乙貴人",
        "type": "gilsin",
        "pillar": "hour",
        "description": "가장 존귀한 길신. 위기 시 귀인의 도움을 받음"
      }
    ],
    "twelveStages": [
      { "pillar": "year",  "stage": "양",   "hanja": "養",  "description": "잉태된 기운이 자라는 상태" },
      { "pillar": "month", "stage": "쇠",   "hanja": "衰",  "description": "기운이 쇠퇴하기 시작하는 시기" },
      { "pillar": "day",   "stage": "장생", "hanja": "長生", "description": "새로운 시작과 생명력이 충만한 상태" },
      { "pillar": "hour",  "stage": "절",   "hanja": "絶",  "description": "완전히 끊어진 상태" }
    ],
    "oheng": {
      "balance": { "mok": 1, "hwa": 3, "to": 3, "geum": 0, "su": 1 },
      "strongest": "hwa",
      "weakest": "geum",
      "missing": ["geum"]
    }
  }
}
```

#### Response Fields

| Field | Description |
|-------|-------------|
| `saju` | The Four Pillars (same structure as `/pillars`) |
| `sinsal[]` | Array of detected spiritual influences. `type` is `"gilsin"` (auspicious) or `"hyungsin"` (inauspicious). `pillar` indicates which pillar it was found in (`"year"`, `"month"`, `"day"`, `"hour"`) |
| `twelveStages[]` | Array of 4 items (one per pillar). Each has the stage name and description |
| `oheng.balance` | Count of each element across all 8 characters (4 stems + 4 branches) |
| `oheng.strongest` | The element with the highest count |
| `oheng.weakest` | The element with the lowest count |
| `oheng.missing` | Elements with count = 0 |

---

### `POST /api/saju/interpret`

**Full interpreted analysis.** Includes everything from `/analyze` plus an `interpreted` array where each sinsal is scored by its effective power, factoring in Twelve Stages and Gongmang (void).

**Request:**
```bash
curl -X POST http://localhost:3000/api/saju/interpret \
  -H "Content-Type: application/json" \
  -d '{"year":1997,"month":7,"day":23,"hour":21,"minute":48}'
```

**The `interpreted` array in the response:**
```json
{
  "success": true,
  "data": {
    "saju": {...},
    "sinsal": [...],
    "twelveStages": [...],
    "oheng": {...},
    "interpreted": [
      {
        "sinsal": {
          "name": "천을귀인",
          "hanja": "天乙貴人",
          "type": "gilsin",
          "pillar": "hour",
          "description": "가장 존귀한 길신. 위기 시 귀인의 도움을 받음"
        },
        "twelveStage": {
          "pillar": "hour",
          "stage": "절",
          "hanja": "絶",
          "description": "완전히 끊어진 상태"
        },
        "isGongmang": true,
        "effectivePower": 0,
        "powerLevel": "negligible",
        "interpretation": "천을귀인이(가) 시주에 있으나 절·공망으로 거의 작용하지 못합니다..."
      },
      {
        "sinsal": {
          "name": "학당귀인",
          "hanja": "學堂貴人",
          "type": "gilsin",
          "pillar": "day",
          "description": "학문을 좋아하고 총명함. 학업에서 성과를 얻음"
        },
        "twelveStage": {
          "pillar": "day",
          "stage": "장생",
          "hanja": "長生",
          "description": "새로운 시작과 생명력이 충만한 상태"
        },
        "isGongmang": false,
        "effectivePower": 0.75,
        "powerLevel": "strong",
        "interpretation": "학당귀인이(가) 일주에서 장생(長生) 위에 있어 강하게 작용합니다..."
      }
    ]
  }
}
```

#### `interpreted[]` Item Fields

| Field | Type | Description |
|-------|------|-------------|
| `sinsal` | SinsalResult | The original sinsal data |
| `twelveStage` | TwelveStageResult | The Twelve Stage of the pillar this sinsal sits on |
| `isGongmang` | boolean | Whether this pillar is in Gongmang (void/empty) state |
| `effectivePower` | number (0.0–1.0) | Calculated effective power score |
| `powerLevel` | string | `"strong"` / `"moderate"` / `"weak"` / `"negligible"` |
| `interpretation` | string | Combined interpretation text (in Korean) |

#### Effective Power Formula

```
effectivePower = stageScore × (isGongmang ? 0.3 : 1.0)
```

Stage scores are listed in the [Twelve Life Stages table](#twelve-life-stages) above.

| powerLevel | effectivePower Range |
|------------|---------------------|
| `strong` | 0.70 – 1.00 |
| `moderate` | 0.40 – 0.69 |
| `weak` | 0.10 – 0.39 |
| `negligible` | 0.00 – 0.09 |

**Key insight:** A `gilsin` (auspicious) sinsal with `"negligible"` power means the benefit is essentially nullified. An `hyungsin` (inauspicious) sinsal with `"negligible"` power means the negative effect is also nullified — which is actually good news.

---

### `POST /api/calendar/solar-to-lunar`

Converts a solar (Gregorian) date to lunar (Korean traditional) date.

**Request:**
```bash
curl -X POST http://localhost:3000/api/calendar/solar-to-lunar \
  -H "Content-Type: application/json" \
  -d '{"year":1997,"month":7,"day":23}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "solar": { "year": 1997, "month": 7, "day": 23 },
    "lunar": { "year": 1997, "month": 6, "day": 19, "isLeapMonth": false }
  }
}
```

---

### `POST /api/calendar/lunar-to-solar`

Converts a lunar date to solar date.

**Request:**
```bash
curl -X POST http://localhost:3000/api/calendar/lunar-to-solar \
  -H "Content-Type: application/json" \
  -d '{"year":1997,"month":6,"day":19}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "solar": { "year": 1997, "month": 7, "day": 23 },
    "lunar": { "year": 1997, "month": 6, "day": 19, "isLeapMonth": false }
  }
}
```

---

## Using as a Library

You can import the library directly without running the API server.

```typescript
import {
  calculateSaju,
  analyzeFullSaju,
  analyzeInterpreted,
  solarToLunar,
  lunarToSolar,
} from '@saju/core';

// Four Pillars only
const saju = calculateSaju({
  year: 1997, month: 7, day: 23, hour: 21, minute: 48,
});
console.log(saju.dayPillar.cheongan.name); // "병" (Byeong)
console.log(saju.dayPillar.jiji.name);     // "인" (In)

// Full analysis (sinsal + twelve stages + five elements)
const analysis = analyzeFullSaju({
  year: 1997, month: 7, day: 23, hour: 21, minute: 48,
});

// Interpreted analysis (with effective power scores)
const interpreted = analyzeInterpreted({
  year: 1997, month: 7, day: 23, hour: 21, minute: 48,
});
for (const item of interpreted.interpreted) {
  console.log(`${item.sinsal.name} [${item.powerLevel}] ${item.effectivePower * 100}%`);
  console.log(`  → ${item.interpretation}`);
}

// Lunar calendar input
const sajuLunar = calculateSaju({
  year: 1997, month: 6, day: 19, hour: 21,
  isLunar: true,
});

// Calendar conversion
const lunar = solarToLunar(1997, 7, 23);  // { solar: {...}, lunar: {...} }
const solar = lunarToSolar(1997, 6, 19);  // { solar: {...}, lunar: {...} }
```

---

## Type Definitions

### Pillar

```typescript
interface Pillar {
  cheongan: Cheongan;  // Heavenly Stem
  jiji: Jiji;          // Earthly Branch
}

interface Cheongan {
  id: number;          // 0–9
  name: string;        // Korean name: "갑", "을", ...
  hanja: string;       // Chinese character: "甲", "乙", ...
  oheng: Oheng;        // Five element: "mok" | "hwa" | "to" | "geum" | "su"
  umyang: UmYang;      // Polarity: "um" (yin) | "yang"
}

interface Jiji {
  id: number;          // 0–11
  name: string;        // Korean name: "자", "축", ...
  hanja: string;       // Chinese character: "子", "丑", ...
  oheng: Oheng;
  umyang: UmYang;
}
```

### SajuResult

```typescript
interface SajuResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
}
```

### SinsalResult

```typescript
interface SinsalResult {
  name: string;        // Korean name: "천을귀인", "도화살", ...
  hanja: string;       // Chinese characters: "天乙貴人", "桃花殺", ...
  type: "gilsin" | "hyungsin";  // Auspicious or inauspicious
  pillar: "year" | "month" | "day" | "hour";
  description: string; // Interpretation text (in Korean)
}
```

### InterpretedSinsal

```typescript
interface InterpretedSinsal {
  sinsal: SinsalResult;
  twelveStage: TwelveStageResult;
  isGongmang: boolean;
  effectivePower: number;    // 0.0 – 1.0
  powerLevel: "strong" | "moderate" | "weak" | "negligible";
  interpretation: string;    // Combined interpretation (in Korean)
}
```

### OhengAnalysis

```typescript
type Oheng = "mok" | "hwa" | "to" | "geum" | "su";
//            Wood    Fire    Earth   Metal    Water

interface OhengAnalysis {
  balance: { mok: number; hwa: number; to: number; geum: number; su: number };
  strongest: Oheng;
  weakest: Oheng;
  missing: Oheng[];  // Elements with count = 0
}
```

---

## Supported Sinsal (28 Types)

### Gilsin — Auspicious (10)

| Korean | Hanja | English | Detection Basis |
|--------|-------|---------|-----------------|
| 천을귀인 | 天乙貴人 | Heavenly Noble | Day stem → Branch lookup |
| 문창귀인 | 文昌貴人 | Literary Star | Day stem → Branch lookup |
| 학당귀인 | 學堂貴人 | Academy Noble | Day stem → Branch lookup |
| 천덕귀인 | 天德貴人 | Heavenly Virtue | Month branch → Stem/Branch lookup |
| 월덕귀인 | 月德貴人 | Monthly Virtue | Month branch → Stem lookup |
| 천관귀인 | 天官貴人 | Heavenly Official | Day stem → Branch lookup |
| 복성귀인 | 福星貴人 | Fortune Star | Day stem → Branch lookup |
| 삼기귀인 | 三奇貴人 | Three Wonders | Stem combination pattern |
| 금여록 | 金輿祿 | Golden Carriage | Day stem → Branch lookup |
| 건록 | 建祿 | Established Prosperity | Day stem → Branch lookup |

### Hyungsin — Inauspicious (18)

| Korean | Hanja | English | Detection Basis |
|--------|-------|---------|-----------------|
| 역마살 | 驛馬殺 | Travelling Horse | Day/Year branch → Trigram-based |
| 도화살 | 桃花殺 | Peach Blossom | Day/Year branch → Trigram-based |
| 화개살 | 華蓋殺 | Flower Canopy | Day/Year branch → Trigram-based |
| 백호살 | 白虎殺 | White Tiger | Day branch → Clash relation |
| 괴강살 | 魁罡殺 | Iron Edge | Specific day pillar combos only |
| 양인살 | 羊刃殺 | Blade of Sheep | Day stem → Branch lookup |
| 겁살 | 劫殺 | Robbery | Day/Year branch → Branch lookup |
| 망신살 | 亡身殺 | Lost Body | Day/Year branch → Branch lookup |
| 재살 | 災殺 | Disaster | Day/Year branch → Branch lookup |
| 천살 | 天殺 | Heavenly Disaster | Year branch → Branch lookup |
| 지살 | 地殺 | Earthly Disaster | Year branch → Branch lookup |
| 년살 | 年殺 | Yearly Disaster | Year branch → Branch lookup |
| 월살 | 月殺 | Monthly Disaster | Year branch → Branch lookup |
| 원진살 | 怨嗔殺 | Resentment | Day branch → Branch lookup |
| 귀문관살 | 鬼門關殺 | Ghost Gate | Day branch → Branch lookup |
| 공망 | 空亡 | Void / Empty | Based on 60-pillar cycle position |
| 천라지망 | 天羅地網 | Heaven Net / Earth Trap | 진+사 or 술+해 co-existing in chart |
| 격각살 | 隔角殺 | Corner Clash | Day branch → Branch lookup |

---

## Error Responses

Server error (HTTP 500):
```json
{
  "success": false,
  "error": "Error message here"
}
```

Validation error (HTTP 400):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 1900,
      "path": ["year"],
      "message": "Number must be greater than or equal to 1900"
    }
  ]
}
```

---

## Frontend Integration Tips

### Display a pillar in Korean

```typescript
const pillar = data.yearPillar;
const korean = `${pillar.cheongan.name}${pillar.jiji.name}`;  // "정축"
const hanja  = `${pillar.cheongan.hanja}${pillar.jiji.hanja}`; // "丁丑"
```

### Map Oheng keys to display strings

```typescript
const ohengKorean = { mok: "목", hwa: "화", to: "토", geum: "금", su: "수" };
const ohengHanja  = { mok: "木", hwa: "火", to: "土", geum: "金", su: "水" };
const ohengEnglish = { mok: "Wood", hwa: "Fire", to: "Earth", geum: "Metal", su: "Water" };
```

### Sort sinsal by effective power (from `/interpret`)

```typescript
const sorted = data.interpreted
  .sort((a, b) => b.effectivePower - a.effectivePower);

const auspicious = sorted.filter(i => i.sinsal.type === "gilsin");
const inauspicious = sorted.filter(i => i.sinsal.type === "hyungsin");
```

### Visual power level indicator

```typescript
function powerBar(level: string): string {
  switch (level) {
    case "strong":     return "████";
    case "moderate":   return "███░";
    case "weak":       return "██░░";
    case "negligible": return "█░░░";
    default:           return "░░░░";
  }
}
```

---

## Dev Commands

```bash
npm test           # Run all 34 tests (vitest)
npm run test:watch # Watch mode
npm run dev        # Dev server with tsx (auto-reload)
npm run build      # TypeScript build → dist/
npm start          # Production server (run build first)
```
