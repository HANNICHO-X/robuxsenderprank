import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { X, Search, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFull, formatRobux } from "@/lib/format";
import { searchRobloxUsers, type RobloxUser } from "@/lib/roblox.functions";
import { RobloxAvatar } from "./RobloxAvatar";

const RobuxIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={cn("fill-current", className)}>
    <path d="M15.0762 7.29574C15.6479 6.96571 16.3521 6.96571 16.9238 7.29574L23.0762 10.8479C23.6479 11.1779 24 11.7878 24 12.4479V19.5521C24 20.2122 23.6479 20.8221 23.0762 21.1521L16.9238 24.7043C16.3521 25.0343 15.6479 25.0343 15.0762 24.7043L8.92376 21.1521C8.35214 20.8221 8 20.2122 8 19.5521V12.4479C8 11.7878 8.35214 11.1779 8.92376 10.8479L15.0762 7.29574ZM11.9998 13V19C11.9998 19.5523 12.4475 20 12.9998 20H18.9998C19.5521 20 19.9998 19.5523 19.9998 19V13C19.9998 12.4477 19.5521 12 18.9998 12H12.9998C12.4475 12 11.9998 12.4477 11.9998 13Z" />
    <path d="M13.8556 2.56068C15.1825 1.81311 16.8175 1.81311 18.1444 2.56068L26.8556 7.46819C28.1825 8.21577 29 9.59734 29 11.0925V20.9075C29 22.4027 28.1825 23.7842 26.8556 24.5318L18.1444 29.4393C16.8175 30.1869 15.1825 30.1869 13.8556 29.4393L5.14444 24.5318C3.81746 23.7842 3 22.4027 3 20.9075V11.0925C3 9.59734 3.81746 8.21577 5.14444 7.46819L13.8556 2.56068ZM17.1628 4.30319C16.4452 3.89894 15.5548 3.89894 14.8372 4.30319L6.12611 9.2107C5.41362 9.61209 5 10.336 5 11.0925V20.9075C5 21.664 5.41362 22.3879 6.12611 22.7893L14.8372 27.6968C16.5548 28.1011 16.4452 28.1011 17.1628 27.6968L25.8739 22.7893C26.5864 22.3879 27 21.664 27 20.9075V11.0925C27 10.336 26.5864 9.61209 25.8739 9.2107L17.1628 4.30319Z" />
  </svg>
);

const PRESETS = [25, 50, 100, 200];

type Friend = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
};

const toFriend = (u: RobloxUser): Friend => ({
  id: String(u.id),
  name: u.displayName || u.name,
  handle: `@${u.name}`,
  avatarUrl: u.avatarUrl,
});

type Step = "pick" | "amount" | "sending" | "done";


