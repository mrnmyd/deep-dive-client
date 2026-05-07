import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

let mermaidPromise: Promise<typeof import('mermaid').default> | null = null

const loadMermaid = () => {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((module) => module.default)
  }
  return mermaidPromise
}

export function MermaidBlock({ code }: { code: string }) {
  const { resolvedTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [error, setError] = useState<string | null>(null)
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    let nextId = 0

    loadMermaid()
      .then((mermaid) => {
        if (cancelled) return
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          fontFamily: 'inherit',
        })
        const renderId = `mermaid-${baseId}-${nextId++}`
        return mermaid.render(renderId, code)
      })
      .then((result) => {
        if (cancelled || !result) return
        setSvg(result.svg)
        setError(null)
      })
      .catch((reason) => {
        if (cancelled) return
        const message = reason instanceof Error ? reason.message : String(reason)
        setError(message)
        setSvg('')
      })

    return () => {
      cancelled = true
    }
  }, [code, resolvedTheme, baseId])

  if (error) {
    return (
      <div className="my-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-xs">
        <p className="font-medium text-destructive">Diagram failed to render</p>
        <pre className="mt-1 whitespace-pre-wrap text-destructive/80">{error}</pre>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-md border bg-card p-4"
      // SVG markup comes from mermaid's renderer, which sanitizes input under
      // securityLevel: 'strict'. Diagrams are authored by us inside markdown.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
