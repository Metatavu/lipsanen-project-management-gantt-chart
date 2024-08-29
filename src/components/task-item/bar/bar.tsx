import React from "react";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

export const Bar: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  rtl,
  onEventStart,
  isSelected,
}) => {
  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth + task.progressX,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;

  /**
   * Render a preview of the task when it is moved with new change preview dates
   */
  const renderTaskChangePreview = () => {
    if (!task.x1ChangePreview || !task.x2ChangePreview) {
      return null;
    }

    const previewX1 = task.x1ChangePreview;
    const previewX2 = task.x2ChangePreview;
    const previewProgressWidth = task.changePreviewProgressWidth;
    const previewProgressX = task.changePreviewProgressX;
    
    return (
      <BarDisplay
        x={previewX1}
        y={task.y}
        width={previewX2 - previewX1}
        height={task.height}
        progressX={previewProgressX ?? 0}
        progressWidth={previewProgressWidth ?? 0}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        uniqueId={`${task.id}-preview`}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
        changePreviewShown
      />
    );
  };

  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        uniqueId={task.id}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={task.x1 + 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("start", task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("end", task, e);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g>
      {renderTaskChangePreview()}
    </g>
  );
};
