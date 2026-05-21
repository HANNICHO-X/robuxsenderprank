import { createFileRoute } from "@tanstack/react-router";
import RobuxPurchasePage from "@/components/generated/RobuxPurchasePage";

export const Route = createFileRoute("/")({
  component: RobuxPurchasePage,
});
