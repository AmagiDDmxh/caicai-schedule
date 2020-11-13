import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card, Space, Layout, Button, Typography } from "antd";
import { v4 as uuid } from "uuid";

import { Student } from "./models";
import AddStudentForm from "./AddStudentForm";
import StudentList from "./StudentList";
import { STORE_KEY_STUDENT_LIST, STORE_KEY_BUILDING_LIST } from "./constants";
import StudentSchedules from "./StudentSchedules";
import BuildingList from "./BuildingList";
import "./App.css";

const { Content, Sider, Header } = Layout;

function useSemiPersistentState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<typeof initialValue>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // TODO: try with key
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

function App() {
  const [students, setStudents] = useSemiPersistentState<Student[]>(
    STORE_KEY_STUDENT_LIST,
    []
  );
  const [isEdit, setIsEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [buildings, setBuildings] = useSemiPersistentState<string[]>(
    STORE_KEY_BUILDING_LIST,
    []
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
    setStudents(
      students.map((student) =>
        student.id === newStudent.id ? newStudent : student
      )
    );
    setIsEdit(false)
    setSelectedStudent(undefined)
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
      <Sider width="440">
        <Space direction="vertical">
          <Card style={{ width: 440 }}>
            <BuildingList
              buildings={buildings}
              onChange={(buildings: string[]) => setBuildings(buildings)}
            />
          </Card>
          <Card style={{ width: 440 }}>
            {/* {startImport && <ImportPanel /} */}

            <AddStudentForm
              onAddStudent={handleAddStudent}
              onSaveStudent={handleEditStudent}
              buildings={buildings}
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
          buildings={buildings}
          onSelectStudent={selectStudent}
          onRemoveStudent={handleRemoveStudent}
        />

        <StudentSchedules buildings={buildings} />
      </Content>
      {/* </Space> */}

      {/* <StudentList /> */}

      {/* <Schedule /> */}
    </Layout>
  );
}

export default App;
