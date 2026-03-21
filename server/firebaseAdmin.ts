import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

let db: FirebaseFirestore.Firestore;
let storage: any;

try {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  if (!getApps().length) {
    // If you have a service account key, you can use it here:
    // const serviceAccount = require('./serviceAccountKey.json');
    // initializeApp({ credential: cert(serviceAccount), storageBucket: config.storageBucket });
    
    // Otherwise, it will try to use Application Default Credentials
    initializeApp({
      projectId: config.projectId,
      storageBucket: config.storageBucket || `${config.projectId}.appspot.com`
    });
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
