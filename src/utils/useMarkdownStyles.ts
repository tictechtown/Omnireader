import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export default function useMarkdownStyles() {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        heading1: {
          marginVertical: 16,
          ...theme.fonts.headlineSmall,
        },
        heading2: {
          marginVertical: 12,
          ...theme.fonts.headlineSmall,
        },
        heading3: {
          marginVertical: 8,
          ...theme.fonts.titleLarge,
        },
        heading4: {
          marginVertical: 6,
          ...theme.fonts.titleLarge,
        },
        heading5: {
          marginVertical: 4,
          ...theme.fonts.titleMedium,
        },
        heading6: {
          marginVertical: 2,
          ...theme.fonts.titleMedium,
        },

        image: {
          borderRadius: 24,
          overflow: "hidden",
        },
        body: {
          ...theme.fonts.bodyLarge,
          color: theme.colors.onSurface,
          userSelect: "auto",
        },
        textgroup: {
          userSelect: "auto",
        },
        link: {
          color: theme.colors.primary,
        },

        code_inline: {
          backgroundColor: theme.colors.secondaryContainer,
          color: theme.colors.onSecondaryContainer,
        },

        code_block: {
          backgroundColor: theme.colors.elevation.level2,
          color: theme.colors.onSurface,
          borderColor: theme.colors.elevation.level2,
          borderRadius: 8,
        },

        fence: {
          backgroundColor: theme.colors.elevation.level3,
          color: theme.colors.onSurface,
          borderColor: theme.colors.elevation.level3,
          borderRadius: 8,
        },
        blockquote: {
          backgroundColor: theme.colors.elevation.level3,
          color: theme.colors.onSurface,
          borderColor: theme.colors.elevation.level3,
          borderRadius: 8,
        },
        hr: {
          backgroundColor: theme.colors.outlineVariant,
        },
      }),
    [theme]
  );

  return { styles, theme };
}
