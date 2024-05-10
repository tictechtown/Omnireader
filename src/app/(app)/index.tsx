import { useQuery } from "@apollo/client";
import { Link, Stack, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl, SectionList, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  List,
  Snackbar,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import {
  GetLabelsQuery,
  GetSubscriptionsQuery,
  MeQuery,
  SavedSearchesQuery,
} from "../../__generated__/graphql";
import TopAppBar from "../../components/TopAppBar";
import HomeFAB from "../../components/home/HomeFAB";
import {
  FilterItem,
  GET_FILTERS,
  GET_LABELS,
  GET_ME,
  GET_SUBS,
  LabelItem,
  SubscriptionItem,
} from "../../graphql/graphql";
import formatRelativeTime from "../../utils/formatRelativeTime";
import useAppState from "../../utils/useAppState";

const getSlugParams = (item: SubscriptionItem) => {
  if (item.type === "RSS") {
    return {
      pathname: "/feed/[slug]",
      params: { slug: `rss:"${item.url}"`, name: item.name },
    };
  } else if (item.type === "NEWSLETTER") {
    return {
      pathname: "/feed/[slug]",
      params: { slug: `subscription:"${item.name}"`, name: item.name },
    };
  }

  return { pathname: "/feed/" };
};

const getSlugParamsForFilter = (item: FilterItem) => {
  return {
    pathname: "/feed/[slug]",
    params: { slug: `${item.filter}`, name: item.name },
  };
};

const getSlugParamsForLabel = (item: LabelItem) => {
  return {
    pathname: "/feed/[slug]",
    params: { slug: `in:inbox label:${item.name}`, name: item.name },
  };
};

const getDescription = (item) => {
  if (item.type === "RSS") {
    return ["RSS", formatRelativeTime(item.mostRecentItemDate)]
      .filter((it) => !!it)
      .join(" • ");
  } else if (item.type === "NEWSLETTER") {
    return ["Newsletter", formatRelativeTime(item.updatedAt)]
      .filter((it) => !!it)
      .join(" • ");
  }

  return item.description ?? "";
};

const getIconForFilter = (name: string) => {
  if (name === "Inbox") {
    return "inbox";
  }

  if (name === "Continue Reading") {
    return "read";
  }

  if (name === "Non-Feed Items") {
    return "link";
  }

  if (name === "Highlights") {
    return "marker";
  }

  if (name === "Unlabeled") {
    return "label-off";
  }

  if (name === "Archived") {
    return "archive";
  }
  if (name === "Files") {
    return "file-document";
  }

  return "folder";
};

const getColorForFilter = (name: string) => {
  if (name === "Inbox") {
    return "#4567b7"; // blue
  }

  if (name === "Continue Reading") {
    return "#34c759"; // green
  }

  if (name === "Non-Feed Items") {
    return "#0097a7"; // teal
  }

  if (name === "Highlights") {
    return "#ff9900"; // orange
  }

  if (name === "Unlabeled") {
    return "#7a288a"; // puprle
  }

  if (name === "Archived") {
    return "rgb(255, 45, 85)";
  }
  if (name === "Files") {
    return "rgb(88, 86, 214)";
  }

  return undefined;
};

const getColor = (item: SubscriptionItem, labels: LabelItem[]) => {
  if (!item) return undefined;
  if (item.type === "NEWSLETTER") {
    return labels.find((l) => l.name === "Newsletter")?.color;
  }
  if (item.type === "RSS") {
    return labels.find((l) => l.name === "RSS")?.color;
  }
  return undefined;
};

type Item = SubscriptionItem | LabelItem | FilterItem;

export default function Page() {
  const theme = useTheme();
  const router = useRouter();
  const { loading, error, refetch: refetchMe } = useQuery<MeQuery>(GET_ME);
  const {
    loading: subsLoading,
    error: subsError,
    data: subsData,
    refetch: refetchSubs,
  } = useQuery<GetSubscriptionsQuery>(GET_SUBS);
  const { data: filtersData, refetch: refetchFilters } =
    useQuery<SavedSearchesQuery>(GET_FILTERS);
  const { data: labelData, refetch: refetchLabels } =
    useQuery<GetLabelsQuery>(GET_LABELS);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setShowError(!!error || !!subsError);
  }, [error, subsError]);

  const searchedFeed = useMemo(() => {
    if (!subsData) return [];
    if (subsData.subscriptions.__typename === "SubscriptionsError") return [];
    return [...subsData.subscriptions.subscriptions].sort((itemA, itemB) => {
      return itemA.name.toLowerCase() < itemB.name.toLowerCase() ? -1 : 1;
    });
  }, [subsData]);
  const [needQueryRefetch, setNeedQueryRefetch] = useAppState();

  const refreshData = () => {
    refetchMe();
    refetchSubs();
    refetchFilters();
    refetchLabels();
  };

  if (needQueryRefetch) {
    setNeedQueryRefetch(false);
    refreshData();
  }

  if (loading || subsLoading) {
    return (
      <Surface style={styles.surface} mode="flat" elevation={0}>
        <ActivityIndicator animating={true} style={{ alignSelf: "center" }} />
      </Surface>
    );
  }

  if (error || subsError) {
    return (
      <Surface style={styles.surface} mode="flat" elevation={0}>
        <Text>Error loading data</Text>
        <Text>{(error ?? subsError)?.graphQLErrors?.toString()}</Text>
      </Surface>
    );
  }

  const renderItem = ({ item }: { item: Item }) => {
    if (item.__typename === "Filter") {
      const href = getSlugParamsForFilter(item);
      const icon = getIconForFilter(item.name);
      const color = getColorForFilter(item.name);

      return (
        <Link href={href}>
          <List.Item
            style={{ paddingHorizontal: 16 }}
            title={item.name}
            left={(props) => {
              return (
                <Avatar.Icon
                  size={40}
                  icon={icon}
                  color={"white"}
                  style={{ backgroundColor: color }}
                />
              );
            }}
          />
        </Link>
      );
    }

    if (item.__typename === "Label") {
      const href = getSlugParamsForLabel(item);
      return (
        <Link href={href}>
          <List.Item
            style={{ paddingHorizontal: 16 }}
            title={item.name}
            left={(props) => {
              return (
                <Avatar.Text
                  size={40}
                  label=""
                  style={{ backgroundColor: item.color }}
                />
              );
            }}
          />
        </Link>
      );
    }

    const href = getSlugParams(item);
    const description = getDescription(item);

    const color = getColor(
      item,
      labelData?.labels.__typename === "LabelsSuccess"
        ? labelData?.labels.labels ?? []
        : []
    );
    return (
      <Link href={href}>
        <List.Item
          style={{ paddingHorizontal: 16 }}
          title={item.name.trim()}
          description={description}
          left={(props) => {
            return item.type === "NEWSLETTER" ? (
              <Avatar.Icon
                size={40}
                icon="email"
                style={{ backgroundColor: color }}
              />
            ) : (
              <Avatar.Icon
                size={40}
                icon="rss"
                style={{ backgroundColor: color }}
              />
            );
          }}
        />
      </Link>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <List.Subheader
      style={{
        color: theme.colors.primary,
        backgroundColor: theme.colors.background,
      }}
    >
      {title}
    </List.Subheader>
  );

  const sectionData = [
    {
      title: "Categories",
      data:
        filtersData?.filters.__typename === "FiltersError"
          ? []
          : filtersData?.filters.filters ?? [],
    },
    {
      title: "Subscriptions",
      data: searchedFeed,
    },
    {
      title: "Labels",
      data:
        labelData?.labels.__typename === "LabelsError"
          ? []
          : labelData?.labels.labels ?? [],
    },
  ];

  return (
    <Surface style={styles.surface} mode="flat" elevation={0}>
      <Stack.Screen
        options={{
          title: "Omnivore",
          header: (props) => (
            <TopAppBar
              {...props}
              onSearchPress={() => router.push("search")}
              onAccountPress={() => router.push("/account")}
            />
          ),
        }}
      />

      <SectionList
        sections={sectionData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{
          paddingBottom: 42,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshData}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.background}
          />
        }
      />
      <HomeFAB
        onPress={() => {
          router.push("add");
        }}
      />

      <Snackbar
        visible={showError}
        onDismiss={() => {
          setShowError(false);
        }}
        action={{
          label: "Retry",
          onPress: () => {
            setShowError(false);
            refreshData();
          },
        }}
      >
        Error fetching data.
      </Snackbar>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    minHeight: "80%",
  },
});
