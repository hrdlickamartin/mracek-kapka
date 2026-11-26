import type { ReactNode } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

export interface PressDownProps {
  label: string;
  onDown: () => void;
  onUp?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  allowScroll?: boolean;
}

export function PressDown({ label, onDown, onUp, style, children, allowScroll = false }: PressDownProps) {
  return (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      onAccessibilityTap={onDown}
      onStartShouldSetResponder={() => true}
      onResponderTerminationRequest={() => allowScroll}
      onResponderGrant={onDown}
      onResponderRelease={onUp}
      onResponderTerminate={onUp}
      style={style}
    >
      {children}
    </View>
  );
}
