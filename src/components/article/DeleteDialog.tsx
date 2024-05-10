import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";

export default function DeleteDialog({ visible, hideDialog, onDelete }) {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Text variant="bodyMedium">Delete Article?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button textColor={theme.colors.error} onPress={onDelete}>
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
