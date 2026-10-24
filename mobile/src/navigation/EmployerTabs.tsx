import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyJobOffers from "../screens/employer/MyJobOffers";
import Applicants from "../screens/employer/Applicants";
import Settings from "../screens/common/Settings";

const Tab = createBottomTabNavigator();

export default function EmployerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MyJobOffers" component={MyJobOffers} />
      <Tab.Screen name="Applicants" component={Applicants} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
