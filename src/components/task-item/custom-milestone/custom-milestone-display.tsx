import React from "react";
import style from "./custom-milestone.module.css";

/**
 * Component properties
 */
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
  taskName: string
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
  taskName,
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
  const NAME_WIDTH = width - TRIANGLE_WIDTH / 2 - 5;
  const NAME_HEIGHT = 16;
  const NAME_X = x + TRIANGLE_WIDTH/2;
  const NAME_Y = y + height / 2;

  /**
   * Renders thin grey bar underneath the milestone
   * 
   * TODO: add original milestone dates support for the grey bar
   */
  const renderGreyBar = () => {
    const milestoneBottomY = y + height;
    const greyBarHeight = height / 6;
    const greyBarY = milestoneBottomY + 2;

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
  
  /**
   * Renders flag icon
   * 
   * TODO: add flag icon support
   */
  const renderFlagIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        style={{ marginLeft: "10px" }}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"
        />
      </svg>
    );
  }

  /**
   * Renders text inside the milestone shape
   */
  const renderMilestoneName = () => (
    <foreignObject x={NAME_X} y={NAME_Y - 8} width={NAME_WIDTH} height={NAME_HEIGHT}>
      <div style={{ width: "100%", height: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>{taskName}</div>
    </foreignObject>
  );

  if (width <= 0) {
    return null;
  }

  /**
   * Main component render
   */
  return (
    <g onMouseDown={onMouseDown}>
      {renderGreyBar()}
      {/* Render milestone hex shape */}
      <rect
        x={x + TRIANGLE_WIDTH}
        width={width - 2 * TRIANGLE_WIDTH}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={isSelected ? styles.backgroundSelectedColor : styles.backgroundColor}
        className={style.barBackground}
        style={{ position: "relative" }}
      />
      {/* Render milestone progress */}
      <rect
        x={progressX + TRIANGLE_WIDTH}
        width={progressWidth - 2 * TRIANGLE_WIDTH}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={isSelected ? styles.progressSelectedColor : styles.progressColor}
        style={{ position: "relative" }}
      />
      {/* Render triangles */}
      {renderRightTriangle(progressWidth > width - 1 ? getProcessColor() : getBarColor())}
      {renderLeftTriangle(progressWidth > 0 ? getProcessColor() : getBarColor())}
      {/* Render milestone name */}
      {renderMilestoneName()}
    </g>
  );
};
