import React from "react";
import { BarTask } from "../../types/bar-task";
import { TaskConnectionType } from "../../types/public-types";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
  connectionType: TaskConnectionType;
};

export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl,
  connectionType
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
      arrowIndent,
      connectionType
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
  arrowIndent: number,
  connectionType: TaskConnectionType
) => {
  const arrowYOffset = arrowIndent + rowHeight / 10;
  const rowsBetween = Math.abs(taskFrom.index - taskTo.index);

  /**
   * Returns the X coordinate of the starting point of the arrow based on the connection type.
   * 
   * - For START_TO_START: uses the left edge (x1) of the source task.
   * - For FINISH_TO_FINISH and FINISH_TO_START: uses the right edge (x2) of the source task.
   */
  const getFromX = () => {
    switch (connectionType) {
      case TaskConnectionType.StartToStart:
        return taskFrom.x1ChangePreview ?? taskFrom.x1;
      case TaskConnectionType.FinishToFinish:
      case TaskConnectionType.FinishToStart:
      default:
        return taskFrom.x2ChangePreview ?? taskFrom.x2;
    }
  };

  /**
   * Returns the X coordinate of the ending point of the arrow based on the connection type.
   * 
   * - For START_TO_START: uses the left edge (x1) of the target task.
   * - For FINISH_TO_FINISH: uses the right edge (x2) of the target task.
   * - For FINISH_TO_START: uses the left edge (x1) of the target task.
   */
  const getToX = () => {
    switch (connectionType) {
      case TaskConnectionType.StartToStart:
        return taskTo.x1ChangePreview ?? taskTo.x1;
      case TaskConnectionType.FinishToFinish:
        return taskTo.x2ChangePreview ?? taskTo.x2;
      case TaskConnectionType.FinishToStart:
      default:
        return taskTo.x1ChangePreview ?? taskTo.x1;
    }
  };
  // Values below help us draw arrows either for tasks or task previews if they are available
  const taskFromX = getFromX();
  const taskToX = getToX();

  const taskToEndPosition = taskTo.y + taskHeight / 2;
  const taskFromEndPosition = taskFromX + arrowIndent * 2;

  const taskToHorizontalOffsetValue =
    connectionType === TaskConnectionType.FinishToFinish
      ? taskFromEndPosition > taskToX
        ? arrowIndent
        : taskToX - taskFromX
      : taskFromEndPosition > taskToX
        ? arrowIndent
        : taskToX - taskFromX + arrowIndent;

  const xOffset = arrowIndent; // Change this value to move the triangle to the right or left
  const yOffset = arrowYOffset - 2; // Change this value to move the triangle up or down

  const triangleHeightAdjustment = 2; // Smaller value for height adjustment
  const triangleWidthAdjustment = 3;  // Smaller value for width adjustment

  // Draws the arrow pointer triangle
  let trianglePoints: string;
  // Reposition the triangle point based on the connection type
  if (connectionType === TaskConnectionType.FinishToFinish) {
    // No X offset for FinishToFinish
    trianglePoints = `${taskToX},${taskToEndPosition + triangleHeightAdjustment - yOffset} 
      ${taskToX - triangleWidthAdjustment},${taskToEndPosition - (2 * triangleHeightAdjustment) - yOffset} 
      ${taskToX + triangleWidthAdjustment},${taskToEndPosition - (2 * triangleHeightAdjustment) - yOffset}`;
  } else {
    // FinishToStart or StartToStart
    trianglePoints = `${taskToX + xOffset},${taskToEndPosition + triangleHeightAdjustment - yOffset} 
      ${taskToX - triangleWidthAdjustment + xOffset},${taskToEndPosition - (2 * triangleHeightAdjustment) - yOffset} 
      ${taskToX + triangleWidthAdjustment + xOffset},${taskToEndPosition - (2 * triangleHeightAdjustment) - yOffset}`;
  }

  // If a child task starts before the parent task ends, we need to add 2 more lines to the path: one horizontal line back from the parent tase end to the child task start, and one vertical line to the child task arrow
  if (taskFromEndPosition > taskToX) {
    const path2 = `M ${taskFromX} ${taskFrom.y + taskHeight / 2} 
    h ${arrowIndent} 
    v ${rowsBetween > 1 ? (rowsBetween - 0.5) * rowHeight : (rowsBetween * rowHeight) / 2}
    H ${taskToX + arrowIndent} 
    v ${rowHeight - arrowYOffset - rowHeight / 2}`;

    return [path2, trianglePoints];
  }

  // This repositions the line to avoid arrows originating on the left of a source task from going through the task
  // Without this the arrow path would look visually incorrect for this condition.
  if (connectionType === TaskConnectionType.StartToStart) {
    const path = `M ${taskFromX} ${taskFrom.y + taskHeight / 2}
      h -${arrowIndent}
      v ${(rowsBetween * rowHeight) - arrowYOffset}
      H ${taskToX - arrowIndent}
      h ${arrowIndent * 2}`;
    return [path, trianglePoints];
  }

  const path = `M ${taskFromX} ${taskFrom.y + taskHeight / 2} 
  h ${taskToHorizontalOffsetValue}
  v ${(rowsBetween * rowHeight) - arrowYOffset}`;

  return [path, trianglePoints];
};

// This function is not used in our current implementation, but it is kept for reference, without the above connectionType handling.
const drownPathAndTriangleRTL = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;

  // Values below help us draw arrows either for tasks or task previews if they are available
  const taskOrPreviewFromX1 = taskFrom.x1ChangePreview ?? taskFrom.x1;
  const taskOrPreviewToX2 = taskTo.x2ChangePreview ?? taskTo.x2;

  const taskFromEndPosition = taskOrPreviewFromX1 - arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition > taskOrPreviewToX2 ? "" : `H ${taskOrPreviewToX2 + arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition < taskOrPreviewToX2
      ? -arrowIndent
      : taskOrPreviewToX2 - taskOrPreviewFromX1 + arrowIndent;

  const path = `M ${taskOrPreviewFromX1} ${taskFrom.y + taskHeight / 2} 
  h ${-arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition} 
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskOrPreviewToX2},${taskToEndPosition} 
  ${taskOrPreviewToX2 + 5},${taskToEndPosition + 5} 
  ${taskOrPreviewToX2 + 5},${taskToEndPosition - 5}`;
  return [path, trianglePoints];
};
