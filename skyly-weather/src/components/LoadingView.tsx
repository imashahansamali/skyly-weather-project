import {
  ActivityIndicator,
  Text,
} from 'react-native';

import { Card, styles } from './UI';
import { colors } from '../theme/colors';

export default function LoadingView({
  message = 'Loading weather…',
}: {
  message?: string;
}) {
  return (
    <Card>
      <ActivityIndicator
        size="large"
        color={colors.accent}
      />

      <Text
        accessibilityLiveRegion="polite"
        style={[
          styles.body,
          { textAlign: 'center' },
        ]}
      >
        {message}
      </Text>
    </Card>
  );
}