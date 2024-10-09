import { useNavigation, useRouter } from "expo-router";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { images } from "@/constants";
import { DrawerActions } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import React from "react";
import CustomDrawer from "@/components/CustomDrawer";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import CustomDrawerLabel from "@/components/CustomDrawerLabel";
import { allNotifications } from "@/api/notifications/allNotifications";

const DrawerLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const onToggle = () => {
    router.push('/drawer');
    
  };
  
  
  const onBellPress = () => {
    router.push(
      "/notification/readedNotification"
    )
  };
  const { data } = allNotifications();
  const unreadCount = data?.filter(notification => notification.noStatus == "Unread").length;


  return (
    <>
      <Drawer
        drawerContent={CustomDrawer}
        screenOptions={{
          drawerStyle: { width: "100%" },
          drawerPosition: "right",
          drawerActiveBackgroundColor: "#C7F9FF",
          headerShadowVisible: false,
          drawerLabelStyle: {
            fontSize: 18,
            color: "#000",
          },
        }}
      >
        <Drawer.Screen
          name="(menu)"
          options={{
            title: "My Menu",
            drawerIcon: () => (
              <AntDesign name="arrowleft" size={24} color="black" />
            ),
            headerLeft: () => (
              <Image style={style.image} source={images.Logo} />
            ),
            headerRight: () => {
              return (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      onBellPress();
                    }}
                    style={{ marginRight: 1 }}
                  >
                    <View style={{ position: "relative" }}>
                      <Image style={style.iconSize} source={images.Bell} />
                      <View style={style.circle}>
                        <Text style={style.notificationNumber}>
                        {unreadCount} 
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      onToggle();
                    }}
                    style={{ padding: 15 }}
                  >
                    <Image style={style.iconSize} source={images.hamBurger} />
                  </TouchableOpacity>
                </View>
              );
            },
            headerTitle: "",
            headerShown: true,
          }}
        />

        <Drawer.Screen
          name="eventitem"
          options={{
            headerShown: false,
            drawerLabel: () => (
              <CustomDrawerLabel
                title="Event Items"
                subTitle="Manage your Items"
              />
            ),
            drawerIcon: () => (
              <Ionicons name="cart-outline" size={24} color="black" />
            ),
          }}
        />

        <Drawer.Screen
          name="eventdetail"
          options={{
            headerShown: false,
            drawerLabel: () => (
              <CustomDrawerLabel
                title="Event Details"
                subTitle="Manage your Events"
              />
            ),
            drawerIcon: () => <Feather name="sunset" size={24} color="black" />,
          }}
        />
      </Drawer>
    </>
  );
};

export default DrawerLayout;

const style = StyleSheet.create({
  image: {
    marginLeft: 10,
    width: 160,
    height: 40,
  },
  circle: {
    position: "absolute",
    left: -16,
    top: -12,
    backgroundColor: "#fef100",
    borderColor: "#c5ba00",
    borderWidth: 0.5,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationNumber: {
    color: "black",
    fontSize: 8,
    fontWeight: "bold",
  },
  iconSize: {
    width: 25,
    height: 25,
  },
});
