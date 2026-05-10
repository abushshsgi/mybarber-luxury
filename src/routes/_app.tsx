import { Outlet, createFileRoute } from "@tanstack/react-router";
import { FloatingBottomDock } from "@/components/luxury/FloatingBottomDock";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md bg-background pb-28">
      <Outlet />
      <FloatingBottomDock />
    </div>
  );
}
