
import React, { useState } from "react"
import CommentEditor from "./CommentEditor"


export const BASE_API = "http://localhost:8000/api/"

export async function getComment(entId, commentId) {
    let response = await fetch(BASE_API+"entities/" + entId + "/" + commentId + "?whole_comment=True&HTML=True", {
        cache: 'no-store'
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }

    return await response.json()
}

/*

A comment can be selected. This will just add a blue box around it. This will probably make it easier to add usability later on.

A comment can also be activated. This means that the comment has an active editor on it and can be edited. This will probably be done by clicking on the comment.

a comment gets selected with a single click. A comment can be activated with a double click

*/

export default function Comment({comment,
                                 entID,
                                 onClickHandler, 
                                 isSelected, 
                                 onDoubleClickHandler, 
                                 isActivated, 
                                 deactivateAllComments,
                                 entType = null,
                                }) {
                                 
    
    const [updatingComment, setUpdatingComment] = useState(comment);
    const [isHovered, setIsHovered] = useState(false);

    const refreshComment = () => {
        getComment(entID, updatingComment.ID).then(newComment => {
            const parsed_item = JSON.parse(JSON.parse(newComment)); // FIXME: This means I am over stringifying my object from the server. This should be fixed.
            setUpdatingComment(parsed_item);
        });
        deactivateAllComments();
    }

    const innerClickHandler = (event) => {
        onClickHandler(updatingComment.ID)
    }

    const innerDoubleClickHandler = (event) => {
        onDoubleClickHandler(updatingComment.ID)
    }

    if (updatingComment.com_type[updatingComment.com_type.length - 1] == 4 || updatingComment.com_type[updatingComment.com_type.length - 1] == 5) {
        return (
            <div className={`comment ${isSelected ? 'selected': ''}`}
                onClick={innerClickHandler}>
                <img src={BASE_API+"entities/"+entID+"/"+updatingComment.ID} alt="Image is loading" />
            </div>
        )
    } else if (updatingComment.com_type[updatingComment.com_type.length - 1] == 6) {
        const tableData = updatingComment.content[updatingComment.content.length - 1];
        const columnNames = Object.keys(tableData);
        const numberOfRows = tableData[columnNames[0]].length;

        return (
            <div className={`comment ${isSelected ? 'selected': ''}`}
                onClick={innerClickHandler}>
                <table>
                    <thead>
                        <tr>
                            {columnNames.map((columnName, index) => (
                                <th key={index}>{columnName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: numberOfRows }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {columnNames.map((columnName, columnIndex) => (
                                    <td key={columnIndex}>{tableData[columnName][rowIndex]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) 
    } else {

        if (isActivated) {
            return <CommentEditor entID={entID} comment={updatingComment} refresh={refreshComment}/>
        }

        return <div className={`comment ${isSelected ? 'selected': ''}`}
            onClick={innerClickHandler}
            onDoubleClick={innerDoubleClickHandler} 
            onMouseEnter = {() => setIsHovered(true)}
            onMouseLeave = {() => setIsHovered(false)}
            >
                <span dangerouslySetInnerHTML={{ __html: updatingComment.content[updatingComment.content.length - 1] }}/>
                {isHovered && (
                    <div className={`comment-buttons ${entType ? entType : ""}`}>
                        <button>New Comment</button>
                        <button>New Step</button>
                        <button>New Task</button>
                    </div>
    )}
            </div> // The  span is there to have an element in which to place the argument.
    }
}