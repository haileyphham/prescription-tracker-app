import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface Medication {
  id: string;
  medicationName: string;
  startDate: string;
  medicationType: 'pill' | 'liquid' | 'topical';
  pillsInPack: number;
  frequency: string;
  period: string;
  specialNotes: string;
  takeTime: string;
}

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [takenMedications, setTakenMedications] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
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

  return (
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
                {expanded === item.id && (
                  <View style={styles.medicationDetails}>
                    <Text style={styles.medicationDetailsText}>Start Date: {item.startDate}</Text>
                    <Text style={styles.medicationDetailsText}>Type: {item.medicationType}</Text>
                    <Text style={styles.medicationDetailsText}>Frequency: {item.frequency} times per day</Text>
                    <Text style={styles.medicationDetailsText}>Period: {item.period} days</Text>
                    <Text style={styles.medicationDetailsText}>Special Notes: {item.specialNotes}</Text>
                    <Text style={styles.medicationDetailsText}>Time of Day: {item.takeTime}</Text>
                  </View>
                )}
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>

      {/* Add Medication Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('./AddMedicationScreen')}
      >
        <Text style={styles.addButtonText}>Add Medication</Text>
      </TouchableOpacity>
    </View>
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
    flexGrow: 1,
    marginBottom: 60,
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
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderColor: '#123d87', 
    borderWidth: 2,
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
    fontSize: 20,
    color: '#FFFFFF',
  },
  medicationDose: {
    fontSize: 17,
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
    backgroundColor: '#123d87',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
