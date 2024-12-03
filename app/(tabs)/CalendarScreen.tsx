import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper'; // Add PaperProvider
import { TimePickerModal } from 'react-native-paper-dates'; // Import TimePicker modal

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#123d87', // Change the primary color to blue
    accent:  '#5986d4', 
    background: '#ffffff', // Background color for modal
    surface: '#ffffff',  // Surface color (dialog background)
    text: '#123d87', // Text color
  },
};

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [takenMedications, setTakenMedications] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null); // Track which medication is expanded
  const [time, setTime] = useState<Date | undefined>(undefined); // Time for reminder
  const [modalVisible, setModalVisible] = useState(false); // Show TimePicker Modal
  const [reminderMessage, setReminderMessage] = useState<string>(''); // Reminder feedback message
  const router = useRouter();

  useEffect(() => {
    const loadMedications = async () => {
      try {
        const storedMedications = await AsyncStorage.getItem('medications');
        if (storedMedications) {
          const medicationsArray: Medication[] = JSON.parse(storedMedications);
          setMedications(medicationsArray);

          const dates = medicationsArray.reduce<Record<string, any>>(
            (acc, med) => {
              const date = med.startDate;
              acc[date] = { marked: true, selectedColor: '#123d87' };
              return acc;
            },
            {}
          );
          setMarkedDates(dates);
        }
      } catch (error) {
        console.error('Error loading medications from AsyncStorage:', error);
      }
    };

    loadMedications();
  }, []);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const getMedicationIcon = (type: string) => {
    switch (type) {
      case 'pill':
        return <MaterialCommunityIcons name="pill" size={30} color='#FFFFFF' />;
      case 'liquid':
        return <MaterialCommunityIcons name="beaker" size={30} color='#FFFFFF' />;
      case 'topical':
        return <MaterialCommunityIcons name="lotion-plus-outline" size={30} color='#FFFFFF' />;
      default:
        return <MaterialCommunityIcons name="help-circle" size={30} color='#FFFFFF' />;
    }
  };

  const handleCheckToggle = (medicationName: string) => {
    const updatedSet = new Set(takenMedications);
    if (updatedSet.has(medicationName)) {
      updatedSet.delete(medicationName);
    } else {
      updatedSet.add(medicationName);
    }
    setTakenMedications(updatedSet);
  };

  const medicationsForSelectedDate = medications.filter((med) => med.startDate === selectedDate);

  const totalMedications = medicationsForSelectedDate.length;
  const takenProgress = (takenMedications.size * 100) / totalMedications;

  // Toggle expand/collapse for medication details
  const handleExpand = (medicationId: string) => {
    setExpanded((prev) => (prev === medicationId ? null : medicationId)); // Toggle the expanded state
  };

  // Handle "Set Reminder" action
  const handleSetReminder = (medicationName: string) => {
    setModalVisible(true); // Show TimePicker modal
    setReminderMessage(''); // Reset reminder feedback message
  };

  // Handle Time Picker confirmation
  const handleConfirmTime = (newTime: Date | undefined) => {
    if (newTime) {
      setTime(newTime); // Set the time
      setReminderMessage('Reminder confirmed!'); // Set reminder confirmation message

      // Clear reminder message after 3 seconds
      setTimeout(() => {
        setReminderMessage('');
      }, 2000); // 3 seconds

      // Set a 2-minute delay for the popup
      setTimeout(() => {
        Alert.alert("Reminder!", "Take your medicine: Promethazine 25 MG Oral Tablet");
      }, 110000); // 2 minutes (120,000 ms)
    } else {
      setReminderMessage('No time selected'); // Handle no time selection
    }
    setModalVisible(false); // Close the modal
  };

  return (
    <PaperProvider theme={theme}>  {/* Wrap your app with PaperProvider */}
      <View style={styles.container}>
        {/* Title above the calendar */}
        <Text style={styles.monthTitle}>This Month:</Text>

        {/* Calendar */}
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
          style={styles.calendar}
          theme={{
            arrowColor: '#123d87',
            todayTextColor: '#123d87',
            monthTextColor: '#123d87',
            dayTextColor: '#123d87',
            textSectionTitleColor: '#123d87',
            selectedDayBackgroundColor: '#123d87',
            selectedDayTextColor: '#ffffff',
            todayBackgroundColor: '#c1d5f7',
            dotColor: '#123d87',
          }}
        />

        {/* Medication List */}
        <ScrollView contentContainerStyle={styles.medicationsContainer}>
          {selectedDate && medicationsForSelectedDate.length > 0 && (
            <Text style={styles.selectedDate}>Medications for {selectedDate}</Text>
          )}
          <FlatList
            data={medicationsForSelectedDate}
            renderItem={({ item }) => {
              const isChecked = takenMedications.has(item.medicationName);
              return (
                <View style={styles.medicationBox}>
                  <View style={styles.medicationHeader}>
                    {getMedicationIcon(item.medicationType)}
                    <View style={styles.medicationInfo}>
                      <Text style={styles.medicationName}>{item.medicationName}</Text>
                      <Text style={styles.medicationDose}>{item.pillsInPack} Pills - {item.frequency}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleCheckToggle(item.medicationName)}>
                      <Ionicons
                        name={isChecked ? "checkmark-circle" : "checkmark-circle-outline"}
                        size={30}
                        color={isChecked ? '#123d87' : '#DDD'}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* Toggle medication details */}
                  <TouchableOpacity onPress={() => handleExpand(item.id)}>
                    <Text style={styles.toggleText}>{expanded === item.id ? 'Hide Details' : 'Show Details'}</Text>
                  </TouchableOpacity>
                  {expanded === item.id && (
                    <View style={styles.medicationDetails}>
                      <Text style={styles.medicationDetailsText}>Start Date: {item.startDate}</Text>
                      <Text style={styles.medicationDetailsText}>Type: {item.medicationType}</Text>
                      <Text style={styles.medicationDetailsText}>Frequency: {item.frequency} times per day</Text>
                      <Text style={styles.medicationDetailsText}>Period: {item.period} days</Text>
                      <Text style={styles.medicationDetailsText}>Special Notes: {item.specialNotes}</Text>
                      <Text style={styles.medicationDetailsText}>Time of Day: {item.takeTime}</Text>

                      {/* Add reminder button */}
                      <TouchableOpacity style={styles.reminderButton} onPress={() => handleSetReminder(item.medicationName)}>
                        <Text style={styles.reminderButtonText}>Set Reminder</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>

        {/* Reminder feedback message */}
        {reminderMessage && <Text style={styles.reminderFeedback}>{reminderMessage}</Text>}

        {/* Add Medication Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('./AddMedicationScreen')}
        >
          <Text style={styles.addButtonText}>Add Medication</Text>
        </TouchableOpacity>

        {/* Time Picker Modal */}
        <TimePickerModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onConfirm={handleConfirmTime} // Handle confirmation directly here
          mode="time"
          label="Select Reminder Time"
          saveLabel="Confirm" // Optional: you can customize the label
          cancelLabel="Cancel" // Optional: you can customize the cancel label
          locale="en" // Optional: for locale-based time formatting
          theme={theme} 
          style={styles.timePickerModal} // Custom styles for the modal
        />
      </View>
    </PaperProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf4ff',
    padding: 16,
  },
  monthTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#123d87',
    marginBottom: 10,
    padding: 20,
  },
  calendar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 30,
    height: 450,
    padding: 30,
    borderColor: '#123d87',
    borderWidth: 2,
  },
  medicationsContainer: {
    marginBottom: 100,
  },
  medicationBox: {
    backgroundColor: '#5986d4',
    padding: 16,
    marginVertical: 10,
    borderRadius: 15,
    marginBottom: 10,
    borderColor: '#123d87',
    borderWidth: 2,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  medicationName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  medicationDose: {
    fontSize: 16,
    color: '#ddd',
  },
  toggleText: {
    color: '#ddd',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  medicationDetails: {
    marginTop: 10,
  },
  medicationDetailsText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 4,
  },
  reminderButton: {
    backgroundColor: '#c1d5f7',
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    borderColor: '#123d87',
    borderWidth: 2,
  },
  reminderButtonText: {
    color: '#123d87',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reminderFeedback: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#123d87',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#123d87',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CalendarScreen;
