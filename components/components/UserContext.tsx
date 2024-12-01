import React, { Dispatch, SetStateAction, createContext, useState, useEffect } from "react";


interface Medication {
  id: string;
  name: string;
  dose: string;
  doseUnit: string;
  frequency: number;
  period: number;
  periodUnit: string;
  startDate: string;  
  pills: number;
  type: 'pill' | 'liquid' | 'topical';
  details: string;
}

interface UserContextType {
  user: { id: string, name: string } | null;
  setUser: Dispatch<SetStateAction<{ id: string, name: string } | null>>;
  medications: Medication[];
  setMedications: Dispatch<SetStateAction<Medication[]>>;
  isLoading: boolean;
  isError: boolean;
}

const defaultUserContext: UserContextType = {
  user: null, // Default user is null until set
  setUser: () => {},
  medications: [],
  setMedications: () => {},
  isLoading: false,
  isError: false,
};

const UserContext = createContext<UserContextType>(defaultUserContext);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ id: string, name: string } | null>(null); 
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const fetchMedications = async () => {
        setIsLoading(true);
        setIsError(false);

        try {
          const response = await fetch(`https://gw.interop.community/andyjiangsandboxtest/open/MedicationDispense/?patient=${user.id}`);
          
          if (!response.ok) {
            throw new Error("Failed to fetch medications");
          }

          const data = await response.json();

          if (!data.entry || data.entry.length === 0) {
            console.log("No medications found in response.");
            return;
          }

          const medicationsData: Medication[] = data.entry.map((entry: any) => {
            const medication = entry.resource.medicationCodeableConcept?.text || "No Name";
            const dosageInstruction = entry.resource.dosageInstruction?.[0];  
            const quantity = entry.resource.quantity?.value || 0;

            const dose = dosageInstruction?.doseQuantity?.value || 'N/A';
            const doseUnit = dosageInstruction?.doseQuantity?.unit || 'tablet';
            const frequency = dosageInstruction?.timing?.repeat?.frequency || 1;  
            const period = dosageInstruction?.timing?.repeat?.period || 1; 
            const periodUnit = dosageInstruction?.timing?.repeat?.periodUnits || 'd'; 
            const startDate = dosageInstruction?.timing?.repeat?.boundsPeriod?.start || ""; 

            return {
              id: entry.resource.id,
              name: medication,
              dose: dose.toString(),
              doseUnit: doseUnit,
              frequency: frequency,
              period: period,
              periodUnit: periodUnit,
              startDate: startDate,
              pills: quantity,
              type: 'pill', 
              details: "No details provided", 
            };
          }) || [];

          setMedications(medicationsData);
        } catch (error) {
          setIsError(true);
          console.error('Error fetching medications:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMedications();
    }
  }, [user]); 

  return (
    <UserContext.Provider value={{ user, setUser, medications, setMedications, isLoading, isError }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
