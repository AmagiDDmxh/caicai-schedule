import React, { useState, FC, useMemo } from "react";
import { BorderInnerOutlined, CheckOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Row } from "antd";
import { equals, splitEvery } from "ramda";
import { css } from "emotion";
import { generateMonth } from "../utils";

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

interface WeekRowProps {
  onSelectRow: Function;
  row: number[];
}

const WeekRow: FC<WeekRowProps> = ({ onSelectRow, row }) => {
  const [rowHover, setRowHover] = useState(false);

  return (
    <Row
    // key={`week-row-${index}`}
    >
      <Button
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
      ></Button>

      {row.map((day) => {
        const hover = rowHover;
        return (
          <Col span={3} key={day}>
            <Checkbox
              className={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 10px;
                background-color: ${hover ? "#efefef" : "initial"};
              `}
              value={day}
            >
              {day}
            </Checkbox>
          </Col>
        );
      })}
    </Row>
  );
};

interface DatepickerProps {
  onChange: Function;
}

// TODO: Refactor row column picker
const Datepicker: FC<DatepickerProps> = ({ onChange }) => {
  const months = useMemo(() => generateMonth(), []);
  const splitedMonths = useMemo(() => splitEvery(7, months), months);

  const [workdays, setWorkdays] = useState<number[]>([]);
  const [hoverColumn, setHoverColumn] = useState<number>();
  const [selectedColumn, setSelectedColumn] = useState<number>();

  const selectRow = (index: number) => setWorkdays(workdays);

  const selectAll = () => {
    if (equals(workdays, months)) {
      return setWorkdays([]);
    }
    setWorkdays(months.slice());
  };

  return (
    <>
      <Row>
        <Col span={3}>
          <Button
            type="dashed"
            icon={<BorderInnerOutlined />}
            onClick={selectAll}
          ></Button>
        </Col>

        {weekDayList.map((day, index) => (
          <Col
            span={3}
            key={day}
            onMouseEnter={() => setHoverColumn(index)}
            onMouseLeave={() => setHoverColumn(undefined)}
            onClick={() => setSelectedColumn(index)}
            className="weekday"
          >
            {day}
          </Col>
        ))}
      </Row>
      <Checkbox.Group
        className="checkbox-group"
        value={workdays}
        onChange={(availables) => setWorkdays(availables as number[])}
      >
        {splitedMonths.map((week, index) => (
          <WeekRow row={week} onSelectRow={() => selectRow(index)} />
        ))}
      </Checkbox.Group>
    </>
  );
};

export default Datepicker;
