import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getMatchResults, generateApplicationsFromMatches } from "api";
import { useNavigation } from "@react-navigation/native";

export default function MatchResultsScreen() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    getMatchResults()
      .then((res) => {
        console.log("✅ Match Results:", res.data);
        setMatches(res.data.matches || []);
      })
      .catch((err) => {
        console.error("Failed to load matches:", err);
        Alert.alert("Error", "Failed to load matched jobs.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApplyToAll = async () => {
    try {
      setApplying(true);
      await generateApplicationsFromMatches({});
      Alert.alert("Success", "Applications submitted!");
      navigation.navigate("Applications");
    } catch (err) {
      console.error("Failed to apply:", err);
      Alert.alert("Error", "Something went wrong while applying.");
    } finally {
      setApplying(false);
    }
  };

  const renderMatch = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>{Math.round(item.score * 100)}% Match</Text>
        </View>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.company}>ID: {item.job_offer_id}</Text>
      <Text style={styles.justification}>{item.justification}</Text>
      <View style={styles.divider} />
      <TouchableOpacity 
        style={styles.quickApplyButton}
        onPress={() => {/* Add single apply functionality here */}}
      >
        <Text style={styles.quickApplyText}>Quick Apply</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Finding your best matches...</Text>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateTitle}>No matches yet</Text>
        <Text style={styles.emptyStateText}>
          We couldn't find any jobs matching your profile. Try updating your CV or preferences.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("ApplicationsScreen")}
        >
          <Text style={styles.buttonText}>See My Applications</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Your Job Matches</Text>
        <Text style={styles.subheading}>
          {matches.length} positions matched with your profile
        </Text>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.job_offer_id || item.title || Math.random().toString()}
        renderItem={renderMatch}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, applying && styles.disabledButton]}
          onPress={handleApplyToAll}
          disabled={applying}
        >
          <Text style={styles.buttonText}>
            {applying ? "Applying..." : `Apply to All (${matches.length})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Applications")}
        >
          <Text style={styles.secondaryButtonText}>View Applications</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    color: "#64748b",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#f8fafc",
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  scorePill: {
    backgroundColor: "#e0e7ff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4f46e5",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 12,
  },
  justification: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  quickApplyButton: {
    alignSelf: "flex-end",
  },
  quickApplyText: {
    color: "#6366f1",
    fontWeight: "600",
    fontSize: 14,
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: "#f8fafc",
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  secondaryButtonText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});