import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type RobloxUser = {
  id: number;
  name: string;
  displayName: string;
  avatarUrl: string | null;
};

type SearchRobloxUsersResult = {
  users: RobloxUser[];
  error: string | null;
  retryAfterMs: number | null;
};

const ALLOWED_LIMITS = [10, 25, 50, 100] as const;
const clampLimit = (n: number) =>
  ALLOWED_LIMITS.reduce((prev, curr) => (Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev), 10);
const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000;
const STALE_CACHE_TTL_MS = 20 * 60 * 1000;
const RETRY_AFTER_MS = 2_000;

const searchCache = new Map<string, { users: RobloxUser[]; at: number }>();
const avatarCache = new Map<number, string | null>();
const inFlightSearches = new Map<string, Promise<SearchRobloxUsersResult>>();

const normalizeKeyword = (keyword: string) => keyword.trim().toLowerCase();

const getCachedUsers = (keyword: string, maxAgeMs: number) => {
  const entry = searchCache.get(keyword);
  if (!entry) return null;
  if (Date.now() - entry.at > maxAgeMs) return null;
  return entry.users;
};

const matchesKeyword = (user: RobloxUser, keyword: string) => {
  const normalizedName = user.name.toLowerCase();
  const normalizedDisplayName = user.displayName.toLowerCase();
  return normalizedName.includes(keyword) || normalizedDisplayName.includes(keyword);
};

const getFallbackUsers = (keyword: string) => {
  const now = Date.now();
  const candidates = [...searchCache.entries()]
    .filter(
      ([cachedKeyword, entry]) =>
        now - entry.at <= STALE_CACHE_TTL_MS &&
        (keyword.startsWith(cachedKeyword) || cachedKeyword.startsWith(keyword)),
    )
    .sort((a, b) => b[0].length - a[0].length);

  for (const [, entry] of candidates) {
    const filtered = entry.users.filter((user) => matchesKeyword(user, keyword));
    if (filtered.length > 0) return filtered;
  }

  return [];
};

export const searchRobloxUsers = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      keyword: z.string().trim().min(1).max(50),
      limit: z.number().int().min(1).max(100).default(10),
    }),
  )
  .handler(async ({ data }): Promise<SearchRobloxUsersResult> => {
    const keyword = normalizeKeyword(data.keyword);
    const limit = clampLimit(data.limit);

    const freshCache = getCachedUsers(keyword, SEARCH_CACHE_TTL_MS);
    if (freshCache) {
      return { users: freshCache, error: null, retryAfterMs: null };
    }

    const existingRequest = inFlightSearches.get(keyword);
    if (existingRequest) {
      return existingRequest;
    }

    const requestPromise = (async (): Promise<SearchRobloxUsersResult> => {
      const url = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}`;
      const headers = {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; RobuxApp/1.0)",
      };

      try {
        let searchRes = await fetch(url, { headers });
        if (searchRes.status === 429) {
          await new Promise((r) => setTimeout(r, 600));
          searchRes = await fetch(url, { headers });
        }

        if (!searchRes.ok) {
          const fallbackUsers = getFallbackUsers(keyword);
          if (fallbackUsers.length > 0) {
            return { users: fallbackUsers, error: null, retryAfterMs: searchRes.status === 429 ? RETRY_AFTER_MS : null };
          }

          return {
            users: [],
            error:
              searchRes.status === 429
                ? "Roblox is busy, retrying automatically"
                : `Roblox search failed (${searchRes.status})`,
            retryAfterMs: searchRes.status === 429 ? RETRY_AFTER_MS : null,
          };
        }

        const searchJson = (await searchRes.json()) as {
          data?: { id: number; name: string; displayName: string }[];
        };
        const users = searchJson.data ?? [];
        if (users.length === 0) {
          searchCache.set(keyword, { users: [], at: Date.now() });
          return { users: [], error: null, retryAfterMs: null };
        }

        const avatarMap = new Map<number, string | null>();
        const missingIds: number[] = [];
        for (const user of users) {
          if (avatarCache.has(user.id)) {
            avatarMap.set(user.id, avatarCache.get(user.id) ?? null);
          } else {
            missingIds.push(user.id);
          }
        }

        if (missingIds.length > 0) {
          try {
            const thumbRes = await fetch(
              `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${missingIds.join(",")}&size=150x150&format=Png&isCircular=true`,
              { headers },
            );

            if (thumbRes.ok) {
              const thumbJson = (await thumbRes.json()) as {
                data?: { targetId: number; imageUrl: string; state: string }[];
              };
              for (const thumbnail of thumbJson.data ?? []) {
                const imageUrl = thumbnail.state === "Completed" ? thumbnail.imageUrl : null;
                avatarCache.set(thumbnail.targetId, imageUrl);
                avatarMap.set(thumbnail.targetId, imageUrl);
              }
            }
          } catch (e) {
            console.error("thumbnail fetch failed", e);
          }
        }

        const mappedUsers = users.map((user) => ({
          id: user.id,
          name: user.name,
          displayName: user.displayName,
          avatarUrl: avatarMap.get(user.id) ?? null,
        }));

        searchCache.set(keyword, { users: mappedUsers, at: Date.now() });
        return { users: mappedUsers, error: null, retryAfterMs: null };
      } catch (e) {
        console.error("Roblox search error:", e);
        const fallbackUsers = getFallbackUsers(keyword);
        if (fallbackUsers.length > 0) {
          return { users: fallbackUsers, error: null, retryAfterMs: RETRY_AFTER_MS };
        }
        return { users: [], error: "Failed to reach Roblox", retryAfterMs: RETRY_AFTER_MS };
      }
    })();

    inFlightSearches.set(keyword, requestPromise);
    try {
      return await requestPromise;
    } finally {
      inFlightSearches.delete(keyword);
    }
  });
