import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import RoundedButton from "./RoundedButton";

const initialData = [
  {
    id: 1,
    name: "Diaper",
    quantity: 1,
  },
  {
    id: 2,
    name: "Wipes",
    quantity: 1,
  },
  {
    id: 3,
    name: "Formula",
    quantity: 1,
  },
  {
    id: 4,
    name: "Baby Food",
    quantity: 2,
  },
  {
    id: 5,
    name: "Baby Clothes",
    quantity: 1,
  },
];

const ItemAdder: React.FC = () => {
  const [text, onChangeText] = useState("Diaper");
  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState(initialData);

  const onMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const onPlus = () => {
    setQuantity(quantity + 1);
  };
  const addItem = () => {
    if (text.trim() !== "") {
      const newItem = { id: Date.now(), name: text, quantity };
      setData([...data, newItem]);
      onChangeText("");
      setQuantity(1);
    }
  };

  const deleteItem = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.addContainer}>
      <Text style={styles.itemHeading}>Item Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />

      <View style={styles.countContainer}>
        <AntDesign
          name="minuscircleo"
          size={25}
          color={"black"}
          onPress={onMinus}
        />
        <Text style={styles.quantity}>{quantity}</Text>
        <AntDesign
          name="pluscircleo"
          size={25}
          color={"black"}
          onPress={onPlus}
        />
      </View>
      <RoundedButton
        title="Add Item"
        onPress={addItem}
        buttonStyle={styles.addButton}
        textStyle={styles.buttonText}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              {item.name}: {item.quantity}
            </Text>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <AntDesign name="closecircleo" size={20} color={"red"} />
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

export default ItemAdder;

const styles = StyleSheet.create({
  addContainer: {
    width: 280,
    padding: 10,
    height: 500,
    alignSelf: "center",
   
    borderRadius: 25,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    width: 200,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 5,
    borderColor: Colors.grey.light,
    borderRadius: 25,
  },
  addButton: {
    backgroundColor: Colors.green.alt,
    width: 100,
    alignSelf: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    textAlign: "center",
  },
  summaryText: {
    fontSize: 14,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 25,
    width: 220,
    alignSelf: "center",
    color: Colors.grey.dark,
  },
  symbolContainer: {
    borderRadius: 30,
  },
  symbol: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "center",
  },
  quantity: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  itemHeading: {
    fontSize: 20,
    fontFamily: "LeagueSpartan-Regular",

    marginTop: 20,
    alignSelf: "center",
  },
});
