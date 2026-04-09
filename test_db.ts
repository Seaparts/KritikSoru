import { db } from './server/firebaseAdmin';
async function run() {
  const snapshot = await db.collection('questions').limit(5).get();
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data().cost);
  });
}
run();
