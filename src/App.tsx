import React, { useState } from "react";
import { Card, Space, Layout, Button } from "antd";
import { v4 as uuid } from "uuid";
import { findIndex, propEq } from "ramda";

import { Student } from "./models";
import AddStudentForm from "./AddStudentForm";
import StudentList from "./StudentList";
import "./App.css";

const { Content, Sider, Header } = Layout;

function App() {
  const [students, setStudents] = useState<Array<Student>>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [student, setStudent] = useState<Student>();
  const [startImport, setStartImport] = useState(false)

  const onFormSubmit = (formResult: Student) => {
    const newStudent = {
      ...formResult,
      id: formResult.id ?? uuid(),
    };
    if (isEdit) {
      const index = findIndex(propEq("id", student!.id), students);
      const newStudents = [
        ...students.slice(0, index),
        newStudent,
        ...students.slice(index + 1),
      ];
      setStudents(newStudents);
      return;
    }
    setStudents([...students, newStudent]);
  };

  const selectStudent = (student: Student) => {
    setStudent({ ...student });
    setIsEdit(true);
  };

  return (
    <Layout className="App">
      {/* <Space align="center"> */}
      <Sider width="338">
        <Space>
          <Card>
            {/* {startImport && <ImportPanel /} */}

            <AddStudentForm
              onSubmit={onFormSubmit}
              isEdit={isEdit}
              student={student}
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
        <StudentList students={students} onSelectStudent={selectStudent} />
      </Content>
      {/* </Space> */}

      {/* <StudentList /> */}

      {/* <Schedule /> */}
    </Layout>
  );
}

export default App;
