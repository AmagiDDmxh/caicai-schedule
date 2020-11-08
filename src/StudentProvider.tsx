import React, { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import { Student } from "./models";
import { STORE_KEY_STUDENT_LIST } from "./constants";

type StudentFunc = (student: Student) => void;

interface StudentContextProps {
  students?: Student[];
  addStudent?: StudentFunc;
  selectedStudent?: Student;
  removeStudent?: StudentFunc;
  editStudent?: StudentFunc;
  editing?: boolean;
}
const DEFAULT_STUDENTS: Student[] = JSON.parse(
  window.localStorage.getItem(STORE_KEY_STUDENT_LIST) ?? "[]"
);

// TODO: default props should be provided?
const StudentContext = createContext<StudentContextProps>({});
export const useStudent = () => useContext(StudentContext);

// TODO: Finish provider
const StudentProvider: React.FC = ({ children }) => {
  const [editing, setEditing] = useState(false);
  const [students, setStudents] = useState<Student[]>(DEFAULT_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<Student>();

  const addStudent: StudentFunc = (student) => {
    setStudents([
      ...students,
      {
        // @ts-ignore
        // Should be override by student otherwise take this instead
        id: uuid(),
        ...student,
      },
    ]);
  };
  const editStudent = () => {};
  const removeStudent = () => {};

  return (
    <StudentContext.Provider
      value={{
        students: DEFAULT_STUDENTS,
        addStudent,
        editStudent,
        removeStudent,
        editing,
        selectedStudent,
        // setEditing,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;
