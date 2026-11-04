import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  Button,
  Card,
  styles,
} from './UI';

import { colors } from '../theme/colors';

export default function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card>
      <Ionicons
        name="alert-circle-outline"
        color={colors.danger}
        size={32}
      />

      <Text style={styles.sectionTitle}>
        Something went wrong
      </Text>

      <Text
        accessibilityRole="alert"
        style={styles.body}
      >
        {message}
      </Text>

      {onRetry ? (
        <Button
          title="Try again"
          onPress={onRetry}
        />
      ) : null}
    </Card>
  );
}