import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

// Assuming ButtonProps is defined in your types file
import { ButtonProps } from "@/types/type";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]): ViewStyle => {
  switch (variant) {
    case "secondary":
      return { backgroundColor: "#6B7280" };
    case "danger":
      return { backgroundColor: "#EF4444" };
    case "success":
      return { backgroundColor: "#10B981" };
    case "outline":
      return {
        backgroundColor: "transparent",
        borderColor: "#D1D5DB",
        borderWidth: 0.5,
      };
    default:
      return { backgroundColor: "#9334ea" };
  }
};

const getTextVariantStyle = (
  variant: ButtonProps["textVariant"]
): TextStyle => {
  switch (variant) {
    case "primary":
      return { color: "black" };
    case "secondary":
      return { color: "#F3F4F6" };
    case "danger":
      return { color: "#FEE2E2" };
    case "success":
      return { color: "#D1FAE5" };
    default:
      return { color: "white" };
  }
};

const CustomButton: React.FC<ButtonProps> = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, getBgVariantStyle(bgVariant), style]}
      {...props}
    >
      {IconLeft && <IconLeft />}
      <Text style={[styles.text, getTextVariantStyle(textVariant)]}>
        {title}
      </Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 9999,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e2d3fe",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomButton;
