import React, { useMemo } from "react";
import style from "./bar.module.css";

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  uniqueId: string; // New prop to pass a unique ID
  changePreviewShown?: boolean;
};

const TASK_BAR_CORNER_RADIUS = 25;

export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  isSelected,
  progressX,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
  uniqueId,
  changePreviewShown,
}) => {
  // Generate unique IDs for clipPath
  const clipPathId = useMemo(() => `clip-path-${uniqueId}`, [uniqueId]);

  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  /**
   * Render grey bar below the task bar
   */
  const renderGreyBar = () => {
    if (changePreviewShown) {
      return null;
    }

    const taskBottomY = y + height;
    const greyBarHeight = height / 6;
    const greyBarY = taskBottomY + 2;

    return (
      <rect
        x={x}
        y={greyBarY}
        width={width}
        height={greyBarHeight}
        fill="#CCCCCC"
        rx={barCornerRadius}
        ry={barCornerRadius}
      />
    );
  };

  return (
    <g onMouseDown={onMouseDown}>
      {renderGreyBar()}
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={TASK_BAR_CORNER_RADIUS}
        rx={TASK_BAR_CORNER_RADIUS}
        fill={getBarColor()}
        opacity={changePreviewShown ? 0.5 : 1}
        stroke="black"
        strokeWidth={changePreviewShown ? 4 : 0}
        strokeDasharray="10 5"
        strokeOpacity="0.8"
      />
      <defs>
        <clipPath id={clipPathId}>
          <rect
            x={x}
            y={y}
            width={progressWidth}
            height={height}
            ry={TASK_BAR_CORNER_RADIUS}
            rx={TASK_BAR_CORNER_RADIUS}
          />
        </clipPath>
      </defs>
      <rect
        x={progressX}
        width={width}
        y={y}
        height={height}
        ry={TASK_BAR_CORNER_RADIUS}
        rx={TASK_BAR_CORNER_RADIUS}
        fill={getProcessColor()}
        opacity={changePreviewShown ? 0.5 : 1}
        clipPath={`url(#${clipPathId})`}
      />
    </g>
  );
};
