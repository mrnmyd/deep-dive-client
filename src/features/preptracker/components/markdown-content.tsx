import { useState, type ComponentProps, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import { Check, Copy, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import 'highlight.js/styles/github-dark.css'

type CodeProps = ComponentProps<'code'> & { inline?: boolean; node?: unknown }
type HeadingProps = ComponentProps<'h1'> & { id?: string }

export function MarkdownContent({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn('markdown-body', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { ignoreMissing: true }]]}
        components={{
          h1: (props) => <Heading level={1} {...props} />,
          h2: (props) => <Heading level={2} {...props} />,
          h3: (props) => <Heading level={3} {...props} />,
          h4: (props) => <Heading level={4} {...props} />,
          a: ({ href, children, ...rest }) => (
            <a
              href={href}
              {...(href?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
              {...rest}
            >
              {children}
            </a>
          ),
          pre: ({ children }) => <>{children}</>,
          code: CodeBlock,
          table: ({ children, ...rest }) => (
            <div className="my-4 overflow-x-auto rounded-md border">
              <table className="w-full text-sm" {...rest}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...rest }) => (
            <th className="border-b bg-muted/50 px-3 py-2 text-left font-medium" {...rest}>
              {children}
            </th>
          ),
          td: ({ children, ...rest }) => (
            <td className="border-b border-border/40 px-3 py-2" {...rest}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function Heading({
  level,
  id,
  children,
  ...rest
}: HeadingProps & { level: 1 | 2 | 3 | 4; children?: ReactNode }) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'
  return (
    <Tag id={id} className={cn('group scroll-mt-24')} {...rest}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="Anchor link to this section"
          className="ml-2 inline-flex align-middle opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
        >
          <Link2 className="h-4 w-4" />
        </a>
      )}
    </Tag>
  )
}

function CodeBlock({ inline, className, children, ...rest }: CodeProps) {
  const text =
    typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : ''

  if (inline || !className) {
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...rest}>
        {children}
      </code>
    )
  }

  return (
    <div className="relative my-4 overflow-hidden rounded-md border bg-zinc-950 text-zinc-100">
      <CopyButton text={text} />
      <pre className="overflow-x-auto p-4 text-[0.85rem] leading-6">
        <code className={className} {...rest}>
          {children}
        </code>
      </pre>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy code"
      className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-[0.7rem] text-zinc-200 opacity-70 transition-opacity hover:opacity-100"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
