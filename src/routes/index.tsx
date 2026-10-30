import { createFileRoute } from "@tanstack/react-router";
import { NurApp } from "@/components/nur/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <NurApp />;
}
