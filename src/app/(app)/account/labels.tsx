import { useMutation, useQuery } from "@apollo/client";
import { Stack } from "expo-router";
import { useState } from "react";
import { FlatList, TouchableHighlight, View } from "react-native";
import { Avatar, List, Surface, useTheme } from "react-native-paper";
import {
  CreateLabelMutation,
  CreateLabelMutationVariables,
  DeleteLabelMutation,
  DeleteLabelMutationVariables,
  GetLabelsQuery,
} from "../../../__generated__/graphql";
import AddLabelDialog from "../../../components/account/AddLabelDialog";
import { LABEL_FRAGMENT } from "../../../graphql/fragments";
import {
  CREATE_LABEL,
  DELETE_LABEL,
  GET_LABELS,
  LabelItem,
} from "../../../graphql/graphql";

export default function Page() {
  const theme = useTheme();
  const { data: labelData } = useQuery<GetLabelsQuery>(GET_LABELS);

  const [showAddLabelDialog, setShowAddLabelDialog] = useState(false);

  const [createLabel] = useMutation<
    CreateLabelMutation,
    CreateLabelMutationVariables
  >(CREATE_LABEL, {
    update(cache, { data: { createLabel } }) {
      if (createLabel.__typename === "CreateLabelSuccess") {
        cache.modify({
          fields: {
            labels(existingLabels = { labels: [] }) {
              const newLabelRef = cache.writeFragment({
                data: createLabel.label,
                fragment: LABEL_FRAGMENT,
              });

              return {
                ...existingLabels,
                labels: [...existingLabels.labels, newLabelRef],
              };
            },
          },
        });
      }
    },
  });

  const [deleteLabel] = useMutation<
    DeleteLabelMutation,
    DeleteLabelMutationVariables
  >(DELETE_LABEL, {
    update(cache, { data: { deleteLabel } }) {
      if (deleteLabel.__typename === "DeleteLabelSuccess") {
        cache.modify({
          fields: {
            labels(existingLabels, { readField }) {
              return {
                ...existingLabels,
                labels: existingLabels.labels.filter(
                  (lbRef) => readField("id", lbRef) !== deleteLabel.label.id
                ),
              };
            },
          },
        });
      }
    },
  });

  const renderItem = ({ item }: { item: LabelItem }) => {
    return (
      <List.Item
        style={{ paddingHorizontal: 16 }}
        title={item.name}
        left={(props) => (
          <Avatar.Text
            size={24}
            label=""
            style={{ backgroundColor: item.color }}
          />
        )}
        right={(props) =>
          !item.internal && (
            <TouchableHighlight
              onPress={() => {
                deleteLabel({ variables: { id: item.id } });
              }}
            >
              <List.Icon
                icon={"delete-outline"}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableHighlight>
          )
        }
      />
    );
  };

  return (
    <Surface style={{ flex: 1 }} mode="flat" elevation={0}>
      <Stack.Screen options={{ title: "Labels" }} />

      <FlatList
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 42,
        }}
        style={{ height: "100%" }}
        data={
          labelData?.labels?.__typename === "LabelsSuccess"
            ? labelData?.labels?.labels
            : []
        }
        ListHeaderComponent={
          <View>
            <List.Item
              style={{ paddingHorizontal: 16 }}
              title="Add label"
              titleStyle={{ color: theme.colors.primary }}
              onPress={() => {
                setShowAddLabelDialog(true);
              }}
              left={(props) => (
                <List.Icon color={theme.colors.primary} icon="plus" />
              )}
            />

            <List.Subheader>Labels</List.Subheader>
          </View>
        }
        renderItem={renderItem}
      />
      <AddLabelDialog
        visible={showAddLabelDialog}
        hideDialog={() => {
          setShowAddLabelDialog(false);
        }}
        onAdd={async (labelText, color) => {
          setShowAddLabelDialog(false);
          await createLabel({
            variables: { input: { name: labelText, color: color } },
          });
        }}
      />
    </Surface>
  );
}
