import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Link, router } from "expo-router";
import axios from "axios";
import { useStore } from "@/store/index";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "Moe@gmail.com",
    password: "Moebee",
  });
  const { setEmail } = useStore(); // Use Zustand to update email
  const handleSignIn = async (e: React.FormEvent) => {
    console.log("Sign in pressed with:", form);
    e.preventDefault();

    const { email, password } = form;

    try {
      const response = await axios.post("http://192.168.0.3:5000/check_user", {
        email,
        password,
      });

      if (response.status === 200) {
        console.log("Login successful", response.data);
        // Show success alert
        setEmail(email);
        Alert.alert("Success", "You have signed in successfully!", [
          { text: "OK", onPress: () => router.push("/(root)/(tabs)/home") },
        ]);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data.error);
        // Show error alert
        Alert.alert(
          "Sign In Failed",
          error.response.data.error || "Invalid email or password."
        );
      } else {
        console.error("An unexpected error occurred");
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={images.signinn}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={handleSignIn}
            style={styles.signInButton}
          />

          <Link href="/sign-up" style={styles.signUpLink}>
            <Text style={styles.signUpText}>
              Don't have an account?{" "}
              <Text style={styles.signUpHighlight}>Sign Up</Text>
            </Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  welcomeText: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    bottom: 40,
    left: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  formContainer: {
    padding: 24,
    paddingTop: 32,
  },
  signInButton: {
    marginTop: 32,
  },
  signUpLink: {
    marginTop: 24,
  },
  signUpText: {
    fontSize: 16,
    textAlign: "center",
    color: "#4B5563",
  },
  signUpHighlight: {
    color: "#9334ea",
    fontWeight: "bold",
  },
});

export default SignIn;
