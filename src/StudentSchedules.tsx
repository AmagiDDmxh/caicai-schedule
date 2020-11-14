import React, { FC } from "react";
import { Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import faker from "faker";
import Column from "antd/lib/table/Column";
import { MONTH } from "./utils";

export interface TableProps {
  date: string | number;
  [buliding: string]: any;
}

const generateColumns: (buildings: string[]) => ColumnsType<TableProps> = (
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
    render(operators: string[] = []) {
      const [first, second] = operators;

      return (
        <>
          <Typography.Paragraph>{first}</Typography.Paragraph>
          <Typography.Paragraph>{second}</Typography.Paragraph>
        </>
      );
    },
  })),
];

// const BUILDINGS = [...Array(9)].map((_, index) => (index + 1).toString());

/**
 * take a max and a min
 * return integer x such that
 * min <= x < max
 */
export const random = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min)) + min;
// const generateArray = (n: number) => [...Array(n)];
// const shuffle = <T extends any>(arr: T[]) => {
//   const newArray = arr.slice();
//   const len = arr.length;
//   for (let i = 0; i < len; i++) {
//     const j = random(i);
//     if (j !== i) {
//       newArray[i] = newArray[j];
//     }
//     newArray[j] = arr[i];
//   }
//   return newArray;
// };

// const operators = generateArray(16).map(() => faker.name.firstName());
// const randomPickTwo = <T extends any>(arr: T[]) => shuffle(arr).slice(0, 2);

// const generateBuildingOperators = (buildings = BUILDINGS) =>
//   shuffle(buildings)
//     .slice(0)
//     .map((building) => ({
//       [`building_${building}`]: randomPickTwo(operators),
//     }))
//     .reduce((acc, cur) => ({ ...acc, ...cur }), {});

// const DATA = (buildings: string[]) =>
//   generateMonth().map((date) => ({
//     date,
//     ...generateBuildingOperators(buildings),
//   }));

interface StudentSchedulesProps {
  data: TableProps[];
  buildings: string[];
  loading: boolean;
}

const StudentSchedules: FC<StudentSchedulesProps> = (props) => {
  const { buildings, data, loading } = props;

  return (
    <Table
      title={() => <Typography.Title>Student Schedules</Typography.Title>}
      loading={loading}
      pagination={{ pageSize: 32, hideOnSinglePage: true }}
      columns={generateColumns(buildings)}
      dataSource={data as any}
      scroll={{ x: 1280, y: 800 }}
      size="small"
    ></Table>
  );
};

export default StudentSchedules;
