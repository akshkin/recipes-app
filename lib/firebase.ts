// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from "firebase/app";
import {
  getStorage,
  deleteObject,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-MGqP8Bb6j7-9woGyeeMbCecfq_bsQx0",
  authDomain: "recipes-app-b4ceb.firebaseapp.com",
  projectId: "recipes-app-b4ceb",
  storageBucket: "recipes-app-b4ceb.appspot.com",
  messagingSenderId: "840731082180",
  appId: "1:840731082180:web:9d02cc67412a3e6f42b891",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export async function uploadImage(file: any) {
  console.log(file);
  const storageRef = ref(storage, file.name);
  await uploadBytes(storageRef, file);
  // const imageRef = storageRef.child(file.name);
  // await imageRef.put(file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

export async function deleteImage(filePath: string) {
  try {
    const storageRef = ref(storage, filePath);

    await deleteObject(storageRef);
  } catch (error) {
    console.log(error);
  }
}
