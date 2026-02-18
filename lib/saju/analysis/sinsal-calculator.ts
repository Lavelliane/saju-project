import type { SajuResult, PillarPosition, Pillar } from "../types/saju";
import type { SinsalResult } from "../types/analysis";
import {
  CHEONEUL_GWIYIN,
  MUNCHANG_GWIYIN,
  HAKDANG_GWIYIN,
  CHEONDUK_GWIYIN,
  WOLDUK_GWIYIN,
  CHEONGWAN_GWIYIN,
  BOKSUNG_GWIYIN,
  SAMGI_GROUPS,
  GEUMYEOLOK,
  GEONROK,
  YEOKMA,
  DOHWA,
  HWAGAE,
  BAEKHO,
  GOEGANG,
  YANGIN,
  GEOBSAL,
  MANGSIN,
  JAESAL,
  CHEONSAL,
  JISAL,
  NYEONSAL,
  WOLSAL,
  WONJIN,
  GWIMUNGWAN,
  GYEOKGAK,
} from "../constants/sinsal-tables";

type PillarEntry = { position: PillarPosition; pillar: Pillar };

function getAllPillars(saju: SajuResult): PillarEntry[] {
  return [
    { position: "year",  pillar: saju.yearPillar },
    { position: "month", pillar: saju.monthPillar },
    { position: "day",   pillar: saju.dayPillar },
    { position: "hour",  pillar: saju.hourPillar },
  ];
}

function getAllJijiIds(saju: SajuResult): number[] {
  return [
    saju.yearPillar.jiji.id,
    saju.monthPillar.jiji.id,
    saju.dayPillar.jiji.id,
    saju.hourPillar.jiji.id,
  ];
}

function getAllCheonganIds(saju: SajuResult): number[] {
  return [
    saju.yearPillar.cheongan.id,
    saju.monthPillar.cheongan.id,
    saju.dayPillar.cheongan.id,
    saju.hourPillar.cheongan.id,
  ];
}

function checkCheoneulGwiyin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const dayGanId = saju.dayPillar.cheongan.id;
  const targetJiji = CHEONEUL_GWIYIN[dayGanId];
  if (!targetJiji) return results;
  for (const entry of getAllPillars(saju)) {
    if (targetJiji.includes(entry.pillar.jiji.id)) {
      results.push({ name: "천을귀인", hanja: "天乙貴人", type: "gilsin", pillar: entry.position, description: "가장 존귀한 길신. 위기 시 귀인의 도움을 받음" });
    }
  }
  return results;
}

function checkMunchangGwiyin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = MUNCHANG_GWIYIN[saju.dayPillar.cheongan.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "문창귀인", hanja: "文昌貴人", type: "gilsin", pillar: entry.position, description: "학문과 예술에 뛰어난 재능. 시험운이 좋음" });
    }
  }
  return results;
}

function checkHakdangGwiyin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = HAKDANG_GWIYIN[saju.dayPillar.cheongan.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "학당귀인", hanja: "學堂貴人", type: "gilsin", pillar: entry.position, description: "학문을 좋아하고 총명함. 학업에서 성과를 얻음" });
    }
  }
  return results;
}

function checkCheondukGwiyin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const target = CHEONDUK_GWIYIN[saju.monthPillar.jiji.id];
  if (!target) return results;
  for (const entry of getAllPillars(saju)) {
    if (target.type === "cheongan" && entry.pillar.cheongan.id === target.id) {
      results.push({ name: "천덕귀인", hanja: "天德貴人", type: "gilsin", pillar: entry.position, description: "하늘의 덕을 받아 재앙을 면함. 음덕이 있음" });
    } else if (target.type === "jiji" && entry.pillar.jiji.id === target.id) {
      results.push({ name: "천덕귀인", hanja: "天德貴人", type: "gilsin", pillar: entry.position, description: "하늘의 덕을 받아 재앙을 면함. 음덕이 있음" });
    }
  }
  return results;
}

