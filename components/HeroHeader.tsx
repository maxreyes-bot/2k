import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { GRADIENTS } from '../constants/styles';

export function HeroHeader(props: { title: string; subtitle?: string }) {
  return (
    <View className="mb-3 overflow-hidden rounded-3xl border border-white/10">
      <LinearGradient colors={GRADIENTS.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View className="gap-2 px-5 py-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-extrabold text-white">{props.title}</Text>
            <View className="flex-row gap-2">
              <Link
                href="/search"
                className="rounded-full border border-white/30 bg-black/25 px-4 py-2 text-sm font-extrabold text-white"
              >
                Search
              </Link>
              <Link
                href="/favorites"
                className="rounded-full border border-white/30 bg-black/25 px-4 py-2 text-sm font-extrabold text-white"
              >
                Faves
              </Link>
            </View>
          </View>
          {props.subtitle ? <Text className="text-white">{props.subtitle}</Text> : null}
        </View>
      </LinearGradient>
    </View>
  );
}

