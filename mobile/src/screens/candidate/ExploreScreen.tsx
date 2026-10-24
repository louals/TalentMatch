import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";

export default function ExploreScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Discover Your Next Opportunity</Text>
          <Text style={styles.heroSubtitle}>
            Let our AI match you with perfect career opportunities
          </Text>
          <View style={styles.heroGradient} />
        </View>

        {/* How it works */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.emojiIcon}>⚙️</Text>
            <Text style={styles.cardTitle}>How It Works</Text>
          </View>
          {[
            "Create a profile and upload your CV",
            "Browse and apply to jobs",
            "Get matched with the best offers using AI",
          ].map((text, index) => (
            <View style={styles.featureItem} key={index}>
              <View style={styles.featureIcon}>
                <Text style={styles.emojiIcon}>✅</Text>
              </View>
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>

        {/* Key Features */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.emojiIcon}>⭐</Text>
            <Text style={styles.cardTitle}>Key Features</Text>
          </View>
          {[
            "Easy job search and filters",
            "Personalized job recommendations",
            "Manage your applications in one place",
          ].map((text, index) => (
            <View style={styles.featureItem} key={index}>
              <View style={styles.featureIcon}>
                <Text style={styles.emojiIcon}>⚡</Text>
              </View>
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>

        {/* Testimonials */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.emojiIcon}>👥</Text>
            <Text style={styles.cardTitle}>Success Stories</Text>
          </View>
          {[
            {
              text: "This app helped me find my dream job in no time!",
              author: "- Sarah, Product Designer",
            },
            {
              text: "Super easy to use and very smart matching.",
              author: "- Michael, Software Engineer",
            },
          ].map((t, i) => (
            <View style={styles.testimonial} key={i}>
              <Text style={styles.testimonialText}>"{t.text}"</Text>
              <Text style={styles.testimonialAuthor}>{t.author}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation?.navigate("BrowseJobs")}
        >
          <Text style={styles.ctaButtonText}>Get Started</Text>
          <Text style={[styles.emojiIcon, { fontSize: 20, color: "#fff" }]}>➡️</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 JobMatch Inc.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: "#6366f1",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: "hidden",
    position: "relative",
  },
  heroGradient: {
    position: "absolute",
    width: 200,
    height: 200,
    backgroundColor: "#818cf8",
    borderRadius: 100,
    top: -50,
    right: -50,
    opacity: 0.4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#e0e7ff",
    maxWidth: "90%",
    lineHeight: 22,
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
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginLeft: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emojiIcon: {
    fontSize: 18,
  },
  featureText: {
    fontSize: 15,
    color: "#334155",
    flex: 1,
  },
  testimonial: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  testimonialText: {
    fontSize: 15,
    color: "#334155",
    fontStyle: "italic",
    marginBottom: 4,
  },
  testimonialAuthor: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  ctaButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 8,
  },
  footer: {
    alignItems: "center",
    marginTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: "#64748b",
  },
});
