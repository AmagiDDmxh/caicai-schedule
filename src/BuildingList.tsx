import React, { ChangeEventHandler, useRef, useState } from "react";
import { Tag, Input, Tooltip } from "antd";
import { PlusOutlined, RestOutlined } from "@ant-design/icons";
import { random } from "./StudentSchedules";
import "./BuildingList.css";

type InputChangeHandler = ChangeEventHandler<HTMLInputElement>;

const colors = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

const BuildingList = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const newInputRef = useRef<Input>(null);
  const editInputRef = useRef<Input>(null);

  const handleEditInputChange: InputChangeHandler = ({ target: { value } }) => {
    setEditInputValue(value);
  };

  const handleEditInputConfirm = () => {
    if (editInputValue) {
      setTags(
        tags.map((tag, index) =>
          index === editInputIndex ? editInputValue : tag
        )
      );
      setEditInputValue("");
      setEditInputIndex(-1);
    }
  };

  const handleInputChange: InputChangeHandler = ({ target: { value } }) => {
    setInputValue(value);
  };

  const handleClose = (tag: string) => {
    setTags(tags.filter((innerTag) => innerTag !== tag));
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
      setInputVisible(false);
      setInputValue("");
    }
  };

  const showNewInput = () => {
    setInputVisible(true);
    // newInputRef.current && newInputRef.current.focus();
    setTimeout(() => newInputRef.current?.focus(), 0);
  };

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={editInputRef}
                key={tag}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              key={tag}
              className="edit-tag"
              closable={true}
              color={colors[random(colors.length)]}
              onClose={() => handleClose(tag)}
              onDoubleClick={(e) => {
                e.preventDefault();
                setEditInputIndex(index);
                setEditInputValue(tag);
                console.log(editInputRef.current);
                setTimeout(() => editInputRef.current?.focus(), 0);
              }}
            >
              <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
      </div>

      {inputVisible && (
        <Input
          ref={newInputRef}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag className="site-tag-plus" onClick={showNewInput}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
      <Tag className="site-tag-plus" onClick={showNewInput}>
        <RestOutlined /> Clean All
      </Tag>
    </>
  );
};

export default BuildingList;
