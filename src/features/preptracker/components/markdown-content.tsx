import { cn } from "@/lib/utils"

type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string }

export function MarkdownContent({ content, className }: { content: string; className?: string }) {
  const blocks = parseMarkdown(content)

  return (
    <div className={cn("space-y-4 text-sm leading-7", className)}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Heading = block.level === 1 ? "h1" : block.level === 2 ? "h2" : "h3"
          return (
            <Heading key={`${block.text}-${index}`} className={cn(
              "font-semibold tracking-normal text-foreground",
              block.level === 1 && "text-2xl",
              block.level === 2 && "border-b pb-2 text-xl",
              block.level === 3 && "text-base"
            )}>
              {renderInline(block.text)}
            </Heading>
          )
        }

        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className="space-y-2 pl-5 text-muted-foreground">
              {block.items.map((item) => <li key={item} className="list-disc">{renderInline(item)}</li>)}
            </ul>
          )
        }

        if (block.type === "code") {
          return (
            <pre key={`code-${index}`} className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs leading-6">
              <code>{block.text}</code>
            </pre>
          )
        }

        return <p key={`${block.text}-${index}`} className="text-muted-foreground">{renderInline(block.text)}</p>
      })}
    </div>
  )
}

function parseMarkdown(content: string) {
  const blocks: MarkdownBlock[] = []
  const lines = content.split("\n")
  let paragraph: string[] = []
  let list: string[] = []
  let code: string[] = []
  let inCode = false

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") })
      paragraph = []
    }
  }

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "list", items: list })
      list = []
    }
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd()

    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", text: code.join("\n") })
        code = []
      } else {
        flushParagraph()
        flushList()
      }
      inCode = !inCode
      return
    }

    if (inCode) {
      code.push(rawLine)
      return
    }

    if (!line.trim()) {
      flushParagraph()
      flushList()
      return
    }

    if (line.startsWith("### ")) {
      flushParagraph()
      flushList()
      blocks.push({ type: "heading", level: 3, text: line.slice(4) })
      return
    }

    if (line.startsWith("## ")) {
      flushParagraph()
      flushList()
      blocks.push({ type: "heading", level: 2, text: line.slice(3) })
      return
    }

    if (line.startsWith("# ")) {
      flushParagraph()
      flushList()
      blocks.push({ type: "heading", level: 1, text: line.slice(2) })
      return
    }

    if (line.startsWith("- ")) {
      flushParagraph()
      list.push(line.slice(2))
      return
    }

    paragraph.push(line.trim())
  })

  flushParagraph()
  flushList()

  return blocks
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={`${part}-${index}`} className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">{part.slice(1, -1)}</code>
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    }

    return part
  })
}
