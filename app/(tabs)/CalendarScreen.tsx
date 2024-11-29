import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

// Sample medication data, each associated with a specific date
const medications = [
  {
    id: '1',
    name: 'Aspirin',
    dose: '100mg',
    pills: 30,
    type: 'pill',
    details: 'Take one tablet with food every 4-6 hours as needed for pain.',
    date: '2024-11-13',
  },
  {
    id: '2',
    name: 'Ibuprofen',
    dose: '200mg',
    pills: 20,
    type: 'pill',
    details: 'Take one tablet every 4-6 hours for pain relief. Do not exceed 6 tablets in 24 hours.',
    date: '2024-11-14',
  },
  {
    id: '3',
    name: 'Liquid Paracetamol',
    dose: '150mg',
    pills: 0,
    type: 'liquid',
    details: 'Take 15ml every 4-6 hours for fever or pain relief.',
    date: '2024-11-14',
  },
  {
    id: '4',
    name: 'Topical Cream',
    dose: '50mg',
    pills: 0,
    type: 'topical',
    details: 'Apply a thin layer to the affected area twice daily.',
    date: '2024-11-15',
  },
];

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  // Function to return the correct icon based on medication type
  const getMedicationIcon = (type: string) => {
    switch (type) {
      case 'pill':
        return <MaterialCommunityIcons name="pill" size={24} color="#FFFFFF" />;
      case 'liquid':
        return <MaterialCommunityIcons name="beaker" size={24} color="#FFFFFF" />;
      case 'topical':
        return <MaterialCommunityIcons name="lotion-plus-outline" size={24} color="#FFFFFF" />;
      default:
        return <MaterialCommunityIcons name="help-circle" size={24} color="#FFFFFF" />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  // Get a list of medications for the selected date
  const medicationsForSelectedDate = medications.filter((med) => med.date === selectedDate);

  // Mark the dates that have scheduled medications
  const markedDates = medications.reduce<Record<string, { marked: boolean, selectedColor: string }>>(
    (acc, med) => {
      acc[med.date] = { marked: true, selectedColor: '#123d87' }; // Blue for marked dates
      return acc;
    },
    {} // Initial empty object
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medication Calendar</Text>
      
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        style={styles.calendar}
        theme={{
          arrowColor: '#123d87', // Set the arrows color to green
          todayTextColor: '#123d87', // Highlight today's date in green
          monthTextColor: '#123d87', // Set the month text to green
          dayTextColor: '#123d87', // Set the day text to blue
          textSectionTitleColor: '#123d87', // Set the section title color to green
          selectedDayBackgroundColor: '#123d87', // Set the selected day background to green
          selectedDayTextColor: '#ffffff', // Set the selected day text to white
          todayBackgroundColor: '#c1d5f7', // Set the background color for today's date
          dotColor: '#123d87',
        }}
      />
      
      <ScrollView contentContainerStyle={styles.medicationsContainer}>
        {selectedDate && medicationsForSelectedDate.length > 0 && (
          <>
            <Text style={styles.selectedDate}>Medications for {selectedDate}</Text>
            <FlatList
              data={medicationsForSelectedDate}
              renderItem={({ item }) => (
                <View style={styles.medicationBox}>
                  <View style={styles.medicationHeader}>
                    {getMedicationIcon(item.type)}
                    <View style={styles.medicationInfo}>
                      <Text style={styles.medicationName}>{item.name}</Text>
                      <Text style={styles.medicationDose}>{item.dose} - {item.pills > 0 ? `${item.pills} Pills` : 'No Pills'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                      <AntDesign name="ellipsis1" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  {expanded === item.id && (
                    <View style={styles.medicationDetails}>
                      <Text style={styles.medicationDetailsText}>{item.details}</Text>
                    </View>
                  )}
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Medication</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#c1d5f7',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#123d87',
    marginBottom: 20,
    padding: 20,
  },
  calendar: {
    backgroundColor: "#FFFFFF" , // Match calendar background to the page background color
    borderRadius: 18,
    marginBottom: 20,
    height: 450, // Increase the height of the calendar
    width: 'auto',
    padding: 30,
    

  },
  medicationsContainer: {
    flexGrow: 1,  // Allow scrolling content inside the container
    marginBottom: 70,  // Ensure there's space for the Add Medication button
  },
  selectedDate: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#123d87',
    padding: 20,
  },
  medicationBox: {
    backgroundColor: '#5986d4',
    padding: 20,
    marginBottom: 15,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medicationInfo: {
    flex: 1,
    marginLeft: 10,
  },
  medicationName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  medicationDose: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  medicationDetails: {
    marginTop: 10,
    padding: 10,
    borderRadius: 18,
  },
  medicationDetailsText: {
    color: '#FFFFFF',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -90 }], // Center the button horizontally
    backgroundColor: '#123d87',
    padding: 15,
    borderRadius: 18,
    width: 180, // Set a fixed width for the button
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
