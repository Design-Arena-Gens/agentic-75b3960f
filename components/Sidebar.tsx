"use client";
import { useState, useMemo, useRef } from 'react';
import { useWatchlistStore } from "../lib/store";
import { clsx } from 'clsx';
import { searchAll } from "../lib/search";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [manualType, setManualType] = useState<'movie'|'tv'>('movie');
  const [manualImage, setManualImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    id: string;
    title: string;
    type: 'movie'|'tv';
    image: string;
    year?: string;
  }>>([]);
  const addItem = useWatchlistStore(s => s.addItem);

  const runSearch = useMemo(() => {
    let timeout: any;
    return async (q: string) => {
      clearTimeout(timeout);
      if (!q.trim()) { setResults([]); return; }
      timeout = setTimeout(async () => {
        setLoading(true);
        try {
          const r = await searchAll(q.trim());
          setResults(r);
        } finally { setLoading(false); }
      }, 250);
    };
  }, []);

  const onPick = (r: any) => {
    addItem({
      title: r.title,
      type: r.type,
      image: r.image,
      notes: "",
      rating: 0,
      category: 'planning',
    });
    setQuery("");
    setResults([]);
  };

  const onManualAdd = () => {
    if (!manualTitle.trim()) return;
    addItem({
      title: manualTitle.trim(),
      type: manualType,
      image: manualImage.trim(),
      notes: "",
      rating: 0,
      category: 'planning',
    });
    setManualTitle("");
    setManualImage("");
  };

  return (
    <aside className={clsx(
      "relative h-full transition-all duration-300",
      collapsed ? "w-12" : "w-80"
    )}>
      <div className={clsx("absolute top-4 z-20", collapsed ? "left-2" : "-right-4") }>
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed(v => !v)}
          className="glass rounded-full p-2 hover:scale-105 active:scale-95 transition"
        >
          {collapsed ?
            <span className="block w-6 h-6">▶</span> :
            <span className="block w-6 h-6 rotate-180">◀</span>
          }
        </button>
      </div>

      <div className={clsx("glass h-full p-4 pr-6 overflow-y-auto scrollbar", collapsed && "px-2") }>
        {!collapsed && (
          <div className="space-y-6">
            <section>
              <h2 className="text-sm uppercase tracking-widest text-white/70 mb-2">Search</h2>
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); runSearch(e.target.value); }}
                placeholder="Search movies & TV"
                className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
              />
              {loading && <div className="text-xs text-white/60 mt-2">Searching…</div>}
              {!!results.length && (
                <div className="mt-2 max-h-60 overflow-y-auto rounded-md border border-white/10">
                  {results.map(r => (
                    <button key={r.id} onClick={() => onPick(r)} className="w-full flex items-center gap-3 bg-black/30 hover:bg-white/5 px-2 py-2 text-left">
                      <img src={r.image} alt="poster" className="w-10 h-14 object-cover rounded" />
                      <div className="text-sm">
                        <div className="font-medium">{r.title}</div>
                        <div className="text-white/60">{r.type.toUpperCase()} {r.year ? `• ${r.year}` : ''}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-sm uppercase tracking-widest text-white/70 mb-2">Add manual</h2>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select value={manualType} onChange={e=>setManualType(e.target.value as any)} className="bg-white/5 border border-white/10 rounded px-2">
                    <option value="movie">Movie</option>
                    <option value="tv">TV</option>
                  </select>
                  <input value={manualTitle} onChange={e=>setManualTitle(e.target.value)} placeholder="Title" className="flex-1 rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none" />
                </div>
                <input value={manualImage} onChange={e=>setManualImage(e.target.value)} placeholder="Poster URL (optional)" className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none" />
                <button onClick={onManualAdd} className="w-full glass rounded-md py-2 hover:scale-[1.01] active:scale-95 transition">Add</button>
              </div>
            </section>

            <section>
              <h2 className="text-sm uppercase tracking-widest text-white/70 mb-2">Filters</h2>
              <SidebarFilters />
            </section>

            <section className="flex items-center justify-between gap-2">
              <button onClick={() => useWatchlistStore.getState().exportData()} className="flex-1 glass rounded-md py-2">Export</button>
              <label className="flex-1 glass rounded-md py-2 text-center cursor-pointer">
                <input type="file" accept="application/json" className="hidden" onChange={(e)=>useWatchlistStore.getState().importData(e)} />
                Import
              </label>
            </section>

            <section>
              <h2 className="text-sm uppercase tracking-widest text-white/70 mb-2">Settings</h2>
              <ThemeToggle />
            </section>
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarFilters(){
  const tabs = useWatchlistStore(s => s.filterTabs);
  const setTabs = useWatchlistStore(s => s.setFilterTabs);
  const onChange = (key: keyof typeof tabs, val: 'all'|'movie'|'tv') => setTabs({ ...tabs, [key]: val });
  return (
    <div className="space-y-4">
      {(['watching','planning','watched','dropped'] as const).map(cat => (
        <div key={cat} className="space-y-1">
          <div className="text-xs text-white/60 capitalize">{cat.replace(/.*/, (m)=>m)}</div>
          <div className="flex gap-1">
            {(['all','movie','tv'] as const).map(k => (
              <button key={k} onClick={()=>onChange(cat, k)} className={clsx(
                "flex-1 rounded px-2 py-1 text-xs border",
                tabs[cat]===k ? "bg-white/10 border-white/20" : "bg-white/0 border-white/10 hover:bg-white/5"
              )}>{k}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ThemeToggle(){
  const [on, setOn] = useState(true);
  return (
    <button onClick={()=>setOn(v=>!v)} className="glass px-3 py-2 rounded-md w-full">
      {on ? 'Dark' : 'Light'}
    </button>
  );
}
