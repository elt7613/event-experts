import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap,
  } from "@react-navigation/material-top-tabs";
  import { View , Text,StyleSheet, TouchableOpacity, GestureResponderEvent} from "react-native";
  import { useRouter, withLayoutContext } from "expo-router";
  import { ParamListBase, TabNavigationState } from "@react-navigation/native";
  import React from "react";
import Notification from "@/components/Notification";
import { Feather } from "@expo/vector-icons";
  
  const { Navigator } = createMaterialTopTabNavigator();
  
  
  export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap>(Navigator);
  
  const MaterialTopTabsLayout = () => {
    const router = useRouter();
    function handleBackPress(){
      router.push('/(root)/(screen)/(menu)/eventdetail')
      
    }

    return (
      <>
      {/* <View style={{backgroundColor:"white",borderTopWidth:1,borderTopColor:"grey"}}>
        <View style={styles.container}>
          <View style={styles.container2}>
           <Notification/>
          </View>
        </View>
      </View> */}
      <View style={styles.DrawerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Feather name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.DrawerText}>Notification</Text>
      </View>
      
      <MaterialTopTabs screenOptions={{ tabBarActiveTintColor: '#000', tabBarIndicatorStyle: {
            backgroundColor: '#000'},}}>
          <MaterialTopTabs.Screen name="readedNotification" options={{ title: 'All Notification' }} />
          <MaterialTopTabs.Screen name="unreadNotification" options={{ title: 'Unread' }}   />
      </MaterialTopTabs>
      </>
    );
  };
  
  export default MaterialTopTabsLayout;

  const styles = StyleSheet.create(
    {
        container:{
          flex:0,
          marginTop:15,
          marginBottom:10,
          marginLeft:5,
          marginRight:5,
          justifyContent:'center',
          alignItems:'center',
        },
        container2:{
            width:"95%",
            backgroundColor:"#C7F9FF",
            borderWidth:1,
            borderRadius:4,
            borderColor:"#0195B5",
            height:100,
        },
        DrawerContainer: {
          flexDirection: "row", // Align items in a row
          alignItems: "center", // Vertically center items
          padding: 10,
          marginTop: 20,
          borderBottomWidth: 0.5,
        },
        DrawerText: {
          fontSize: 24,
          marginLeft: 20, // Add some spacing between the arrow and the text
        },
    }
  )