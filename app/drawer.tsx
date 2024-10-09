import { View, Text,Image,StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const drawer = () => {
  const router = useRouter();
  return (
   <SafeAreaView  style={style.background}>
    <View style={style.imageContainer}>
     <Image style={style.image} source={images.Logo} />
    </View>

    <TouchableOpacity onPress={()=> router.push('/(root)/(screen)/(menu)/eventitem')} style={[style.container1,{backgroundColor:'#C7F9FF',borderRadius:6}]}>
      <Ionicons name="arrow-back" size={24} color="black" style={style.leftIcon1} />    
        <View style={style.centerTextContainer1}>
          <Text style={style.mainText1}>My Menu</Text>
        </View>
      <Ionicons size={24} color="black" style={style.rightIcon1} />
    </TouchableOpacity>

    <TouchableOpacity onPress={()=> router.push('/(root)/(screen)/eventitem')} style={style.container}>
    <Ionicons name="cart-outline" size={24} color="black" style={style.leftIcon} />
        <View style={style.centerTextContainer}>
          <Text style={style.mainText}>Event Items</Text>
          <Text style={style.subText}>Manage your Items</Text>
        </View>
        <AntDesign name="right" size={24} color="black" style={style.rightIcon} />
    </TouchableOpacity>

    <TouchableOpacity onPress={()=> router.push('/(root)/(screen)/eventdetail')} style={style.container}>
    <Feather name="sunset" size={24} color="black" style={style.leftIcon} />
        <View style={style.centerTextContainer}>
          <Text style={style.mainText}>Event Details</Text>
          <Text style={style.subText}>Manage your Details</Text>
        </View>
        <AntDesign name="right" size={24} color="black" style={style.rightIcon} />
    </TouchableOpacity>

    <TouchableOpacity onPress={()=> {AsyncStorage.clear(),router.push('/')}} style={style.container1}>
    <MaterialIcons
              name="logout"
              size={24}
              color="#333"
              style={{ transform: [{ rotate: "180deg" }] }}
            /> 
        <View style={style.centerTextContainer1}>
          <Text style={style.logout}>Log Out</Text>
        </View>
      <Ionicons size={24} color="black" style={style.rightIcon1} />
    </TouchableOpacity>

   </SafeAreaView>
  )
}

export default drawer;

const style = StyleSheet.create({
  imageContainer:{
    height:60,
  },
  background: {
    backgroundColor:'white',
    height:1000,
  },
  image: {
    marginTop:10,
    marginLeft: 10,
    width: 160,
    height: 40,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    margin:5
  },
  leftIcon: {
    flex: 1, // Give more space to the left icon
  },
  centerTextContainer: {
    flex: 3, // Slightly less space for the center text, shifting it left
    alignItems: 'flex-start', // Align the text slightly towards the left
  },
  mainText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 12,
    color: 'gray',
  },
  rightIcon: {
    flex: 0.6, // Space for the right icon
    alignItems: 'flex-end',
  },

  container1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    margin:5
  },
  leftIcon1: {
    flex: 1,
  },
  centerTextContainer1: {
    flex: 3,
    alignItems: 'flex-start', // Centers the main text horizontally
  },
  mainText1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logout:{
    marginLeft:50,
    fontSize:16,
    fontWeight:'bold',
  },
  rightIcon1: {
    flex: 0.6,
    alignItems: 'flex-end',
  },
});