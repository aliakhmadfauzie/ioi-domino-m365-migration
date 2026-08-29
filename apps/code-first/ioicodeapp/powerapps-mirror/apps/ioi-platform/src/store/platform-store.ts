import { atom } from "jotai";
import type { SiteCode } from "@/types/platform";

export type UserRole = "user" | "approver" | "admin" | "super_admin" | "it_staff" | "hr_staff";

export const currentRoleAtom = atom<UserRole>("user");

export const currentDepartmentAtom = atom<string | null>(null);

export const isAuthenticatedAtom = atom<boolean>(false);

/** Current site context: 'MY-PR' (Prai) or 'MY-JH' (Johor) — defaults to Prai */
export const currentSiteAtom = atom<SiteCode>("MY-PR");
