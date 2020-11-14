import React, {
  ChangeEventHandler,
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Card, Space, Layout, Button, Typography, Input } from "antd";
import { v4 as uuid } from "uuid";

import { Student } from "./models";
import AddStudentForm from "./AddStudentForm";
import StudentList from "./StudentList";
import {
  STORE_KEY_STUDENT_LIST,
  STORE_KEY_BUILDING_LIST,
  STORE_KEY_SCHEDULES,
} from "./constants";
import StudentSchedules, { TableProps as Schedule } from "./StudentSchedules";
import BuildingList from "./BuildingList";
import { MONTH } from "./utils";
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [buildings, setBuildings] = useSemiPersistentState<string[]>(
    STORE_KEY_BUILDING_LIST,
    []
  );
  const [schedules, setSchedules] = useSemiPersistentState<Schedule[]>(
    STORE_KEY_SCHEDULES,
    []
  );

  useEffect(() => {
    // const data: Schedule[] = MONTH.map((date) => ({ date }));
    const data: Schedule[] = buildings.map((building) => ({ building }));

    for (const student of students) {
      for (const workday of student.workdays) {
        const { day, building } = workday;
        if (building) {
          const index = buildings.indexOf(building);
          const operators = data[index][day];
          if (operators && !operators.includes(student.name)) {
            operators.push(student.name);
          } else {
            data[index][day] = [student.name];
          }
        }
      }
    }

    console.log(data);
    // setSchedules(data);
  }, [students]);

  const handleAddStudent = (student: Student) => {
    const newStudent = {
      ...student,
      id: student.id ?? uuid(),
      total: student.workdays.reduce(
        (acc, { day, building }) => acc + (!!building ? 1 : 0),
        0
      ),
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
    setIsEdit(false);
    setSelectedStudent(undefined);
  };

  const selectStudent = (student: Student) => {
    setSelectedStudent({ ...student });
    setIsEdit(true);
  };

  const handleRemoveStudent = (id: string) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const handleImportStudentList: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.target.files?.[0]) {
      setIsLoading(true);
      const fileReader = new FileReader();
      fileReader.onload = function (progressEvent) {
        const result = JSON.parse(progressEvent.target!.result as string);
        console.log(result);
        const newStudents = result.map((student: Student) => {
          const workdays = student.workdays ?? MONTH.map((day) => ({ day }));
          const id = student.id ?? uuid();
          return {
            ...student,
            total: 0,
            id,
            workdays,
          };
        });
        // console.log(newStudents);

        // append?
        setStudents(newStudents);
        setIsLoading(false);
      };
      fileReader.readAsText(e.target.files![0]);
    }
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
            <Button type="primary">Schedule student</Button>
            <Input
              type="file"
              onChange={handleImportStudentList}
              multiple={false}
              accept=".json"
              placeholder="Import Data"
            />
            <Button type="default">Export To Excel</Button>
            {/* <Button type="text">Give It a Like</Button> */}
            {/* <Button type="link">Say hello to Amagi</Button> */}
          </Space>
        </Header>
        <StudentList
          loading={isLoading}
          students={students}
          buildings={buildings}
          onSelectStudent={selectStudent}
          onRemoveStudent={handleRemoveStudent}
        />

        <StudentSchedules
          loading={isLoading}
          data={schedules}
          buildings={buildings}
        />
      </Content>
      {/* </Space> */}

      {/* <StudentList /> */}

      {/* <Schedule /> */}
    </Layout>
  );
}

export default App;
