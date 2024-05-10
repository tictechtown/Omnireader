import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const colors = [
  // web
  "#FF5D99",
  "#7CFF7B",
  "#FFD234",
  "#7BE4FF",
  "#CE88EF",
  "#EF8C43",
  //  swatch
  "#fff034",
  "#efff34",
  "#d1ff34",
  "#b2ff34",
  "#94ff34",
  "#75ff34",
  "#57ff34",
  "#38ff34",
  "#34ff4e",
  "#34ff6d",
  "#34ff8b",
  "#34ffa9",
  "#34ffc8",
  "#34ffe6",
  "#34f9ff",
  "#34dbff",
  "#34bcff",
  "#349eff",
  "#347fff",
  "#3461ff",
  "#3443ff",
  "#4434ff",
  "#6234ff",
  "#8134ff",
  "#9f34ff",
  "#be34ff",
  "#dc34ff",
  "#fb34ff",
  "#ff34e5",
  "#ff34c7",
  "#ff34a8",
  "#ff348a",
  "#ff346b",
];

export default function AddLabelDialog({ visible, hideDialog, onAdd }) {
  const theme = useTheme();
  const [labelTxt, setLabelTxt] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const isActionEnabled = labelTxt.length > 0 && selectedColor.length > 0;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => setSelectedColor(item)}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 28,
            backgroundColor: item,
            borderWidth: 1,
            borderColor: item === selectedColor ? "black" : "transparent",
            marginRight: 8,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Text variant="titleMedium" style={{ marginTop: 16 }}>
            Name
          </Text>

          <TextInput
            value={labelTxt}
            autoFocus
            onChangeText={(txt) => setLabelTxt(txt)}
          />
          <Text variant="titleMedium" style={{ marginTop: 16 }}>
            Color
          </Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 8 }}
            horizontal
            data={colors}
            renderItem={renderItem}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={hideDialog}
            textColor={theme.colors.onSurfaceVariant}
          >
            Cancel
          </Button>
          <Button
            onPress={() => onAdd(labelTxt, selectedColor)}
            disabled={!isActionEnabled}
            textColor={theme.colors.primary}
          >
            Add Label
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
