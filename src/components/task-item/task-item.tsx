import { useNavigate } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { CustomMilestone } from "./bar/custom-milestone";
import { Milestone } from "./milestone/milestone";
import { Project } from "./project/project";
import style from "./task-list.module.css";

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
};

export const TaskItem: React.FC<TaskItemProps> = props => {
  const {
    task,
    arrowIndent,
    isDelete,
    taskHeight,
    isSelected,
    rtl,
    onEventStart,
  } = {
    ...props,
  };

  const navigate = useNavigate();
  const textRef = useRef<SVGTextElement>(null);
  const { x1ChangePreview, x2ChangePreview} = task;
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);

  const getCustomMilestone = () => {
    const newProps = {
      ...props,
      onEventStart: (action: GanttContentMoveAction, selectedTask: BarTask) => {
        if (action === "click") {
          navigate({
            to: "$milestoneId/tasks",
            params: {
              milestoneId: selectedTask.id,
            },
          });
        }
      }
    };

    return <CustomMilestone { ...newProps } />;
  };

  useEffect(() => {
    switch (task.typeInternal) {
      case "milestone":
        setTaskItem(<Milestone {...props} />);
        break;
      case "custom-milestone":
        setTaskItem(getCustomMilestone());
        break;
      case "project":
        setTaskItem(<Project {...props} />);
        break;
      case "smalltask":
        setTaskItem(<BarSmall {...props} />);
        break;
      default:
        setTaskItem(<Bar {...props} />);
        break;
    }
  }, [task, isSelected]);

  useEffect(() => {
    if (textRef.current) {
      setIsTextInside(textRef.current.getBBox().width < task.x2 - task.x1);
    }
  }, [textRef, task]);

  const getX = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    if (isTextInside) {
      return task.x1 + width * 0.5;
    }
    if (rtl && textRef.current) {
      return (
        task.x1 -
        textRef.current.getBBox().width -
        arrowIndent * +hasChild -
        arrowIndent * 0.2
      );
    } else {
      return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
    }
  };

  /**
   * Renders a task preview label when change preview is available
   */
  const renderTaskChangePreviewLabel = () => {
    if (!x1ChangePreview || !x2ChangePreview) {
      return null;
    }

    return (
      <text
        x={x1ChangePreview + (x2ChangePreview - x1ChangePreview) * 0.5}
        y={task.y + taskHeight * 0.5}
        className={isTextInside ? style.barLabel : style.barLabel && style.barLabelOutside}
        style={{opacity: 0.5}}
      >
        {task.name}
      </text>
    );
  };

  return (
    <g
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (isDelete) onEventStart("delete", task, e);
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => {
        onEventStart("mouseenter", task, e);
      }}
      onMouseLeave={e => {
        onEventStart("mouseleave", task, e);
      }}
      onDoubleClick={e => {
        onEventStart("dblclick", task, e);
      }}
      onClick={e => {
        onEventStart("click", task, e);
      }}
      onFocus={() => {
        onEventStart("select", task);
      }}
    >
      {taskItem}
      <text
        x={getX()}
        y={task.y + taskHeight * 0.5}
        className={
          isTextInside
            ? style.barLabel
            : style.barLabel && style.barLabelOutside
        }
        ref={textRef}
      >
        {task.typeInternal !== "custom-milestone" && task.name}
      </text>
      {renderTaskChangePreviewLabel()}
    </g>
  );
};
