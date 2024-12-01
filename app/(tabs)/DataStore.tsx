import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MedicationsListScreen = () => {
  const [medications, setMedications] = useState<any[]>([]); // State to store medications

  // Fetch medications from AsyncStorage when the component mounts
  useEffect(() => {
    const loadMedications = async () => {
      try {
        // Retrieve the saved medications from AsyncStorage
        const storedMedications = await AsyncStorage.getItem('medications');
        
        if (storedMedications) {
          // If medications exist, parse the JSON string into an array
          const medicationsArray = JSON.parse(storedMedications);
          setMedications(medicationsArray); // Update the state with the retrieved data
        }
      } catch (error) {
        console.error('Error loading medications from AsyncStorage:', error);
      }
    };

    loadMedications(); // Call the function to load medications
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Function to delete a medication from AsyncStorage and state
  const deleteMedication = async (medicationName: string) => {
    try {
      // Fetch the current medications from AsyncStorage
      const storedMedications = await AsyncStorage.getItem('medications');
      
      if (storedMedications) {
        // Parse the stored medications and filter out the one to be deleted
        const medicationsArray = JSON.parse(storedMedications);
        const updatedMedications = medicationsArray.filter(
          (medication: { medicationName: string }) => medication.medicationName !== medicationName
        );

        // Save the updated medications array back to AsyncStorage
        await AsyncStorage.setItem('medications', JSON.stringify(updatedMedications));

        // Update the state to remove the deleted medication
        setMedications(updatedMedications);
        
        console.log(`Medication "${medicationName}" deleted successfully!`);
      }
    } catch (error) {
      console.error('Error deleting medication from AsyncStorage:', error);
    }
  };

  const renderMedicationItem = ({ item }: { item: any }) => (
    <View style={styles.medicationItem}>
      <Text style={styles.medicationText}>Name: {item.medicationName}</Text>
      <Text style={styles.medicationText}>Start Date: {item.startDate}</Text>
      <Text style={styles.medicationText}>Type: {item.medicationType}</Text>
      <Text style={styles.medicationText}>Pills in Pack: {item.pillsInPack}</Text>
      <Text style={styles.medicationText}>Frequency: {item.frequency}</Text>
      <Text style={styles.medicationText}>Period: {item.period}</Text>
      <Text style={styles.medicationText}>Special Notes: {item.specialNotes}</Text>
      <Text style={styles.medicationText}>Time of Day: {item.takeTime}</Text>
      
      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteMedication(item.medicationName)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Medications</Text>
      
      {/* Display the list of medications */}
      <FlatList
        data={medications}
        keyExtractor={(item, index) => index.toString()} // Key should be unique for each item
        renderItem={renderMedicationItem}
      />
    </View>
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
    textAlign: 'center',
  },
  medicationItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    borderColor: '#123d87',
    borderWidth: 2,         
    elevation: 2,
  },
  medicationText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#123d87',
  },
  deleteButton: {
    backgroundColor: '#123d87', 
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MedicationsListScreen;
