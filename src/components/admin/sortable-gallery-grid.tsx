"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { GalleryItem } from "@/lib/projects";
import { SortableGalleryTile } from "@/components/admin/sortable-gallery-tile";

type Props = {
  items: GalleryItem[];
  onReorder: (next: GalleryItem[]) => void;
  onRemove: (index: number) => void;
  onTypeChange: (index: number, type: GalleryItem["type"]) => void;
};

export function SortableGalleryGrid({ items, onReorder, onRemove, onTypeChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  if (!items.length) return null;

  return (
    <DndContext
      id="project-gallery"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item, i) => (
            <SortableGalleryTile
              key={item.id}
              item={item}
              onRemove={() => onRemove(i)}
              onTypeChange={(type) => onTypeChange(i, type)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