function checkWoldukGwiyin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetCheongan = WOLDUK_GWIYIN[saju.monthPillar.jiji.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.cheongan.id === targetCheongan) {
      results.push({ name: "월덕귀인", hanja: "月德貴人", type: "gilsin", pillar: entry.position, description: "월의 덕을 받아 흉사를 막음. 온화한 성품" });
    }
  }
  return results;
}

function checkCheongwanGwiyin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = CHEONGWAN_GWIYIN[saju.dayPillar.cheongan.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "천관귀인", hanja: "天官貴人", type: "gilsin", pillar: entry.position, description: "관직운이 좋음. 직장에서 승진이 빠름" });
    }
  }
  return results;
}

function checkBoksungGwiyin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = BOKSUNG_GWIYIN[saju.dayPillar.cheongan.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "복성귀인", hanja: "福星貴人", type: "gilsin", pillar: entry.position, description: "복을 주관하는 길신. 일생 복록이 풍부함" });
    }
  }
  return results;
}

function checkSamgiGwiyin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const cheonganIds = getAllCheonganIds(saju);
  const pillars = getAllPillars(saju);
  const groupNames = ["천상삼기", "지하삼기", "인중삼기"];
  for (let gi = 0; gi < SAMGI_GROUPS.length; gi++) {
    const group = SAMGI_GROUPS[gi]!;
    if (group.filter((id) => cheonganIds.includes(id)).length >= 2) {
      for (const entry of pillars) {
        if (group.includes(entry.pillar.cheongan.id)) {
          results.push({ name: "삼기귀인", hanja: "三奇貴人", type: "gilsin", pillar: entry.position, description: `${groupNames[gi]}에 해당. 특별한 재능과 기회가 있음` });
        }
      }
      break;
    }
  }
  return results;
}

function checkGeumyeolok(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = GEUMYEOLOK[saju.dayPillar.cheongan.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "금여록", hanja: "金輿祿", type: "gilsin", pillar: entry.position, description: "배우자궁이 좋고 부부인연이 좋음" });
    }
  }
  return results;
}

function checkGeonrok(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = GEONROK[saju.dayPillar.cheongan.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "건록", hanja: "建祿", type: "gilsin", pillar: entry.position, description: "녹봉이 있어 경제적으로 안정됨. 자수성가의 기운" });
    }
  }
  return results;
}

function checkYeokma(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targets = new Set([YEOKMA[saju.dayPillar.jiji.id], YEOKMA[saju.yearPillar.jiji.id]]);
  for (const entry of getAllPillars(saju)) {
    if (targets.has(entry.pillar.jiji.id)) {
      results.push({ name: "역마살", hanja: "驛馬殺", type: "hyungsin", pillar: entry.position, description: "이동이 많고 변동이 잦음. 해외운이 있을 수 있음" });
    }
  }
  return results;
}

function checkDohwa(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targets = new Set([DOHWA[saju.dayPillar.jiji.id], DOHWA[saju.yearPillar.jiji.id]]);
  for (const entry of getAllPillars(saju)) {
    if (targets.has(entry.pillar.jiji.id)) {
      results.push({ name: "도화살", hanja: "桃花殺", type: "hyungsin", pillar: entry.position, description: "매력이 넘치고 이성운이 강함. 예술적 감성" });
    }
  }
  return results;
}

function checkHwagae(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targets = new Set([HWAGAE[saju.dayPillar.jiji.id], HWAGAE[saju.yearPillar.jiji.id]]);
  for (const entry of getAllPillars(saju)) {
    if (targets.has(entry.pillar.jiji.id)) {
      results.push({ name: "화개살", hanja: "華蓋殺", type: "hyungsin", pillar: entry.position, description: "종교, 철학, 예술에 재능. 고독할 수 있음" });
    }
  }
  return results;
}

