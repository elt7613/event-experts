import { MaterialIcons } from "@expo/vector-icons";
import { Text, View,StyleSheet } from "react-native";

export default function CustomDrawerLabel({title,subTitle}:any) {
    return (
      <View style={styles.drawerLabelContainer}>
        <View>
          <Text style={styles.drawerTitle}>{title}</Text>
          <Text style={styles.drawerSubtitle}>{subTitle}</Text> 
        </View>
        <MaterialIcons name="arrow-forward-ios" size={24} color="black" style={styles.icon}/>
      </View>
    );
  }

  const styles = StyleSheet.create({
    drawerLabelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    drawerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    drawerSubtitle: {
        fontSize: 12,
        color: '#888',
    },
    icon: {
        marginRight: -10,
    }
  })