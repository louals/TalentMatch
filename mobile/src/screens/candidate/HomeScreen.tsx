import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Animated,
  Easing
} from "react-native";
import { getJobOffers } from "api";

export default function HomeScreen({ navigation }: any) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    getJobOffers()
      .then((res) => {
        setJobs(res.data);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      })
      .catch((err) => console.error("Error loading jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  const renderJob = ({ item, index }: { item: any, index: number }) => (
    <Animated.View 
      style={[
        styles.jobCard,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50 * (index + 1), 0]
            })
          }]
        }
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("JobDetails", { jobId: item.id })}
        style={styles.jobTouchable}
      >
        <View style={styles.jobHeader}>
          <View>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <View style={styles.chipRow}>
              <View style={[styles.microChip, styles.locationChip]}>
                <Text style={styles.microChipText}>{item.location || "Remote"}</Text>
              </View>
              <View style={[styles.microChip, styles.typeChip]}>
                <Text style={styles.microChipText}>{item.type || "Full-time"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.companyChip}>
            <Text style={styles.companyName}>{item.companyName || "TechCorp"}</Text>
          </View>
        </View>
        
        <Text numberOfLines={2} style={styles.jobDescription}>
          {item.description}
        </Text>
        
        <View style={styles.jobFooter}>
          <View style={styles.salaryPill}>
            
          </View>
          <View style={styles.seeDetails}>
            <Text style={styles.seeDetailsText}>VIEW DETAILS</Text>
            <View style={styles.arrowIcon}>
              <View style={[styles.arrowLine, styles.arrowLine1]} />
              <View style={[styles.arrowLine, styles.arrowLine2]} />
            </View>
          </View>
        </View>
        
        {/* Tech-inspired decorative elements */}
        <View style={styles.cardGlow} />
        <View style={styles.cardCircuit}>
          <View style={styles.circuitLine} />
          <View style={styles.circuitDot} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.heroTitle}>FIND YOUR TECH</Text>
            <Text style={styles.heroSubtitle}>AI-POWERED JOB MATCHING</Text>
          </View>
          <Image 
            source={require('../../assets/mlogo.png')} 
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Stats Bar */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24K+</Text>
            <Text style={styles.statLabel}>JOBS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>MATCH RATE</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9★</Text>
            <Text style={styles.statLabel}>RATING</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.uploadButton]}
            onPress={() => navigation.navigate("UploadCV")}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>UPLOAD CV</Text>
              <View style={styles.buttonHalo} />
            </View>
            <View style={styles.buttonTechBorder} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.matchButton]}
            onPress={() => navigation.navigate("MatchResults")}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>AI MATCHES</Text>
              <View style={styles.buttonHalo} />
            </View>
            <View style={styles.buttonTechBorder} />
          </TouchableOpacity>
        </View>

        {/* Job Listings */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>SYNCING WITH AI...</Text>
          </View>
        ) : (
          <View style={styles.jobsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECOMMENDED POSITIONS</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={jobs}
              keyExtractor={(item) => item.id}
              renderItem={renderJob}
              contentContainerStyle={styles.listContent}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>NO ACTIVE LISTINGS</Text>
                </View>
              }
            />
          </View>
        )}
      </ScrollView>
      
      {/* Global tech overlay elements */}
      <View style={styles.globalCircuit} />
      <View style={styles.cornerOrnament} />
    </SafeAreaView>
  );
}const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8fafc', // Light background
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  headerTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b", // Dark text for light mode
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#64748b", // Muted text
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  heroImage: {
    width: 120,
    height: 120,
    marginLeft: 16,
    tintColor: '#6366f1', // Keeping the accent color
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(226, 232, 240, 0.7)', // Light gray background
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b", // Dark text
    marginBottom: 4,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 10,
    color: "#64748b", // Muted text
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionButton: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadButton: {
    backgroundColor: '#e0e7ff', // Lighter version
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  matchButton: {
    backgroundColor: '#d1fae5', // Lighter version
    borderWidth: 1,
    borderColor: '#10b981',
  },
  buttonInner: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonText: {
    color: "#1e293b", // Dark text
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    zIndex: 2,
  },
  buttonHalo: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    top: -30,
    right: -30,
  },
  buttonTechBorder: {
    position: 'absolute',
    height: 2,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
  jobsContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b", // Muted text
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  seeAll: {
    color: "#6366f1",
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  jobCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff', // White cards
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  jobTouchable: {
    padding: 20,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  jobTitle: { 
    fontSize: 18, 
    fontWeight: "700",
    color: "#1e293b", // Dark text
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  microChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  locationChip: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  typeChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  microChipText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#334155", // Darker text
  },
  companyChip: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  companyName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366f1", // Accent color
  },
  jobDescription: { 
    fontSize: 14, 
    color: "#64748b", // Muted text
    lineHeight: 20,
    marginBottom: 20,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)", // Lighter border
    paddingTop: 16,
  },
  salaryPill: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.3)',
  },
  salaryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16a34a", // Green text
  },
  seeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeDetailsText: {
    color: "#6366f1",
    fontWeight: "600",
    fontSize: 10,
    marginRight: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  arrowLine: {
    position: 'absolute',
    backgroundColor: '#6366f1',
    height: 2,
    borderRadius: 1,
  },
  arrowLine1: {
    width: 10,
    top: 7,
    right: 0,
    transform: [{ rotate: '-45deg' }],
  },
  arrowLine2: {
    width: 10,
    top: 7,
    right: 6,
    transform: [{ rotate: '45deg' }],
  },
  // Tech-inspired decorative elements (adjusted for light mode)
  cardGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    top: -20,
    right: -20,
  },
  cardCircuit: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 40,
    height: 40,
  },
  circuitLine: {
    position: 'absolute',
    height: 2,
    width: 30,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    transform: [{ rotate: '45deg' }],
    left: 5,
    top: 5,
  },
  circuitDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
    right: 5,
    bottom: 5,
  },
  globalCircuit: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    top: '30%',
    zIndex: -1,
  },
  cornerOrnament: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    bottom: 0,
    right: 0,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});