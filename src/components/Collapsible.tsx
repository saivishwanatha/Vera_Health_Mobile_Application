import { useState } from 'react'
import { Platform, UIManager, LayoutAnimation, Pressable, View, Text } from 'react-native'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type Props = {
  title: string
  initiallyCollapsed?: boolean
  children: React.ReactNode
}

export default function Collapsible({ title, initiallyCollapsed, children }: Props) {
  const [collapsed, setCollapsed] = useState(!!initiallyCollapsed)

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setCollapsed(v => !v)
  }

  return (
    <View style={{ borderRadius: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1f2937', marginBottom: 12, overflow: 'hidden' }}>
      <Pressable onPress={toggle} style={{ paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#111827', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{title}</Text>
        <Text style={{ color: '#9CA3AF' }}>{collapsed ? '▾' : '▴'}</Text>
      </Pressable>
      {!collapsed && <View style={{ padding: 14 }}>{children}</View>}
    </View>
  )
}
