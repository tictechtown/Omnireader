import { gql, useLazyQuery } from "@apollo/client";
import { Stack } from "expo-router";
import { FlatList } from "react-native";
import { Divider, Surface, useTheme } from "react-native-paper";
import {
  TypeaheadSearchItem,
  TypeaheadSearchQuery,
  TypeaheadSearchQueryVariables,
} from "../../__generated__/graphql";
import SearchHeader from "../../components/search/SearchHeader";
import SearchItem from "../../components/search/SearchItem";

const SEARCH_QUERY = gql`
  query TypeaheadSearch($query: String!) {
    typeaheadSearch(query: $query) {
      ... on TypeaheadSearchSuccess {
        items {
          id
          title
          slug
          siteName
          contentReader
        }
      }
      ... on TypeaheadSearchError {
        errorCodes
      }
    }
  }
`;

export default function Page() {
  const theme = useTheme();

  const [searchQuery, { data }] = useLazyQuery<
    TypeaheadSearchQuery,
    TypeaheadSearchQueryVariables
  >(SEARCH_QUERY);

  const renderItem = ({ item }: { item: TypeaheadSearchItem }) => {
    return <SearchItem item={item} theme={theme} />;
  };

  return (
    <Surface elevation={0} mode="flat">
      <Stack.Screen
        options={{
          header: (props) => <SearchHeader {...props} onSearch={searchQuery} />,
        }}
      />
      <FlatList
        data={
          data?.typeaheadSearch.__typename === "TypeaheadSearchSuccess"
            ? data?.typeaheadSearch.items
            : []
        }
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 42,
        }}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Surface>
  );
}
