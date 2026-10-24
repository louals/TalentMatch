import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.text}>{user.first_name} {user.last_name}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.text}>{user.email}</Text>

      <Text style={styles.label}>Role:</Text>
      <Text style={styles.text}>{user.role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: "bold", marginTop: 10 },
  text: { fontSize: 16, color: "#444" },
});
