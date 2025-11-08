export type ServerEvent =
  | { type: 'STREAM'; content: string }
  | {
      type: 'NodeChunk'
      content:
        | { nodeName: 'STREAM'; content: string }
        | {
            nodeName: 'SEARCH_STEPS'
            content: Array<{ text: string; isActive?: boolean; isCompleted?: boolean; info?: string }>
          }
        | { nodeName: 'SEARCH_PROGRESS' | 'SEARCH_PROGRESS_INIT' | 'FIGURES'; content: any }
    }

export type Section = {
  id: string
  tag: 'untagged' | 'guideline' | 'drug' | string
  title: string
  markdown: string
  collapsed: boolean
}

export type SearchStep = { id: string; text: string; status: 'active' | 'done' | 'queued'; extra?: string }
