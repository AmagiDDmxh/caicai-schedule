import React, { useState } from "react";
import { Badge, Button, Card, Row, Space, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import {
  ExclamationCircleOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Student } from "./models";
import { generateMonth } from "./utils";
import "./StudentList.css";

interface Props {
  students: Student[];
  onSelectStudent: Function;
}

const months = generateMonth();

const generateColumns: (props: Props) => ColumnsType<Student> = (props) => [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  // {
  //   title: "住址",
  //   dataIndex: "building",
  //   key: "building",
  // },
  {
    title: "Workdays",
    dataIndex: "unavailables",
    key: "unavailables",
    render: (unavailables: number[], record) => (
      <>
        {months.map((date) => {
          let color = unavailables.includes(date) ? "yellow" : "blue";
          // if (unavailable === "loser") {
          //   color = "volcano";
          // }
          return (
            <Tag color={color} key={date}>
              {date}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (value, record) => {
      console.log(value, record);
      return (
        <Space>
          <Button type="link" onClick={() => props.onSelectStudent(record)}>
            Edit Student
            <Typography.Text>&nbsp;	{record.name}</Typography.Text>
          </Button>
        </Space>
      );
    },
  },
];

const STUDENTS: Student[] = [
  { name: "c", id: 2, building: 2, unavailables: [2, 3] },
];

const StudentList: React.FC<Props> = (props) => {
  const { students = STUDENTS } = props;

  const columns = generateColumns(props);

  return (
      <Table columns={columns} dataSource={students} size="small" />
  );
};

export default StudentList;
