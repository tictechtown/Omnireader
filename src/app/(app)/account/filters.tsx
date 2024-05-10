import { useMutation, useQuery } from "@apollo/client";
import { Stack } from "expo-router";
import { useState } from "react";
import { FlatList, TouchableHighlight, View } from "react-native";
import { List, Surface, useTheme } from "react-native-paper";
import { SavedSearchesQuery } from "../../../__generated__/graphql";
import AddFilterDialog from "../../../components/account/AddFilterDialog";
import {
  CREATE_FILTER,
  DELETE_FILTER,
  GET_FILTERS,
} from "../../../graphql/graphql";

export default function Page() {
  const theme = useTheme();
  const { data } = useQuery<SavedSearchesQuery>(GET_FILTERS, {
    fetchPolicy: "network-only",
  });

  // {category: "Search", filter: "", name: "", position: 8}
  const [createFilter] = useMutation(CREATE_FILTER, {
    refetchQueries: [GET_FILTERS],
  });
  const [deleteFilter] = useMutation(DELETE_FILTER, {
    refetchQueries: [GET_FILTERS],
  });

  const [showDialog, setShowDialog] = useState(false);

  const renderItem = ({ item }) => {
    return (
      <List.Item
        style={{ paddingHorizontal: 16 }}
        title={item.name}
        description={item.filter}
        right={(props) =>
          !item.defaultFilter && (
            <TouchableHighlight
              onPress={() => {
                deleteFilter({ variables: { id: item.id } });
              }}
            >
              <List.Icon
                icon={"delete-outline"}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableHighlight>
          )
        }
      />
    );
  };

  return (
    <Surface style={{ flex: 1 }} mode="flat" elevation={0}>
      <Stack.Screen options={{ title: "Categories" }} />

      <FlatList
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 42,
        }}
        style={{ height: "100%" }}
        data={
          data?.filters?.__typename === "FiltersSuccess"
            ? data?.filters?.filters
            : []
        }
        ListHeaderComponent={
          <View>
            <List.Item
              onPress={() => {
                setShowDialog(true);
              }}
              style={{ paddingHorizontal: 16 }}
              title="Add Filter"
              titleStyle={{ color: theme.colors.primary }}
              left={(props) => (
                <List.Icon color={theme.colors.primary} icon="plus" />
              )}
            />

            <List.Subheader>Filters</List.Subheader>
          </View>
        }
        renderItem={renderItem}
      />

      <AddFilterDialog
        visible={showDialog}
        hideDialog={() => {
          setShowDialog(false);
        }}
        onAdd={async (labelTxt, queryTxt) => {
          setShowDialog(false);
          const position =
            data?.filters?.__typename === "FiltersSuccess"
              ? data?.filters?.filters.length
              : 1;
          await createFilter({
            variables: {
              input: {
                category: "Search",
                name: labelTxt,
                filter: queryTxt,
                position,
              },
            },
          });
        }}
      />
    </Surface>
  );
}
