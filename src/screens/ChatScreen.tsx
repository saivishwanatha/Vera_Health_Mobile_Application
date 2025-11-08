import { useRef, useState } from 'react'
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSSE } from '../hooks/useSSE'
import Collapsible from '../components/Collapsible'
import MarkdownView from '../components/MarkdownView'

export default function ChatScreen() {
  const inset = useSafeAreaInsets()
  const [prompt, setPrompt] = useState('')
  const inputRef = useRef<TextInput>(null)
  const { sections, steps, isStreaming, error, start, stop } = useSSE()

  const onSubmit = () => {
    start(prompt)
    inputRef.current?.blur()
  }

  return (
    <KeyboardAvoidingScreen insetsTop={inset.top}>
      <View style={{ paddingHorizontal: 14, flex: 1 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '700', marginTop: 8, marginBottom: 12 }}>Vera Mobile Assignment</Text>

        <View style={{ backgroundColor: '#0b1220', borderRadius: 12, borderWidth: 1, borderColor: '#1f2937', padding: 10, marginBottom: 10 }}>
          <TextInput
            ref={inputRef}
            value={prompt}
            onChangeText={setPrompt}
            placeholder='Ask a clinical question'
            placeholderTextColor='#6b7280'
            editable={!isStreaming}
            style={{ color: 'white', padding: 10, fontSize: 16 }}
            multiline
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable onPress={onSubmit} disabled={!prompt.trim() || isStreaming} style={{ backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, opacity: !prompt.trim() || isStreaming ? 0.6 : 1 }}>
              <Text style={{ color: 'white', fontWeight: '600' }}>{isStreaming ? 'Streaming' : 'Ask'}</Text>
            </Pressable>
            {!!isStreaming && (
              <Pressable onPress={stop} style={{ backgroundColor: '#374151', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Stop</Text>
              </Pressable>
            )}
          </View>
          {!!error && <Text style={{ color: '#fca5a5', marginTop: 8 }}>{error}</Text>}
        </View>

        {!!steps.length && (
          <Collapsible title='Search progress' initiallyCollapsed={false}>
            <View style={{ gap: 6 }}>
              {steps.map(s => (
                <View key={s.id} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Text style={{ width: 10, textAlign: 'center', color: s.status === 'done' ? '#10b981' : s.status === 'active' ? '#fbbf24' : '#9CA3AF' }}>
                    {s.status === 'done' ? '●' : s.status === 'active' ? '●' : '○'}
                  </Text>
                  <Text style={{ color: 'white', flex: 1 }}>{s.text}{s.extra ? `  ${s.extra}` : ''}</Text>
                </View>
              ))}
            </View>
          </Collapsible>
        )}

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
          {sections.length === 0 && !isStreaming ? (
            <Text style={{ color: '#9CA3AF', marginTop: 10 }}>Your answer will appear here with collapsible sections</Text>
          ) : (
            sections.map(sec => (
              <Collapsible key={sec.id} title={sec.title} initiallyCollapsed={sec.collapsed}>
                <MarkdownView text={sec.markdown} />
              </Collapsible>
            ))
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingScreen>
  )
}

function KeyboardAvoidingScreen({ children, insetsTop }: { children: React.ReactNode; insetsTop: number }) {
  return (
    <View style={{ backgroundColor: '#0a0f1a', flex: 1, paddingTop: insetsTop }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
        {children}
      </KeyboardAvoidingView>
    </View>
  )
}
