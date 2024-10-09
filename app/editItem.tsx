import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import EventField from '@/components/EventField';
import ActionButton from '@/components/ActionButton';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { useEditItem } from '@/api/Items/editItem';

const NewFormPage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expectedCost, setExpectedCost] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [itemAddFieldsArray, setItemAddFieldsArray] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate: editItem } = useEditItem();
  const { KeyId } = useGlobalSearchParams();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status!== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libraryStatus!== 'granted') {
        alert('Sorry, we need photo library permissions to make this work!');
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/items/${KeyId}`
        );
        const itemData = response.data;
        setName(itemData.itemName);
        setCategory(itemData.itemType);
        setDescription(itemData.itemDesc);
        setExpectedCost(itemData.itemCost.toString());
        setImageUri(itemData.itemImagePath);
        const itemAddFields = itemData.itemAddFields.split(',');
        setItemAddFieldsArray(itemAddFields);
      } catch (error) {
      }
    };
    fetchData();
  }, [KeyId]);

  const handleBackPress = useCallback(() => {
    router.replace('/(root)/(screen)/(menu)/eventitem');
  }, [router]);

  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImageUri(null);
      const imageBase64String = (await convertImageToBase64(result.assets[0].uri)) as string;
      setImageBase64(imageBase64String);
    }
  }, []);

  const takePicture = useCallback(async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImageUri(null);
      const imageBase64String = (await convertImageToBase64(result.assets[0].uri)) as string;
      setImageBase64(imageBase64String);
    }
  }, []);

  const convertImageToBase64 = useCallback(async (imageUri: string) => {
    if (imageUri.startsWith('file://')) {
      // Image from device
      const file = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });
      return file;
    } else {
      // image from camera
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    }
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setImageBase64(null);
    setImageUri(null);
  }, []);

  const handleAddField = useCallback(() => {
    setItemAddFieldsArray([...itemAddFieldsArray, '']);
  }, [itemAddFieldsArray]);

  const handleRemoveField = useCallback((index: number) => {
    const newArray = [...itemAddFieldsArray];
    newArray.splice(index, 1);
    setItemAddFieldsArray(newArray);
  }, [itemAddFieldsArray]);

  const handleSubmit = useCallback(async () => {
    setIsUploading(true);
    try {
      const payload = {
        itemId: Number(KeyId),
        itemName: name,
        itemType: category,
        itemDesc: description,
        itemCost: Number(expectedCost),
        itemImagePath: imageBase64 || imageUri || '',
        imageString: '',
        itemAddFields: itemAddFieldsArray.join(','),
      };
      editItem(payload);
      router.replace('/(root)/(screen)/(menu)/eventitem');
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting the form.');
    } finally {
      setIsUploading(false);
    }
  }, [
    KeyId,
    name,
    category,
    description,
    expectedCost,
    imageBase64,
    imageUri,
    itemAddFieldsArray,
    editItem,
    router,
  ]);

  const handleDeleteItem = useCallback(async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this Item?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const response = await axios.put(
                `http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/items/delete/${KeyId}`
              );
              Alert.alert('Success', 'Item is deleted successfully!', [{ text: 'OK' }]);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete Item. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
        {
          text: 'No',
          onPress: () => console.log('Delete cancelled'),
        },
      ],
      { cancelable: false }
    );
  }, [KeyId, router]);

  return (
    <SafeAreaView style={styles.container}>

    <View style={styles.DrawerContainerTop}>
        <TouchableOpacity onPress={handleBackPress}>
          <Feather name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.DrawerTextTop}>Edit Item</Text>
      </View>
      
      <ScrollView>
        <View style={styles.form}>
          <EventField
            title="Name"
            value={name}
            placeholder="Enter name"
            handleChangeText={setName}
          />
          <EventField
            title="Category"
            value={category}
            placeholder="Enter category"
            handleChangeText={setCategory}
          />
          <EventField
            title="Description"
            value={description}
            placeholder="Enter description"
            handleChangeText={setDescription}
          />
          <EventField
            title="Expected Cost"
            value={expectedCost}
            placeholder="Enter expected cost"
            keyboardType="numeric"
            handleChangeText={setExpectedCost}
          />
          
          <View style={styles.imageInputContainer}>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}
          </View>
          <View style={styles.imageInputContainer}>
            {!selectedImage && (
              <>
                <TouchableOpacity onPress={pickImage} style={styles.imageInputBtn}>
                  <Text style={styles.imageInputBtnText}>Upload New Image</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture} style={styles.imageInputBtn}>
                  <Text style={styles.imageInputBtnText}>Take New Picture</Text>
                </TouchableOpacity>
              </>
            )}
            {selectedImage && (
              <>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <TouchableOpacity onPress={removeImage} style={styles.removeImageBtn}>
                  <Text style={styles.removeImageText}>x</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Item Add Fields */}
          {itemAddFieldsArray.map((word, index) => (
            <View key={index} style={styles.addFieldContainer}>
              <EventField
                title={`Field ${index + 1}`}
                value={word}
                placeholder={"eg. Height = 234"}
                handleChangeText={(text: any) => {
                  const newArray = [...itemAddFieldsArray];
                  newArray[index] = text;
                  setItemAddFieldsArray(newArray);
                }}
              />
             <TouchableOpacity
              key={index}
              onPress={() => handleRemoveField(index)}
              style={styles.removeFieldBtn}
            >
              <FontAwesome
                      name="trash"
                      size={20}
                      color="black"
                      style={[styles.icon, { marginLeft: -6 }]}
                    />
            </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={handleAddField} style={styles.addFieldBtn}>
            <Text style={styles.addFieldText}>+ Add Item Fields</Text>
          </TouchableOpacity>


          <View style={styles.footer}>
            <ActionButton
              label="Delete"
              onPress={handleDeleteItem}
              enabled={true}
              style={styles.deleteButton}
            />
            {isUploading? (
              <ActivityIndicator size="small" color="#0195B5" style={styles.icon} />
            ) : (
              <ActionButton
                label="Update"
                onPress={handleSubmit}
                enabled={true}
                style={styles.footerButton}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop:5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    minWidth: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  footerButton: {
    width: '45%',
  },
  DrawerContainer: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Vertically center items
    padding: 10,
    marginTop: 25,
    borderBottomWidth: 0.5,
  },
  DrawerText: {
    fontSize: 20,
    fontFamily: 'MontserratMedium',
    marginLeft: 30, // Add some spacing between the arrow and the text
  },
  scrollView: {
    height: 200,
    marginTop: '25%',
  },

  imagePreview: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginTop: 10,
  },

  imageInputBtnText: {
    fontSize: 14,
    color: '#000',
  },

  imageInputContainer: {
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageInputBtn: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 80,
    backgroundColor: 'yellow',
    width: 30, // Set width and height to be equal
    height: 30,
    borderRadius: 100,
    justifyContent: 'center', // Center the text horizontally
    alignItems: 'center',
  },
  removeImageText: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
  },

  icon: {
    marginLeft: 15,
    color: '#000',
  },

  deleteButton: {
    width: '45%',
    backgroundColor: '#fef100',
  },
  addFieldBtn: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  addFieldText: {
    fontSize: 14,
    color: '#000',
  },
  removeFieldBtn: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  addFieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "90%",
    marginBottom: 10,
  },
  DrawerContainerTop: {
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Vertically center items
    padding: 10,
    marginTop:25,
    borderBottomWidth: 0.5,
  },
  DrawerTextTop: {
    fontSize: 20,
    fontFamily: "MontserratMedium",
    marginLeft: 30, // Add some spacing between the arrow and the text
  },
});

export default NewFormPage;
