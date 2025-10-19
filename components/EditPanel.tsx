"use client";
import { useEffect } from 'react';
import { useWatchlistStore } from "../lib/store";

export function EditPanel({ itemId, onClose }: { itemId: string; onClose: () => void; }){
  const item = useWatchlistStore(s => s.items.find(it => it.id === itemId));
  const updateItem = useWatchlistStore(s => s.updateItem);
  const removeItem = useWatchlistStore(s => s.removeItem);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/50 opacity-100 transition-opacity" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="glass w-full max-w-xl rounded-2xl p-4 animate-[fadeIn_150ms_ease]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm uppercase tracking-widest text-white/70">Edit</div>
            <button onClick={onClose} className="rounded-full px-2 py-1 bg-white/10 hover:bg-white/20">✕</button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <div className="aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-white/5">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">No image</div>
                )}
              </div>
            </div>
            <div className="col-span-2 space-y-4">
              <div>
                <label className="text-xs text-white/60">Title</label>
                <input value={item.title} onChange={e=>updateItem(item.id, { title: e.target.value })} className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="text-xs text-white/60">Poster URL</label>
                <input value={item.image} onChange={e=>updateItem(item.id, { image: e.target.value })} className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1">Score</label>
                <div className="grid grid-cols-10 gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button key={i} onClick={()=>updateItem(item.id, { rating: i+1 })} className={`rounded-md py-1 text-sm border ${item.rating === i+1 ? 'bg-white/20 border-white/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{i+1}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/60">Notes</label>
                <textarea value={item.notes} onChange={e=>updateItem(item.id, { notes: e.target.value })} rows={4} className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  {(['watching','planning','watched','dropped'] as const).map(cat => (
                    <button key={cat} onClick={()=>updateItem(item.id, { category: cat })} className={`rounded px-2 py-1 text-xs border ${item.category===cat ? 'bg-white/20 border-white/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{cat}</button>
                  ))}
                </div>
                <button onClick={()=>{ removeItem(item.id); onClose(); }} className="text-red-300 hover:text-red-200">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
