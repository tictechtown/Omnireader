import { useMutation } from "@apollo/client";
import { useState } from "react";
import { Modal } from "react-native";
import { Appbar, Button, Dialog, Surface, TextInput } from "react-native-paper";
import {
  UpdatePageMutation,
  UpdatePageMutationVariables,
} from "../__generated__/graphql";
import { UPDATE_PAGE_INFO } from "../graphql/graphql";

export default function EditInfoBottomSheet({ item, visible, onDismiss }) {
  const [updatePage] = useMutation<
    UpdatePageMutation,
    UpdatePageMutationVariables
  >(UPDATE_PAGE_INFO);
  const [titleText, setTitleText] = useState(item?.title ?? "");
  const [authorText, setAuthorText] = useState(item?.author ?? "");

  const [descriptionText, setDescriptionText] = useState(
    item?.description ?? ""
  );

  return (
    <Modal
      onRequestClose={onDismiss}
      presentationStyle="overFullScreen"
      visible={visible}
    >
      <Appbar.Header statusBarHeight={0} mode="small" elevated={false}>
        <Appbar.Action icon="close" onPress={onDismiss} />
        <Appbar.Content title="Edit Info" />
        <Button
          onPress={() => {
            updatePage({
              variables: {
                input: {
                  pageId: item.id,
                  description: descriptionText,
                  byline: authorText,
                  title: titleText,
                },
              },
            });
            onDismiss();
          }}
        >
          Save
        </Button>
      </Appbar.Header>
      <Surface style={{ flex: 1, paddingVertical: 24 }}>
        <Dialog.Content style={{ gap: 16 }}>
          <TextInput
            value={titleText}
            label="Title"
            mode="outlined"
            onChangeText={setTitleText}
          />
          <TextInput
            value={authorText}
            label="Author"
            mode="outlined"
            onChangeText={setAuthorText}
          />
          <TextInput
            value={descriptionText}
            label="Description"
            multiline
            mode="outlined"
            onChangeText={setDescriptionText}
            numberOfLines={4}
          />
        </Dialog.Content>
      </Surface>
    </Modal>
  );
}
