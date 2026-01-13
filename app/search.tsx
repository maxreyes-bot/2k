import { useEffect, useMemo, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CategoryTabs } from '../components/CategoryTabs';
import { FavoriteButton } from '../components/FavoriteButton';
import { Loader } from '../components/Loader';
import { OutfitCard } from '../components/OutfitCard';
import { SearchBar } from '../components/SearchBar';
import type { Outfit, StyleCategory } from '../services/fashionApi';
import { searchOutfits } from '../services/fashionApi';
import { getFavoriteMap, toggleFavorite } from '../services/favorites';

export default function SearchScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<StyleCategory>('Streetwear');
  const [query, setQuery] = useState('');

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Outfit[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Record<string, boolean>>({});

  const trimmed = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPage(1);

    searchOutfits({ category, query: trimmed, page: 1, perPage: 12 })
      .then((r) => {
        if (cancelled) return;
        setItems(r.outfits);
        setHasMore(r.hasMore);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, trimmed]);

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
      const r = await searchOutfits({ category, query: trimmed, page: next, perPage: 12 });
      setItems((prev) => [...prev, ...r.outfits]);
      setHasMore(r.hasMore);
      setPage(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0b0b0f] px-4">
      <View className="gap-3 py-4">
        <Text className="text-2xl font-bold text-white">Search</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="baggy jeans, oversized hoodie…" />
        <CategoryTabs value={category} onChange={setCategory} />
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

