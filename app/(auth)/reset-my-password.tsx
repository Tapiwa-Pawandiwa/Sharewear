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
const resetMyPassword = () => {
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

 

  const trimInputs = () => {
    setEmail(email.trim());
    setPassword(password.trim());
  };

  const resetPasssword = async (email: string) => {
    if(email === ''){
        Alert.alert('Error', 'Please enter a valid email.');
    }else {
        console.log("reset password requested ...");
        const resetPassswordURL = "sharewear://reset-password";
        try {
          const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: resetPassswordURL,
          });
          console.log('data',data);
          return { data, error };
        } catch (error) {
          console.error("Error sending password reset email:", error);
        }
    }
    
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logos/main-logo.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Reset Password</Text>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          width: 300,
        }}
      ></View>

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
    
    
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.loginSubtitle}>I shouldnt be here ? </Text>
        <Link href="/(auth)/sign-in">
          <Text style={[styles.textLink, { color: Colors.green.main }]}>
            Sign In
          </Text>
        </Link>
      </View>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <RoundedButton
        title="Reset Password"
        onPress={() => resetPasssword(email)}
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
        link=""
      />
    
    </View>
  );
};

export default resetMyPassword;

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
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: Colors.grey.alt,
    borderRadius: 10,
    borderColor: "black",
  },
  textLink: {
    color: Colors.green.main,
    fontSize: 16,
    fontFamily: "Helvetica",
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
