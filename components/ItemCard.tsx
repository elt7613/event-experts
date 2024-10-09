import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const ItemCard = ({
  keyId,
  title,
  itemType,
  imageUrl,
  price,
  ShowPrice,
}: {
  keyId: number;
  title: string;
  itemType: string;
  imageUrl: string;
  price: number;
  ShowPrice: boolean;
}) => {

  const router = useRouter();

  const editPageRedirect = () => {
    router.push(`/editItem?KeyId=${keyId}`); 
  }

  return (
    <Pressable onPress={editPageRedirect}>
      <View key={keyId} style={styles.container}>
        <Text style={styles.TextStyle}>{title}</Text>

        {ShowPrice ? (
          <>
            <Image source={{ uri: `${imageUrl}` }} width={135} height={135} style={styles.image} />
            <Text style={styles.TextStyle}>{itemType}</Text>
            <Text style={styles.PriceText}>Rs. {price}</Text>
          </>
        ) : (
          <>
          <Image
            source={{ uri: `${imageUrl}` }}
            width={150}
            height={150}
            style={styles.image}
          />
          <Text style={styles.TextStyle}>{itemType}</Text>
          </>
        )}
        
      </View>
    </Pressable>
  );
};

export default ItemCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 167,
    height: 215,
    maxWidth: 180,
    borderWidth: 1,
    margin: 5,
    borderRadius: 4,
  },
  TextStyle: {
    textAlign: "center",
    width: "100%",
    fontSize: 14,
    marginBottom: 2,
    marginTop: 2,
    fontFamily: "MontserratMedium",
  },
  PriceText: {
    marginTop: 3,
    marginBottom: 3,
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 14,
    backgroundColor: "#fef100",
    fontFamily: "MontserratMedium",
  },
  image: {
    marginBottom: 0,
    borderRadius: 8,
    objectFit: 'cover'
  },
});
