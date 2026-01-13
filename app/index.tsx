import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { CategoryTabs } from '../components/CategoryTabs';
import { FavoriteButton } from '../components/FavoriteButton';
import { HeroHeader } from '../components/HeroHeader';
import { Loader } from '../components/Loader';
import { OutfitCard } from '../components/OutfitCard';
import type { Outfit, StyleCategory } from '../services/fashionApi';
import { searchOutfits } from '../services/fashionApi';
import { getFavoriteMap, toggleFavorite } from '../services/favorites';

export default function DiscoverScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<StyleCategory>('Streetwear');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Outfit[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'unsplash' | 'fallback'>('fallback');
  const [favoriteIds, setFavoriteIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPage(1);
    searchOutfits({ category, page: 1, perPage: 12 })
      .then((r) => {
        if (cancelled) return;
        setItems(r.outfits);
        setHasMore(r.hasMore);
        setSource(r.source);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  useEffect(() => {
    let cancelled = false;
    getFavoriteMap().then((m) => {
      if (cancelled) return;
      const ids: Record<string, boolean> = {};
      Object.keys(m).forEach((k) => (ids[k] = true));
      setFavoriteIds(ids);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    const next = page + 1;
    try {
      const r = await searchOutfits({ category, page: next, perPage: 12 });
      setItems((prev) => [...prev, ...r.outfits]);
      setHasMore(r.hasMore);
      setPage(next);
      setSource(r.source);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0b0b0f] px-4">
      <View className="pt-4">
        <HeroHeader title="Swaggy Fits" subtitle="Bright, bold, and drip-ready outfit inspiration." />
      </View>

      <View className="pb-3">
        <CategoryTabs value={category} onChange={setCategory} />
        <Text className="mt-2 text-xs font-semibold text-white/80">
          {source === 'unsplash'
            ? 'Powered by Unsplash'
            : 'Tip: set EXPO_PUBLIC_UNSPLASH_KEY for richer results'}
        </Text>
      </View>

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
                active={Boolean(favoriteIds[item.id])}
                onPress={async () => {
                  const next = await toggleFavorite(item);
                  setFavoriteIds((prev) => ({ ...prev, [item.id]: next }));
                }}
              />
            }
          />
        )}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        ListFooterComponent={loading ? <Loader label="Loading more…" /> : null}
      />
    </SafeAreaView>
  );
}

