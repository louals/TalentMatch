import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../screens/admin/Dashboard";
import ManageUsers from "../screens/admin/ManageUsers";
import Settings from "../screens/common/Settings";

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="ManageUsers" component={ManageUsers} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
