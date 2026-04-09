import { db } from './server/firebaseAdmin.js';
async function test() {
  const snapshot = await db.collection('questions').limit(10).get();
  snapshot.docs.forEach(doc => {
    console.log(doc.id, doc.data().cost);
  });
}
test();
