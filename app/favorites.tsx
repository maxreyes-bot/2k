import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Outfit } from '../services/fashionApi';
import { clearFavorites, getFavoritesList, removeFavorite } from '../services/favorites';
import { OutfitCard } from '../components/OutfitCard';
import { FavoriteButton } from '../components/FavoriteButton';

export default function FavoritesScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const list = await getFavoritesList();
      setItems(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#0b0b0f] px-4">
      <View className="py-4">
        <Text className="text-2xl font-bold text-white">Favorites</Text>
        <Text className="mt-2 text-white/70">Your saved fits, available offline.</Text>
        {items.length ? (
          <Text
            className="mt-3 text-sm font-semibold text-white/80"
            onPress={async () => {
              await clearFavorites();
              await refresh();
            }}
          >
            Clear all
          </Text>
        ) : null}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white/70">Loading favorites…</Text>
        </View>
      ) : items.length ? (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
          renderItem={({ item }) => (
            <OutfitCard
              outfit={item}
              onPress={() => router.push(`/outfit/${encodeURIComponent(item.id)}`)}
              rightAccessory={
                <FavoriteButton
                  active
                  onPress={async () => {
                    await removeFavorite(item.id);
                    await refresh();
                  }}
                />
              }
            />
          )}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white/80">No favorites yet.</Text>
          <Text className="mt-2 text-white/60">Tap ♡ on a fit to save it here.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

