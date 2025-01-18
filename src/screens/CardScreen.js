import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";

const CardScreen = ({ route }) => {
    const { words } = route.params;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const flipAnimation = useRef(new Animated.Value(0)).current;

    const currentWord = words[currentIndex];

    const handleFlip = () => {
        Animated.timing(flipAnimation, {
            toValue: isFlipped ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsFlipped(!isFlipped);
        });
    };

    const handleNextCard = () => {
        setIsFlipped(false);
        flipAnimation.setValue(0);
        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            alert("Successfully Completed!");
        }
    };

    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["180deg", "360deg"],
    });

    const frontOpacity = flipAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
    });

    const backOpacity = flipAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <Animated.View
                    style={[
                        styles.card,
                        {
                            transform: [{ rotateY: frontInterpolate }],
                            opacity: frontOpacity,
                            backgroundColor: "#5A67D8",
                        },
                    ]}
                >
                    <Text style={styles.cardText}>{currentWord.translatedWord}</Text>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.card,
                        styles.cardBack,
                        {
                            transform: [{ rotateY: backInterpolate }],
                            opacity: backOpacity,
                            backgroundColor: "#5A67D8",
                        },
                    ]}
                >
                    <Text style={styles.cardText}>{currentWord.turkishWord}</Text>
                </Animated.View>
            </View>

            <TouchableOpacity style={styles.flipButton} onPress={handleFlip}>
                <Text style={styles.flipButtonText}>Flip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={handleNextCard}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
    },
    cardContainer: {
        width: "40%",
        height: "50%",
        marginBottom: 20,
        position: "relative",
    },
    card: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        backfaceVisibility: "hidden",
        borderRadius: 10,
    },
    cardBack: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    cardText: {
        fontSize: 50,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
    },
    flipButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
    },
    flipButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    nextButton: {
        backgroundColor: "#2C5282",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    nextButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
});

export default CardScreen;
