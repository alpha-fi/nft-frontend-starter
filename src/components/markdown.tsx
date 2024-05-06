import React from "react"
import ReactMarkdown from "react-markdown"
import { Options } from "react-markdown"

const Markdown: React.FC<Options> = (props) => (
  <ReactMarkdown {...props} urlTransform={() => "_blank"} />
)

export default Markdown