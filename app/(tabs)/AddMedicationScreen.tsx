import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const AddMedicationScreen = () => {
  const [medicationName, setMedicationName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [medicationType, setMedicationType] = useState('');
  const [pillsInPack, setPillsInPack] = useState(30);
  const [specialNotes, setSpecialNotes] = useState('');
  const [takeTime, setTakeTime] = useState<'day' | 'night' | ''>('');

  const handleAddMedication = () => {
    console.log('Medication Added:', {
      medicationName,
      startDate,
      medicationType,
      pillsInPack,
      specialNotes,
      takeTime,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Medication</Text>
      
      {/* Medication Name */}
      <TextInput
        style={styles.input}
        placeholder="Medication Name"
        value={medicationName}
        onChangeText={setMedicationName}
      />
      
      {/* Start Date */}
      <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      
      {/* Medication Type Selection */}
      <Text style={styles.label}>Medication Type</Text>
      <View style={styles.typeButtons}>
        {['pill', 'liquid', 'topical'].map((type) => {
          let icon;
          let label;

          // Set icon and label based on medication type
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
    </ScrollView>
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
  input: {
    height: 45,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 23,
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 20,
    color: '#123d87',
    fontSize: 19,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#123d87',
    marginBottom: 8,
    paddingLeft: 20,
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
  },
  selectedTypeButton: {
    backgroundColor: '#123d87', // Blue color for selected button
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
  },
  selectedTimeButton: {
    backgroundColor: '#123d87', // Blue color for selected button
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
