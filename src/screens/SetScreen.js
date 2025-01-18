import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SetScreen = () => {
    const [sets, setSets] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchSets = async () => {
            try {
                const storedSets = JSON.parse(await AsyncStorage.getItem("wordSets")) || [];
                setSets(storedSets);
            } catch (error) {
                console.error("An error occured", error);
            }
        };

        fetchSets();
    }, []);

    const deleteSet = async (setIndex) => {
        try {
            const updatedSets = sets.filter((_, index) => index !== setIndex);

            setSets(updatedSets);

            await AsyncStorage.setItem("wordSets", JSON.stringify(updatedSets));

            console.log("Set successfully deleted!");
        } catch (error) {
            console.error("An error occured", error);
        }
    };


    const editSet = (set) => {
        navigation.navigate("MainScreen", { editingSet: set });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Saved Sets</Text>
            <FlatList
                data={sets}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.setItem}>
                        <TouchableOpacity
                            style={styles.setName}
                            onPress={() => navigation.navigate("CardScreen", { words: item.words })}
                        >
                            <Text style={styles.setItemText}>{item.name}</Text>
                        </TouchableOpacity>
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.editButton} onPress={() => editSet(item)}>
                                <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteSet(index)}
                            >
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F9FAFB",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2C5282",
        marginBottom: 20,
        textAlign: "center",
    },
    setItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2C5282",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    setName: {
        flex: 1,
    },
    setItemText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#f7f9fa",
    },
    actions: {
        flexDirection: "row",
    },
    editButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginRight: 10,
    },
    editButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#E53E3E",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default SetScreen;
