import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { UserContext } from "@/components/components/UserContext";
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddMedicationScreen = () => {
  const { medications } = useContext(UserContext);
  const [medicationName, setMedicationName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [medicationType, setMedicationType] = useState('');
  const [pillsInPack, setPillsInPack] = useState(30);
  const [specialNotes, setSpecialNotes] = useState('');
  const [takeTime, setTakeTime] = useState<'day' | 'night' | ''>('');
  const [frequency, setFrequency] = useState(1);
  const [period, setPeriod] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMedicationPicker, setShowMedicationPicker] = useState(false);


  const [feedbackMessage, setFeedbackMessage] = useState('');

  const onDateSelect = (date: string) => {
    setStartDate(date);
    setShowCalendar(false);
  };

  const handleMedicationSelect = (medication: string) => {
    setMedicationName(medication);
    setShowMedicationPicker(false);
  };


  const saveMedicationToStorage = async () => {
    const medicationData = {
      medicationName,
      startDate,
      medicationType,
      pillsInPack,
      specialNotes,
      takeTime,
      frequency,
      period,
    };

    try {

      const existingData = await AsyncStorage.getItem('medications');
      let medicationsArray = existingData ? JSON.parse(existingData) : [];


      medicationsArray.push(medicationData);


      await AsyncStorage.setItem('medications', JSON.stringify(medicationsArray));

      console.log('Medication saved to AsyncStorage', medicationData);
    } catch (error) {
      console.error('Error saving medication to AsyncStorage:', error);
    }
  };


  const handleAddMedication = async () => {
    await saveMedicationToStorage(); 
    setFeedbackMessage('Information updated!'); 

   
    setMedicationName('');
    setStartDate('');
    setMedicationType('');
    setPillsInPack(30);
    setSpecialNotes('');
    setTakeTime('');
    setFrequency(1);
    setPeriod(1);

    console.log('Medication Added:', {
      medicationName,
      startDate,
      medicationType,
      pillsInPack,
      specialNotes,
      takeTime,
      frequency,
      period,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Medication</Text>

      {/* Medication Name */}
      <Text style={styles.label}>Medication Name</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowMedicationPicker(true)}
      >
        <Text style={styles.dateText}>{medicationName || 'Select Medication'}</Text>
      </TouchableOpacity>

  
      {showMedicationPicker && (
        <View style={styles.medicationList}>
          <Picker
            selectedValue={medicationName}
            onValueChange={handleMedicationSelect}
            style={styles.input}
          >
            <Picker.Item label="Select Medication" value="" />
            {medications.map((med) => (
              <Picker.Item key={med.id} label={med.name} value={med.name} />
            ))}
          </Picker>
        </View>
      )}

      {/* Start Date */}
      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.input}>
        <Text style={styles.dateText}>{startDate || 'Select Start Date'}</Text>
      </TouchableOpacity>

      {/* Calendar pop-up for Start Date */}
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day: { dateString: string; }) => onDateSelect(day.dateString)}
            markedDates={{ [startDate]: { selected: true, selectedColor: '#123d87' } }}
            monthFormat={'yyyy MM'}
            firstDay={1}
          />
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowCalendar(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Medication Type Selection */}
      <Text style={styles.label}>Medication Type</Text>
      <View style={styles.typeButtons}>
        {['pill', 'liquid', 'topical'].map((type) => {
          let icon;
          let label;

          switch (type) {
            case 'pill':
              icon = <MaterialCommunityIcons name="pill" size={24} color="#FFF" />;
              label = 'Pill';
              break;
            case 'liquid':
              icon = <MaterialCommunityIcons name="beaker" size={24} color="#FFF" />;
              label = 'Liquid';
              break;
            case 'topical':
              icon = <MaterialCommunityIcons name="lotion-plus-outline" size={24} color="#FFF" />;
              label = 'Topical';
              break;
          }

          return (
            <TouchableOpacity
              key={type}
              style={[styles.typeButton, medicationType === type && styles.selectedTypeButton]}
              onPress={() => setMedicationType(type)}
            >
              {icon}
              <Text style={styles.typeButtonText}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Pills in Pack */}
      <View style={styles.pillsPackContainer}>
        <Text style={styles.label}>Pills in Pack</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of pills"
          value={String(pillsInPack)}
          keyboardType="numeric"
          onChangeText={(text) => setPillsInPack(Number(text))}
        />
      </View>

      {/* Frequency */}
      <Text style={styles.label}>Frequency</Text>
      <TextInput
        style={styles.input}
        placeholder="How often (e.g., 1 for daily, 2 for every 2 days)"
        value={String(frequency)}
        keyboardType="numeric"
        onChangeText={(text) => setFrequency(Number(text))}
      />

      {/* Period */}
      <Text style={styles.label}>Period (Days)</Text>
      <TextInput
        style={styles.input}
        placeholder="Period (e.g., 7 for weekly)"
        value={String(period)}
        keyboardType="numeric"
        onChangeText={(text) => setPeriod(Number(text))}
      />

      {/* Special Notes */}
      <Text style={styles.label}>Special Notes</Text>
      <TextInput
        style={[styles.input, styles.specialNotesInput]}
        placeholder="Any special instructions"
        value={specialNotes}
        onChangeText={setSpecialNotes}
        multiline
      />

      {/* Time of Day for Taking the Medication */}
      <Text style={styles.label}>Time of Day</Text>
      <View style={styles.timeButtons}>
        <TouchableOpacity
          style={[styles.timeButton, takeTime === 'day' && styles.selectedTimeButton]}
          onPress={() => setTakeTime('day')}
        >
          <MaterialCommunityIcons name="weather-sunny" size={24} color="#FFF" />
          <Text style={styles.timeButtonText}>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeButton, takeTime === 'night' && styles.selectedTimeButton]}
          onPress={() => setTakeTime('night')}
        >
          <FontAwesome name="moon-o" size={24} color="#FFF" />
          <Text style={styles.timeButtonText}>Night</Text>
        </TouchableOpacity>
      </View>

      {/* Add Medication Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddMedication}>
        <Text style={styles.addButtonText}>Add Medication</Text>
      </TouchableOpacity>

      {/* Feedback Message */}
      {feedbackMessage ? (
        <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#edf4ff',
    
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#123d87',
    marginBottom: 20,
    padding: 20,
  },
  input: {
    height: 45,
    marginBottom: 16,
    paddingLeft: 23,
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 25,
    color: '#123d87',
    fontSize: 19,
    borderColor: '#123d87', 
    borderWidth: 2,         
    
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#123d87',
    marginBottom: 8,
    paddingLeft: 20,
    
  },
  dateText: {
    fontSize: 16,
    color: '#123d87',
  },
  medicationList: {
    maxHeight: 150,
    marginBottom: 25,
    
  },
  feedbackMessage: {
    marginTop: 20,
    fontSize: 18,
    color: '#123d87',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    
    
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#5986d4',
    borderRadius: 18,
    marginRight: 8,
    justifyContent: 'center',
    borderColor: '#123d87',  
    borderWidth: 2,   
    
  },
  selectedTypeButton: {
    backgroundColor: '#123d87',
    
  },
  typeButtonText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
    
  },
  pillsPackContainer: {
    marginBottom: 16,
  },
  specialNotesInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  timeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#5986d4',
    padding: 12,
    borderRadius: 18,
    marginRight: 8,
    justifyContent: 'center',
    borderColor: '#123d87', 
    borderWidth: 2,   
  },
  selectedTimeButton: {
    backgroundColor: '#123d87',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#123d87',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddMedicationScreen;
