import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS } from '../constants/styles';

export function Loader(props: { label?: string }) {
  return (
    <View className="items-center justify-center py-6">
      <ActivityIndicator color={COLORS.accent} />
      {props.label ? <Text className="mt-3 text-white/70">{props.label}</Text> : null}
    </View>
  );
}

