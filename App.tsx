import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const validateForm = () => {
    if (
      dishName.trim() === '' ||
      description.trim() === '' ||
      course.trim() === '' ||
      price.trim() === ''
    ) {
      Alert.alert('Validation Error', 'All fields are required');
      return false;
    }
    if (isNaN(price)) {
      Alert.alert('Validation Error', 'Price must be a number');
      return false;
    }
    return true;
  };
  const clearFields = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setEditingId(null);
  };
  const addOrUpdateItem = () => {
    if (!validateForm()) return;
    if (editingId !== null) {
      const updatedItems = menuItems.map((item) =>
        item.id === editingId
          ? {
              ...item,
              dishName,
              description,
              course,
              price: parseFloat(price),
            }
          : item
      );
      setMenuItems(updatedItems);
      Alert.alert('Success', 'Menu item updated');
    } else {
      const newItem = {
        id: Date.now().toString(),
        dishName,
        description,
        course,
        price: parseFloat(price),
      };
      setMenuItems([...menuItems, newItem]);
      Alert.alert('Success', 'Menu item added');
    }
    clearFields();
  };
  const editItem = (item) => {
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price.toString());
    setEditingId(item.id);
  };
  const deleteItem = (id) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setMenuItems(menuItems.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.dishName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesFilter =
      courseFilter === 'All' || item.course === courseFilter;
    return matchesSearch && matchesFilter;
  });
  const totalItems = menuItems.length;
  const averagePrice =
    totalItems > 0
      ? (
          menuItems.reduce((sum, item) => sum + item.price, 0) / totalItems
        ).toFixed(2)
      : 0;
  const starterCount = menuItems.filter(
    (item) => item.course === 'Starter'
  ).length;
  const mainCount = menuItems.filter(
    (item) => item.course === 'Main Course'
  ).length;
  const dessertCount = menuItems.filter(
    (item) => item.course === 'Dessert'
  ).length;
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chef Menu Manager</Text>
      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={dishName}
        onChangeText={setDishName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Course (Starter/Main Course/Dessert)"
        value={course}
        onChangeText={setCourse}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={addOrUpdateItem}
      >
        <Text style={styles.buttonText}>
          {editingId ? 'Update Item' : 'Add Item'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Search Menu</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by dish name"
        value={searchText}
        onChangeText={setSearchText}
      />
      <View style={styles.filterContainer}>
        {['All', 'Starter', 'Main Course', 'Dessert'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              courseFilter === item && styles.activeFilter,
            ]}
            onPress={() => setCourseFilter(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          setSearchText('');
          setCourseFilter('All');
        }}
      >
        <Text style={styles.buttonText}>Clear Filter</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Menu Statistics</Text>
      <View style={styles.statsBox}>
        <Text>Total Items: {totalItems}</Text>
        <Text>Average Price: R{averagePrice}</Text>
        <Text>Starters: {starterCount}</Text>
        <Text>Main Courses: {mainCount}</Text>
        <Text>Desserts: {dessertCount}</Text>
      </View>
      <Text style={styles.sectionTitle}>Menu Items</Text>
      {filteredItems.length === 0 ? (
        <Text style={styles.emptyText}>No menu items found</Text>
      ) : (
        <FlatList
          data={filteredItems}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.dishName}
              </Text>
              <Text>{item.description}</Text>
              <Text>{item.course}</Text>
              <Text>R{item.price}</Text>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => editItem(item)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteItem(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: '#607D8B',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  filterButton: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 8,
    margin: 3,
  },
  activeFilter: {
    backgroundColor: '#90CAF9',
  },
  card: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
  },
  statsBox: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});
