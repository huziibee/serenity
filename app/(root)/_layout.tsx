import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

const Layout = () => {
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Reminder");

  useEffect(() => {
    // Function to fetch affirmation
    const fetchAffirmation = async () => {
      try {
        const response = await fetch("http://192.168.0.3:5000/affirm");
        const data = await response.json();

        // Update the affirmation and title
        setAffirmation(data.affirmations[0]?.affirmation);
        setTitle(data.affirmations[0]?.tag);

        // Show alert with updated affirmation and title
        showAlert(data.affirmations[0]?.tag, data.affirmations[0]?.affirmation);
      } catch (error) {
        console.error("Error fetching affirmation:", error);
      }
    };

    // Set up reminder interval
    const intervalId = setInterval(() => {
      fetchAffirmation();
    }, 120000); // 120000 ms = 2 mins

    // Initial fetch
    fetchAffirmation();

    return () => clearInterval(intervalId);
  }, []);

  // Function to show the alert
  const showAlert = (newTitle: string, newAffirmation: string | null) => {
    Alert.alert(
      newTitle.charAt(0).toUpperCase() + newTitle.slice(1), // Capitalize the first letter of the title
      newAffirmation || "This is your popup message!", // Show affirmation if available
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
};

export default Layout;
