import { View } from "@/components/Themed";
import { Text, StyleSheet, TextInput, Image, Alert, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import Colors from "@/constants/Colors";
import RoundedButton from "@/components/RoundedButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomRadioButton from "@/components/CustomRadioButton";
import { RadioButton } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../providers/Auth";

const signUpScreen = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState(""); // [value, setValue
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState(""); // [value, setValue
  const [userType, setUserType] = useState("Donor");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isAdmin } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const trimInputs = () => {
    setEmail(email.trim());
    setFirstName(firstName.trim());
    setPassword(password.trim());
    setLastName(lastName.trim());
    setPhone(phone.trim());
  };

  const signUpwithEmail = async () => {
    trimInputs();
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    try {
      console.log("signing up ...");
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
            username: email,
            phone_number: phone,
          },
        },
      });
      console.log(data, "data");
      if (error) {
        console.log(error, "error signing up");
        throw error;
      }
      //auto sign in after sign up
      const { data: newData } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      console.log(newData, "newData");

      if (newData.user?.user_metadata.user_type === "Beneficiary") {
        router.push("/(admin)");
      } else {
        router.push("/(user)");
      }
    } catch (e: any) {
      console.log("Sign up failed", e);
      // setError(e.message);
      Alert.alert("Sign up failed, try again", e.message);
    }
  };

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUserTypeChange = (userType: string) => {
    setUserType(userType);
  };

  //need to differentiate between donor and beneficiary
  // so i need to use the userType in custom attributes to split the UI that way and route it bassed on the userType
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <Image
        source={require("../../assets/images/logos/main-logo.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.headingText}>Let's get started</Text>
      <Text style={styles.title}>Create an Account Purpose:</Text>
      <View style={styles.radioButtonContainer}>
        <CustomRadioButton
          label="Donor"
          selected={userType === "Donor"}
          onSelect={() => handleUserTypeChange("Donor")}
        />
        <CustomRadioButton
          label="Beneficiary"
          selected={userType === "Beneficiary"}
          onSelect={() => handleUserTypeChange("Beneficiary")}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="phone-pad"
        placeholder="Phone Number"
        onChangeText={setPhone}
        value={phone}
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          secureTextEntry={!showPassword}
          onChangeText={setConfirmPassword}
        />
        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color="#aaa"
          style={styles.icon}
          onPress={toggleShowPassword}
        />
      </View>
      <Text style={styles.titleText}>
        Already have an account?
        <Link href="/(auth)/sign-in">
          <Text style={styles.resetText}> Sign In</Text>
        </Link>
      </Text>
      <RoundedButton
        title="Sign Up"
        onPress={signUpwithEmail}
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
      />
    </ScrollView>
  </KeyboardAvoidingView>
  );
};

export default signUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    height: 50,
    width: 350,
    marginVertical: 10,
    padding: 15,
    backgroundColor: Colors.grey.alt,
    borderRadius: 25,
  },
  passwordContainer: {
    position: "relative",
    width: 350,
  },
  titleText: {
    fontSize: 16,
    color: Colors.theme.secondary,
    marginTop: 5,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  button: {
    backgroundColor: Colors.green.main,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.theme.tertiary,
    marginBottom: 5,
  },
  resetText: {
    color: Colors.green.main,
    fontSize: 16,
  },
  radioButtonContainer: {
    padding: 10,
    flexDirection: "row",
    marginRight: 10,
  },
});
