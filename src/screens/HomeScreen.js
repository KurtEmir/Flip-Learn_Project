import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Dimensions } from "react-native";


const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Flip&Learn</Text>

            <Image
                source={require('../../assets/flipandlearn.png')}
                style={styles.logo}
            />

            <Text style={styles.subtitle}>
                The easiest way to learn English with Flip&Learn.
            </Text>

            <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => navigation.navigate("MainScreen")}
            >
                <Text style={styles.buttonPrimaryText}>Go</Text>
            </TouchableOpacity>
        </View>
    );
};
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
    },
    logo: {
        width: width * 0.3,
        height: width * 0.3,
        marginBottom: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#5A67D8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#5A67D8",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#718096",
        textAlign: "center",
        paddingHorizontal: 40,
        marginBottom: 30,
    },
    buttonPrimary: {
        backgroundColor: "#5A67D8",
        paddingVertical: 12,
        paddingHorizontal: 80,
        borderRadius: 8,
        marginBottom: 15,
    },
    buttonPrimaryText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default HomeScreen;
