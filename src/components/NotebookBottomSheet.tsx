import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetSectionList,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { View } from "react-native";
import Markdown from "react-native-markdown-display";
import { Appbar, Button, List, Surface } from "react-native-paper";
import useMarkdownStyles from "../utils/useMarkdownStyles";

function NotebookBottomSheet({ item }, ref) {
  const { theme, styles } = useMarkdownStyles();

  const highlights = item?.highlights ?? [];

  const sections = [
    {
      id: "note",
      title: "Article Notes",
      data: highlights.filter((hg) => hg.type === "NOTE"),
    },
    {
      id: "highlights",
      title: "Highlights",
      data: highlights.filter((hg) => hg.type === "HIGHLIGHT"),
    },
  ];

  const renderSectionHeader = useCallback(
    ({ section }) => <List.Subheader>{section.title}</List.Subheader>,
    []
  );

  const renderItem = useCallback(
    ({ item }) => {
      if (item.type === "NOTE") {
        return (
          <Surface
            style={{
              marginHorizontal: 16,
              paddingHorizontal: 16,
              borderRadius: 8,
            }}
          >
            <Markdown style={styles}>{item.annotation}</Markdown>
          </Surface>
        );
      }

      // HIGHLIGHT
      return (
        <View style={{ marginHorizontal: 16, marginBottom: 16, gap: 8 }}>
          <Surface
            mode="flat"
            style={{ paddingHorizontal: 16, borderRadius: 8 }}
          >
            <Surface
              mode="flat"
              style={{
                marginVertical: 8,
                paddingHorizontal: 8,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: theme.colors.outlineVariant,
              }}
            >
              <Markdown style={styles}>{item.quote}</Markdown>
            </Surface>
            {item.annotation ? (
              <Markdown style={styles}>{item.annotation}</Markdown>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "100%",
                  gap: 4,
                }}
              >
                <Button mode="text">Add Note</Button>
              </View>
            )}
          </Surface>
        </View>
      );
    },

    [theme, styles]
  );

  return (
    <BottomSheet
      index={-1}
      ref={ref}
      snapPoints={[300, 800]}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: theme.colors.onSurfaceVariant,
      }}
      backgroundStyle={{ backgroundColor: theme.colors.elevation.level2 }}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
    >
      <Surface style={{ flex: 1 }} elevation={2} mode="flat">
        <Appbar.Header
          statusBarHeight={0}
          style={{ backgroundColor: "transparent" }}
          mode="small"
        >
          <Appbar.Content title="Notebook" />
        </Appbar.Header>

        <BottomSheetSectionList
          sections={sections}
          keyExtractor={(item) => item.shortId}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
        />
      </Surface>
    </BottomSheet>
  );
}

export default forwardRef(NotebookBottomSheet);
