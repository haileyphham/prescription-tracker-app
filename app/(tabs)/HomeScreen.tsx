import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from "@/components/components/UserContext";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const HomeScreen = () => {
  const { user, isLoading, isError, medications } = useContext(UserContext);  
  const [currentMedications, setCurrentMedications] = useState<any[]>([]); 
  const [expanded, setExpanded] = useState<string | null>(null); 
  const [selectedTab, setSelectedTab] = useState<'current' | 'all'>('current');
  const [takenMedications, setTakenMedications] = useState<Set<string>>(new Set()); 

  useEffect(() => {
    const loadCurrentMedications = async () => {
      try {
        const storedMedications = await AsyncStorage.getItem('medications');
        if (storedMedications) {
          const medicationsArray = JSON.parse(storedMedications);
          setCurrentMedications(medicationsArray);
        }
      } catch (error) {
        console.error('Error loading medications from AsyncStorage:', error);
      }
    };

    loadCurrentMedications();
  }, []);


  if (isLoading) {
    return <Text style={styles.loadingText}>Loading medications...</Text>;
  }

  if (isError) {
    return <Text style={styles.errorText}>Failed to load medications. Please try again.</Text>;
  }


  const toggleExpand = (medicationName: string) => {
    setExpanded((prev) => (prev === medicationName ? null : medicationName)); 
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


  const renderMedicationItem = ({ item }: { item: any }) => {
    const isChecked = takenMedications.has(item.medicationName); 

    const handleCheckToggle = () => {
      const updatedSet = new Set(takenMedications);
      if (isChecked) {
        updatedSet.delete(item.medicationName);
      } else {
        updatedSet.add(item.medicationName); 
      }
      setTakenMedications(updatedSet);
    };

    return (
      <View style={styles.medicationBox}>
        <View style={styles.medicationHeader}>
          {getMedicationIcon(item.medicationType)} {/* Medication icon */}
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{item.medicationName}</Text>
            <Text style={styles.medicationDose}>{item.pillsInPack > 0 ? `${item.pillsInPack} Pills` : 'No Pills'}</Text>
          </View>
          {/* Checkmark button */}
          <TouchableOpacity onPress={handleCheckToggle}>
            <Ionicons
              name={isChecked ? "checkmark-circle" : "checkmark-circle-outline"}
              size={30}
              color={isChecked ? '#123d87' : '#DDD'}
            />
          </TouchableOpacity>
        </View>

        {/* Medication details */}
        {expanded === item.medicationName && (
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
  };

  
  const toggleTab = (tab: 'current' | 'all') => {
    setSelectedTab(tab);
  };

  const totalMedications = currentMedications.length;
  const takenProgress = (takenMedications.size * 100) / totalMedications;

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <MaterialCommunityIcons name="account-circle" size={50} color='#123d87' />
        <Text style={styles.profileTitle}>Welcome {user?.name || 'User'},</Text>
      </View>

      {/* Progress Intake Circular Bar (Moved above tabs) */}
      <View style={styles.progressContainer}>
        {/* Subtitle Text */}
        <Text style={styles.progressSubtitle}>Your current medication intake progress:</Text>
        <AnimatedCircularProgress
          size={120}
          width={12}
          fill={takenProgress}
          tintColor='#123d87'
          backgroundColor='#d1e3f7'
          rotation={0}
          lineCap="round"
        >
          {() => (
            <Text style={styles.progressText}>
              {takenProgress.toFixed(0)}%
            </Text>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Tab Section */}
      <View style={styles.tabSection}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'current' && styles.selectedTab]}
          onPress={() => toggleTab('current')}
        >
          <Text style={styles.tabText}>Current Medications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'all' && styles.selectedTab]}
          onPress={() => toggleTab('all')}
        >
          <Text style={styles.tabText}>All Medications</Text>
        </TouchableOpacity>
      </View>

      {/* Medication List */}
      <FlatList
        data={selectedTab === 'current' ? currentMedications : medications} 
        renderItem={renderMedicationItem}
        keyExtractor={(item) => item.medicationName} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#edf4ff',
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
    padding: 20,
  },
  profileTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#123d87',
    marginLeft: 10,
  },
  tabSection: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 50,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#d1e3f7',
    margin: 5,
    borderRadius: 15,
    borderColor: '#123d87',  
    borderWidth: 2,   
  },
  selectedTab: {
    backgroundColor: '#5986d4',
  },
  tabText: {
    fontSize: 16,
    color: '#123d87',
    fontWeight: 'bold',
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
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressSubtitle: {
    fontSize: 17,
    color: '#123d87',
    marginBottom: 50,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 24,
    color: '#123d87',
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#123d87',
    fontSize: 20,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
