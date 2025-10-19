"use client";
import { useEffect } from 'react';
import { Sidebar } from "../components/Sidebar";
import { Board } from "../components/Board";
import { useWatchlistStore } from "../lib/store";

export default function Page() {
  const hydrate = useWatchlistStore(s => s.hydrateFromStorage);
  useEffect(() => { hydrate(); }, [hydrate]);
  return (
    <main className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <Board />
    </main>
  );
}
