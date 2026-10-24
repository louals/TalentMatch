// src/navigation/CandidateStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/candidate/HomeScreen";
import UploadCVScreen from "../screens/candidate/UploadCVScreen";
import MatchResultsScreen from "../screens/candidate/MatchResultsScreen";
import JobDetailsScreen from "../screens/candidate/JobDetails";

const Stack = createNativeStackNavigator();

export default function CandidateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UploadCV" component={UploadCVScreen} />
      <Stack.Screen name="MatchResults" component={MatchResultsScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
    </Stack.Navigator>
  );
}