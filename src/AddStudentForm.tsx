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
import { MONTH } from "./utils";
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
  const [genderValue, setGenderValue] = useState("She");
  const [unavailables, setUnavailables] = useState<number[]>([]);
  const [form] = Form.useForm<Student>();

  const [selectedWorkdays, setSelectedWorkdays] = useState<DateSelect[]>(
    MONTH.map((day) => ({ day }))
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
    console.log(form.getFieldsValue());

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
    setSelectedWorkdays(MONTH.map((day) => ({ day })));
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

      <Row gutter={100}>
        <Col>
          <Form.Item
            name="gender"
            valuePropName="checked"
            label="Gender: Girl/Boy"
          >
            <Switch
              onChange={(checked) => setGenderValue(checked ? "He" : "She")}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="isManager"
            valuePropName="checked"
            label={`Is ${genderValue} a Manager?`}
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

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

      <Form.Item label="Unavailable weekday" name="unavailable">
        <Checkbox.Group
          onChange={(values) => {
            // console.log(values);
            setUnavailables(values as number[]);
          }}
        >
          <Row>
            {weekDays.map((day, index) => (
              <Col flex={3} key={day}>
                <Checkbox
                  value={index}
                  disabled={
                    unavailables.length === 2 && !unavailables.includes(index)
                  }
                >
                  {day}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item name="workdays" label="Workdays">
        <Datepicker
          buildings={buildings}
          workdays={selectedWorkdays}
          onChange={(workdays: DateSelect[]) => {
            setSelectedWorkdays(workdays);
          }}
        ></Datepicker>
      </Form.Item>

      <Form.Item></Form.Item>

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
