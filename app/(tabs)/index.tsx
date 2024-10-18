import { Image, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UserContext } from "@/components/UserContext";
import { Card, Text } from "@rneui/base";

function MedicationDispenseCard({
    medicationDispense,
}: {
    medicationDispense: MedicalDispenseInterface;
}) {
    return (
        <Card>
            <Card.Title>{medicationDispense.displayText}</Card.Title>
            <Card.Divider />

            <Text>Quantity:</Text>
            <Text>{JSON.stringify(medicationDispense.quantity)}</Text>
            <Text>Days Supply:</Text>
            <Text>{JSON.stringify(medicationDispense.daysSupply)}</Text>
            <Text>When Handed Over:</Text>
            <Text>{JSON.stringify(medicationDispense.whenHandedOver)}</Text>
        </Card>
    );
}

export default function HomeScreen() {
    const { data, isLoading, isError } = useMedicationDispenseData();
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            headerImage={
                <Image
                    source={require("@/assets/images/partial-react-logo.png")}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome! Version 0.0</ThemedText>
                <HelloWave />
            </ThemedView>
            {isLoading && data ? (
                <ThemedText>Loading...</ThemedText>
            ) : (
                <ThemedView style={styles.stepContainer}>
                    <ThemedText type="subtitle">API Response:</ThemedText>
                    {isError ? (
                        <ThemedText>Something went wrong</ThemedText>
                    ) : (
                        data?.map((item) => (
                            <MedicationDispenseCard
                                key={item.id}
                                medicationDispense={item}
                            />
                        ))
                    )}
                </ThemedView>
            )}
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});

interface MedicalDispenseInterface {
    id: string;
    codingSystem: string;
    code: string;
    displayText: string;
    medicationRequestId: string;
    quantity: any;
    daysSupply: any;
    whenHandedOver: any;
}
export function useMedicationDispenseData(): {
    data: MedicalDispenseInterface[] | null;
    isLoading: boolean;
    isError: boolean;
} {
    const [data, setData] = useState<MedicalDispenseInterface[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user.id) {
            console.log("user not ready yet");
            return;
        }

        const fetchMedicationDispense = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const response = await fetch(
                    `https://gw.interop.community/andyjiangsandboxtest/open/MedicationDispense/?patient=${user.id}`
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const json = await response.json();
                const _data = json.entry.map((entry: any) => {
                    const medicationDispense = entry.resource;
                    return {
                        id: medicationDispense.id,
                        codingSystem:
                            medicationDispense.medicationCodeableConcept
                                .coding[0].system,
                        code: medicationDispense.medicationCodeableConcept
                            .coding[0].code,
                        displayText:
                            medicationDispense.medicationCodeableConcept.text,
                        medicationRequestId:
                            medicationDispense.authorizingPrescription[0]
                                .reference,
                        quantity: medicationDispense.quantity,
                        daysSupply: medicationDispense.daysSupply,
                        whenHandedOver: medicationDispense.whenHandedOver,
                    } as MedicalDispenseInterface;
                });

                setData(_data);
            } catch (error) {
                console.error("There was an error:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedicationDispense();
    }, [user]);

    return { data, isLoading, isError };
}
