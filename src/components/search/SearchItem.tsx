import { router } from "expo-router";
import { View } from "react-native";
import { MD3Theme, Text, TouchableRipple } from "react-native-paper";
import { TypeaheadSearchItem } from "../../__generated__/graphql";

type Props = {
  item: TypeaheadSearchItem;
  theme: MD3Theme;
};

export default function SearchItem({ item, theme }: Props) {
  const description = [item.siteName].filter((it) => !!it).join(" • ");

  return (
    <TouchableRipple
      style={{
        paddingVertical: 8,
        paddingRight: 24,
        backgroundColor: theme.colors.surface,
      }}
      onPress={() => {
        router.push({
          pathname: "/article/[id]",
          params: { id: item.slug },
        });
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          marginVertical: 6,
          gap: 24,
        }}
      >
        <View style={{ paddingLeft: 16, flex: 1 }}>
          <Text
            variant="titleMedium"
            style={{ lineHeight: 20 }}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
          >
            {description}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
}
