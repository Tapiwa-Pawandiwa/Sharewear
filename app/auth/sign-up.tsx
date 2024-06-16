import { View } from "@/components/Themed";
import { Text, StyleSheet, TextInput, Image } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import Colors from "@/constants/Colors";
import RoundedButton from "@/components/RoundedButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signUp } from "aws-amplify/auth";
import CustomRadioButton from "@/components/CustomRadioButton";
import { RadioButton } from 'react-native-paper';


const signUpScreen = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState(""); // [value, setValue
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState(""); // [value, setValue
  const [userType, setUserType] = useState("Donor"); // [value, setValue
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSignUp = async() => {
    console.log("Signing up...");
    setError("");
   try {
   await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          email: email,
          name: firstName,
          family_name: lastName,
          "custom:userType": userType,
        },
        autoSignIn: true,
      },
     })
       console.log("Sign up successful");
        router.navigate("/auth/confirm");
    } catch(e: any)  {
        setError(e.message);
        console.log("Sign up failed", e);
      };
  };
  //need to differentiate between donor and beneficiary
  // so i need to use the userType in custom attributes to split the UI that way and route it bassed on the userType 
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logos/main-logo.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Create an Account Purpose: </Text>
      <View style={styles.radioButtonContainer}> 
      <CustomRadioButton 
                label="Donor"
                selected={userType === 'Donor'} 
                onSelect={() => setUserType('Donor')} 
            /> 
            <CustomRadioButton 
                label="Beneficiary"
                selected={userType === 'Beneficiary'} 
                onSelect={() => setUserType('Beneficiary')} 
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
      <Text>
        Already have an account?
        <Link href="/auth/sign-in">
          <Text style={styles.resetText}> Sign In</Text>
        </Link>
      </Text>

      <RoundedButton
        title="Sign Up"
        onPress={onSignUp}
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
      />
    </View>
  );
};

export default signUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
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
  resetText: {
    color: Colors.green.main,
  },
  radioGroup: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    marginTop: 20, 
    borderRadius: 8, 
    backgroundColor: 'white', 
    padding: 16, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { 
        width: 0, 
        height: 2, 
    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
}, 
radioButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
}, 
radioLabel: { 
    marginLeft: 8, 
    fontSize: 16, 
    color: '#333', 
}, 
radioButtonContainer: { 
  padding: 10,
    flexDirection: 'row',
  marginRight: 10,
},
});
