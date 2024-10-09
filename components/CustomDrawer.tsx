import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { images } from "@/constants";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawer = (props: any) => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View>
          <Image source={images.Logo} style={styles.image} />
        </View>
        <DrawerItemList {...props} />

        <DrawerItem
          label={"Log Out"}
          onPress={() => {
            AsyncStorage.clear(), console.log("Log out"), router.replace("/");
          }}
          icon={() => (
            <MaterialIcons
              name="logout"
              size={24}
              color="#333"
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          )}
          labelStyle={styles.logoutLabel}
        />
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  image: {
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
    width: 160,
    height: 40,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
