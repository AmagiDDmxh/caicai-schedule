import React, { useEffect, useState } from "react";
import { Card, Space, Layout, Button, Typography } from "antd";
import { v4 as uuid } from "uuid";
import { findIndex, propEq } from "ramda";

import { Student } from "./models";
import AddStudentForm from "./AddStudentForm";
import StudentList from "./StudentList";
import { STORE_KEY_STUDENT_LIST } from "./constants";
import StudentSchedules from "./StudentSchedules";
import "./App.css";
import BuildingList from "./BuildingList";

const { Content, Sider, Header } = Layout;

const studentList = JSON.parse(
  window.localStorage.getItem(STORE_KEY_STUDENT_LIST) ?? "[]"
);

function App() {
  const [students, setStudents] = useState<Array<Student>>(studentList);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [startImport, setStartImport] = useState(false);

  useEffect(
    () =>
      localStorage.setItem(STORE_KEY_STUDENT_LIST, JSON.stringify(students)),
    [students]
  );

  const handleAddStudent = (student: Student) => {
    const newStudent = {
      ...student,
      id: student.id ?? uuid(),
    };
    setStudents([...students, newStudent]);
    setIsEdit(false);
  };

  const handleEditStudent = (newStudent: Student) => {
    const index = students.indexOf(selectedStudent!);
    setStudents([
      ...students.slice(0, index),
      newStudent,
      ...students.slice(index + 1),
    ]);
  };

  const selectStudent = (student: Student) => {
    setSelectedStudent({ ...student });
    setIsEdit(true);
  };

  const handleRemoveStudent = (id: string) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <Layout className="App">
      {/* <Space align="center"> */}
      <Sider width="338">
        <Space direction="vertical">
          <Card>
            {/* <Typography.Title level={5}>
              Incoming Building List... :&gt;
            </Typography.Title>
            <Typography.Paragraph>
              Developing... Wait for me
            </Typography.Paragraph> */}
            <BuildingList />
          </Card>
          <Card>
            {/* {startImport && <ImportPanel /} */}

            <AddStudentForm
              onAddStudent={handleAddStudent}
              onSaveStudent={handleEditStudent}
              isEdit={isEdit}
              student={selectedStudent}
            />
          </Card>
        </Space>
      </Sider>

      <Content>
        <Header className="caiying-header">
          <Space>
            <Button type="primary">Auto Fill Blank</Button>
            <Button type="ghost">Import Data</Button>
            <Button type="default">Export To Excel</Button>
            <Button type="text">Give It a Like</Button>
            <Button type="link">Say hello to Amagi</Button>
          </Space>
        </Header>
        <StudentList
          students={students}
          onSelectStudent={selectStudent}
          onRemoveStudent={handleRemoveStudent}
        />

        <StudentSchedules />
      </Content>
      {/* </Space> */}

      {/* <StudentList /> */}

      {/* <Schedule /> */}
    </Layout>
  );
}

export default App;
