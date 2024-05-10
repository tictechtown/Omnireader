import { useQuery } from "@apollo/client";
import { getHeaderTitle } from "@react-navigation/elements";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { Appbar, Avatar, IconButton, useTheme } from "react-native-paper";
import { MeQuery } from "../__generated__/graphql";
import { GET_ME } from "../graphql/graphql";

export default function TopAppBar({
  route,
  options,
  onSearchPress,
  onAccountPress,
}) {
  const { loading, data } = useQuery<MeQuery>(GET_ME);
  const theme = useTheme();
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header elevated mode="small">
      <Image
        style={{
          width: 36,
          height: 36,
          tintColor: theme.colors.onSurface,
          marginHorizontal: 4,
        }}
        source={require("../../assets/images/ic-omnivore.svg")}
        tintColor={theme.colors.onSurface}
      />

      <Appbar.Content title={title} />
      <Appbar.Action icon="magnify" onPress={onSearchPress} />
      {loading && (
        <IconButton
          icon={"account"}
          mode="contained"
          onPress={onAccountPress}
        />
      )}
      {!loading && data.me.picture && (
        <TouchableOpacity
          onPress={onAccountPress}
          style={{ marginHorizontal: 8 }}
        >
          <Avatar.Image size={38} source={{ uri: data.me.picture }} />
        </TouchableOpacity>
      )}
      {!loading && !data.me.picture && (
        <TouchableOpacity
          onPress={onAccountPress}
          style={{ marginHorizontal: 8 }}
        >
          <Avatar.Text size={38} label={data.me.name[0].toUpperCase()} />
        </TouchableOpacity>
      )}
    </Appbar.Header>
  );
}