function checkBaekho(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = BAEKHO[saju.dayPillar.jiji.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "백호살", hanja: "白虎殺", type: "hyungsin", pillar: entry.position, description: "혈광이나 사고에 주의. 수술수가 있을 수 있음" });
    }
  }
  return results;
}

function checkGoegang(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const dayGanId = saju.dayPillar.cheongan.id;
  const dayJijiId = saju.dayPillar.jiji.id;
  for (const [ganId, jijiId] of GOEGANG) {
    if (dayGanId === ganId && dayJijiId === jijiId) {
      results.push({ name: "괴강살", hanja: "魁罡殺", type: "hyungsin", pillar: "day", description: "성격이 강하고 결단력이 있음. 리더십이 강함" });
      break;
    }
  }
  return results;
}

function checkYangin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = YANGIN[saju.dayPillar.cheongan.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "양인살", hanja: "羊刃殺", type: "hyungsin", pillar: entry.position, description: "기운이 지나치게 강함. 성격이 급하고 과단성이 있음" });
    }
  }
  return results;
}

function checkGeobsal(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targets = new Set([GEOBSAL[saju.dayPillar.jiji.id], GEOBSAL[saju.yearPillar.jiji.id]]);
  for (const entry of getAllPillars(saju)) {
    if (targets.has(entry.pillar.jiji.id)) {
      results.push({ name: "겁살", hanja: "劫殺", type: "hyungsin", pillar: entry.position, description: "강도, 도난, 강탈의 위험. 예기치 않은 손해" });
    }
  }
  return results;
}

function checkMangsin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targets = new Set([MANGSIN[saju.dayPillar.jiji.id], MANGSIN[saju.yearPillar.jiji.id]]);
  for (const entry of getAllPillars(saju)) {
    if (targets.has(entry.pillar.jiji.id)) {
      results.push({ name: "망신살", hanja: "亡身殺", type: "hyungsin", pillar: entry.position, description: "명예 실추, 망신의 위험. 구설수에 주의" });
    }
  }
  return results;
}

function checkJaesal(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targets = new Set([JAESAL[saju.dayPillar.jiji.id], JAESAL[saju.yearPillar.jiji.id]]);
  for (const entry of getAllPillars(saju)) {
    if (targets.has(entry.pillar.jiji.id)) {
      results.push({ name: "재살", hanja: "災殺", type: "hyungsin", pillar: entry.position, description: "재난과 재앙에 주의. 질병이나 사고의 위험" });
    }
  }
  return results;
}

function checkCheonsal(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = CHEONSAL[saju.yearPillar.jiji.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "천살", hanja: "天殺", type: "hyungsin", pillar: entry.position, description: "하늘에서 내리는 재앙. 자연재해나 불가항력" });
    }
  }
  return results;
}

function checkJisal(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = JISAL[saju.yearPillar.jiji.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "지살", hanja: "地殺", type: "hyungsin", pillar: entry.position, description: "땅에서 발생하는 재앙. 이사나 이동에 주의" });
    }
  }
  return results;
}

function checkNyeonsal(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = NYEONSAL[saju.yearPillar.jiji.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "년살", hanja: "年殺", type: "hyungsin", pillar: entry.position, description: "해당 년도에 주의가 필요. 질병이나 구설수" });
    }
  }
  return results;
}

function checkWolsal(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = WOLSAL[saju.yearPillar.jiji.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "월살", hanja: "月殺", type: "hyungsin", pillar: entry.position, description: "고독과 이별의 살. 가족과 멀어질 수 있음" });
    }
  }
  return results;
}

function checkWonjin(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = WONJIN[saju.dayPillar.jiji.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.position !== "day" && entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "원진살", hanja: "怨嗔殺", type: "hyungsin", pillar: entry.position, description: "원한과 미움의 살. 대인관계에서 갈등이 생길 수 있음" });
    }
  }
  return results;
}

