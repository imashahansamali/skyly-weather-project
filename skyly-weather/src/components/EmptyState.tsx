import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  Button,
  Card,
  styles,
} from './UI';

import { colors } from '../theme/colors';

export default function EmptyState({
  title,
  message,
  button,
  onPress,
}: {
  title: string;
  message: string;
  button?: string;
  onPress?: () => void;
}) {
  return (
    <Card>
      <Ionicons
        name="search-outline"
        color={colors.accent}
        size={36}
      />

      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <Text style={styles.body}>
        {message}
      </Text>

      {button && onPress ? (
        <Button
          title={button}
          onPress={onPress}
        />
      ) : null}
    </Card>
  );
}