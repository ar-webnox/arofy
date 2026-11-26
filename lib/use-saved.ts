"use client";
import { useEffect, useState } from "react";
/** Small localStorage-backed list. Loads after mount so server and client markup match. */
export function useSaved<T extends { id: string }>(key: string) {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(key) || "[]"); if (Array.isArray(v)) setItems(v); } catch {} }, [key]);
  const commit = (n: T[]) => { setItems(n); try { localStorage.setItem(key, JSON.stringify(n)); } catch {} };
  return { items, has: (id: string) => items.some((i) => i.id === id), toggle: (it: T) => commit(items.some((i) => i.id === it.id) ? items.filter((i) => i.id !== it.id) : [it, ...items].slice(0, 200)), remove: (id: string) => commit(items.filter((i) => i.id !== id)) };
}
