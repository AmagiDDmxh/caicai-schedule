import React from "react";

export const BuildingList = null;
// import React, { useState } from "react";
// import { Tag, Input, Tooltip } from "antd";
// import { PlusOutlined } from "@ant-design/icons";

// const BuildingList = () => {
//   const [tags, setTags] = useState(["Unremovable", "Tag 2", "Tag 3"]);
//   const [inputVisible, setInputVisible] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [editInputIndex, setEditInputIndex] = useState(-1);
//   const [editInputValue, setEditInputValue] = useState("");

//   const handleEditInputChange = () => {

//   }

//   const handleEditInputConfirm = () => {}

//   const handleInputChange = () => {}

//   return (
//     <>
//       {tags.map((tag, index) => {
//         if (editInputIndex === index) {
//           return (
//             <Input
//               ref={saveEditInputRef}
//               key={tag}
//               size="small"
//               className="tag-input"
//               value={editInputValue}
//               onChange={handleEditInputChange}
//               onBlur={handleEditInputConfirm}
//               onPressEnter={handleEditInputConfirm}
//             />
//           );
//         }

//         const isLongTag = tag.length > 20;

//         const tagElem = (
//           <Tag
//             className="edit-tag"
//             key={tag}
//             closable={index !== 0}
//             onClose={() => handleClose(tag)}
//           >
//             <span
//               onDoubleClick={e => {
//                 if (index !== 0) {
//                   setState({ editInputIndex: index, editInputValue: tag }, () => {
//                     editInput.focus();
//                   });
//                   e.preventDefault();
//                 }
//               }}
//             >
//               {isLongTag ? `${tag.slice(0, 20)}...` : tag}
//             </span>
//           </Tag>
//         );
//         return isLongTag ? (
//           <Tooltip title={tag} key={tag}>
//             {tagElem}
//           </Tooltip>
//         ) : (
//           tagElem
//         );
//       })}
//       {inputVisible && (
//         <Input
//           ref={saveInputRef}
//           type="text"
//           size="small"
//           className="tag-input"
//           value={inputValue}
//           onChange={handleInputChange}
//           onBlur={handleInputConfirm}
//           onPressEnter={handleInputConfirm}
//         />
//       )}
//       {!inputVisible && (
//         <Tag className="site-tag-plus" onClick={showInput}>
//           <PlusOutlined /> New Tag
//         </Tag>
//       )}
//     </>
//   );
// };

// export default BuildingList;
