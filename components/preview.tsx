"use client"

import { useRef, useEffect } from "react"
import type Quill from "quill"

import "quill/dist/quill.bubble.css"

interface PreviewProps {
    value: string;
}

export const Preview = ({ value }: PreviewProps) => {
    const previewRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill | null>(null)

    useEffect(() => {
        if (previewRef.current && !quillRef.current) {
            import("quill").then((module) => {
                const Quill = module.default;
                quillRef.current = new Quill(previewRef.current!, {
                    theme: "bubble",
                    readOnly: true,
                    modules: {
                        toolbar: false, // Disable toolbar in preview
                    },
                })

                // Set the initial content.
                quillRef.current.clipboard.dangerouslyPasteHTML(value)
            })
        }
        // We intend for this effect to run only once—hence disabling the exhaustive deps rule.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update the preview whenever the value prop changes.
    useEffect(() => {
        if (quillRef.current) {
            const currentContent = quillRef.current.root.innerHTML
            if (currentContent !== value) {
                quillRef.current.clipboard.dangerouslyPasteHTML(value)
            }
        }
    }, [value])

    return (
        <div className="bg-white dark:bg-black">
            {/* The div below will be transformed into a read-only Quill preview */}
            <div ref={previewRef} />
        </div>
    )
}