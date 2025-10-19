"use client";
import { useDroppable } from '@dnd-kit/core';
import { useMemo } from 'react';
import { ItemCard } from './ItemCard';
import { useWatchlistStore, CategoryKey, Item } from "../lib/store";
import { clsx } from 'clsx';

export function CategoryColumn({ id, title, items, category }: { id: string; title: string; items: Item[]; category: CategoryKey; }){
  const { setNodeRef, isOver } = useDroppable({ id });
  const filterTabs = useWatchlistStore(s => s.filterTabs);
  const filtered = useMemo(() => {
    const tab = filterTabs[category];
    return items.filter(it => tab === 'all' ? true : it.type === tab);
  }, [items, filterTabs, category]);

  return (
    <div ref={setNodeRef} className={clsx("rounded-xl transition-colors", isOver ? "ring-1 ring-white/30" : "") }>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm uppercase tracking-widest text-white/70">{title}</h3>
        <div className="text-xs text-white/50">{filtered.length}</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(i => (
          <ItemCard key={i.id} item={i} />
        ))}
      </div>
      {filtered.length===0 && (
        <div className="text-white/40 text-sm py-8 text-center">Drop items here</div>
      )}
    </div>
  );
}
