import React from "react";
import { BarTask } from "../../types/bar-task";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
};
export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl,
}) => {
  let path: string;
  let trianglePoints: string;
  if (rtl) {
    [path, trianglePoints] = drownPathAndTriangleRTL(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  } else {
    [path, trianglePoints] = drownPathAndTriangle(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  }

  return (
    <g className="arrow">
      <path strokeWidth="1.5" d={path} fill="none" />
      <polygon points={trianglePoints} />
    </g>
  );
};

const drownPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const arrowYOffset = arrowIndent + rowHeight / 10;
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const rowsBetween = Math.abs(taskFrom.index - taskTo.index);
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  const taskFromEndPosition = taskFrom.x2 + arrowIndent * 2;
  const taskFromHorizontalOffsetValue = taskFromEndPosition < taskTo.x1 ? "" : `H ${taskTo.x1 - arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition > taskTo.x1
      ? arrowIndent
      : taskTo.x1 - taskFrom.x2 + arrowIndent;

  const xOffset = arrowIndent; // Change this value to move the triangle to the right or left
  const yOffset = arrowYOffset-2; // Change this value to move the triangle up or down

  const triangleHeightAdjustment = 2; // Smaller value for height adjustment
  const triangleWidthAdjustment = 3;  // Smaller value for width adjustment

  // Draws the arrow pointer triangle
  const trianglePoints = `${taskTo.x1 + xOffset},${taskToEndPosition + triangleHeightAdjustment - yOffset} 
    ${taskTo.x1 - triangleWidthAdjustment + xOffset},${taskToEndPosition - (2 * triangleHeightAdjustment) - yOffset} 
    ${taskTo.x1 + triangleWidthAdjustment + xOffset},${taskToEndPosition - (2 * triangleHeightAdjustment) - yOffset}`;

  // If a child task starts before the parent task ends, we need to add 2 more lines to the path: one horizontal line back from the parent tase end to the child task start, and one vertical line to the child task arrow
  if (taskFromEndPosition > taskTo.x1) {
    const path2 = `M ${taskFrom.x2} ${taskFrom.y + taskHeight / 2} 
    h ${arrowIndent} 
    v ${rowsBetween > 1 ? (rowsBetween - 0.5) * rowHeight : (rowsBetween * rowHeight) / 2}
    H ${taskTo.x1 + arrowIndent} 
    v ${rowHeight - arrowYOffset - rowHeight / 2}`;
    
    return [path2, trianglePoints];
  }

  const path = `M ${taskFrom.x2} ${taskFrom.y + taskHeight / 2} 
  h ${taskToHorizontalOffsetValue}
  v ${(rowsBetween * rowHeight) - arrowYOffset}`;

  return [path, trianglePoints];
};

const drownPathAndTriangleRTL = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  const taskFromEndPosition = taskFrom.x1 - arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition > taskTo.x2 ? "" : `H ${taskTo.x2 + arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition < taskTo.x2
      ? -arrowIndent
      : taskTo.x2 - taskFrom.x1 + arrowIndent;

  const path = `M ${taskFrom.x1} ${taskFrom.y + taskHeight / 2} 
  h ${-arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition} 
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskTo.x2},${taskToEndPosition} 
  ${taskTo.x2 + 5},${taskToEndPosition + 5} 
  ${taskTo.x2 + 5},${taskToEndPosition - 5}`;
  return [path, trianglePoints];
};
