import { Link } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';

export default function DiscoverScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0b0b0f] px-4">
      <View className="flex-row items-center justify-between py-4">
        <Text className="text-2xl font-bold text-white">Swaggy Fits</Text>
        <View className="flex-row gap-3">
          <Link href="/search" className="text-white/90">
            Search
          </Link>
          <Link href="/favorites" className="text-white/90">
            Favorites
          </Link>
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        <Text className="text-white/80">Discover feed coming next.</Text>
      </View>
    </SafeAreaView>
  );
}

