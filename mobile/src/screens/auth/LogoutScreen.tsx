import React from "react";
import { Button } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types"; // adjust path

export default function SettingsScreen() {
  const { logout } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return <Button title="Logout" onPress={handleLogout} />;
}
