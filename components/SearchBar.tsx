import { TextInput, View } from 'react-native';

export function SearchBar(props: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder ?? 'Search outfits…'}
        placeholderTextColor="rgba(255,255,255,0.72)"
        className="text-base font-semibold text-white"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