function checkGwimungwan(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const targetJiji = GWIMUNGWAN[saju.dayPillar.jiji.id];
  for (const entry of getAllPillars(saju)) {
    if (entry.position !== "day" && entry.pillar.jiji.id === targetJiji) {
      results.push({ name: "귀문관살", hanja: "鬼門關殺", type: "hyungsin", pillar: entry.position, description: "귀신의 문을 여닫는 살. 정신적 불안이나 신비체험" });
    }
  }
  return results;
}

function checkGongmang(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const dayGanId = saju.dayPillar.cheongan.id;
  const dayJijiId = saju.dayPillar.jiji.id;
  const startJiji = ((dayJijiId - dayGanId) % 12 + 12) % 12;
  const gongmang1 = (startJiji + 10) % 12;
  const gongmang2 = (startJiji + 11) % 12;
  for (const entry of getAllPillars(saju)) {
    if (entry.pillar.jiji.id === gongmang1 || entry.pillar.jiji.id === gongmang2) {
      results.push({ name: "공망", hanja: "空亡", type: "hyungsin", pillar: entry.position, description: "비어있는 기운. 해당 기둥의 작용이 약해짐" });
    }
  }
  return results;
}

function checkCheonraJimang(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const jijiIds = getAllJijiIds(saju);
  const pillars = getAllPillars(saju);
  if (jijiIds.includes(4) && jijiIds.includes(5)) {
    for (const entry of pillars) {
      if (entry.pillar.jiji.id === 4 || entry.pillar.jiji.id === 5) {
        results.push({ name: "천라지망", hanja: "天羅地網", type: "hyungsin", pillar: entry.position, description: "천라(天羅). 하늘의 그물에 걸림. 관재수나 구속에 주의" });
      }
    }
  }
  if (jijiIds.includes(10) && jijiIds.includes(11)) {
    for (const entry of pillars) {
      if (entry.pillar.jiji.id === 10 || entry.pillar.jiji.id === 11) {
        results.push({ name: "천라지망", hanja: "天羅地網", type: "hyungsin", pillar: entry.position, description: "지망(地網). 땅의 그물에 걸림. 질병이나 재난에 주의" });
      }
    }
  }
  return results;
}

function checkGyeokgak(saju: SajuResult): SinsalResult[] {
  const results: SinsalResult[] = [];
  const dayJijiId = saju.dayPillar.jiji.id;
  const targetJiji = GYEOKGAK[dayJijiId];
  if (!targetJiji) return results;
  for (const entry of getAllPillars(saju)) {
    if (entry.position !== "day" && targetJiji.includes(entry.pillar.jiji.id)) {
      results.push({ name: "격각살", hanja: "隔角殺", type: "hyungsin", pillar: entry.position, description: "가까운 사이에서 틈이 생김. 부부나 동료와 불화" });
    }
  }
  return results;
}

export function calculateSinsal(saju: SajuResult): SinsalResult[] {
  return [
    ...checkCheoneulGwiyin(saju),
    ...checkMunchangGwiyin(saju),
    ...checkHakdangGwiyin(saju),
    ...checkCheondukGwiyin(saju),
    ...checkWoldukGwiyin(saju),
    ...checkCheongwanGwiyin(saju),
    ...checkBoksungGwiyin(saju),
    ...checkSamgiGwiyin(saju),
    ...checkGeumyeolok(saju),
    ...checkGeonrok(saju),
    ...checkYeokma(saju),
    ...checkDohwa(saju),
    ...checkHwagae(saju),
    ...checkBaekho(saju),
    ...checkGoegang(saju),
    ...checkYangin(saju),
    ...checkGeobsal(saju),
    ...checkMangsin(saju),
    ...checkJaesal(saju),
    ...checkCheonsal(saju),
    ...checkJisal(saju),
    ...checkNyeonsal(saju),
    ...checkWolsal(saju),
    ...checkWonjin(saju),
    ...checkGwimungwan(saju),
    ...checkGongmang(saju),
    ...checkCheonraJimang(saju),
    ...checkGyeokgak(saju),
  ];
}
