import React, { useState } from 'react'
import { convertToRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor({ getContent }) {
    const [editorState, setEditorState] = useState("")
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                }}
            />
        </div>
    )
}
