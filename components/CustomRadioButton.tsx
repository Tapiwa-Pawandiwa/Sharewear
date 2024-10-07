import Colors from "@/constants/Colors";
import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type customRadioProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

const CustomRadioButton: React.FC<customRadioProps> = ({
  label,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity style={styles.radioButtonContainer} onPress={onSelect}>
      <View
        style={[styles.radioButton, selected && styles.radioButtonSelected]}
      >
        {selected && (
          <MaterialIcons
            name="radio-button-checked"
            size={10}
            color={Colors.beige.alt}
          />
        )}
        {!selected && (
          <MaterialIcons
            name="radio-button-unchecked"
            size={10}
            color="black"
          />
        )}
      </View>
      <Text style={styles.radioButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomRadioButton;

const styles = StyleSheet.create({
  radioButtonText: {
    fontSize: 16,
    fontFamily: "Now-Regular",
  },
  radioButtonSelected: {
    backgroundColor: Colors.green.main,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    borderRadius: 8,
    marginHorizontal: 10
  },
  radioButton: {
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    width: 25,
  },
});
