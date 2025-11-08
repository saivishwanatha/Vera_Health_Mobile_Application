import { useEffect, useRef, useState } from 'react'
import EventSource from 'react-native-sse'
import type { ServerEvent, Section, SearchStep } from '../types'
import { StreamParser } from '../lib/streamParser'

const API = 'https://vera-assignment-api.vercel.app/api/stream?prompt='

function parseServerEvents(raw: string): ServerEvent[] {
  if (typeof raw !== 'string') return []
  const lines = raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith(':'))
    .map(l => (l.startsWith('data:') ? l.slice(5).trim() : l))

  const out: ServerEvent[] = []
  for (const l of lines) {
    if (!l || l === 'ping' || l === '[DONE]') continue
    if (l[0] !== '{') continue
    try {
      out.push(JSON.parse(l))
    } catch {
      // ignore junk fragments
    }
  }
  return out
}

export function useSSE() {
  const [sections, setSections] = useState<Section[]>([])
  const [steps, setSteps] = useState<SearchStep[]>([])
  const [isStreaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const srcRef = useRef<EventSource | null>(null)
  const parserRef = useRef<StreamParser | null>(null)
  const rafRef = useRef<number | null>(null)

  const scheduleFlush = () => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const cur = parserRef.current?.getSections() ?? []
      setSections([...cur])
    })
  }

  const stop = () => {
    srcRef.current?.close()
    srcRef.current = null
    parserRef.current?.flushAtEnd()
    scheduleFlush()
    setStreaming(false)
  }

  const start = (prompt: string) => {
    if (!prompt.trim()) return
    stop()
    setSections([])
    setSteps([])
    setError(null)
    setStreaming(true)

    parserRef.current = new StreamParser()

    const url = API + encodeURIComponent(prompt.trim())
    const es = new EventSource(url, { headers: { Accept: 'text/event-stream' } })
    srcRef.current = es
    console.log('SSE url', url)

    es.addEventListener('message', e => {
      const events = parseServerEvents((e as any).data ?? '')
      if (!events.length) return

      for (const data of events) {
        if (data.type === 'STREAM') {
          parserRef.current?.append(data.content)
          scheduleFlush()
          continue
        }

        if (data.type !== 'NodeChunk') continue
        const node = data.content

        if (node.nodeName === 'STREAM') {
          parserRef.current?.append(node.content)
          scheduleFlush()
          continue
        }

        if (node.nodeName === 'SEARCH_STEPS') {
          const next: SearchStep[] = node.content.map((s: any, i: number) => ({
            id: String(i),
            text: String(s.text ?? ''),
            status: s.isActive ? 'active' : s.isCompleted ? 'done' : 'queued',
            extra: typeof s.info === 'string' ? s.info : undefined
          }))
          setSteps(next)
          continue
        }


      }
    })

    es.addEventListener('error', () => {
      setError('stream error')
      stop()
    })
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current as number)
      stop()
    }
  }, [])

  return { sections, steps, isStreaming, error, start, stop }
}
