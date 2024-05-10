import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { View } from "react-native";
import { Button, Chip, Dialog, Portal, useTheme } from "react-native-paper";
import {
  ArticleFieldsFragment,
  GetLabelsQuery,
  LabelFieldsFragment,
  SearchItem,
  SetLabelsMutation,
  SetLabelsMutationVariables,
} from "../__generated__/graphql";
import { GET_LABELS, SET_LABELS } from "../graphql/graphql";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  item:
    | SearchItem
    | (ArticleFieldsFragment & { labels: LabelFieldsFragment[] });
};

export default function UpdateLabelDialog({ item, visible, onDismiss }: Props) {
  const theme = useTheme();

  const { data } = useQuery<GetLabelsQuery>(GET_LABELS);

  const [setLabels] = useMutation<
    SetLabelsMutation,
    SetLabelsMutationVariables
  >(SET_LABELS);

  const [selectedLabelIds, setSelectedLabelIds] = useState(
    (item ?? { labels: [] }).labels.map((lbl) => lbl.id)
  );

  const handleToggleLable = ({ id }) => {
    if (selectedLabelIds.includes(id)) {
      setSelectedLabelIds((prev) => prev.filter((lblId) => lblId !== id));
    } else {
      setSelectedLabelIds((prev) => [...prev, id]);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Labels</Dialog.Title>
        <Dialog.Content>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {(data.labels.__typename === "LabelsSuccess"
              ? data.labels.labels
              : []
            ).map((lbl) => (
              <Chip
                key={lbl.id}
                selected={selectedLabelIds.includes(lbl.id)}
                mode={selectedLabelIds.includes(lbl.id) ? "flat" : "outlined"}
                onPress={() => {
                  handleToggleLable(lbl);
                }}
                style={{
                  backgroundColor: selectedLabelIds.includes(lbl.id)
                    ? theme.colors.secondaryContainer
                    : "transparent",
                }}
              >
                {lbl.name}
              </Chip>
            ))}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            onPress={() => {
              setLabels({
                variables: {
                  input: {
                    pageId: item.id,
                    labelIds: selectedLabelIds,
                  },
                },
              });
              onDismiss();
            }}
          >
            Update
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
