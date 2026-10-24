import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import MainTabs from "./MainTabs";
import AdminTabs from "./AdminTabs";
import EmployerTabs from "./EmployerTabs";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import { ActivityIndicator, Text, View } from "react-native";
import UploadCVScreen from "../screens/candidate/UploadCVScreen";
import MatchResultsScreen from "../screens/candidate/MatchResultsScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const role = user?.role;
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (role === "admin") {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
      </Stack.Navigator>
    );
  }
  
  if (role === "employer") {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EmployerTabs" component={EmployerTabs} />
      </Stack.Navigator>
    );
  }

  if (user && !["admin", "employer", "candidate"].includes(role)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Unknown role: {role}</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
  
}
