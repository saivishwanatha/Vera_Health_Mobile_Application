import { nanoid } from 'nanoid/non-secure'
import type { Section } from '../types'

type ParserState = {
  buffer: string
  currentTag: string | null
  capture: string
  sections: Section[]
}

const titleFor = (tag: string) => {
  if (tag === 'guideline') return 'Guideline'
  if (tag === 'drug') return 'Drug'
  return tag[0].toUpperCase() + tag.slice(1)
}

export class StreamParser {
  state: ParserState

  constructor() {
    this.state = { buffer: '', currentTag: null, capture: '', sections: [] }
  }

  append(chunk: string) {
    if (!chunk) return
    this.state.buffer += chunk
    this.process()
  }

  flushAtEnd() {
    // push any remaining bytes as a section
    const { capture, currentTag } = this.state
    if (capture.trim().length > 0) {
      this.pushSection(currentTag ?? 'untagged', capture)
      this.state.capture = ''
    }
  }

  getSections() {
    return this.state.sections
  }

  private pushSection(tag: string, text: string) {
    const normalized = tag ?? 'untagged'
    this.state.sections.push({
      id: nanoid(),
      tag: normalized as Section['tag'],
      title: normalized === 'untagged' ? 'Answer' : titleFor(normalized),
      markdown: text.trim(),
      collapsed: normalized !== 'untagged'
    })
  }

  private process() {
    // process complete tags while leaving incomplete angle tokens in buffer
    while (true) {
      const open = this.state.buffer.indexOf('<')
      if (open === -1) {
        // no tag marker
        this.state.capture += this.state.buffer
        this.state.buffer = ''
        return
      }
      const close = this.state.buffer.indexOf('>', open + 1)
      if (close === -1) {
        // incomplete tag, keep in buffer for next chunk
        // move everything before '<' into capture
        this.state.capture += this.state.buffer.slice(0, open)
        this.state.buffer = this.state.buffer.slice(open)
        return
      }

      // text before the tag
      const before = this.state.buffer.slice(0, open)
      if (before.length) this.state.capture += before

      const token = this.state.buffer.slice(open + 1, close).trim()
      const afterIdx = close + 1
      this.state.buffer = this.state.buffer.slice(afterIdx)

      // token must be simple <name> or </name>
      const mClose = token.startsWith('/')
      const name = mClose ? token.slice(1).toLowerCase() : token.toLowerCase()

      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        // not a valid tag, treat literally
        this.state.capture += `<${token}>`
        continue
      }

      if (!mClose) {
        // opening
        if (this.state.currentTag === null && this.state.capture.trim().length > 0) {
          // finalize untagged segment up to here
          this.pushSection('untagged', this.state.capture)
          this.state.capture = ''
        }
        if (this.state.currentTag === null) {
          this.state.currentTag = name
        } else {
          // nested tag, treat literally to avoid losing content
          this.state.capture += `<${token}>`
        }
      } else {
        // closing
        if (this.state.currentTag === name) {
          this.pushSection(name, this.state.capture)
          this.state.capture = ''
          this.state.currentTag = null
        } else {
          // mismatched close, keep literal
          this.state.capture += `</${name}>`
        }
      }
    }
  }
}
