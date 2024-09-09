import { View, Pressable, Text, StyleSheet } from "react-native";
import { Tables } from "@/app/database.types";

type Item = Tables<'item'>;


// Define the props for the ItemComponent
interface ItemProps {
  item: Item;
  isSelected: boolean;
  onSelect: (item: Item) => void;
  status: 'AVAILABLE' | 'PENDING' | 'COMPLETE' | 'FAILED' | 'UNAVAILABLE' | null; // Add the status prop
  userRole: 'donor' | 'beneficiary'; // New prop to differentiate user roles

}

const Item: React.FC<ItemProps> = ({
  item,
  isSelected,
  onSelect,
  userRole,// New prop to differentiate user roles
  status,

}) => {

  const itemStyle = [
    styles.item,
    isSelected ? styles.selected : null,
    item.status === "PENDING" ? styles.pending : null,
    item.status === "COMPLETE" ? styles.complete : null,
  ];


  const isSelectable = () => {
    if (userRole === 'donor') {
      // Donor can only select if the item is 'AVAILABLE'
      return item.status === 'AVAILABLE';
    } else if (userRole === 'beneficiary') {
      // Beneficiary can select if item is 'PENDING' or 'COMPLETE'
      return item.status === 'PENDING' || item.status === 'COMPLETE';
    }
    return false;
  };

  return (
    <Pressable
      onPress={() => isSelectable() && onSelect(item)} // Call onSelect only if the item is selectable
      style={itemStyle}
      disabled={!isSelectable()} // Disable Pressable if item isn't selectable
    >
      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxText}>{isSelected ? "✓" : "○"}</Text>
      </View>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.quantityText}>{item.quantity}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 5,
    flexDirection: "row",
  },
  itemText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
    verticalAlign: "middle",
    marginTop: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    marginTop: 5,
    justifyContent: "flex-end",
  },
  selected: {
    backgroundColor: "#d3f8d3",
  },
  checkboxContainer: {
    width: 27,
    height: 27,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  checkboxText: {
    fontSize: 18,
    lineHeight: 18,
    marginTop: 2,
  },
  pending: {
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
  },
  complete: {
    display: 'none', // Hide the item if it's complete
  },
});

export default Item;
