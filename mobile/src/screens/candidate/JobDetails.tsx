import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getJobOffer } from 'api';
import { useAuth } from "../../context/AuthContext";
import { createApplication } from "api";

export default function JobDetailsScreen({ route, navigation }: any) {
  const { jobId } = route.params;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();

  

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobOffer(jobId);
        setJob(response.data);
      } catch (err) {
        console.error('Failed to fetch job:', err);
        Alert.alert('Error', 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    if (!user?.id) {
      Alert.alert('Login Required', 'You must be logged in to apply');
      navigation.navigate('Login'); // or whatever your login route is
      return;
    }

    setApplying(true);
    try {
      const payload = {
        user_id: user.id,
        offer_id: job.id,
      };

      await createApplication(payload);
      Alert.alert('Success', 'Application submitted successfully!');
      navigation.goBack();
    } catch (err) {
      console.error("Application failed:", err);
      Alert.alert(
        'Application Error', 
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Job not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>{job.companyName || "Unknown Company"}</Text>
      
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{job.location || 'Remote'}</Text>
      
      <Text style={styles.label}>Type:</Text>
      <Text style={styles.value}>{job.type || 'Full-time'}</Text>
      
      

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.description}>{job.description || "No description provided."}</Text>

      
    </ScrollView>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    content: {
      padding: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: 8,
    },
    company: {
      fontSize: 16,
      fontWeight: '600',
      color: '#6366f1',
      marginBottom: 20,
    },
    label: {
      fontSize: 12,
      color: '#64748b',
      textTransform: 'uppercase',
      marginTop: 16,
      marginBottom: 4,
      letterSpacing: 1,
    },
    value: {
      fontSize: 14,
      color: '#1e293b',
    },
    description: {
      fontSize: 14,
      color: '#334155',
      lineHeight: 20,
      marginTop: 8,
    },
    applyButton: {
      marginTop: 32,
      backgroundColor: '#6366f1',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    applyText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 14,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 12,
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    errorText: {
      fontSize: 14,
      color: 'red',
    },
  });
  