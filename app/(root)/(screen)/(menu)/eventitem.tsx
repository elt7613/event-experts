import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { images } from "@/constants";
import AddButton from "@/components/AddButton";
import SearchBar from "@/components/SearchBar";
import { Feather } from "@expo/vector-icons";
import { getItems } from "@/api/Items/getItems";
import ItemCard from "@/components/ItemCard";
import { useFocusEffect, useRouter } from "expo-router";
import { getHash } from "@/api/userHashItems/getHash";
import * as Clipboard from "expo-clipboard";
import { useDebounce } from "@/hooks/useDebounce";

const eventitem = () => {
  const [search, setSearch] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  // Clipboard finction
  const { data, isLoading: isLoadingItems , refetch} = getItems();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { refetch: refetchHash } = getHash();
  // Search item
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);
  const debouncedSearch = useDebounce(search, 300);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const openItemCreation = () => {
    router.push("/addItem");
  };

  // Refresh on pull-down
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, []);

  // Refresh when navigating back to the screen
  useFocusEffect(
    useCallback(() => {
      
      refetch();
    }, [])
  );

  // Switch toggle
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    Animated.timing(animatedValue, {
      toValue: isEnabled ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 27],
  });

  // Clipboard function
  const handleClipboardPress = async () => {
    setIsLoading(true);
    try {
      const result = await refetchHash();
      const hash = result.data;

      const baseUrl = "http://eventexperts.in/Home/auth";
      const showCost = isEnabled ? "true" : "false";
      const link = `${baseUrl}/${hash}/${showCost}`;

      await Clipboard.setStringAsync(link);
      Alert.alert(
        "Successful", 
        `Copy to Clipboard `, // Message in the alert
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: true } // Allow dismissal by tapping outside
      );
      
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  // Iteam Search
  useEffect(() => {
    if (data) {
      setAllItems(data);
    }
  }, [data]);

  useEffect(() => {
    if (debouncedSearch) {
      const lowercasedSearch = debouncedSearch.toLowerCase();
      const filteredItems = allItems.filter((item) =>
        item.itemName.toLowerCase().includes(lowercasedSearch)
      );
      setSearchResults(filteredItems);
      // console.log(filteredItems);
    } else {
      setSearchResults([]);
      // console.log([]);
    }
  }, [debouncedSearch, allItems]);

  const displayItems = searchResults.length > 0 ? searchResults : allItems;

  return (
    <>
      {data && data.length > 0 && (
        // Search option
        <View style={styles.TopOptions}>
          <SearchBar
            value={search}
            placeholder="Search items by name"
            handleChangeText={(e: string) => setSearch(e)}
            customWidth="90%"
          />

          {/* Toggle button */}
          <View style={{ alignItems: "center", marginRight: 80 }}>
            <Text style={styles.toggleText}>
              {isEnabled ? "Hide Price" : "Show Price"}
            </Text>
            <TouchableOpacity
              style={[styles.toggleButton]}
              onPress={toggleSwitch}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.switch,
                  {
                    transform: [{ translateX: thumbPosition }],
                    backgroundColor: isEnabled ? "#fef100" : "#000",
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Clipboard button */}
          <TouchableOpacity onPress={handleClipboardPress} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#000"
                style={styles.clipboard}
              />
            ) : (
              <Feather
                name="clipboard"
                size={24}
                color="black"
                style={styles.clipboard}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
      <ScrollView style={{ marginTop: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        {error && <Text style={styles.errorText}>{error}</Text>}
        {displayItems && displayItems.length > 0 ? (
          // Displaying Items
          <View style={styles.ItemContainer}>
            <View style={styles.row}>
            <View style={styles.fixedComponent}>
                <TouchableOpacity onPress={openItemCreation}>
                  <View style={styles.square}>
                    <Text style={styles.plus}>+</Text>
                  </View>
                </TouchableOpacity>
              </View>
              
              {displayItems.slice(0, 1).map((event) => (
                <ItemCard
                  key={event.itemId}
                  keyId={event.itemId}
                  title={event.itemName}
                  itemType={event.itemType}
                  imageUrl={event.itemImagePath}
                  price={event.itemCost}
                  ShowPrice={isEnabled}
                />
              ))}
              
            </View>

            {Array.from({
              length: Math.ceil(displayItems.slice(2).length / 2),
            }).map((_, rowIndex) => (
              <View style={styles.row} key={rowIndex}>
                {displayItems
                  .slice(2 + rowIndex * 2, 2 + (rowIndex + 1) * 2)
                  .map((event) => (
                    <ItemCard
                      key={event.itemId}
                      keyId={event.itemId}
                      title={event.itemName}
                      itemType={event.itemType}
                      imageUrl={event.itemImagePath}
                      price={event.itemCost}
                      ShowPrice={isEnabled}
                    />
                  ))}
              </View>
            ))}
          </View>
        ) : (
          // Little  Animation - No item
          <View style={styles.container}>
            {search ? (
              <Text style={styles.noResultsText}>No items found</Text>
            ) : (
              <>
                <Image source={images.boxGif} style={styles.gif} />
                <AddButton onPress={"/addItem"} label="Add Items" />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default eventitem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  gif: {
    width: 200,
    height: 200,
  },
  TopOptions: {
    flexDirection: "row",
  },
  share: {
    position: "absolute",
    marginTop: 28,
    right: 70,
  },
  clipboard: {
    position: "absolute",
    marginTop: 28,
    right: 30,
  },
  toggleButton: {
    width: 46,
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "transparent",
    justifyContent: "center",
    padding: 2,
  },
  switch: {
    width: 14,
    height: 14,
    borderRadius: 10,
    position: "absolute",
    top: 2,
  },
  toggleText: {
    fontSize: 10,
    fontFamily: "MontserratLight",
    marginTop: 18,
    fontWeight: "heavy",
    marginBottom: 2,
  },
  ItemContainer: {
    flex: 1,
    padding: 5,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 5,
  },
  fixedComponent: {
    height: 215,
    width: 167,
    maxWidth: 180,
    // borderWidth: 1,
    margin: 5,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: 45,
    height: 45,
    backgroundColor: "#fef100",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c5ba00",
    marginLeft: 40,
    marginRight: 40,
  },
  plus: {
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: "MontserratRegular",
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "MontserratRegular",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
