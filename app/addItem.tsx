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
  Button,
  ActivityIndicator,
} from 'react-native';
import EventField from '@/components/EventField';
import ActionButton from '@/components/ActionButton';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAddItem } from '@/api/Items/addItem';
import * as FileSystem from 'expo-file-system';

const NewFormPage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expectedCost, setExpectedCost] = useState('');
  const [itemAddFields, setItemAddFields] = useState([{ value: '' }]); // Initialize with an empty field
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { mutate: addItem } = useAddItem();
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  // For camera Permission
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

  const handleBack = () => {
    router.push('/(root)/(screen)/(menu)/eventitem');
  };

  const handleBackPress = () => {
    router.push('/(root)/(screen)/(menu)/eventitem');
  };

  // Adding image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      const imageBase64String = (await convertImageToBase64(result.assets[0].uri)) as string;
      setImageBase64(imageBase64String);
    }
  };

  // removing selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImageBase64(null);
  };

  // Capture image
  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      const imageBase64String = (await convertImageToBase64(result.assets[0].uri)) as string;
      setImageBase64(imageBase64String);
    }
  };

  // converting image to Base64
  const convertImageToBase64 = async (imageUri: string) => {
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
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      if (imageBase64) {
        const itemAddFieldsValues = itemAddFields.map((field) => field.value);
        addItem({
          itemId: Number(),
          itemName: name,
          itemType: category,
          itemDesc: description,
          itemCost: Number(expectedCost),
          itemImagePath: imageBase64, // imageBase64 is guaranteed to be a string
          imageString: '',
          itemAddFields: itemAddFieldsValues.join(','),
        });
        // console.log(itemAddFieldsValues);
      } else {
        Alert.alert('Image not selected!');
      }
      router.replace('/(root)/(screen)/(menu)/eventitem');
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting the form.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddField = () => {
    setItemAddFields([...itemAddFields, { value: '' }]);
  };

  const handleRemoveField = (index: number) => {
    setItemAddFields(itemAddFields.filter((field, i) => i!== index));
  };

  const handleFieldChange = (index: number, value: string) => {
    setItemAddFields(
      itemAddFields.map((field, i) => (i === index? { value } : field))
    );
  };

  return (
    <>
      <View style={styles.DrawerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Feather name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.DrawerText}>Add Item</Text>
      </View>

      <SafeAreaView style={styles.container}>
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

            {/* ------------- Adding pictures -------------- */}

            <View style={styles.imageInputContainer}>
              {!selectedImage && (
                <>
                 <TouchableOpacity onPress={pickImage} style={styles.imageInputBtn}>
                <Text style={styles.imageInputBtnText}>Upload Image</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={takePicture} style={styles.imageInputBtn}>
                <Text style={styles.imageInputBtnText}>Take Picture</Text>
              </TouchableOpacity></>
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
            {itemAddFields.map((field, index) => (
              <View key={index} style={styles.addFieldContainer}>
                <EventField
                  title="Add Item Fields"
                  value={field.value}
                  placeholder="eg. Height = 2ft"
                  handleChangeText={(value: any) => handleFieldChange(index, value)}
                />
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => handleRemoveField(index)}
                    style={styles.removeFieldBtn}
                  >
                    <FontAwesome
                      name="trash"
                      size={20}
                      color="black"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={handleAddField} style={styles.addFieldBtn}>
              <Text style={styles.addFieldText}>+ Add Item Fields</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <ActionButton
                label="Back"
                onPress={handleBack}
                enabled={true}
                style={styles.footerButton}
              />
              {isUploading? (
              <ActivityIndicator size="small" color="#0195B5" style={styles.icon} />
              ) : (
              <ActionButton
                label="Submit"
                onPress={handleSubmit}
                enabled={true}
                style={styles.footerButton}
              />)}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    backgroundColor:'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1.5,
    marginBottom: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 80,
    backgroundColor: 'yellow',
    width: 30,        // Set width and height to be equal
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


  addFieldContainer: {
    width: 370,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addFieldBtn: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor:'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1.5,
    flex: 1,
    marginHorizontal: 5,
  },
  addFieldText: {
    color: '#000',
    fontSize: 16,
  },
  removeFieldBtn: {
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
});

export default NewFormPage;
