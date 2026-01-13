import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, Pressable, SafeAreaView, ScrollView, Text, View, Image } from 'react-native';
import { useEffect, useState } from 'react';
import type { Outfit } from '../../services/fashionApi';
import { searchOutfits } from '../../services/fashionApi';
import { FavoriteButton } from '../../components/FavoriteButton';
import { getFavoriteMap, toggleFavorite } from '../../services/favorites';

export default function OutfitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // We don’t have a “get by id” endpoint with the fallback source,
    // so we fetch a small set and pick by id when possible.
    searchOutfits({ category: 'Streetwear', page: 1, perPage: 20 })
      .then((r) => {
        if (cancelled) return;
        const found = r.outfits.find((o) => o.id === id) || r.outfits[0] || null;
        setOutfit(found);
      })
      .catch(() => {
        if (cancelled) return;
        setOutfit(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    if (!id) return;
    getFavoriteMap().then((m) => {
      if (cancelled) return;
      setFavorite(Boolean(m[id]));
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!outfit) {
    return (
      <SafeAreaView className="flex-1 bg-[#0b0b0f] px-4">
        <View className="py-4">
          <Pressable onPress={() => router.back()}>
            <Text className="text-white/90">Back</Text>
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white/70">Loading fit…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0b0b0f]">
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => router.back()}>
              <Text className="text-white/90">Back</Text>
            </Pressable>
            <FavoriteButton
              active={favorite}
              onPress={async () => {
                const next = await toggleFavorite(outfit);
                setFavorite(next);
              }}
            />
          </View>
        </View>

        <Image source={{ uri: outfit.imageUrl }} className="h-[520px] w-full" resizeMode="cover" />

        <View className="gap-4 px-4 pt-5">
          <View className="gap-2">
            <Text className="text-xs font-semibold text-white/70">{outfit.category.toUpperCase()}</Text>
            <Text className="text-2xl font-extrabold text-white">{outfit.title}</Text>
            <Text className="text-base text-white/75">{outfit.description}</Text>
          </View>

          <View className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <Text className="text-lg font-bold text-white">Breakdown</Text>
            <View className="mt-3 gap-2">
              <Text className="text-white/80">
                <Text className="font-semibold text-white">Top: </Text>
                {outfit.items.top}
              </Text>
              <Text className="text-white/80">
                <Text className="font-semibold text-white">Bottom: </Text>
                {outfit.items.bottom}
              </Text>
              <Text className="text-white/80">
                <Text className="font-semibold text-white">Shoes: </Text>
                {outfit.items.shoes}
              </Text>
              <Text className="text-white/80">
                <Text className="font-semibold text-white">Accessories: </Text>
                {outfit.items.accessories.join(', ')}
              </Text>
            </View>
          </View>

          <View className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <Text className="text-lg font-bold text-white">Style tips</Text>
            <View className="mt-3 gap-2">
              {outfit.tips.map((t) => (
                <Text key={t} className="text-white/80">
                  - {t}
                </Text>
              ))}
            </View>
          </View>

          {outfit.sourceUrl ? (
            <Pressable
              onPress={() => Linking.openURL(outfit.sourceUrl!)}
              className="items-center justify-center rounded-2xl bg-[#8b5cf6] py-4"
            >
              <Text className="text-base font-bold text-white">
                View source{outfit.photographer ? ` (by ${outfit.photographer})` : ''}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

