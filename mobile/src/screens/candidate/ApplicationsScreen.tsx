import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getApplicationsByUser, getJobOffer } from "api";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

interface Application {
  id: string;
  offer_id: string;
  cover_letter: string;
  matching_score: number;
  created_at: string;
  title?: string;
  description?: string;
}

export default function ApplicationsScreen() {
  const { user } = useAuth();
  const userId = user?.id;

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("User from context:", user);
    console.log("User ID:", userId);

    if (!userId) {
      setLoading(false);
      setApplications([]);
      return;
    }

    async function fetchApplications() {
      setLoading(true);
      setError(null);
      try {
        const res = await getApplicationsByUser(userId);
        const apps: Application[] = res.data || res;

        console.log("Fetched Applications:", apps);

        if (!Array.isArray(apps)) throw new Error("Applications data is not an array");

        const jobIds = Array.from(new Set(apps.map((app) => app.offer_id)));

        const jobsData = await Promise.all(
          jobIds.map((id) =>
            getJobOffer(id)
              .then((res) => {
                const job = res.data || res;
                console.log(`Fetched job ${id}:`, job);
                return job;
              })
              .catch((err) => {
                console.error(`Error fetching job ${id}:`, err);
                return null;
              })
          )
        );

        const jobMap = new Map<string, { title: string; description: string }>();
        jobsData.forEach((job) => {
          if (job?.id) {
            jobMap.set(job.id, {
              title: job.title,
              description: job.description,
            });
          }
        });

        const appsWithDetails = apps.map((app) => ({
          ...app,
          title: jobMap.get(app.offer_id)?.title || "Unknown Position",
          description: jobMap.get(app.offer_id)?.description || "No description available",
        }));

        setApplications(appsWithDetails);
      } catch (err: any) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [userId]);

  const toggleExpand = (id: string) => {
    setExpandedAppId((prev) => (prev === id ? null : id));
  };

  const renderItem = ({ item }: { item: Application }) => {
    console.log("Rendering application:", item);
    const isExpanded = expandedAppId === item.id;
    const scoreColor =
      item.matching_score > 0.7
        ? "#10b981"
        : item.matching_score > 0.4
        ? "#f59e0b"
        : "#ef4444";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[styles.scorePill, { backgroundColor: `${scoreColor}20` }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>
              {Math.round(item.matching_score * 100)}%
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Applied:</Text>
            <Text style={styles.metaValue}>
              {format(new Date(item.created_at), "MMM d, yyyy")}
            </Text>
          </View>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: "#6366f1" }]} />
            <Text style={styles.statusText}>In Review</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.sectionTitle}>Cover Letter</Text>
            <View style={styles.letterBox}>
              <Text style={styles.cover}>
                {item.cover_letter || "No cover letter provided"}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading your applications...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setLoading(true)}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!applications.length) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyIllustration}>
          <Text style={styles.emptyIcon}>📄</Text>
        </View>
        <Text style={styles.emptyTitle}>No Applications Yet</Text>
        <Text style={styles.emptyText}>
          You haven't applied to any jobs yet. Start applying to see them here.
        </Text>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Browse Jobs</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Applications</Text>
        <Text style={styles.headerSubtitle}>
          {applications.length}{" "}
          {applications.length === 1 ? "application" : "applications"}
        </Text>
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // all your styles unchanged, since they look solid!
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#f8fafc",
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
    marginRight: 12,
  },
  scorePill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 13,
    color: "#64748b",
    marginRight: 4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: "#64748b",
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  letterBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 16,
  },
  cover: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
});
