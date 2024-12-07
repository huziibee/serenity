import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Link, Redirect } from "expo-router";
import Modal from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";

const SignUp = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignUp = () => {
    // Implement sign up logic here
    console.log("Sign up with:", form);
    setShowSuccessModal(true);
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
          {/* <OAuth /> */}
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
            <Text style={{ color: "#c8bffe" }}>Log In</Text>
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
                <Redirect href="/(root)/(tabs)/home" />;
                // Navigate to home screen
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
