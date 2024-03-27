import React from 'react';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon?: React.ReactNode;
  color?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  style?: React.CSSProperties;
  itemClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  dateClassName?: string;
  iconClassName?: string;
  lineColor?: string;
  lineWidth?: number;
  alternateItems?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
  items,
  className = '',
  style,
  itemClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  dateClassName = '',
  iconClassName = '',
  lineColor = 'gray-300',
  lineWidth = 2,
  alternateItems = false,
}) => {
  return (
    <div className={`timeline ${className}`} style={style}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`timeline-item ${
            alternateItems && index % 2 !== 0 ? 'timeline-item-right' : ''
          } ${itemClassName}`}
        >
          <div className="timeline-item-content">
            <div
              className={`timeline-item-icon ${iconClassName}`}
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>
            <div className="timeline-item-details">
              <h3 className={`timeline-item-title ${titleClassName}`}>{item.title}</h3>
              {item.description && (
                <p className={`timeline-item-description ${descriptionClassName}`}>
                  {item.description}
                </p>
              )}
              <span className={`timeline-item-date ${dateClassName}`}>{item.date}</span>
            </div>
          </div>
          <div
            className="timeline-item-line"
            style={{ backgroundColor: lineColor, width: `${lineWidth}px` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;