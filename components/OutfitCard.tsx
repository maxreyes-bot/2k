import { Image, Pressable, Text, View } from 'react-native';
import type { Outfit } from '../services/fashionApi';
import { COLORS } from '../constants/styles';

export function OutfitCard(props: {
  outfit: Outfit;
  onPress: () => void;
  rightAccessory?: React.ReactNode;
}) {
  const { outfit } = props;
  return (
    <Pressable
      onPress={props.onPress}
      className="overflow-hidden rounded-3xl border"
      style={{ backgroundColor: COLORS.card, borderColor: COLORS.cardBorder }}
    >
      <View className="relative">
        <Image source={{ uri: outfit.imageThumbUrl }} className="h-64 w-full" resizeMode="cover" />
        <View className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1">
          <Text className="text-xs font-semibold text-white">{outfit.category}</Text>
        </View>
        {props.rightAccessory ? (
          <View className="absolute right-3 top-3">{props.rightAccessory}</View>
        ) : null}
      </View>

      <View className="gap-1 px-4 py-4">
        <Text className="text-base font-bold text-white" numberOfLines={1}>
          {outfit.title}
        </Text>
        <Text className="text-sm text-white/70" numberOfLines={2}>
          {outfit.description}
        </Text>
      </View>
    </Pressable>
  );
}

