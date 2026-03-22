import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

let db: FirebaseFirestore.Firestore;
let storage: any;

try {
  let config: any = {};
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } else {
    console.warn("firebase-applet-config.json not found. Falling back to environment variables.");
    config = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || "(default)"
    };
  }

  if (!getApps().length) {
    // Check if a service account JSON string is provided via environment variables (e.g., on Render)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({
          credential: cert(serviceAccount),
          storageBucket: config.storageBucket || `${config.projectId}.appspot.com`
        });
        console.log("Firebase Admin initialized with Service Account from ENV.");
      } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", e);
      }
    } else {
      // Otherwise, it will try to use Application Default Credentials (works in AI Studio / Google Cloud)
      initializeApp({
        projectId: config.projectId,
        storageBucket: config.storageBucket || `${config.projectId}.appspot.com`
      });
      console.log("Firebase Admin initialized with Application Default Credentials.");
    }
  }

  // In firebase-admin v12+, you can specify the database ID if needed
  // If getFirestore doesn't accept a second argument in your version, you might need to use the default database
  // or configure it via the app options.
  try {
    // @ts-ignore
    db = getFirestore(getApps()[0], config.firestoreDatabaseId);
  } catch (e) {
    db = getFirestore();
  }
  
  storage = getStorage();
  console.log("Firebase Admin initialized.");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

export { db, storage };
