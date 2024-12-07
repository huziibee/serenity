import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";

interface Message {
  id: number;
  text: string;
  sender: "self" | "other";
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey! 👋 How are you feeling today?", sender: "other" },
    { id: 2, text: "I'm here to listen and support you.", sender: "other" },
  ]);

  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: input,
        sender: "self",
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");

      try {
        const response = await fetch("http://192.168.0.3:5000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ message: input }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const botMessage = {
          id: messages.length + 2,
          text: data.response,
          sender: "other",
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = {
          id: messages.length + 2,
          text: "I'm having trouble connecting. Could you try again?",
          sender: "other",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Supportive Chat</Text>
        <Text style={styles.subtitle}>
          Your personal mental wellness companion
        </Text>
      </View>

      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === "self"
                ? styles.selfBubble
                : styles.otherBubble,
            ]}
          >
            <Markdown
              style={
                message.sender === "self"
                  ? styles.selfMessageText
                  : styles.otherMessageText
              }
            >
              {message.text}
            </Markdown>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Share your thoughts..."
            placeholderTextColor="#666"
            style={styles.input}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Ionicons
              name="send"
              size={24}
              color="white"
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4a154b",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    marginVertical: 4,
    maxWidth: "80%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  selfBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#8b5cf6",
    marginLeft: "20%",
  },
  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    marginRight: "20%",
  },
  selfMessageText: {
    body: {
      color: "white",
      fontSize: 16,
    },
    link: {
      color: "#e9d5ff",
    },
    heading1: {
      color: "white",
    },
    heading2: {
      color: "white",
    },
  },
  otherMessageText: {
    body: {
      color: "#4a4a4a",
      fontSize: 16,
    },
    link: {
      color: "#8b5cf6",
    },
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f8f0ff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    color: "#2d3748",
    marginRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    backgroundColor: "#8b5cf6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  sendIcon: {
    marginLeft: 2,
  },
});

export default Chat;
