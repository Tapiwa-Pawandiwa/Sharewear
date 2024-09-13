import React from "react";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import TabIcon from "@/components/TabIcon";
import DonationsTabIcon from "@/components/DonationsTabIcon";
import { useDonationByBeneficiary } from "@/app/hooks/useDonation";
import { useAuth } from "@/app/providers/Auth";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}


export default function TabLayout() {
  const colorScheme = useColorScheme();



  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false, // Ensure label is shown
        tabBarLabelPosition: "below-icon", // Force the label to be displayed below the icon
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          shadowColor: Colors.dark.background,
          shadowOffset: { width: 1, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          borderRadius: 40,
          backgroundColor: Colors.light.background,
          height: 85, // Ensure enough height for both the icon and label
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
            <TabIcon
              name="home"
              label="Home"
              focused={focused}
              library="FontAwesome"
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors.green.main}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="myRequests"
        options={{
          title: "My Requests",
          headerShown: false,
          tabBarActiveTintColor: Colors.green.main,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="box-open"
              focused={focused}
              library="FontAwesome5"
              label="My Requests"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="myDonations"
        options={{
          title: "myDonations",
          headerShown: false,
          tabBarActiveTintColor: Colors.green.main,
          tabBarIcon: ({ focused }) => (
            <DonationsTabIcon focused={focused} label="Donations"
            />
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
            <TabIcon name="user" focused={focused} library="FontAwesome" label="Profile"  />
          ),
        }}
      />
    </Tabs>
  );
}
