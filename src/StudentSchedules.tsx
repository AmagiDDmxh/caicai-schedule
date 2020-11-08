import React, { FC } from "react";
import { Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import faker from "faker";
import Column from "antd/lib/table/Column";
import { generateMonth } from "./utils";

interface TableProps {
  date: any;
  [buliding: string]: string[];
}

const generateColumns: (buildings: number[]) => ColumnsType<TableProps> = (
  buildings
) => [
  {
    title: "Date",
    dataIndex: "date",
    fixed: "left",
    width: 40,
  },
  ...buildings.map((building) => ({
    title: `Building ${building}`,
    dataIndex: `building_${building}`,
    width: 80,
    render(operators?: [string, string]) {
      const [first, second] = operators!;
      return (
        <>
          <Typography.Paragraph>{first}</Typography.Paragraph>
          <Typography.Paragraph>{second}</Typography.Paragraph>
        </>
      );
    },
  })),
];

const BUILDINGS = [...Array(9)].map((_, index) => index + 1);

/**
 * take a max and a min
 * return integer x such that
 * min <= x < max
 */
const random = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min)) + min;
const generateArray = (n: number) => [...Array(n)];
const shuffle = <T extends any>(arr: T[]) => {
  const newArray = arr.slice();
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const j = random(i);
    if (j !== i) {
      newArray[i] = newArray[j];
    }
    newArray[j] = arr[i];
  }
  return newArray;
};

const operators = generateArray(16).map(() => faker.name.firstName());
const randomPickTwo = <T extends any>(arr: T[]) => shuffle(arr).slice(0, 2);

const generateBuildingOperators = () =>
  shuffle(BUILDINGS)
    .slice(0)
    .map((building) => ({
      [`building_${building}`]: randomPickTwo(operators),
    }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

const DATA = generateMonth().map((date) => ({
  date,
  ...generateBuildingOperators(),
}));

interface StudentSchedulesProps {
  data?: TableProps[];
  buildings?: number[];
}

const StudentSchedules: FC<StudentSchedulesProps> = (props) => {
  const { data = DATA, buildings = BUILDINGS } = props;

  return (
    <Table
      title={() => (
        <Typography.Title>Students Schedule with fake data</Typography.Title>
      )}
      columns={generateColumns(buildings)}
      dataSource={data as any}
      scroll={{ x: 1280, y: 800 }}
      size="small"
    ></Table>
  );
};

export default StudentSchedules;
