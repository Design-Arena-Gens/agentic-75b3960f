"use client";
import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
import { Item, useWatchlistStore } from "../lib/store";
import { EditPanel } from './EditPanel';

export function ItemCard({ item }: { item: Item }){
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  const [open, setOpen] = useState(false);
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="group relative">
      <button onClick={()=>setOpen(true)} className="block w-full">
        <div className="aspect-[2/3] w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">No image</div>
          )}
        </div>
        <div className="mt-1 text-sm font-medium line-clamp-1" title={item.title}>{item.title}</div>
        <div className="text-xs text-white/60">{item.type.toUpperCase()} • {item.rating || '-'}</div>
      </button>
      {open && <EditPanel itemId={item.id} onClose={()=>setOpen(false)} />}
    </div>
  );
}
