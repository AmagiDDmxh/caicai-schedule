import React, { useEffect, useMemo, useState } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Checkbox,
  Divider,
  InputNumber,
  Switch,
  Row,
  Col,
  Select,
} from "antd";
import {
  BorderInnerOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { splitEvery, equals } from "ramda";
import { v4 as uuid } from "uuid";

import { Student } from "./models";
import "./AddStudentForm.css";
import { generateMonth } from "./utils";
import Datepicker, { DateSelect } from "./components/Datepicker";

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);
const shortWord = (str: string) => str.slice(0, 3) + ".";

const { Option } = Select;

const weekDays = [
  "monday",
  "tuesday",
  "wendsday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]
  .map(capitalize)
  .map(shortWord);

interface FormProps {
  onAddStudent: Function;
  onSaveStudent: Function;
  isEdit: boolean;
  student?: Student;
  buildings: string[];
}

const AddStudentForm: React.FC<FormProps> = ({
  onAddStudent,
  onSaveStudent,
  student,
  isEdit,
  buildings,
}) => {
  const months = useMemo(() => generateMonth(), []);
  const [form] = Form.useForm<Student>();

  const [selectedWorkdays, setSelectedWorkdays] = useState<DateSelect[]>(
    months.map((day) => ({ day }))
  );

  useEffect(() => {
    if (student && isEdit) {
      const fields: { name: string; value: any }[] = Object.entries(
        student
      ).map(([name, value]) => ({ name, value }));
      form.setFields(fields);
      setSelectedWorkdays(student.workdays);
    }
  }, [student, isEdit, form]);

  const handleAdd = async () => {
    const validate = await form.validateFields();
    if (!validate) return;

    const formResult = {
      ...form.getFieldsValue(),
      workdays: selectedWorkdays,
    };

    if (isEdit && formResult.id === student!.id) {
      formResult.id = uuid();
    }

    onAddStudent(formResult);

    onResetForm();
  };

  const handleSaveChanges = async () => {
    const validate = await form.validateFields();
    if (!validate) return;

    const formResult = {
      ...form.getFieldsValue(),
      workdays: selectedWorkdays,
    };
    onSaveStudent(formResult);
    onResetForm();
  };

  const onResetForm = () => {
    form.resetFields();
    setSelectedWorkdays(months.map((day) => ({ day })));
  };

  return (
    <Form
      form={form}
      name="student"
      layout="vertical"
      initialValues={{ isManager: false }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Missing name" }]}
      >
        <Input placeholder="Name of the student" />
      </Form.Item>

      <Form.Item
        name="isManager"
        valuePropName="checked"
        label="Is She or He a Manager?"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Living Building"
        name="building"
        rules={[{ required: true, message: "Missing building" }]}
      >
        {/* <InputNumber placeholder="Living Building Number" min={1} max={20} /> */}
        <Select>
          {buildings.map((building) => (
            <Option value={building} key={building}>
              {building}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Student ID"
        name="id"
        // rules={[{ required: true, message: "Missing building" }]}
      >
        <Input placeholder="Student ID" />
      </Form.Item>

      <Form.Item name="workdays" label="Workdays">
        <Datepicker
          buildings={buildings}
          workdays={selectedWorkdays}
          onChange={(workdays: DateSelect[]) => {
            setSelectedWorkdays(workdays);
          }}
        ></Datepicker>
        {/* <Row>
          <Col span={3}>
            <Button
              type="dashed"
              icon={<BorderInnerOutlined />}
              onClick={() => {
                if (equals(selectedAvailableDays, months)) {
                  return setSelectedAvailableDays([]);
                }
                setSelectedAvailableDays(months.slice());
              }}
            ></Button>
          </Col>

          {weekDays.map((day, index) => {
            const weekday = (index + 1) % 7;

            return (
              <Col
                span={3}
                key={day}
                onMouseEnter={() => setWeekHover(weekday)}
                onMouseLeave={() => setWeekHover(undefined)}
                onClick={() => {
                  const availables = months.filter(
                    (date) => date % 7 === weekday
                  );
                  // if already has
                  if (
                    availables.every((date) =>
                      selectedAvailableDays.includes(date)
                    )
                  ) {
                    return setSelectedAvailableDays(
                      selectedAvailableDays.filter(
                        (date) => !availables.includes(date)
                      )
                    );
                  }
                  setSelectedAvailableDays([
                    ...selectedAvailableDays,
                    ...availables,
                  ]);
                }}
                className="weekday"
              >
                {day}
              </Col>
            );
          })}
        </Row>
        <Checkbox.Group
          className="checkbox-group"
          value={selectedAvailableDays}
          onChange={(availables) => {
            setSelectedAvailableDays(availables as number[]);
          }}
        >
          {splitEvery(7, months).map((week, index) => (
            <Row key={`week-row-${index}`}>
              <Button
                type="dashed"
                icon={<CheckOutlined />}
                onMouseEnter={() =>
                  setWeekRowInterval([index * 7 + 1, index * 7 + 7])
                }
                onMouseLeave={() => setWeekRowInterval([])}
                onClick={() => {
                  const aWeek = Array(7)
                    .fill(0)
                    .map((_, i) => index * 7 + i + 1);

                  if (
                    aWeek.every((date) => selectedAvailableDays.includes(date))
                  ) {
                    return setSelectedAvailableDays(
                      selectedAvailableDays.filter(
                        (date) => !aWeek.includes(date)
                      )
                    );
                  }
                  setSelectedAvailableDays(selectedAvailableDays.concat(aWeek));
                }}
              ></Button>
              {week.map((day) => {
                const [startInterval, endInterval] = weekRowInterval!;

                const hover =
                  day % 7 === weekHover ||
                  (startInterval <= day && day <= endInterval);
                return (
                  <Col span={3} key={day}>
                    <Checkbox
                      className={`checkbox-column ${hover ? "hover" : ""}`}
                      value={day}
                    >
                      {day}
                    </Checkbox>
                  </Col>
                );
              })}
            </Row>
          ))}
        </Checkbox.Group> */}
      </Form.Item>

      <Divider />
      {isEdit && (
        <Form.Item>
          <Button
            type="primary"
            block
            icon={<SaveOutlined />}
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Form.Item>
      )}
      <Form.Item>
        <Button
          type="primary"
          block
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          {isEdit ? "Duplicate Student" : "Add Student"}
        </Button>
      </Form.Item>
      <Form.Item>
        <Button
          type="default"
          block
          htmlType="button"
          icon={<CloseOutlined />}
          onClick={onResetForm}
        >
          Reset Form
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddStudentForm;
