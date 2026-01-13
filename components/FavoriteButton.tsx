import { Pressable, Text } from 'react-native';
import { COLORS } from '../constants/styles';

export function FavoriteButton(props: { active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      className="h-9 w-9 items-center justify-center rounded-full border"
      style={{
        backgroundColor: props.active ? 'rgba(251,113,133,0.28)' : 'rgba(0,0,0,0.55)',
        borderColor: props.active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.16)',
      }}
      accessibilityRole="button"
      accessibilityLabel={props.active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Text style={{ color: props.active ? '#fff' : 'rgba(255,255,255,0.85)', fontSize: 16 }}>
        {props.active ? '♥' : '♡'}
      </Text>
    </Pressable>
  );
}

