"use client"

import { useEffect, useRef } from "react"
import * as monaco from "@monaco-editor/react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  height?: string
}

export function CodeEditor({ value, onChange, language = "javascript", height = "200px" }: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor
  }

  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      onChange(value)
    }
  }

  return (
    <monaco.Editor
      height={height}
      defaultLanguage={language}
      value={value}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollbar: {
          vertical: "visible",
          horizontal: "visible",
        },
        automaticLayout: true,
      }}
    />
  )
} 