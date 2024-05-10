import { useState } from "react";
import { View } from "react-native";
import { Appbar, TextInput } from "react-native-paper";

type Props = {
  navigation: any;
  route: any;
  options: any;
  back?: { title: string };
  onSearch: (options: any) => void;
};

export default function SearchHeader({
  navigation,
  route,
  options,
  back,
  onSearch,
}: Props) {
  const [searchText, setSearchText] = useState("");
  const handleSearch = (txt: string) => {
    setSearchText(txt);
    if (txt.length > 0) {
      onSearch({ variables: { query: txt } });
    }
  };

  return (
    <Appbar.Header elevated={false}>
      <View style={{ flex: 1 }}>
        <TextInput
          left={
            <TextInput.Icon
              icon={"arrow-left"}
              color="white"
              onPress={navigation.goBack}
            />
          }
          right={
            <TextInput.Icon
              icon={"close"}
              color="white"
              onPress={() => {
                setSearchText("");
              }}
            />
          }
          value={searchText}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
          placeholder="Search"
          autoFocus
        />
      </View>
    </Appbar.Header>
  );
}
