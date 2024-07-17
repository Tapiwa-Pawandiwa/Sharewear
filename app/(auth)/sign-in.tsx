import { View } from "@/components/Themed";
import { Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { Link, router } from "expo-router";
import Colors from "@/constants/Colors";
import RoundedButton from "@/components/RoundedButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../providers/Auth";
const signInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { profile, isAdmin } = useAuth();
  //get profile from AuthProvider
  // Function to toggle the password visibility state
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
      const { data , error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      console.log(data,"user");
      console.log(error , "error")
      if (error){
        Alert.alert("Sign in failed", error.message);
      }
      if (isAdmin) {
        router.push("/(admin)");
      } else {
        router.push("(user)")
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
      <Text style={styles.title}>Login</Text>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
            width: 300,
        }}
      ></View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color="#aaa"
          style={styles.icon}
          onPress={toggleShowPassword}
        />
      </View>

      <Link href="">
        <Text>
          Forgot Password? <Text style={styles.resetText}>Reset Password </Text>
        </Text>
      </Link>
      <Text>
        Don't have an account?
        <Link href="/(auth)/sign-up">
          <Text style={styles.resetText}> Sign Up</Text>
        </Link>
      </Text>

      <RoundedButton
        title="Sign In"
        onPress={signInwithEmail}
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
        link=""
      />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
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
    fontSize: 15,
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
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "black",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    right: 20,
    top: 20,
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
