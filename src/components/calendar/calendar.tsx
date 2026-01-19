import React, { ReactChild, useMemo } from "react";
import {
  getCachedDateTimeFormat,
  getLocalDayOfWeek,
  getLocaleMonth,
  getWeekNumberISO8601,
} from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import { ViewMode } from "../../types/public-types";
import styles from "./calendar.module.css";
import { TopPartOfCalendar } from "./top-part-of-calendar";

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
};

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  locale,
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
}) => {
  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = date.getFullYear();
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getFullYear() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getFullYear()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForQuarterYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      // const bottomValue = getLocaleMonth(date, locale);
      const quarter = "Q" + Math.floor((date.getMonth() + 3) / 3);
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {quarter}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={Math.abs(xText)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;

    const today = new Date();
    const currentMonth = getLocaleMonth(today, locale);
    const currentYear = today.getFullYear();

    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const month = getLocaleMonth(date, locale);
      const year = date.getFullYear();
      const isCurrentMonth = month === currentMonth && year === currentYear;

      const fullMonth = getLocaleMonth(date, locale).toLocaleLowerCase();
      const shortMonth =
        locale.startsWith("fi")
          ? fullMonth.replace(/kuu$/i, "")
          : fullMonth;

      const bottomValue = shortMonth;
      bottomValues.push(
        <text
          key={bottomValue + date.getFullYear()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={
            isCurrentMonth
              ? `${styles.calendarBottomText} ${styles.currentWeekHighlight}`
              : styles.calendarBottomText
          }
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount: number = 1;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;

    const today = new Date();
    const currentWeek = getWeekNumberISO8601(today);
    const currentYear = today.getFullYear();

    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      const weekNumber = getWeekNumberISO8601(date);
      const year = date.getFullYear();
      const isCurrentWeek = weekNumber === currentWeek && year === currentYear;

      let topValue = "";
      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        // top
        topValue = `${getLocaleMonth(date, locale).toLocaleLowerCase()}, ${date.getFullYear()}`;
      }
      // bottom
      const bottomValue = `VK ${Number(getWeekNumberISO8601(date))}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={
            isCurrentWeek
              ? `${styles.calendarBottomText} ${styles.currentWeekHighlight}`
              : styles.calendarBottomText
          }
        >
          {bottomValue}
        </text>
      );

      if (topValue) {
        // if last day is new month
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
              value={topValue}
              x1Line={columnWidth * i + weeksCount * columnWidth}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={columnWidth * i + columnWidth * weeksCount * 0.5}
              yText={topDefaultHeight * 0.9}
            />
          );
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];

    const topDefaultHeight = headerHeight * 0.5;
    const bottomDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;

    let weekStartIndex = 0;

    const today = new Date();
    const currentWeek = getWeekNumberISO8601(today);
    const currentYear = today.getFullYear();

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const isCurrentWeek = date.getFullYear() === currentYear && getWeekNumberISO8601(date) === currentWeek;

      // Bottom row: day label
      const bottomValue = `${date.getDate()}`;
      bottomValues.push(
        <text
          key={`bottom-${date.getTime()}`}
          y={topDefaultHeight + bottomDefaultHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={
            isCurrentWeek
              ? `${styles.calendarBottomText} ${styles.currentWeekHighlight}`
              : styles.calendarBottomText
          }
        >
          {bottomValue}
        </text>
      );

      const isEndOfWeek =
        i === dates.length - 1 ||
        getWeekNumberISO8601(date) !== getWeekNumberISO8601(dates[i + 1]);

      if (isEndOfWeek) {
        const weekNumber = getWeekNumberISO8601(date);
        const year = date.getFullYear();
        const span = i - weekStartIndex + 1;
        const xStart = columnWidth * weekStartIndex;
        const xCenter = xStart + (columnWidth * span) / 2;

        if (weekNumber === currentWeek && year === currentYear) {
          // Highlight full header area for this week
          topValues.push(
            <rect
              key={`highlight-week-${weekNumber}`}
              x={xStart}
              y={0}
              width={columnWidth * span}
              height={headerHeight}
              fill="rgba(255, 247, 163, 0.6)"
            />
          );
        }

        // === 2. Week Label & Border ===
        topValues.push(
          <TopPartOfCalendar
            key={`week-${weekNumber}-${year}`}
            value={`VK ${Number(weekNumber)}`}
            x1Line={xStart}
            y1Line={0}
            y2Line={headerHeight}
            xText={xCenter}
            yText={topDefaultHeight * 0.8}
            isCurrentWeek={isCurrentWeek}
          />
        );

        weekStartIndex = i + 1;
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        const topValue = `${getLocalDayOfWeek(
          date,
          locale,
          "short"
        )}, ${date.getDate()} ${getLocaleMonth(date, locale)}`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i + ticks * columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * i + ticks * columnWidth * 0.5}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
        const displayDate = dates[i - 1];
        const topValue = `${getLocalDayOfWeek(
          displayDate,
          locale,
          "long"
        )}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, locale)}`;
        const topPosition = (date.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + displayDate.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const [topValues, bottomValues] = useMemo(() => {
    switch (dateSetup.viewMode) {
      case ViewMode.Year:
        return getCalendarValuesForYear();
      case ViewMode.QuarterYear:
        return getCalendarValuesForQuarterYear();
      case ViewMode.Month:
        return getCalendarValuesForMonth();
      case ViewMode.Week:
        return getCalendarValuesForWeek();
      case ViewMode.Day:
        return getCalendarValuesForDay();
      case ViewMode.QuarterDay:
      case ViewMode.HalfDay:
        return getCalendarValuesForPartOfDay();
      case ViewMode.Hour:
        return getCalendarValuesForHour();
      default:
        return [[], []];
    }
  }, [dateSetup.dates, locale, dateSetup.viewMode]);
  return (
    <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={headerHeight}
        className={styles.calendarHeader}
      />
      {topValues} {bottomValues}
    </g>
  );
};
