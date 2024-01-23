
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';

export default function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const [categories, setCategories] = useState(['Work', 'Personal', 'Shopping']);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const addTask = () => {
    if (task.trim() !== '' && selectedCategory !== null) {
      setTasks([...tasks, { id: Date.now().toString(), text: task, category: selectedCategory }]);
      setTask('');
      setSelectedCategory(null);
      setSelectedDate(new Date());
    }
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleTextInputSubmit = () => {
    addTask();
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((t) => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const showDatePickerModal = (taskId) => {
    setShowDatePicker(true);
    setSelectedTaskId(taskId);
  };

  const hideDatePickerModal = () => {
    setShowDatePicker(false);
    setSelectedTaskId(null);
  }

  const handleDateChange = (event, date) => {
    hideDatePickerModal();

    if (date) {
      setTasks(
        tasks.map((t) =>
          t.id === selectedTaskId ? { ...t, dueDate: date } : t
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What have to do today</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          onChangeText={(text) => setTask(text)}
          value={task}
          onSubmitEditing={handleTextInputSubmit}
        />
        <Button title="Add" onPress={addTask} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Select Category:</Text>
        <FlatList 
          data={categories}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryItem, selectedCategory === item && styles.selectedCategory]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.taskItem, item.completed && styles.completedTask]}
            onPress={() => toggleTaskCompletion(item.id)}
            onLongPress={() => showDatePickerModal(item.id)}
          >
            <View style={styles.taskInfo}>
              <Text style={styles.taskText}>{item.text}</Text>
              <Text style={styles.taskCategory}>{item.category}</Text>
              {item.dueDate && (
                <Text style={styles.taskDueDate}>
                  Due on: {item.dueDate.toDateString()}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => removeTask(item.id)}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {showDatePicker && !Platform.OS === 'web' ? (
        <Modal transparent animationType="slide">
          <View style={styles.datePickerContainer}>
            {Platform.OS === 'web' ? (
              // Render a simple TextInput for the web platform
              <TextInput
                placeholder="Select due date"
                value={selectedDate.toDateString()} // You might need to format the date accordingly
                editable={false}
              />
            ) : (
              // Render DateTimePicker for non-web platforms
              <DateTimePicker
                value={selectedDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
            <Button title="Cancel" onPress={hideDatePickerModal} />
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header : {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  categoryContainer: {
    marginBotton: 16,
  },
  categoryLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  categoryItem: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 3,
  },
  completedTask: {
    backgroundColor: '#e0e0e0',
  },
  taskInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskCategory: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 4,
  },
  taskDueDate: {
    fontSize: 12,
    color: 'gray',
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  displayText: {
    marginTop: 20,
    fontSize: 16,
  }
});
