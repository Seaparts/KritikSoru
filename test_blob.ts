try {
  const blob = new Blob(['test'], { type: 'image/invalid' });
  console.log("Blob works");
} catch (e) {
  console.error("Error Blob:", e);
}
