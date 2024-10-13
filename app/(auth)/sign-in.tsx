import { View } from "@/components/Themed";
import {
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  Pressable,
} from "react-native";
import React, { useContext, useState } from "react";
import { Link, router } from "expo-router";
import Colors from "@/constants/Colors";
import RoundedButton from "@/components/RoundedButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../providers/Auth";
import * as Linking from "expo-linking";
const signInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { profile, isAdmin } = useAuth();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    setError("");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const trimInputs = () => {
    setEmail(email.trim());
    setPassword(password.trim());
  };

  const signInwithEmail = async () => {
    trimInputs();
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setError("");
        if (isAdmin){
          router.push("/(admin)");
        }else {
          router.push("/(user)");
        }
        console.log("Sign in successful", data);
      }
    } catch (e: any) {
      setLoading(false);
      console.log("Sign up failed", e);
      setError(e.message);
      Alert.alert("Sign up failed, try again", e.message);
    }
  };

  const onSignOut = async () => {
    setError("");

    console.log("Signing out...");
    try {
      console.log("Sign out");
    } catch (e: any) {
      setError(e.message);
      console.log("Sign out failed", e);
    }
    //expo go not supported so need work around here
  };

 

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logos/main-logo.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome</Text>
   

      <TextInput
        style={[
          styles.input,
          { borderColor: isEmailFocused ? Colors.green.main : "black" },
        ]}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            ,
            { borderColor: isPasswordFocused ? Colors.green.main : "black" },
          ]}
          placeholder="Password"
          autoCapitalize="none"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color="#aaa"
          style={styles.icon}
          onPress={toggleShowPassword}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.loginSubtitle}>Don't have an account?</Text>
        <Link href="/(auth)/sign-up" style={styles.link}>
          <Text style={[styles.textLink, { color: Colors.green.main }]}>
            {" "}
            Sign Up
          </Text>
        </Link>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Link href="/(auth)/reset-my-password">
          <Text style={[styles.textLink, { color: Colors.green.main }]}>
            Reset Password
          </Text>
        </Link>
      </View>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <RoundedButton
        title="Sign In"
        onPress={signInwithEmail}
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
        link=""
      />
      <RoundedButton
        title="Sign Out"
        onPress={onSignOut}
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
        link=""
      />
    </View>
  );
};

export default signInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
    fontFamily: "Now-Bold",
    marginBottom: 20,
  },
  loginSubtitle: {
    fontSize: 16,
    color: "grey",
    fontFamily: "Now-Regular",
    marginBottom: 20,
  },
  linkStyle: {
    color: Colors.green.main,
    fontSize: 16,
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: 355,
    margin: 12,

    padding: 10,
    backgroundColor: Colors.grey.alt,
    borderRadius: 20,
    borderColor: "black",
  },
  textLink: {
    color: Colors.green.main,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  link:{
    marginTop: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
  },
  icon: {
    position: "absolute",
    right: 20,
    top: 25,
  },
  resetText: {
    color: Colors.green.main,
  },
  button: {
    backgroundColor: Colors.green.main,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
  },
  image: {
    width: 250,
    height: 115,
  },
});
