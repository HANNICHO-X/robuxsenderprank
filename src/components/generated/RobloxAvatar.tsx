import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export function RobloxAvatar({
  src,
  alt,
  size = 36,
  className,
}: {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-full overflow-hidden border border-white/10 bg-[#393b41] flex items-center justify-center shrink-0",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt ?? ""} className="w-full h-full object-cover" />
      ) : (
        <User
          className="text-[#9ca0a8]"
          style={{ width: size * 0.6, height: size * 0.6 }}
          strokeWidth={2.2}
        />
      )}
    </div>
  );
}
