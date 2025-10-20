import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./src/firebase.js";

async function seedJob() {
  await addDoc(collection(db, "jobs"), {
    title: "React Frontend Engineer",
    description: "Build responsive UI for Portfolink features.",
    company: "Portfolink",
    skills: ["React", "Tailwind", "Firebase"],
    type: "Remote",
    budget: 1200,
    payType: "fixed",
    duration: "4 weeks",
    postedBy: "admin",
    createdAt: serverTimestamp(),
  });
  console.log("✅ Job added successfully!");
}

seedJob();
