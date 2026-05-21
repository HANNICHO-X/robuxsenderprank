import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { X, Search, Loader2, Check } from "lucide-react";
import { searchRobloxUsers, type RobloxUser } from "@/lib/roblox.functions";
import { RobloxAvatar } from "./RobloxAvatar";
import { formatFull } from "@/lib/format";

export type CurrentUser = {
  name: string;
  handle: string;
  avatarUrl: string | null;
};

export function SettingsModal({
  open,
  onClose,
  balance,
  user,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  balance: number;
  user: CurrentUser;
  onSave: (next: { balance: number; user: CurrentUser }) => void;
}) {
  const search = useServerFn(searchRobloxUsers);
  const [balanceInput, setBalanceInput] = useState(String(balance));
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RobloxUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<CurrentUser>(user);

  useEffect(() => {
    if (open) {
      setBalanceInput(String(balance));
      setPicked(user);
      setQuery("");
      setResults([]);
    }
  }, [open, balance, user]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await search({ data: { keyword: q, limit: 10 } });
        if (!ctrl.signal.aborted) setResults(res.users);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 300);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query, open, search]);

  if (!open) return null;

  const parsedBalance = Math.max(0, Math.floor(Number(balanceInput.replace(/[^\d]/g, "")) || 0));

  const save = () => {
    onSave({ balance: parsedBalance, user: picked });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0f1015] border border-white/10 rounded-2xl w-full max-w-[440px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <span className="font-bold text-[15px]">Account settings</span>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-md hover:bg-white/5"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Current profile preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <RobloxAvatar src={picked.avatarUrl} alt={picked.name} size={44} />
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold text-white truncate">{picked.name}</span>
              <span className="text-[12px] text-white/50 truncate">{picked.handle}</span>
            </div>
          </div>

          {/* Robux balance */}
          <div>
            <label className="block text-[12px] font-bold text-white/70 mb-2 uppercase tracking-wider">
              Robux balance
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value.replace(/[^\d]/g, ""))}
              className="w-full h-11 bg-white/[0.04] border border-white/10 focus:border-blue-500 rounded-lg px-3 text-[15px] font-semibold text-white focus:outline-none"
              placeholder="0"
            />
            <p className="text-[11px] text-white/40 mt-1.5">
              Preview: {formatFull(parsedBalance)} Robux
            </p>
          </div>

          {/* Username search */}
          <div>
            <label className="block text-[12px] font-bold text-white/70 mb-2 uppercase tracking-wider">
              Roblox username
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search to change your profile"
                className="w-full h-11 bg-white/[0.04] border border-white/10 focus:border-blue-500 rounded-lg pl-9 pr-9 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
              )}
            </div>

            {results.length > 0 && (
              <div className="mt-2 border border-white/10 rounded-lg overflow-hidden">
                {results.map((u) => {
                  const isPicked = picked.handle === `@${u.name}`;
                  return (
                    <button
                      key={u.id}
                      onClick={() =>
                        setPicked({
                          name: u.displayName || u.name,
                          handle: `@${u.name}`,
                          avatarUrl: u.avatarUrl,
                        })
                      }
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-left border-b border-white/5 last:border-0"
                    >
                      <RobloxAvatar src={u.avatarUrl} alt={u.name} size={32} />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[13px] font-semibold text-white truncate">
                          {u.displayName || u.name}
                        </span>
                        <span className="text-[11px] text-white/50 truncate">@{u.name}</span>
                      </div>
                      {isPicked && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-[13px] font-semibold text-white/70 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="h-10 px-5 rounded-lg bg-blue-500 hover:bg-blue-600 text-[13px] font-bold text-white"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
