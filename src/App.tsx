import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  differenceInWeeks,
  addWeeks,
  isSameMonth,
  isSameDay,
  addDays,
} from "date-fns";
import "./App.scss";

interface RenderHeaderProps {
  currentMonth: Date;
  prevMonth: () => void;
  nextMonth: () => void;
}
const RenderHeader = ({
  currentMonth,
  prevMonth,
  nextMonth,
}: RenderHeaderProps) => {
  return (
    <div className="header row">
      <div className="col col-first">
        <span className="text">
          {format(currentMonth, "yyyy")}.{format(currentMonth, "M")}
        </span>
      </div>
      <div className="col col-end">
        <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} />
        <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} />
      </div>
    </div>
  );
};

const RenderDays = () => {
  const date = ["Sun", "Mon", "Thu", "Wed", "Thrs", "Fri", "Sat"];

  return (
    <div className="days row">
      {date.map((day, index) => (
        <div className="col" key={index}>
          {day}
        </div>
      ))}
    </div>
  );
};

interface RenderCellsProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateClick: (day: Date) => void;
}

const RenderCells = ({
  currentMonth,
  selectedDate,
  onDateClick,
}: RenderCellsProps) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const numberOfWeeks = differenceInWeeks(endDate, startDate) + 1;

  const getCellClasses = (day: Date) => {
    if (!isSameMonth(day, monthStart)) return "col cell disabled";
    if (isSameDay(day, selectedDate)) return "col cell selected";
    if (format(currentMonth, "M") !== format(day, "M"))
      return "col cell not-valid";
    return "col cell valid";
  };

  const getTextClass = (day: Date) => {
    return format(currentMonth, "M") !== format(day, "M")
      ? "text not-valid"
      : "";
  };

  const renderWeek = (startDay: Date) => {
    const weekArray = Array.from({ length: 7 }, (_, i) => addDays(startDay, i));

    return (
      <div className="row" key={startDay.toString()}>
        {weekArray.map((day) => {
          const formattedDate = format(day, "d");
          return (
            <div
              className={getCellClasses(day)}
              key={day.toString()}
              onClick={() => onDateClick(new Date(day))}
            >
              <span className={getTextClass(day)}>{formattedDate}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="body">
      {Array.from({ length: numberOfWeeks }, (_, i) =>
        renderWeek(addWeeks(startDate, i))
      )}
    </div>
  );
};

const Calender = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };
  return (
    <div className="calendar">
      <RenderHeader
        currentMonth={currentMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <RenderDays />
      <RenderCells
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateClick={onDateClick}
      />
    </div>
  );
};

const App = () => {
  return (
    <div style={{ width: "100%", height: "50vh" }}>
      <Calender />
    </div>
  );
};

export default App;
