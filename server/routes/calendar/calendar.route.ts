import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { sajuService } from "@/server/services/saju.service";
import { lunarToSolarSchema, solarToLunarSchema } from "@/server/validators/saju.validators";

const router = new Hono();

/**
 * POST /api/calendar/solar-to-lunar
 * Converts a solar (Gregorian) date to lunar (Korean traditional) date
 */
router.post("/solar-to-lunar", zValidator("json", solarToLunarSchema), (c) => {
  const { year, month, day } = c.req.valid("json");
  try {
    const data = sajuService.solarToLunar(year, month, day);
    return c.json({ success: true, data });
  } catch (err) {
    throw new HTTPException(500, {
      message: err instanceof Error ? err.message : "Failed to convert solar to lunar",
    });
  }
});

/**
 * POST /api/calendar/lunar-to-solar
 * Converts a lunar date to solar (Gregorian) date
 */
router.post("/lunar-to-solar", zValidator("json", lunarToSolarSchema), (c) => {
  const { year, month, day, isLeapMonth } = c.req.valid("json");
  try {
    const data = sajuService.lunarToSolar(year, month, day, isLeapMonth);
    return c.json({ success: true, data });
  } catch (err) {
    throw new HTTPException(500, {
      message: err instanceof Error ? err.message : "Failed to convert lunar to solar",
    });
  }
});

export default router;
