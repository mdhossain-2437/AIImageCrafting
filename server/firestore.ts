import { db } from "../client/src/lib/firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	DocumentData,
} from "firebase/firestore";

// Collection names
const COLLECTIONS = {
	USERS: "users",
	IMAGES: "images",
	STYLE_PRESETS: "style_presets",
	AI_MODELS: "ai_models",
	MODEL_TUNINGS: "model_tunings",
};

// Generic type for Firestore document
type FirestoreDoc<T> = T & { id: string };

// Generic CRUD operations
const firestoreService = {
	// Create a new document
	async create<T extends DocumentData>(
		collectionName: string,
		data: T
	): Promise<FirestoreDoc<T>> {
		const collectionRef = collection(db, collectionName);
		const docRef = await addDoc(collectionRef, {
			...data,
			createdAt: new Date().toISOString(),
		});
		return { ...data, id: docRef.id };
	},

	// Get a document by ID
	async getById<T>(
		collectionName: string,
		id: string
	): Promise<FirestoreDoc<T> | null> {
		const docRef = doc(db, collectionName, id);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) return null;
		return { ...(docSnap.data() as T), id: docSnap.id };
	},

	// Get all documents in a collection
	async getAll<T>(collectionName: string): Promise<FirestoreDoc<T>[]> {
		const collectionRef = collection(db, collectionName);
		const querySnapshot = await getDocs(collectionRef);
		return querySnapshot.docs.map((doc) => ({
			...(doc.data() as T),
			id: doc.id,
		}));
	},

	// Update a document
	async update<T extends DocumentData>(
		collectionName: string,
		id: string,
		data: Partial<T>
	): Promise<void> {
		const docRef = doc(db, collectionName, id);
		await updateDoc(docRef, {
			...data,
			updatedAt: new Date().toISOString(),
		});
	},

	// Delete a document
	async delete(collectionName: string, id: string): Promise<void> {
		const docRef = doc(db, collectionName, id);
		await deleteDoc(docRef);
	},

	// Query documents
	async query<T>(
		collectionName: string,
		field: string,
		operator: "==" | "!=" | "<" | "<=" | ">" | ">=",
		value: any
	): Promise<FirestoreDoc<T>[]> {
		const collectionRef = collection(db, collectionName);
		const q = query(collectionRef, where(field, operator, value));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => ({
			...(doc.data() as T),
			id: doc.id,
		}));
	},
};

export { firestoreService, COLLECTIONS };
