import { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCart } from '../context/CartContext';

// Sample data - in real app, this would come from the food item
const sampleSideOptions = [
  { id: 'pap', name: 'Pap', price: 0, included: true },
  { id: 'chips', name: 'Chips', price: 0, included: true },
  { id: 'salad', name: 'Salad', price: 0, included: true },
  { id: 'rice', name: 'Rice', price: 15, included: false },
];

const sampleDrinkOptions = [
  { id: 'coke', name: 'Coke', price: 25, included: false },
  { id: 'fanta', name: 'Fanta', price: 25, included: false },
  { id: 'water', name: 'Water', price: 15, included: false },
];

const sampleExtras = [
  { id: 'extra-chips', name: 'Extra Chips', price: 20 },
  { id: 'extra-salad', name: 'Extra Salad', price: 25 },
  { id: 'sauce', name: 'Extra Sauce', price: 10 },
  { id: 'cheese', name: 'Extra Cheese', price: 15 },
];

const sampleIngredients = [
  'Lettuce', 'Tomato', 'Onion', 'Pickles', 'Cheese', 'Bacon', 'Mushrooms'
];

interface FoodCustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  foodItem: {
    id: string;
    name: string;
    basePrice: number;
    imageUrl?: string;
  };
}

export default function FoodCustomizationModal({ 
  visible, 
  onClose, 
  foodItem 
}: FoodCustomizationModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [extras, setExtras] = useState<{ [key: string]: number }>({});
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Calculate total price
  const calculateTotal = () => {
    let total = foodItem.basePrice;
    
    // Add extras
    Object.entries(extras).forEach(([extraId, qty]) => {
      const extra = sampleExtras.find(e => e.id === extraId);
      if (extra) total += extra.price * qty;
    });
    
    // Add drinks (if not included)
    selectedDrinks.forEach(drinkId => {
      const drink = sampleDrinkOptions.find(d => d.id === drinkId);
      if (drink && !drink.included) total += drink.price;
    });
    
    return total * quantity;
  };

  const toggleSide = (sideId: string) => {
    setSelectedSides(prev => 
      prev.includes(sideId) 
        ? prev.filter(id => id !== sideId)
        : [...prev, sideId]
    );
  };

  const toggleDrink = (drinkId: string) => {
    setSelectedDrinks(prev => 
      prev.includes(drinkId) 
        ? prev.filter(id => id !== drinkId)
        : [...prev, drinkId]
    );
  };

  const updateExtraQuantity = (extraId: string, delta: number) => {
    setExtras(prev => {
      const current = prev[extraId] || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) {
        const { [extraId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [extraId]: newQty };
    });
  };

  const toggleIngredient = (ingredient: string, type: 'remove' | 'add') => {
    if (type === 'remove') {
      setRemovedIngredients(prev => 
        prev.includes(ingredient) 
          ? prev.filter(i => i !== ingredient)
          : [...prev, ingredient]
      );
    } else {
      setAddedIngredients(prev => 
        prev.includes(ingredient) 
          ? prev.filter(i => i !== ingredient)
          : [...prev, ingredient]
      );
    }
  };

  const handleAddToCart = () => {
    if (quantity <= 0) {
      Alert.alert('Error', 'Please select at least 1 item');
      return;
    }

    const customization = {
      selectedSides,
      selectedDrinks,
      extras: Object.entries(extras).map(([id, qty]) => ({
        id,
        name: sampleExtras.find(e => e.id === id)?.name || '',
        price: sampleExtras.find(e => e.id === id)?.price || 0,
        quantity: qty,
      })),
      removedIngredients,
      addedIngredients,
      specialInstructions,
    };

    addToCart({
      foodId: foodItem.id,
      name: foodItem.name,
      basePrice: foodItem.basePrice,
      quantity,
      imageUrl: foodItem.imageUrl,
      customization,
    });

    // Reset form
    setQuantity(1);
    setSelectedSides([]);
    setSelectedDrinks([]);
    setExtras({});
    setRemovedIngredients([]);
    setAddedIngredients([]);
    setSpecialInstructions('');
    
    onClose();
    Alert.alert('Success', 'Item added to cart!');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Customize {foodItem.name}</Text>
          <TouchableOpacity onPress={handleAddToCart}>
            <Text style={styles.addText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Side Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Side Options (Select up to 2)</Text>
            {sampleSideOptions.map(side => (
              <TouchableOpacity
                key={side.id}
                style={[
                  styles.option,
                  selectedSides.includes(side.id) && styles.selectedOption
                ]}
                onPress={() => toggleSide(side.id)}
              >
                <Text style={styles.optionText}>
                  {side.name} {side.included ? '(Included)' : `(+R${side.price})`}
                </Text>
                <View style={[styles.checkbox, selectedSides.includes(side.id) && styles.checked]} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Drink Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Drink Options</Text>
            {sampleDrinkOptions.map(drink => (
              <TouchableOpacity
                key={drink.id}
                style={[
                  styles.option,
                  selectedDrinks.includes(drink.id) && styles.selectedOption
                ]}
                onPress={() => toggleDrink(drink.id)}
              >
                <Text style={styles.optionText}>
                  {drink.name} {drink.included ? '(Included)' : `(+R${drink.price})`}
                </Text>
                <View style={[styles.checkbox, selectedDrinks.includes(drink.id) && styles.checked]} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Extras */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extras</Text>
            {sampleExtras.map(extra => (
              <View key={extra.id} style={styles.extraContainer}>
                <Text style={styles.extraName}>{extra.name} (+R{extra.price})</Text>
                <View style={styles.extraControls}>
                  <TouchableOpacity
                    style={styles.extraBtn}
                    onPress={() => updateExtraQuantity(extra.id, -1)}
                  >
                    <Text style={styles.extraBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.extraQuantity}>{extras[extra.id] || 0}</Text>
                  <TouchableOpacity
                    style={styles.extraBtn}
                    onPress={() => updateExtraQuantity(extra.id, 1)}
                  >
                    <Text style={styles.extraBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.subsectionTitle}>Remove:</Text>
            {sampleIngredients.map(ingredient => (
              <TouchableOpacity
                key={ingredient}
                style={[
                  styles.option,
                  removedIngredients.includes(ingredient) && styles.selectedOption
                ]}
                onPress={() => toggleIngredient(ingredient, 'remove')}
              >
                <Text style={styles.optionText}>No {ingredient}</Text>
                <View style={[styles.checkbox, removedIngredients.includes(ingredient) && styles.checked]} />
              </TouchableOpacity>
            ))}
            
            <Text style={styles.subsectionTitle}>Add:</Text>
            {sampleIngredients.map(ingredient => (
              <TouchableOpacity
                key={ingredient}
                style={[
                  styles.option,
                  addedIngredients.includes(ingredient) && styles.selectedOption
                ]}
                onPress={() => toggleIngredient(ingredient, 'add')}
              >
                <Text style={styles.optionText}>Extra {ingredient}</Text>
                <View style={[styles.checkbox, addedIngredients.includes(ingredient) && styles.checked]} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Special Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <TextInput
              style={styles.instructionsInput}
              placeholder="Any special requests..."
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Price Summary */}
          <View style={styles.priceSection}>
            <Text style={styles.priceTitle}>Order Summary</Text>
            <Text style={styles.basePrice}>Base Price: R{foodItem.basePrice}</Text>
            <Text style={styles.totalPrice}>Total: R{calculateTotal()}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 16,
  },
  addText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  quantityBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  checked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  extraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  extraName: {
    fontSize: 14,
    color: '#333',
  },
  extraControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  extraBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  extraQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  priceSection: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginTop: 20,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  basePrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
