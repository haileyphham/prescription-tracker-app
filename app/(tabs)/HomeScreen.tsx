import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; // Importing the icons we need
import { UserContext } from "@/components/components/UserContext"; // Importing the UserContext

// Define the types for medication data (adjust according to the API response)
interface Medication {
  id: string;
  name: string;
  dose: string;
  pills: number;
  type: 'pill' | 'liquid' | 'topical';
  details: string;
  quantity: any;
  daysSupply: any;
  whenHandedOver: any;
}

const HomeScreen = () => {
  const { user } = useContext(UserContext);  // Correctly accessing the user context
  const [medications, setMedications] = useState<Medication[]>([]);  // State to store fetched medication data
  const [expanded, setExpanded] = useState<string | null>(null);  // Track expanded state of medication boxes
  const [isLoading, setIsLoading] = useState<boolean>(true);  // Loading state for the API call
  const [isError, setIsError] = useState<boolean>(false);  // Error state for the API call

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id)); // Toggle expanded state
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

  // Fetch medication data from API
  useEffect(() => {
    if (!user) {
      return; // If the user is not loaded yet, don't proceed with the API request
    }

    const fetchMedications = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        // Use user.id in the API request
        const response = await fetch(`https://gw.interop.community/andyjiangsandboxtest/open/MedicationDispense/?patient=${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch medications');
        }
        
        const data = await response.json(); // Assuming the response is an array of medications
        
        // Map the data to the required format if necessary
        const medicationsData = data.entry?.map((entry: any) => ({
          id: entry.resource.id,
          name: entry.resource.medicationCodeableConcept.text || 'No Name', // Adjust based on response
          dose: 'N/A', // Placeholder, adjust based on the actual response
          pills: entry.resource.quantity.value || 0, // Adjust based on the actual response
          type: 'pill', // Adjust based on actual response type
          details: 'No details provided', // Placeholder
        })) || [];

        setMedications(medicationsData);  // Update state with fetched data
      } catch (error) {
        setIsError(true);  // Set error state if the fetch fails
        console.error('Error fetching medications:', error);
      } finally {
        setIsLoading(false);  // Set loading state to false once the fetch completes
      }
    };

    fetchMedications();  // Call the fetch function when the component mounts
  }, [user]);  // Run only when `user` changes (e.g., after the user is set)

  // Display loading state or error message if there's an issue
  if (isLoading) {
    return <Text style={styles.loadingText}>Loading medications...</Text>;
  }

  if (isError) {
    return <Text style={styles.errorText}>Failed to load medications. Please try again.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <MaterialCommunityIcons name="account-circle" size={50} color="#FFFFFF" />
        <Text style={styles.profileTitle}>Welcome {user?.name || 'User'}</Text>
      </View>

      <Text style={styles.title}>Your Medication Today</Text>

      <FlatList
        data={medications}  // Use the medications fetched from the API
        renderItem={({ item }) => (
          <View style={styles.medicationBox}>
            <View style={styles.medicationHeader}>
              {/* Medication Icon based on type */}
              {getMedicationIcon(item.type)}

              {/* Medication Title, Dose, and Pill Count */}
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{item.name}</Text>
                <Text style={styles.medicationDose}>{item.dose} - {item.pills > 0 ? `${item.pills} Pills` : 'No Pills'}</Text>
              </View>

              {/* Three dots icon to expand the box */}
              <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <AntDesign name="ellipsis1" size={24} color='#FFFFFF' />
              </TouchableOpacity>
            </View>

            {/* Expandable details */}
            {expanded === item.id && (
              <View style={styles.medicationDetails}>
                <Text style={styles.medicationDetailsText}>{item.details}</Text>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
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
    marginBottom: 20,
    padding: 20,
  },
  profileTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#123d87',
    marginLeft: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
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
