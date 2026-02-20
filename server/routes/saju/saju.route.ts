import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { AuthType } from "@/lib/auth";
import { authMiddleware } from "@/server/middleware/auth.middleware";
import { sajuService } from "@/server/services/saju.service";
import { sajuAiService } from "@/server/services/saju-ai.service";
import { sajuReadingService } from "@/server/services/saju-reading.service";
import { sajuInputSchema } from "@/server/validators/saju.validators";
import {
  saveSajuReadingSchema,
  updateSajuReadingSchema,
} from "@/server/validators/saju-reading.validators";

const router = new Hono<{ Variables: AuthType }>();

function requireUser(c: { get: (key: string) => AuthType["user"] }) {
  const user = c.get("user");
  if (!user) throw new HTTPException(401, { message: "Unauthorized" });
  return user;
}

/**
 * POST /api/saju/pillars
 * Returns the Four Pillars only (no analysis)
 */
router.post("/pillars", zValidator("json", sajuInputSchema), (c) => {
  const input = c.req.valid("json");
  try {
    const data = sajuService.getPillars(input);
    return c.json({ success: true, data });
  } catch (err) {
    throw new HTTPException(500, {
      message: err instanceof Error ? err.message : "Failed to calculate pillars",
    });
  }
});

/**
 * POST /api/saju/analyze
 * Returns Four Pillars + Sinsal + Twelve Stages + Five Elements analysis
 */
router.post("/analyze", zValidator("json", sajuInputSchema), (c) => {
  const input = c.req.valid("json");
  try {
    const data = sajuService.analyze(input);
    return c.json({ success: true, data });
  } catch (err) {
    throw new HTTPException(500, {
      message: err instanceof Error ? err.message : "Failed to analyze saju",
    });
  }
});

/**
 * POST /api/saju/interpret
 * Full interpreted analysis with effective power scoring
 */
router.post("/interpret", zValidator("json", sajuInputSchema), (c) => {
  const input = c.req.valid("json");
  try {
    const data = sajuService.interpret(input);
    return c.json({ success: true, data });
  } catch (err) {
    throw new HTTPException(500, {
      message: err instanceof Error ? err.message : "Failed to interpret saju",
    });
  }
});

const aiInterpretSchema = sajuInputSchema.extend({
  language: z.enum(["ko", "en"]).optional(),
});

/**
 * POST /api/saju/ai-interpret
 * Full AI-powered interpretation via LangChain + OpenAI
 */
router.post("/ai-interpret", zValidator("json", aiInterpretSchema), async (c) => {
  const { language, ...input } = c.req.valid("json");
  try {
    const analysis = sajuService.interpret(input);
    const aiText = await sajuAiService.interpret(analysis, language ?? "en");
    return c.json({ success: true, data: { analysis, aiInterpretation: aiText } });
  } catch (err) {
    throw new HTTPException(500, {
      message: err instanceof Error ? err.message : "Failed to generate AI interpretation",
    });
  }
});

/**
 * GET /api/saju/readings
 * List all saved readings for the authenticated user
 */
router.get("/readings", authMiddleware, async (c) => {
  const user = requireUser(c);
  const data = await sajuReadingService.getAll(user.id);
  return c.json({ success: true, data });
});

/**
 * GET /api/saju/readings/stats
 * Get stats for the authenticated user
 */
router.get("/readings/stats", authMiddleware, async (c) => {
  const user = requireUser(c);
  const data = await sajuReadingService.getStats(user.id);
  return c.json({ success: true, data });
});

/**
 * GET /api/saju/readings/:id
 * Get a single saved reading
 */
router.get("/readings/:id", authMiddleware, async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  const data = await sajuReadingService.getById(user.id, id);
  if (!data) throw new HTTPException(404, { message: "Reading not found" });
  return c.json({ success: true, data });
});

/**
 * POST /api/saju/readings
 * Save a new reading
 */
router.post("/readings", authMiddleware, zValidator("json", saveSajuReadingSchema), async (c) => {
  const user = requireUser(c);
  const body = c.req.valid("json");
  const data = await sajuReadingService.create(user.id, body);
  return c.json({ success: true, data }, 201);
});

/**
 * PATCH /api/saju/readings/:id
 * Update a saved reading label or AI text
 */
router.patch(
  "/readings/:id",
  authMiddleware,
  zValidator("json", updateSajuReadingSchema),
  async (c) => {
    const user = requireUser(c);
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const data = await sajuReadingService.update(user.id, id, body);
    if (!data) throw new HTTPException(404, { message: "Reading not found" });
    return c.json({ success: true, data });
  },
);

/**
 * DELETE /api/saju/readings/:id
 * Delete a saved reading
 */
router.delete("/readings/:id", authMiddleware, async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  const data = await sajuReadingService.delete(user.id, id);
  if (!data) throw new HTTPException(404, { message: "Reading not found" });
  return c.json({ success: true, data });
});

export default router;
