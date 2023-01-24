//hooks
import { useState, useEffect } from "react";

// db
import { db } from "../firebase/config";

import { useReducer } from "react";

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    where,
} from "firebase/firestore";

export const useFetchDocuments = (
    docColletction,
    search = null,
    uid = null,
) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (cancelled) return;

            setLoading(true);
            const collectionRef = await collection(db, docColletction);

            try {
                let q;
                q = await query(collectionRef, orderBy("createdAt", "desc"));

                await onSnapshot(q, (querySnapshot) => {
                    setDocuments(
                        querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        })),
                    );
                });

                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.message);
                setLoading(false);
            }
        };
        loadData();
    }, [docColletction, search, uid, cancelled]);

    useEffect(() => {
        return setCancelled(true);
    }, []);

    return { documents, loading, error };
};