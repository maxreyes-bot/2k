import { Pressable, ScrollView, Text } from 'react-native';
import type { StyleCategory } from '../services/fashionApi';
import { COLORS } from '../constants/styles';

const CATEGORIES: StyleCategory[] = [
  'Streetwear',
  'Casual',
  'Formal',
  'Vintage',
  'Luxury',
  'Gender-neutral',
];

export function CategoryTabs(props: {
  value: StyleCategory;
  onChange: (c: StyleCategory) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
      {CATEGORIES.map((c) => {
        const active = c === props.value;
        return (
          <Pressable
            key={c}
            onPress={() => props.onChange(c)}
            className="rounded-full border px-4 py-2"
            style={{
              borderColor: active ? COLORS.accent : 'rgba(255,255,255,0.12)',
              backgroundColor: active ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.04)',
            }}
          >
            <Text className="text-sm font-semibold" style={{ color: active ? '#fff' : COLORS.muted }}>
              {c}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

