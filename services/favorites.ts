import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Outfit } from './fashionApi';

const STORAGE_KEY = 'swaggy_favorites_v1';

type FavoritesMap = Record<string, Outfit>;

async function readMap(): Promise<FavoritesMap> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as FavoritesMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function writeMap(map: FavoritesMap) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export async function getFavoriteMap() {
  return await readMap();
}

export async function getFavoritesList(): Promise<Outfit[]> {
  const map = await readMap();
  return Object.values(map);
}

export async function isFavorite(id: string): Promise<boolean> {
  const map = await readMap();
  return Boolean(map[id]);
}

export async function addFavorite(outfit: Outfit) {
  const map = await readMap();
  map[outfit.id] = outfit;
  await writeMap(map);
}

export async function removeFavorite(id: string) {
  const map = await readMap();
  if (map[id]) {
    delete map[id];
    await writeMap(map);
  }
}

export async function toggleFavorite(outfit: Outfit): Promise<boolean> {
  const map = await readMap();
  const next = !map[outfit.id];
  if (next) map[outfit.id] = outfit;
  else delete map[outfit.id];
  await writeMap(map);
  return next;
}

export async function clearFavorites() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

