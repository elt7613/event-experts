import { Link } from "expo-router";
import { Text, Pressable, StyleSheet, View } from "react-native";

const LinkButton = ({ label, onPress, linkPage }: any) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Link href={linkPage} style={styles.text}>
          {label}
        </Link>
      </Pressable>
    </View>
  );
};

export default LinkButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    width: "auto",
    backgroundColor: "#fef100",
    borderRadius: 6,
    alignContent: "center",
    justifyContent: "center",
    borderColor: "#c5ba00",
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center",
    fontFamily: "MontserratLight",
  },
});
