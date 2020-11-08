import React, { useState } from "react";
import { Badge, Button, Card, Row, Space, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Student } from "./models";
import { generateMonth } from "./utils";

interface Props {
  students: Student[];
  onSelectStudent: Function;
  onRemoveStudent: Function;
}

const months = generateMonth();

const generateColumns: (props: Props) => ColumnsType<Student> = ({
  onSelectStudent,
  onRemoveStudent,
}) => [
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
      return (
        <Space>
          <Button type="ghost" icon={<EditOutlined />} onClick={() => onSelectStudent(record)}>
            Edit
          </Button>
          <Button
            type="ghost"
            icon={<DeleteOutlined />}
            onClick={() => onRemoveStudent(record.id)}
            danger
          >
            Remove
          </Button>
        </Space>
      );
    },
  },
];

const STUDENTS: Student[] = [
  { name: "c", id: "2", building: 2, unavailables: [2, 3] },
];

const StudentList: React.FC<Props> = (props) => {
  const { students = STUDENTS } = props;

  const columns = generateColumns(props);

  return (
    <Table
      title={() => <Typography.Title>Student List</Typography.Title>}
      columns={columns}
      dataSource={students}
      size="small"
    />
  );
};

export default StudentList;
