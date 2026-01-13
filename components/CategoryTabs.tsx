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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 py-1">
      {CATEGORIES.map((c) => {
        const active = c === props.value;
        return (
          <Pressable
            key={c}
            onPress={() => props.onChange(c)}
            className="rounded-full border px-4 py-2"
            style={{
              borderColor: active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.14)',
              backgroundColor: active ? 'rgba(168,85,247,0.22)' : 'rgba(255,255,255,0.06)',
            }}
          >
            <Text className="text-sm font-extrabold" style={{ color: '#fff' }}>
              {c}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

