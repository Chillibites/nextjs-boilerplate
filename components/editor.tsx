"use client"

import { useRef, useEffect } from "react"
import type Quill from "quill"

import "quill/dist/quill.snow.css"

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill | null>(null)

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            import("quill").then((module) => {
                const Quill = module.default;
                quillRef.current = new Quill(editorRef.current!, {
                    theme: "snow",
                    modules: {
                        toolbar: "#toolbar",
                    },
                })

                quillRef.current.clipboard.dangerouslyPasteHTML(value)

                quillRef.current.on("text-change", () => {
                    const html = quillRef.current?.root.innerHTML || ""
                    onChange(html)
                })
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (quillRef.current) {
            const currentContent = quillRef.current.root.innerHTML
            if (value !== currentContent) {
                const selection = quillRef.current.getSelection()
                quillRef.current.clipboard.dangerouslyPasteHTML(value)
                if (selection) {
                    quillRef.current.setSelection(selection)
                }
            }
        }
    }, [value])

    return (
        <div className="bg-white dark:bg-black">
            <div id="toolbar">
                <span className="ql-formats">
                    <select className="ql-header" defaultValue="">
                        <option value="1">Heading 1</option>
                        <option value="2">Heading 2</option>
                        <option value="">Normal</option>
                    </select>
                </span>
                <span className="ql-formats">
                    <button className="ql-bold"></button>
                    <button className="ql-italic"></button>
                    <button className="ql-underline"></button>
                    <button className="ql-strike"></button>
                </span>
                <span className="ql-formats">
                    <button className="ql-blockquote"></button>
                    <button className="ql-code-block"></button>
                </span>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-list" value="bullet"></button>
                    <select className="ql-align"></select>
                </span>
                <span className="ql-formats">
                    <button className="ql-link"></button>
                    <button className="ql-image"></button>
                    <button className="ql-video"></button>
                </span>
                <span className="ql-formats">
                    <button className="ql-clean"></button>
                </span>
            </div>
            <div ref={editorRef} />
        </div>
    )
}