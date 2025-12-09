import finnishholidays, { type Holiday } from "finnish-holidays-js";
import React, { ReactChild } from "react";
import { addToDate } from "../../helpers/date-helper";
import { Task, ViewMode } from "../../types/public-types";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
  viewMode?: ViewMode;
};

const isWeekend = (date: Date) => {
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  return day === 0 || day === 6;
};

/**
 * Builds a set of Finnish holidays in ISO format for the given date range
 * 
 * @param dates Date []
 * @returns List of unique Finnish holidays in ISO format (yyyy-mm-dd) for date range
 */
const buildFinnishHolidaySet = (dates: Date[]) => {
  if (!dates.length) return new Set<string>();

  const firstYear = dates[0].getFullYear();
  const lastYear = dates[dates.length - 1].getFullYear();
  const holidayIsoSet = new Set<string>();

  for (let year = firstYear; year <= lastYear; year++) {
    const yearHolidays: Holiday[] = finnishholidays.year(year, false);
    for (const h of yearHolidays) {
      const d = new Date(h.year, h.month - 1, h.day);
      const iso = d.toISOString().slice(0, 10);
      holidayIsoSet.add(iso);
    }
  }

  return holidayIsoSet;
};

export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl,
  viewMode
}) => {
  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  const now = new Date();

  const finnishHolidaySet =
    viewMode === ViewMode.Day ? buildFinnishHolidaySet(dates) : undefined;

  let tickX = 0;
  const ticks: ReactChild[] = [];
  const weekendHolidayRects: ReactChild[] = [];
  let today: ReactChild = <rect />;

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];

    if (viewMode === ViewMode.Day) {
      const iso = date.toISOString().slice(0, 10);
      const isHoliday = !!finnishHolidaySet?.has(iso);
      if (isWeekend(date) || isHoliday) {
        weekendHolidayRects.push(
          <rect
            key={`WH-${date.getTime()}`}
            x={tickX}
            y={0}
            width={columnWidth}
            height={y}
            fill="##F3F3F3" 
          />
        );
      }
    }

    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
      />
    );
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    tickX += columnWidth;
  }
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="weekendsHolidays">{weekendHolidayRects}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today">{today}</g>
    </g>
  );
};
