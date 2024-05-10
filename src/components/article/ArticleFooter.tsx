import { View } from "react-native";
import { Button, Divider } from "react-native-paper";

type Props = {
  onShare: () => void;
  onArchive: () => void;
};

export default function ArticleFooter({ onShare, onArchive }: Props) {
  return (
    <>
      <Divider style={{ marginVertical: 8 }} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          marginTop: 8,
          marginBottom: 24,
          gap: 12,
        }}
      >
        <Button mode="outlined" icon={"archive"} onPress={onArchive}>
          Archive
        </Button>
        <Button mode="outlined" icon={"share-variant"} onPress={onShare}>
          Share
        </Button>
      </View>
    </>
  );
}
