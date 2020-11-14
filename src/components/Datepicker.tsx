import React, { useState, FC, useMemo } from "react";
import { BorderInnerOutlined, CheckOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select, Typography } from "antd";
import { equals, flatten, splitEvery, move } from "ramda";
import dj from "dayjs";
import { css } from "emotion";
import "./Datepicker.css";

const { Option } = Select;

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);
const shortWord = (str: string) => str.slice(0, 3) + ".";

const weekDayList = [
  "monday",
  "tuesday",
  "wendsday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]
  .map(capitalize)
  .map(shortWord);

function getWeekdays(
  weekday = dj()
    .month(dj().month() - 1)
    .date(26)
    .day()
) {
  let weekdays = weekDayList;
  if (weekday === 0) return move(-1, 0, weekdays);
  let i = 1;
  while (i++ < weekday) {
    weekdays = move(0, -1, weekdays);
  }
  return weekdays;
}

interface WorkdaySelectProps {
  buildings: string[];
  onChange: Function;
  selectedBuilding?: string;
}

const WorkdaySelect: FC<WorkdaySelectProps> = ({
  selectedBuilding,
  buildings,
  onChange,
}) => {
  return (
    <select
      className="date-select"
      value={selectedBuilding ?? ""}
      onChange={({ target: { value } }) => {
        onChange(value);
      }}
    >
      <option value="">-</option>
      {buildings.map((building) => (
        <option value={building} key={building}>
          {building}
        </option>
      ))}
    </select>
  );
};

interface WeekRowProps {
  row: DateSelect[];
  buildings: string[];
  last: boolean;
  onChange: Function;
  displaySelect?: boolean;
  [rest: string]: any;
}

export interface DateSelect {
  day: number;
  building?: string;
}

const WeekRow: FC<WeekRowProps> = ({
  onSelectRow,
  row,
  buildings,
  last,
  onChange,
  displaySelect,
  ...rest
}) => {
  // const [rowHover, setRowHover] = useState(false);
  const [selectedRows, setSelectedRows] = useState<DateSelect[]>(row);

  const renderSelect = ({ day, building }: DateSelect, index: number) =>
    displaySelect ? (
      <WorkdaySelect
        selectedBuilding={building}
        buildings={buildings}
        onChange={(value: string) => {
          const newRows = [
            ...selectedRows.slice(0, index),
            { day, building: value },
            ...selectedRows.slice(index + 1),
          ];
          setSelectedRows(newRows);
          onChange(newRows);
        }}
      />
    ) : (
      <span>{building ? `No. ${building}` : "-"}</span>
    );

  return (
    <Row
      {...rest}
      className={css`
        flex-wrap: nowrap;
      `}
    >
      {/* <Button
        type="dashed"
        icon={<CheckOutlined />}
        onMouseEnter={() => setRowHover(true)}
        onMouseLeave={() => setRowHover(false)}
        onClick={() => {
          // const aWeek = Array(7)
          //   .fill(0)
          //   .map((_, i) => index * 7 + i + 1);
          // if (
          //   aWeek.every((date) => selectedAvailableDays.includes(date))
          // ) {
          //   return setSelectedAvailableDays(
          //     selectedAvailableDays.filter(
          //       (date) => !aWeek.includes(date)
          //     )
          //   );
          // }
          // setSelectedAvailableDays(selectedAvailableDays.concat(aWeek));
        }}
      ></Button> */}

      {row.map(({ day, building }, index) => {
        // const hover = rowHover;
        return (
          <Col
            // span={3}
            style={{
              // flex: "1 1 14.285%",
              width: "14.25%",
            }}
            // flex={last ? undefined : 3}
            key={day}
          >
            <div
              className={css`
                border: 1px solid #ccc;
                display: flex;
                align-items: center;
                flex-flow: column nowrap;
                padding: 5px;
                margin: 0 2px 1px;
              `}
            >
              <span
                className={css`
                  color: gray;
                `}
              >
                {day}
              </span>
              {renderSelect({ day, building }, index)}
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

interface DatepickerProps {
  onChange?: Function;
  workdays: DateSelect[];
  buildings: string[];
  // default true
  displaySelect?: boolean;
}

// TODO: Refactor row column picker
const Datepicker: FC<DatepickerProps> = ({
  onChange,
  workdays,
  buildings,
  displaySelect: displaySelectProp,
}) => {
  const splitedMonths = splitEvery(7, workdays);
  const weekdays = getWeekdays();

  const displaySelect = displaySelectProp ?? true;

  const handleRowChange = (row: DateSelect[], index: number) => {
    console.log("row change", row);
    const newWorkdays = [
      ...splitedMonths.slice(0, index),
      row,
      ...splitedMonths.slice(index + 1),
    ];
    onChange?.(flatten(newWorkdays));
  };

  return (
    <>
      <Row>
        {/* <Col span={3}>
          <Button
            type="dashed"
            icon={<BorderInnerOutlined />}
            onClick={selectAll}
          ></Button>
        </Col> */}

        {weekdays.map((day, index) => (
          <Col
            flex={3}
            key={day}
            // onMouseEnter={() => setHoverColumn(index)}
            // onMouseLeave={() => setHoverColumn(-1)}
            // onClick={() => setSelectedColumn(index)}
            className={css`
              text-align: center;
            `}
          >
            {day}
          </Col>
        ))}
      </Row>
      <div className="">
        {splitedMonths.map((week, rowIndex) => (
          <WeekRow
            className={css`
              margin-bottom: 5px;
            `}
            row={week}
            key={`week${rowIndex}`}
            onChange={(rows: DateSelect[]) => handleRowChange(rows, rowIndex)}
            buildings={buildings}
            displaySelect={displaySelect}
            last={rowIndex === splitedMonths.length - 1}
          />
        ))}
      </div>
    </>
  );
};

export default Datepicker;
