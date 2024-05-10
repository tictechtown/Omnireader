import { useState } from "react";
import {
  Button,
  Dialog,
  Portal,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function AddFilterDialog({ visible, hideDialog, onAdd }) {
  const theme = useTheme();
  const [filterTxt, setFilterTxt] = useState("");
  const [queryTxt, setQueryTxt] = useState("");

  const isActionEnabled = filterTxt.length > 0 && queryTxt.length > 0;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content style={{ gap: 16 }}>
          <TextInput
            value={filterTxt}
            autoFocus
            mode="outlined"
            label={"Name"}
            placeholder="Query Name"
            onChangeText={(txt) => setFilterTxt(txt)}
          />
          <TextInput
            value={queryTxt}
            mode="outlined"
            label={"Query"}
            autoCapitalize="none"
            autoComplete="off"
            placeholder="in:inbox"
            onChangeText={(txt) => setQueryTxt(txt)}
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
            onPress={() => onAdd(filterTxt, queryTxt)}
            disabled={!isActionEnabled}
            textColor={theme.colors.primary}
          >
            Add Filter
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
