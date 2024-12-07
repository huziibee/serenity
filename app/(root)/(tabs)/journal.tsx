import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useStore } from "@/store/index";
interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  activities: string[];
  score: number;
  isExpanded?: boolean;
}

const ACTIVITIES = [
  { id: "exercise", label: "🏃‍♂️ Exercise" },
  { id: "meditation", label: "🧘‍♂️ Meditation" },
  { id: "goodSleep", label: "😴 Good Sleep" },
  { id: "nature", label: "🌿 Nature" },
  { id: "social", label: "👥 Social" },
  { id: "creative", label: "🎨 Creative" },
  { id: "productive", label: "✅ Productive" },
  { id: "learning", label: "📚 Learning" },
];

const ActivityTag: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.activityTag, selected && styles.selectedTag]}
  >
    <Text style={[styles.activityText, selected && styles.selectedTagText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const JournalCard: React.FC<{
  entry: JournalEntry;
  onToggleExpand: (id: string) => void;
}> = ({ entry, onToggleExpand }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.date}>
        {entry.date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>+{entry.score}</Text>
      </View>
    </View>

    {entry.activities.length > 0 && (
      <View style={styles.activityContainer}>
        {entry.activities.map((activity, index) => (
          <View key={index} style={styles.activityBadge}>
            <Text style={styles.activityBadgeText}>
              {ACTIVITIES.find((a) => a.id === activity)?.label}
            </Text>
          </View>
        ))}
      </View>
    )}

    <Text
      style={[
        styles.content,
        entry.isExpanded ? styles.expandedContent : styles.collapsedContent,
      ]}
    >
      {entry.content}
    </Text>
    <TouchableOpacity
      style={styles.readMoreButton}
      onPress={() => onToggleExpand(entry.id)}
    >
      <Text style={styles.readMoreText}>
        {entry.isExpanded ? "Show Less" : "Read More"}
      </Text>
    </TouchableOpacity>
  </View>
);

const JournalPage: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const { email } = useStore();

  useEffect(() => {
    const score = entries.reduce((total, entry) => total + entry.score, 0);
    setTotalScore(score);
  }, [entries]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(
          "http://192.168.0.3:5000/journal_entries",
          {
            params: { email: email },
          }
        );
        const fetchedEntries = response.data.entries.map((entry: any) => ({
          id: entry.id.toString(),
          date: new Date(entry.date),
          content: entry.content,
          activities: entry.activities.split(","),
          score: entry.score,
          isExpanded: false,
        }));
        setEntries(fetchedEntries);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };
    fetchEntries();
  }, []);

  const handleNewEntry = async () => {
    if (newEntry.trim()) {
      const entryData = {
        email: email,
        content: newEntry,
        activities: selectedActivities.join(","),
        score: 10, // Adjust the score calculation as needed
      };

      try {
        const response = await axios.post(
          "http://192.168.0.3:5000/journal_entries",
          entryData
        );

        if (response.status === 201) {
          const newEntryWithId: JournalEntry = {
            date: new Date(),
            content: newEntry,
            activities: selectedActivities,
            score: entryData.score,
            isExpanded: false,
          };
          setEntries([newEntryWithId, ...entries]);
          setNewEntry("");
          setSelectedActivities([]);
          setModalVisible(false);
        } else {
          console.error(
            "Error creating journal entry:",
            response.data.error || "Unknown error"
          );

          console.log("Response:", response.status, response.data.id);
        }
      } catch (error: any) {
        console.error(
          "Error creating journal entry:",
          error.response?.data?.error || error.message
        );
      }
    }
  };

  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  const toggleExpand = (id: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, isExpanded: !entry.isExpanded } : entry
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Journal</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.totalScoreLabel}>Total Journal Score</Text>
          <Text style={styles.totalScoreValue}>{totalScore}</Text>
          <Text style={styles.scoreSubtext}>
            Keep writing to earn more points!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.newEntryButtonText}>Create New Entry</Text>
        </TouchableOpacity>

        {entries.map((entry) => (
          <JournalCard
            key={entry.id}
            entry={entry}
            onToggleExpand={toggleExpand}
          />
        ))}

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Journal Entry</Text>

              <View style={styles.activitiesSection}>
                <Text style={styles.activitiesSectionTitle}>
                  What helped your well-being today?
                </Text>
                <View style={styles.activitiesGrid}>
                  {ACTIVITIES.map((activity) => (
                    <ActivityTag
                      key={activity.id}
                      label={activity.label}
                      selected={selectedActivities.includes(activity.id)}
                      onPress={() => toggleActivity(activity.id)}
                    />
                  ))}
                </View>
              </View>

              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Write your thoughts here..."
                value={newEntry}
                onChangeText={setNewEntry}
                textAlignVertical="top"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setNewEntry("");
                    setSelectedActivities([]);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleNewEntry}
                >
                  <Text style={styles.saveButtonText}>Save Entry</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  scoreCard: {
    backgroundColor: "#8b5cf6",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
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
  totalScoreLabel: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  totalScoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginVertical: 10,
  },
  scoreSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  newEntryButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 25,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
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
  newEntryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: "#4a4a4a",
    fontWeight: "500",
  },
  scoreContainer: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#666",
  },
  scoreValue: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "bold",
  },
  activityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    marginTop: 5,
  },
  activityBadge: {
    backgroundColor: "#f3e8ff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  activityBadgeText: {
    color: "#8b5cf6",
    fontSize: 14,
  },
  content: {
    fontSize: 16,
    color: "#4a4a4a",
    lineHeight: 24,
  },
  collapsedContent: {
    maxHeight: 72,
    overflow: "hidden",
  },
  expandedContent: {
    maxHeight: undefined,
  },
  readMoreButton: {
    marginTop: 10,
  },
  readMoreText: {
    color: "#8b5cf6",
    fontSize: 14,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a154b",
    marginBottom: 20,
    textAlign: "center",
  },
  activitiesSection: {
    marginBottom: 20,
  },
  activitiesSectionTitle: {
    fontSize: 16,
    color: "#4a4a4a",
    marginBottom: 12,
  },
  activitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  activityTag: {
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 5,
  },
  selectedTag: {
    backgroundColor: "#e9d5ff",
  },
  activityText: {
    color: "#666",
    fontSize: 14,
  },
  selectedTagText: {
    color: "#8b5cf6",
    fontWeight: "500",
  },
  textInput: {
    backgroundColor: "#f7f7f7",
    borderRadius: 15,
    padding: 15,
    height: 200,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f7f7f7",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#8b5cf6",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default JournalPage;
