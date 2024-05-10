import * as React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

const HomeFAB = ({ onPress }: { onPress: () => void }) => (
  <FAB icon="plus" style={styles.fab} onPress={onPress} />
);

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 16,
  },
});

export default HomeFAB;
