// components/MasonryGrid.tsx
import React, { useEffect, useRef, useState } from 'react';

interface MasonryGridProps {
  items: React.ReactNode[];
  columnWidth?: number;
  gap?: number;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items, columnWidth = 300, gap = 20 }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [numColumns, setNumColumns] = useState(1);

  useEffect(() => {
    const updateLayout = () => {
      if (gridRef.current) {
        const width = gridRef.current.offsetWidth;
        const calculatedColumns = Math.floor(width / (columnWidth + gap));
        setNumColumns(calculatedColumns);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
    };
  }, [columnWidth, gap]);

  const getColumnStyles = () => {
    return {
      gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
      gap: `${gap}px`,
    };
  };

  return (
    <div ref={gridRef} className="masonry-grid" style={getColumnStyles()}>
      {items.map((item, index) => (
        <div key={index} className="masonry-grid-item">
          {item}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;