export function SendRobuxModal({
  open,
  onClose,
  balance,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  balance: number;
  onSent: (amount: number) => void;
}) {
  const search = useServerFn(searchRobloxUsers);
  const [step, setStep] = useState<Step>("pick");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [friend, setFriend] = useState<Friend | null>(null);
  const [amount, setAmount] = useState<number>(200);

  // Debounced Roblox search
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length === 0) {
      setResults([]);
      setErrMsg(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrMsg(null);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await search({ data: { keyword: q, limit: 10 } });
        if (ctrl.signal.aborted) return;
        if (res.error) setErrMsg(res.error);
        setResults(res.users.map(toFriend));
      } catch (e) {
        if (!ctrl.signal.aborted) setErrMsg("Search failed");
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 300);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query, open, search]);

  const showHint = useMemo(() => query.trim().length === 0, [query]);

  if (!open) return null;

  const reset = () => {
    setStep("pick");
    setQuery("");
    setResults([]);
    setErrMsg(null);
    setFriend(null);
    setAmount(200);
  };
  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSend = () => {
    setStep("sending");
    setTimeout(() => {
      onSent(amount);
      setStep("done");
    }, 1600);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#05060A]/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="relative rounded-2xl w-full max-w-[420px] overflow-hidden border border-white/[0.06] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.04)]"
        style={{
          background:
            "linear-gradient(180deg, #161922 0%, #0F1117 60%, #0B0D13 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center gap-2">
            <RobuxIcon size={18} className="text-white/90" />
            <span className="font-semibold text-[15px] text-white/90 tracking-tight">Send Robux</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 text-white/80 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]"
              title={formatFull(balance)}
            >
              <RobuxIcon size={14} className="text-white/80" />
              <span className="text-[12px] font-semibold tabular-nums">{formatRobux(balance)}</span>
            </div>
            <button
              onClick={handleClose}
              className="text-white/50 hover:text-white/90 p-1 rounded-md hover:bg-white/[0.05] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        {step === "pick" && (
          <div className="p-5">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Roblox username"
                className="w-full h-11 bg-[#0B0D13] border border-white/[0.06] rounded-lg pl-9 pr-9 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/15 focus:bg-[#0D1018] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-colors"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 animate-spin" />
              )}
            </div>

            <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-2 px-1">
              {showHint ? "Suggestions" : `Results${results.length ? ` (${results.length})` : ""}`}
            </div>

            <div className="max-h-[320px] overflow-y-auto -mx-2 pr-1 min-h-[180px]">
              {showHint && (
                <div className="px-3 py-10 text-center text-white/40 text-sm">
                  Start typing to search Roblox players
                </div>
              )}
              {!showHint && errMsg && (
                <div className="px-3 py-3 text-center text-red-400/80 text-sm">{errMsg}</div>
              )}
              {!showHint && !loading && !errMsg && results.length === 0 && (
                <div className="px-3 py-10 text-center text-white/40 text-sm">No players found</div>
              )}
              {results.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFriend(f);
                    setStep("amount");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
                >
                  <RobloxAvatar src={f.avatarUrl} alt={f.name} size={36} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-semibold text-white/90 truncate">{f.name}</span>
                    <span className="text-[12px] text-white/45 truncate">{f.handle}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "amount" && friend && (
          <div className="p-6 flex flex-col items-center">
            <div className="mb-3">
              <RobloxAvatar src={friend.avatarUrl} alt={friend.name} size={64} />
            </div>
            <div className="text-[15px] font-semibold text-white/90">{friend.name}</div>
            <div className="text-[12px] text-white/45">{friend.handle}</div>
            <div className="flex items-center gap-2 mt-5 mb-5 px-5 py-3 rounded-xl bg-[#0B0D13] border border-white/[0.05] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]">
              <RobuxIcon size={26} className="text-white/90" />
              <span className="text-[34px] font-black tracking-tight text-white/95 tabular-nums">{formatFull(amount)}</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 h-9 rounded-lg border text-[13px] font-semibold transition-all",
                    amount === p
                      ? "border-white/15 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                      : "border-white/[0.06] bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white/90",
                  )}
                >
                  <RobuxIcon size={13} className="opacity-80" />
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={handleSend}
              disabled={amount <= 0 || amount > balance}
              className="w-full h-12 rounded-lg font-semibold text-white text-[15px] transition-all disabled:text-white/30 disabled:cursor-not-allowed border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_12px_-4px_rgba(0,0,0,0.5)]"
              style={
                amount <= 0 || amount > balance
                  ? { background: "#14171F" }
                  : { background: "linear-gradient(180deg, #2A3142 0%, #1B2030 100%)" }
              }
            >
              {amount > balance ? "Not enough Robux" : "Next"}
            </button>
            <button
              onClick={() => setStep("pick")}
              className="mt-3 text-[12px] text-white/40 hover:text-white/70 transition-colors"
            >
              Choose a different player
            </button>
          </div>
        )}

        {step === "sending" && (
          <div className="p-10 flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full border-4 border-white/[0.06] border-t-white/60 animate-spin" />
            <div className="text-center">
              <div className="font-semibold text-[17px] text-white/90">Sending Robux...</div>
              <div className="text-white/40 text-[13px] mt-1">Please wait</div>
            </div>
          </div>
        )}

        {step === "done" && friend && (
          <div className="p-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1B2030] border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <Check className="w-8 h-8 text-white/90" strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <div className="font-bold text-[20px] text-white/95">Robux Sent</div>
              <p className="text-white/55 text-[14px] mt-2">
                You sent{" "}
                <span className="font-semibold text-white/90">{formatFull(amount)} Robux</span> to{" "}
                <span className="font-semibold text-white/90">{friend.handle}</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="mt-3 px-8 h-11 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg font-semibold text-white/90 text-[14px] transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SendRobuxModal;
