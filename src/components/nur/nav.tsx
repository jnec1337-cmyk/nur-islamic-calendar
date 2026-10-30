import { createContext, useContext } from "react";

export type Tab = "today" | "calendar" | "prayer" | "names" | "sunnah" | "more";
export type PageName =
  | "settings"
  | "fasting"
  | "duas"
  | "ayah"
  | "about"
  | "privacy"
  | "converter"
  | "widgets"
  | "schedule"
  | "birthday";

export type NavApi = {
  tab: Tab;
  page: PageName | null;
  qiblaTick: number;
  goTab: (tab: Tab) => void;
  goPage: (page: PageName) => void;
  goQibla: () => void;
  back: () => void;
};

const NavContext = createContext<NavApi | null>(null);

export const NavProvider = NavContext.Provider;

export function useNav(): NavApi {
  const value = useContext(NavContext);
  if (!value) throw new Error("nav");
  return value;
}
