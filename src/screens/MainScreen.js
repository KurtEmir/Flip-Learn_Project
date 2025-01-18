import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const MainScreen = ({ route }) => {
    const [fields, setFields] = useState([{ id: Date.now(), turkishWord: "", translatedWord: "" }]);
    const [modalVisible, setModalVisible] = useState(false);
    const [setName, setSetName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (route.params?.editingSet) {
            const { name, words } = route.params.editingSet;
            setSetName(name);
            setFields(words);
            setIsEditing(true);
        }
    }, [route.params]);

    const translateWord = async (index) => {
        const word = fields[index].turkishWord;

        if (!word.trim()) {
            alert("Please enter a Turkish word!");
            return;
        }

        try {
            const response = await axios.post(
                "https://api-free.deepl.com/v2/translate",
                {
                    text: [word.trim()],
                    target_lang: "EN",
                },
                {
                    headers: {
                        "Authorization": "DeepL-Auth-Key f92ec423-590f-4d13-9e5b-ffa1bf4d8a34:fx",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data && response.data.translations && response.data.translations[0].text) {
                updateField(index, { translatedWord: response.data.translations[0].text });
            } else {
                alert("Translation failed!");
            }
        } catch (error) {
            console.error("Translation error:", error);
            alert("An error occurred during translation!");
        }
    };

    const updateField = (index, updatedData) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updatedData };
        setFields(newFields);
    };

    const addField = () => {
        setFields([...fields, { id: Date.now(), turkishWord: "", translatedWord: "" }]);
    };

    const deleteField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
    };

    const saveSet = async () => {
        if (!setName.trim()) {
            alert("Please give your set a name");
            return;
        }

        const newSet = { name: setName.trim(), words: fields };
        try {
            const existingSets = JSON.parse(await AsyncStorage.getItem("wordSets")) || [];

            let updatedSets;
            if (isEditing) {
                updatedSets = existingSets.map((set) =>
                    set.name === route.params.editingSet.name ? newSet : set
                );
            } else {
                updatedSets = [...existingSets, newSet];
            }

            await AsyncStorage.setItem("wordSets", JSON.stringify(updatedSets));
            alert(isEditing ? "Set başarıyla güncellendi!" : "Set başarıyla kaydedildi!");
            setModalVisible(false);
            setFields([{ id: Date.now(), turkishWord: "", translatedWord: "" }]);
            setSetName("");
            setIsEditing(false);
        } catch (error) {
            console.error("Set kaydedilirken hata oluştu:", error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create a New Study Set</Text>

            {fields.map((field, index) => (
                <View key={field.id} style={styles.row}>
                    { }
                    <TextInput
                        style={styles.input}
                        placeholder="Please enter a Turkish Word"
                        value={field.turkishWord}
                        onChangeText={(text) => updateField(index, { turkishWord: text })}
                    />

                    { }
                    <TextInput
                        style={styles.input}
                        placeholder="English Translation"
                        value={field.translatedWord}
                        editable={false}
                    />

                    { }
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.translateButton}
                            onPress={() => translateWord(index)}
                        >
                            <Text style={styles.translateButtonText}>Translate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deleteField(index)}
                        >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addField}>
                <Text style={styles.addButtonText}>Add New Word</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate("CardScreen", { words: fields })}
            >
                <Text style={styles.startButtonText}>Learn With Cards</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.saveButtonText}>{isEditing ? "Update Set" : "Create New Set"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navigateButton}
                    onPress={() => navigation.navigate("SetScreen")}
                >
                    <Text style={styles.navigateButtonText}>My Sets</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Set's Name</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Set name"
                            value={setName}
                            onChangeText={setSetName}
                        />
                        <TouchableOpacity style={styles.modalSaveButton} onPress={saveSet}>
                            <Text style={styles.modalSaveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#F9FAFB",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#5A67D8",
        marginBottom: 20,
        textAlign: "center",
    },
    row: {
        flexDirection: "column",
        alignItems: "stretch",
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    input: {
        height: 50,
        borderColor: "#CBD5E0",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#FFFFFF",
        marginBottom: 10,
    },
    translateButton: {
        flex: 1,
        backgroundColor: "#5A67D8",
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 5,
    },
    translateButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
    deleteButton: {
        flex: 1,
        backgroundColor: "#E53E3E",
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: 5,
    },
    deleteButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
    addButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: "center",
        marginTop: 20,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    startButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: "center",
        marginTop: 20,
    },
    startButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: "#4C51BF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    navigateButton: {
        backgroundColor: "#2C5282",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    navigateButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    modalInput: {
        width: "100%",
        height: 40,
        borderColor: "#CBD5E0",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: "#FFFFFF",
    },
    modalSaveButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalSaveButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    modalCancelButton: {
        marginTop: 10,
    },
    modalCancelButtonText: {
        color: "#E53E3E",
        fontWeight: "bold",
    },
});

export default MainScreen;
