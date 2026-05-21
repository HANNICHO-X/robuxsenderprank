import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type RobloxUser = {
  id: number;
  name: string;
  displayName: string;
  avatarUrl: string | null;
};

const ALLOWED_LIMITS = [10, 25, 50, 100] as const;
const clampLimit = (n: number) =>
  ALLOWED_LIMITS.reduce((prev, curr) => (Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev), 10);

export const searchRobloxUsers = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      keyword: z.string().trim().min(1).max(50),
      limit: z.number().int().min(1).max(100).default(10),
    }),
  )
  .handler(async ({ data }): Promise<{ users: RobloxUser[]; error: string | null }> => {
    const limit = clampLimit(data.limit);
    const url = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(data.keyword)}&limit=${limit}`;
    const headers = {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; RobuxApp/1.0)",
    };
    try {
      // Retry once on 429 with short backoff
      let searchRes = await fetch(url, { headers });
      if (searchRes.status === 429) {
        await new Promise((r) => setTimeout(r, 600));
        searchRes = await fetch(url, { headers });
      }
      if (!searchRes.ok) {
        return {
          users: [],
          error:
            searchRes.status === 429
              ? "Roblox is rate-limiting, try again in a moment"
              : `Roblox search failed (${searchRes.status})`,
        };
      }
      const searchJson = (await searchRes.json()) as {
        data?: { id: number; name: string; displayName: string }[];
      };
      const users = searchJson.data ?? [];
      if (users.length === 0) return { users: [], error: null };


      const ids = users.map((u) => u.id).join(",");
      let avatarMap = new Map<number, string>();
      try {
        const thumbRes = await fetch(
          `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids}&size=150x150&format=Png&isCircular=true`,
          { headers: { Accept: "application/json" } },
        );
        if (thumbRes.ok) {
          const thumbJson = (await thumbRes.json()) as {
            data?: { targetId: number; imageUrl: string; state: string }[];
          };
          for (const t of thumbJson.data ?? []) {
            if (t.state === "Completed") avatarMap.set(t.targetId, t.imageUrl);
          }
        }
      } catch (e) {
        console.error("thumbnail fetch failed", e);
      }

      return {
        users: users.map((u) => ({
          id: u.id,
          name: u.name,
          displayName: u.displayName,
          avatarUrl: avatarMap.get(u.id) ?? null,
        })),
        error: null,
      };
    } catch (e) {
      console.error("Roblox search error:", e);
      return { users: [], error: "Failed to reach Roblox" };
    }
  });
