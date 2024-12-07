import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "@/store/index";
interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  gradient?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  gradient,
}) => (
  <View style={[styles.card, gradient && { backgroundColor: "#f8f0ff" }]}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const MoodButton: React.FC<{
  emoji: string;
  selected: boolean;
  onPress: () => void;
}> = ({ emoji, selected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.moodButton, selected && styles.moodButtonSelected]}
    >
      <Text style={styles.moodEmoji}>{emoji}</Text>
    </TouchableOpacity>
  );
};

const WellnessTracker: React.FC<{
  label: string;
  value: number;
  unit: string;
  maxValue: number;
  onIncrement: () => void;
  onDecrement: () => void;
}> = ({ label, value, unit, maxValue, onIncrement, onDecrement }) => {
  const handlePress = (action: "increment" | "decrement") => {
    if (action === "increment") {
      Alert.alert("Great Job!", `You're making progress on ${label}!`);
      onIncrement();
    } else {
      Alert.alert("Oops!", `You're reducing ${label}. Keep it balanced!`);
      onDecrement();
    }
  };
  const { email } = useStore();
  return (
    <View style={styles.wellnessItem}>
      <View style={styles.wellnessHeader}>
        <Text style={styles.wellnessLabel}>{label}</Text>
        <View style={styles.wellnessControls}>
          <TouchableOpacity
            onPress={() => handlePress("decrement")}
            style={styles.controlButton}
          >
            <Text style={styles.controlText}>−</Text>
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.wellnessValue}>{value}</Text>
            <Text style={styles.wellnessUnit}>{unit}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handlePress("increment")}
            style={styles.controlButton}
          >
            <Text style={styles.controlText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${(value / maxValue) * 100}%` },
          ]}
        />
      </View>
    </View>
  );
};

const Dashboard: React.FC = () => {
  const { email } = useStore();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [moodScore, setMoodScore] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [waterGlasses, setWaterGlasses] = useState<number>(3);
  const [steps, setSteps] = useState<number>(6000);
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"];

  // Fetch user's data from API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://192.168.0.3:5000/user_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.error) {
          console.log("Error", data.error);
        } else {
          setUserInfo(data);
          setMoodScore(data.mood_score || 4);
          setSleepHours(data.sleep_hours || 7.5);
          setWaterGlasses(data.water_glasses || 3);
          setSteps(data.steps || 6000);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        console.log("Error", "There was an error fetching your data.");
      }
    };

    fetchUserInfo();
  }, [email]);

  // Fetch affirmation from API
  useEffect(() => {
    const fetchAffirmation = async () => {
      try {
        const response = await fetch("http://192.168.0.3:5000/affirm");
        const data = await response.json();
        setAffirmation(data.affirmations[0]?.affirmation);
      } catch (error) {
        setAffirmation(
          "You are capable of amazing things. Take each moment one step at a time."
        );
      }
    };

    fetchAffirmation();
  }, []);

  // Update wellness data
  const updateWellness = async (updates: any) => {
    try {
      const response = await fetch("http://192.168.0.3:5000/update_wellness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          updates,
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Success", data.message);
      } else {
        console.log("Error", data.error);
      }
    } catch (error) {
      console.error("Error updating wellness:", error);
      console.log("Error", "There was an error updating your wellness data.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Mindful Moments</Text>

        <DashboardCard title="Today's Affirmation" gradient>
          <Text style={styles.affirmation}>
            {affirmation || "Loading affirmation..."}
          </Text>
        </DashboardCard>

        <DashboardCard title="Mood Check-In">
          <View style={styles.moodContainer}>
            {moodEmojis.map((emoji, index) => (
              <MoodButton
                key={index}
                emoji={emoji}
                selected={moodScore === index + 1}
                onPress={() => {
                  setMoodScore(index + 1);
                  const message =
                    index + 1 > 3
                      ? "You're in a great mood today! Keep shining! 🌟"
                      : "It's okay to have off days. You're doing amazing!";
                  // Alert.alert("Mood Updated", message);
                  updateWellness({ mood_score: index + 1 });
                }}
              />
            ))}
          </View>
          <Text style={styles.moodLabel}>How are you feeling today?</Text>
        </DashboardCard>

        <DashboardCard title="Daily Wellness">
          <WellnessTracker
            label="Sleep"
            value={sleepHours}
            unit="hours"
            maxValue={12}
            onIncrement={() => {
              const newSleep = Math.min(sleepHours + 0.5, 12);
              setSleepHours(newSleep);
              updateWellness({ sleep_hours: newSleep });
            }}
            onDecrement={() => {
              const newSleep = Math.max(sleepHours - 0.5, 0);
              setSleepHours(newSleep);
              updateWellness({ sleep_hours: newSleep });
            }}
          />

          <WellnessTracker
            label="Water Intake"
            value={waterGlasses}
            unit="glasses"
            maxValue={12}
            onIncrement={() => {
              const newWater = Math.min(waterGlasses + 1, 12);
              setWaterGlasses(newWater);
              updateWellness({ water_glasses: newWater });
            }}
            onDecrement={() => {
              const newWater = Math.max(waterGlasses - 1, 0);
              setWaterGlasses(newWater);
              updateWellness({ water_glasses: newWater });
            }}
          />

          <WellnessTracker
            label="Steps"
            value={steps}
            unit="steps"
            maxValue={20000}
            onIncrement={() => {
              const newSteps = Math.min(steps + 1000, 20000);
              setSteps(newSteps);
              updateWellness({ steps: newSteps });
            }}
            onDecrement={() => {
              const newSteps = Math.max(steps - 1000, 0);
              setSteps(newSteps);
              updateWellness({ steps: newSteps });
            }}
          />
        </DashboardCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4a154b",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2d3748",
  },
  affirmation: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    color: "#4a4a4a",
    lineHeight: 24,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  moodButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#f7f7f7",
  },
  moodButtonSelected: {
    backgroundColor: "#e9d5ff",
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 30,
  },
  moodLabel: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
  },
  wellnessItem: {
    marginBottom: 20,
  },
  wellnessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  wellnessLabel: {
    fontSize: 16,
    color: "#4a4a4a",
    flex: 1,
  },
  wellnessControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
  },
  controlText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginHorizontal: 12,
    minWidth: 60,
    justifyContent: "center",
  },
  wellnessValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a154b",
    marginRight: 4,
  },
  wellnessUnit: {
    fontSize: 14,
    color: "#666",
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: 4,
  },
});

export default Dashboard;
