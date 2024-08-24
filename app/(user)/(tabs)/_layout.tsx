import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Redirect, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useAuth } from "@/app/providers/Auth";
import { Entypo } from "@expo/vector-icons";
import TabIcon from "@/components/TabIcon";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { session } = useAuth();

  if (!session) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          shadowColor: "#1C2F14",
          shadowOffset: { width: 1, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          borderRadius: 35,
          backgroundColor: '#1C2F14',
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,

          tabBarActiveTintColor: Colors.green.main,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} library="FontAwesome" />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="myDonations"
        options={{
          title: "My Donations",
          headerShown: false,
          tabBarActiveTintColor: Colors.green.main,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="box-open" focused={focused} library="FontAwesome5" />
          ),
        }}
      />
      <Tabs.Screen
        name="nearMe"
        options={{
          title: "Near Me",
          headerShown: false,
          tabBarActiveTintColor: Colors.green.main,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="location" focused={focused} library="Entypo" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarActiveTintColor: Colors.green.main,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="user" focused={focused} library="FontAwesome5" />
          ),
        }}
      />
    </Tabs>
  );
}
