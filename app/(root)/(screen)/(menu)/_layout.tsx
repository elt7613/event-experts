import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap,
  } from "@react-navigation/material-top-tabs";
  import { View , StyleSheet} from "react-native";
  import { withLayoutContext } from "expo-router";
  import { ParamListBase, TabNavigationState } from "@react-navigation/native";
  import React from "react";
import Notification from "@/components/Notification";
import { userInfo } from "@/api/getUserInfo";
  
  const { Navigator } = createMaterialTopTabNavigator();
  
  
  export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap>(Navigator);
  
  const MaterialTopTabsLayout = () => {
    const { data } = userInfo();
    return (
      <>
      <View style={{backgroundColor:"white",borderTopWidth:1,borderTopColor:"grey"}}>
        <View style={styles.container}>
          <View style={styles.container2}>
           <Notification
           KeyId = ''
           Company = {data?.emEventOrg}
           Email = {data?.emEmailId}
           Phone = {data?.emMobile}
           />
          </View>
        </View>
      </View>
      
      <MaterialTopTabs screenOptions={{ tabBarActiveTintColor: '#000', tabBarIndicatorStyle: {
            backgroundColor: '#000'},}}>
          <MaterialTopTabs.Screen name="eventitem" options={{ title: 'Event Items' }} />
          <MaterialTopTabs.Screen name="eventdetail" options={{ title: 'Event Details' }}   />
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
        }
    }
  )