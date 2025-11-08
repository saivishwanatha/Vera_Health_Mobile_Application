import Markdown from 'react-native-markdown-display'
import { View } from 'react-native'

export default function MarkdownView({ text }: { text: string }) {
  return (
    <View>
      <Markdown
        style={{
          body: { color: 'white', fontSize: 15, lineHeight: 22 },
          heading1: { color: 'white', marginBottom: 8 },
          heading2: { color: 'white', marginTop: 8, marginBottom: 6 },
          code_inline: { backgroundColor: '#1f2937', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, color: '#E5E7EB' },
          code_block: { backgroundColor: '#111827', padding: 10, borderRadius: 8, color: '#E5E7EB' },
          bullet_list: { marginLeft: 10 },
          ordered_list: { marginLeft: 10 },
          link: { color: '#93c5fd' }
        }}
      >
        {text.length ? text : ' '}
      </Markdown>
    </View>
  )
}
