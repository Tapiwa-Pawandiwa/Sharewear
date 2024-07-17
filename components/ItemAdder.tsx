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
import { useFormContext } from "@/app/providers/Form";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import { supabase } from "@/lib/supabase";
import {SelectList} from 'react-native-dropdown-select-list'

const ItemAdder: React.FC = () => {
  const [text, onChangeText] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { formData, updateFormData, removeItem, addItem } = useFormContext();

  interface Category {
    id: string;
    name: string;
  }
  

useEffect(() => {
  console.log(formData, 'formData added item')
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('category').select('*');
      if (error) {
        throw error;
      }
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  fetchCategories();
}
  ,[])


  const onMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const onPlus = () => {
    setQuantity(quantity + 1);
  };

  const handleAddItem = () => {
    if (text.trim() !== "") {
      const newItem = { id: Date.now(), name: text, quantity, category_ID: selectedCategory?.id  };
      addItem(newItem);
      console.log(formData.items, 'formData added item')
      console.log(selectedCategory, 'selectedCategory')
      console.log(formData,'form data' )
      setQuantity(1);
    }
  
  };

  const handleDeleteItem = (id: number) => {
    removeItem(id);
  };

  return (
    <View style={styles.addContainer}>
      <Text style={styles.itemHeading}>Item Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Something you need..."
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
      <SelectList
      setSelected={(val: string) => {
      const selected = categories.find((category) => category.id === val);
      if (selected) {
        setSelectedCategory(selected);
        }
  }}        data={categories.map((category) => ({
          key: category.id,
          value: category.name,
        }))}       
         placeholder="Select Category"
        boxStyles={{marginTop: 10}}
      
      />
      <RoundedButton
        title="Add Item"
        onPress={handleAddItem}
        buttonStyle={styles.addButton}
        textStyle={styles.buttonText}
      />
      <FlatList
        data={formData.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              {item.name}: {item.quantity}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
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
    color: "black",
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
