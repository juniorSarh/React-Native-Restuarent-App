const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAKHFs-SHzlAoOvD8duZb1he0samAj8q0k",
  authDomain: "rn-restuarant-app-64df9.firebaseapp.com",
  projectId: "rn-restuarant-app-64df9",
  storageBucket: "rn-restuarant-app-64df9.appspot.com",
  messagingSenderId: "262220698487",
  appId: "1:262220698487:web:f347802208e00ec4c8c772",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestoreWrite() {
  try {
    console.log('Testing Firestore write to fooditems collection...');
    
    const testData = {
      name: 'Test Burger',
      description: 'A delicious test burger',
      price: 99.99,
      category: 'pizza',
      available: true,
      imageUrl: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'fooditems'), testData);
    console.log('✅ Successfully wrote to Firestore!');
    console.log('Document ID:', docRef.id);
    console.log('Collection: fooditems');
    
  } catch (error) {
    console.error('❌ Firestore write failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

testFirestoreWrite();
