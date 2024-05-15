import React from "react";
import style from "./custom-milestone.module.css";

type CustomMilestoneDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  /* progress start point */
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
};

/**
 * Custom milestone display component for the gantt chart
 * 
 * @param props custom milestone properties
 */
export const CustomMilestoneDisplay = ({
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
}: CustomMilestoneDisplayProps) => {

  /**
   * Get color for the progress bar
   */
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  /**
   * Get color for the background bar
   */
  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  const TRIANGLE_WIDTH = 25;
  const TRIANGLE_WIDTH_WITH_OFFSET = TRIANGLE_WIDTH * 1.082;

  /**
   * Renders start of a bar triangle
   * 
   * @param color fill color of the triangle
   */
  const renderLeftTriangle = (color: string) => {
    return (
      <polygon
        points={`${x + TRIANGLE_WIDTH_WITH_OFFSET},${y} ${x},${y + height / 2} ${x + TRIANGLE_WIDTH_WITH_OFFSET},${y + height}`}
        fill={color}
      />
    );
  };

  /**
   * Renders end of bar triangle
   * 
   * @param color fill color of the triangle
   */
  const renderRightTriangle = (color: string) => {
    return (
      <polygon
        points={`${x + width - TRIANGLE_WIDTH_WITH_OFFSET},${y} ${x + width},${y + height / 2} ${x + width - TRIANGLE_WIDTH_WITH_OFFSET},${y + height}`}
        fill={color}
      />
    );
  };

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x + TRIANGLE_WIDTH}
        width={width - 2 * TRIANGLE_WIDTH}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className={style.barBackground}
        style={{ position: "relative" }}
      />
      <rect
        x={progressX + TRIANGLE_WIDTH}
        width={progressWidth - 2 * TRIANGLE_WIDTH}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
        style={{ position: "relative" }}
      />
      {renderRightTriangle(progressWidth > width - 1 ? getProcessColor() : getBarColor())}
      {renderLeftTriangle(progressWidth > 0 ? getProcessColor() : getBarColor())}
    </g>
  );
};
