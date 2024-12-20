import React, { useState } from "react";
import { Image, ScrollView, Text, View, Alert } from "react-native";
import { Link, Redirect, router } from "expo-router";
import Modal from "react-native-modal";
import axios from "axios";
import { useStore } from "@/store/index";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";

const SignUp = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { setEmail } = useStore();

  const handleSignUp = async () => {
    console.log("Sign up with:", form);

    // Validate input fields
    const { name, email, password } = form;
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://192.168.0.3:5000/sign_up", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        console.log("User signed up successfully:", response.data);
        setEmail(email);
        setShowSuccessModal(true);
      }
    } catch (error) {
      if (error.response) {
        console.error("Sign up error:", error.response.data.error);
        Alert.alert(
          "Sign Up Failed",
          error.response.data.error ||
            "Unable to create account. Please try again."
        );
      } else {
        console.error("Unexpected error:", error);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ position: "relative", width: "100%", height: 250 }}>
          <Image
            source={images.loginImg}
            style={{ width: "100%", height: 250 }}
          />
          <Text
            style={{
              fontSize: 24,
              color: "white",
              fontWeight: "600",
              position: "absolute",
              bottom: 20,
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
              left: 20,
            }}
          >
            Create Your Account
          </Text>
        </View>
        <View style={{ padding: 20 }}>
          <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign Up"
            onPress={handleSignUp}
            style={{ marginTop: 24 }}
          />
          <Link
            href="/sign-in"
            style={{
              fontSize: 18,
              textAlign: "center",
              color: "#666",
              marginTop: 40,
            }}
          >
            Already have an account?{" "}
            <Text style={{ color: "#e2d3fe" }}>Log In</Text>
          </Link>
        </View>
        <Modal
          isVisible={showSuccessModal}
          onBackdropPress={() => setShowSuccessModal(false)}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 28,
              borderRadius: 16,
              minHeight: 300,
            }}
          >
            <Image
              source={images.check}
              style={{
                width: 110,
                height: 110,
                alignSelf: "center",
                marginVertical: 20,
              }}
            />
            <Text
              style={{ fontSize: 28, fontWeight: "bold", textAlign: "center" }}
            >
              Signed Up
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#666",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              You have successfully created your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/(root)/(tabs)/home");
              }}
              style={{ marginTop: 20 }}
            />
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
