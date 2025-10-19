"use client";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useWatchlistStore, CategoryKey } from "../lib/store";
import { CategoryColumn } from "./CategoryColumn";

export function Board(){
  const moveItem = useWatchlistStore(s => s.moveItem);
  const itemsByCat = useWatchlistStore(s => s.itemsByCategory);

  const onDragEnd = (ev: DragEndEvent) => {
    const id = ev.active.id as string;
    const overId = ev.over?.id as string | undefined;
    if (!overId) return;
    const parts = overId.split(":");
    if (parts[0] === 'cat') {
      const to = parts[1] as CategoryKey;
      moveItem(id, to);
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <DndContext onDragEnd={onDragEnd}>
          {(['watching','planning','watched','dropped'] as const).map((catKey) => (
            <div key={catKey} className="glass rounded-xl p-3 min-h-[280px]">
              <CategoryColumn id={`cat:${catKey}`} title={titleFor(catKey)} items={itemsByCat(catKey)} category={catKey} />
            </div>
          ))}
        </DndContext>
      </div>
    </div>
  );
}

function titleFor(k: CategoryKey){
  switch(k){
    case 'watching': return 'Currently Watching';
    case 'planning': return 'Planning to Watch';
    case 'watched': return 'Watched';
    case 'dropped': return 'Dropped';
  }
}
