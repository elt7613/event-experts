import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const AutoCloseModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (modalVisible) {
      const timer = setTimeout(() => {
        setModalVisible(false);
      }, 3000); // Closes after 3 seconds

      return () => clearTimeout(timer); // Cleanup in case the modal closes before timeout
    }
  }, [modalVisible]);

  const showModal = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Button to trigger the modal */}
      <TouchableOpacity style={styles.showButton} onPress={showModal}>
        <Text style={styles.buttonText}>Show Modal</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)} // Android back button close
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>This message will close in 3 seconds</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AutoCloseModal;
