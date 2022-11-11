import React, { useEffect, useState } from 'react'
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import { Editor } from "react-draft-wysiwyg"
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

export default function NewsEditor({ getContent, content }) {
    const [editorState, setEditorState] = useState("")

    useEffect(() => {
        const html = content

        if (html === undefined) return

        const contentBlock = htmlToDraft(html)

        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);

            setEditorState(editorState)
        }
    }, [content])

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
