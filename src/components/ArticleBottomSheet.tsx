import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { Share } from "react-native";
import { List, Surface, useTheme } from "react-native-paper";
import useArchiveArticle from "../graphql/useArchiveArticle";
import useSaveReadingProgress from "../graphql/useSaveReadingProgress";

function ArticleBottomSheet(
  { item, onDeletePress, onUpdateLabelPress, onUpdateInfoPress },
  ref
) {
  const theme = useTheme();
  const setArchiveStatus = useArchiveArticle();
  const [_, markAsRead] = useSaveReadingProgress();

  const handleArchive = () => {
    if (item) {
      setArchiveStatus(item.id, !item.isArchived);
    }
    ref.current.close();
  };

  const handleMarkAsRead = () => {
    if (item) {
      markAsRead(item.id);
    }
    ref.current.close();
  };

  const handleOnDeletePress = () => {
    onDeletePress();
    ref.current.close();
  };
  const handleOnUpdateLabelPress = () => {
    onUpdateLabelPress();
    ref.current.close();
  };

  const handleOnUpdateInfoPress = () => {
    onUpdateInfoPress();
    ref.current.close();
  };

  const handleShareArticle = () => {
    if (item) {
      Share.share({
        message: item.url,
      });
    }

    ref.current.close();
  };

  return (
    <BottomSheet
      index={-1}
      ref={ref}
      snapPoints={[300, 380]}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: theme.colors.onSurfaceVariant,
      }}
      backgroundStyle={{ backgroundColor: theme.colors.elevation.level2 }}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
    >
      <Surface
        style={{ flex: 1, paddingHorizontal: 16 }}
        elevation={2}
        mode="flat"
      >
        <List.Section>
          <List.Item
            title="Archive"
            onPress={handleArchive}
            left={() => <List.Icon icon="archive" />}
          />
          <List.Item
            title="Delete"
            onPress={handleOnDeletePress}
            left={() => <List.Icon icon="delete" />}
          />
          <List.Item
            title="Update Labels"
            onPress={handleOnUpdateLabelPress}
            left={() => <List.Icon icon="label" />}
          />
          <List.Item
            title="Update Info"
            onPress={handleOnUpdateInfoPress}
            left={() => <List.Icon icon="information" />}
          />
          <List.Item
            title="Mark as Read"
            onPress={handleMarkAsRead}
            left={() => <List.Icon icon="read" />}
          />
          <List.Item
            title="Share"
            onPress={handleShareArticle}
            left={() => <List.Icon icon="share-variant" />}
          />
        </List.Section>
      </Surface>
    </BottomSheet>
  );
}

export default forwardRef(ArticleBottomSheet);
