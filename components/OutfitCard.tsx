import { ImageBackground, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Outfit } from '../services/fashionApi';
import { COLORS, GRADIENTS } from '../constants/styles';

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
        <ImageBackground source={{ uri: outfit.imageThumbUrl }} className="h-72 w-full" resizeMode="cover">
          <LinearGradient colors={GRADIENTS.card} className="h-full w-full">
            <View className="flex-1 px-3 pb-3 pt-3">
              <View className="flex-row items-start justify-between">
                <View
                  className="rounded-full border px-3 py-1"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.10)',
                    borderColor: 'rgba(255,255,255,0.18)',
                  }}
                >
                  <Text className="text-xs font-extrabold text-white">{outfit.category}</Text>
                </View>
                {props.rightAccessory ? <View>{props.rightAccessory}</View> : null}
              </View>

              <View className="mt-auto gap-1">
                <Text className="text-lg font-extrabold text-white" numberOfLines={1}>
                  {outfit.title}
                </Text>
                <Text className="text-sm text-white/90" numberOfLines={2}>
                  {outfit.description}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </Pressable>
  );
}

