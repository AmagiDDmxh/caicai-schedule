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
import Datepicker, { DateSelect } from "./components/Datepicker";

interface Props {
  students: Student[];
  onSelectStudent: Function;
  onRemoveStudent: Function;
  buildings: string[];
  loading: boolean;
}

const StudentList: React.FC<Props> = (props) => {
  const {
    students,
    onSelectStudent,
    onRemoveStudent,
    buildings,
    loading,
  } = props;

  const columns = [
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
    //   title: "Building",
    //   dataIndex: "building",
    //   key: "building",
    //   render(building: string) {
    //     return <span style={{ color: "blueviolet" }}>{building}</span>;
    //   },
    // },

    {
      title: "Workdays",
      dataIndex: "workdays",
      key: "workdays",
      width: 800,
      render: (workdays: DateSelect[]) => (
        <>
          <Datepicker
            workdays={workdays}
            displaySelect={false}
            buildings={buildings}
          ></Datepicker>
        </>
      ),
    },
    {
      title: "Total Workday",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Student) => {
        return (
          <Space>
            <Button
              type="ghost"
              icon={<EditOutlined />}
              onClick={() => onSelectStudent(record)}
            >
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

  return (
    <Table
      title={() => <Typography.Title>Student List</Typography.Title>}
      columns={columns}
      dataSource={students}
      size="small"
      loading={loading}
      pagination={{ hideOnSinglePage: true }}
    />
  );
};

export default StudentList;
