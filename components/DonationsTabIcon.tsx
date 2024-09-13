import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers/Auth";

interface TabIconProps {
  label: string;
  focused: boolean;

}

const DonationsTabIcon: React.FC<TabIconProps> = ({ focused, label }) => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const {profile} = useAuth();


  useEffect(() => {
    if (!profile?.id) return; // Ensure we have the profile ID before proceeding

    const fetchPendingDonations = async () => {
      const { data, error } = await supabase
        .from("donation_with_details")
        .select("*")
        .eq("donation_status", "PENDING")
        .eq("beneficiary_ID", profile.id); // Only fetch donations for this user

      if (!error && data) {
        setPendingCount(data.length);
      }
    };

    // Subscribe to real-time changes in the user's donations
    const subscription = supabase
      .channel('donation-updates')
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public', 
          table: 'donation_with_details',
          filter: `beneficiary_ID=eq.${profile.id}`, // Only match the current user's donations
        },
        async (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            await fetchPendingDonations(); // Update count on insert or update
          }
        }
      )
      .subscribe();

    // Fetch the initial pending donations
    fetchPendingDonations();

    // Cleanup the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [profile?.id]); 


  return (
    <View style={[styles.container, focused ? styles.focusedContainer : null]}>
      <View style={styles.iconContainer}>
      <FontAwesome5
          name="box"
          size={focused ? 20 : 15}
          color={focused ? Colors.green.main : Colors.grey.light}
          style={styles.boxIcon}
        />
        <FontAwesome5
          name="hand-holding"
          size={focused ? 35 : 25}
          color={focused ? Colors.green.main : Colors.grey.light}
          style={styles.handIcon}
        />
           {pendingCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingCount}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.labelText, focused ? styles.focusedLabel : null]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    marginTop: 30,
  },
  focusedContainer: {
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  iconContainer: {
    position: "relative", // Enables absolute positioning for the child icons
  },
  handIcon: {
    marginTop: 2, // Positions the hand icon slightly below the box icon
  },
  boxIcon: {
    position: "absolute", // Positions the box icon on top of the hand
    top: 0,
    left:10,
  },
  labelText: {
    color: Colors.grey.light,
    fontSize: 12,
    width: 100,
    fontFamily: "Now-Regular",
    textAlign: "center",
    marginTop: 5,
  },
  focusedLabel: {
    color: Colors.green.main,
    fontSize: 14,
    width: 100,
  },
  badge: {
    position: 'absolute',
    bottom: 18,
    left: 32, 
    backgroundColor: Colors.theme.tertiary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },badgeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default DonationsTabIcon;
