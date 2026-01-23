import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../config/firebase";

export const uploadImage = async (fileUri: string, path: string): Promise<string> => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const storageRef = ref(storage, path);

    await uploadBytesResumable(storageRef, blob);

    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error: any) {
    console.error("Storage upload error:", error);
    
    // Handle CORS errors for web development
    if (error.message?.includes('CORS') || error.message?.includes('blocked by CORS policy')) {
      throw new Error("Image upload blocked by CORS policy. This is a web development issue. On mobile devices, this will work fine. For web testing, you can:\n1. Test on a real mobile device\n2. Use a different image hosting service\n3. Configure Firebase Storage CORS rules");
    }
    
    throw new Error("Failed to upload image: " + error.message);
  }
};

export default uploadImage;