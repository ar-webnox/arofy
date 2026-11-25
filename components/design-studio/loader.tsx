"use client";
import dynamic from "next/dynamic";
const StudioApp = dynamic(() => import("./studio-app"), { ssr: false, loading: () => <div aria-busy="true" className="h-[70vh] rounded-xl border border-line bg-surface" /> });
export function StudioLoader() { return <StudioApp />; }
