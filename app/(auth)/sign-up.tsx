import {
  View,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import SignupButton from "@/components/SignupButton";
import { images } from "@/constants";
import { useCreateUser } from "@/api/signup";
import LinkButton from "@/components/LinkButton";
import { useRouter } from "expo-router";
import { useGetToken } from "@/api/Loginapi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Signup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    emailId: "",
    emEventOrg: "",
    matchingPassword: "",
    phoneNumber: "",
    surName: "",
    gender: "",
    active: true,
  });
  const { mutate: createUser } = useCreateUser();

  const router = useRouter();

  // token storage
  const storeToken = async (token: any) => {
    try {
      await AsyncStorage.setItem("Token", token);
      // console.log("Token Saved!!!");
    } catch (e) {
      // console.error("Error saving token:", e);
    }
  };

  const { mutate: getToken } = useGetToken();

  const submit = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.emailId ||
      !form.matchingPassword ||
      !form.emEventOrg ||
      !form.password ||
      !form.phoneNumber
    ) {
      Alert.alert("Error", "Please fill in all fields");
    }

    try {
      // console.log(form.emailId, form.phoneNumber, form.emEventOrg);
      // api logic goes here
      createUser(
        {
          firstName: form.firstName,
          password: form.password,
          lastName: form.lastName,
          emailId: form.emailId,
          phoneNumber: form.phoneNumber,
          matchingPassword: form.matchingPassword,
          emEventOrg: form.emEventOrg,
          surName: form.surName,
          gender: form.gender,
          active: form.active,
        },
        {
          onSuccess: (data: any) => {
            // console.log("Data : ", data);
            // automatic Login
            getToken(
              {
                username: form.emailId,
                password: form.password,
              },
              {
                onSuccess: (data: any) => {
                  // console.log("Token:", data.jwtToken);

                  const token = data.jwtToken;

                  storeToken(token);
                  if (token) {
                    // router.replace("/(root)/(screen)/(menu)/eventitem");
                    router.replace("/(root)/(screen)/(menu)/eventitem");
                  }
                },
                onError: (error: any) => {
                  // console.error("Error during authentication:", error);

                  Alert.alert(
                    "Authentication Error",
                    error.message || "An error occurred"
                  );
                },
              }
            );
          },
          onError: (error: any) => {
            // console.error("Error during authentication:", error);
            Alert.alert(
              "Authentication Error",
              error.message || "An error occurred"
            );
          },
        }
      );
    } catch (error) {
      console.log("Error!!");
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <ImageBackground source={images.background}>
          <View style={Styles.container}>
            <View style={Styles.imagecontainer}>
              <Image source={images.mainLogo} style={Styles.image} />
            </View>

            <View style={Styles.formcontainer}>
              <FormField
                title="firstName"
                value={form.firstName}
                placeholder="First Name"
                handleChangeText={(e: any) =>
                  setForm({ ...form, firstName: e })
                }
              />

              <FormField
                title="lastName"
                value={form.lastName}
                placeholder="Last Name"
                handleChangeText={(e: any) => setForm({ ...form, lastName: e })}
              />

              <FormField
                title="Email"
                value={form.emailId}
                placeholder="Email"
                handleChangeText={(e: any) => setForm({ ...form, emailId: e })}
              />

              <FormField
                title="phoneNumber"
                value={form.phoneNumber}
                placeholder="Phone Number"
                handleChangeText={(e: any) =>
                  setForm({ ...form, phoneNumber: e })
                }
              />

              <FormField
                title="companyName"
                value={form.emEventOrg}
                placeholder="Company Name"
                handleChangeText={(e: any) =>
                  setForm({ ...form, emEventOrg: e })
                }
              />

              <FormField
                title="Password"
                value={form.password}
                placeholder="Password"
                handleChangeText={(e: any) => setForm({ ...form, password: e })}
              />

              <FormField
                title="Password"
                value={form.matchingPassword}
                placeholder="Confirm Password"
                handleChangeText={(e: any) =>
                  setForm({ ...form, matchingPassword: e })
                }
              />

              <SignupButton label="Sign Up" onPress={submit} />

              <Text style={Styles.textcenter}>Already Have Account?</Text>

              <LinkButton
                label="Back to LogIn"
                onPress={{}}
                linkPage="/(auth)/sign-in/"
              />
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  imagecontainer: {
    paddingTop: 40,
    position: "absolute",
    zIndex: 10,
  },
  image: {
    width: 200,
    height: 140,
    borderRadius: 4,
  },
  formcontainer: {
    marginTop: 110,
    paddingTop: 90,
    width: "90%",
    height: 750,
    backgroundColor: "white",
    zIndex: 5,
    borderRadius: 10,
    marginBottom: 50,
  },
  textcenter: {
    textAlign: "center",
    marginBottom: 5,
    marginTop: 10,
  },
});
