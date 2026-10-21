/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { Perfume, CartItem } from '../types/perfume';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'customer' | 'connoisseur' | 'admin';
  createdAt: string;
}

export interface UserFavorite {
  perfumeId: string;
  perfumeName: string;
  category?: string;
  addedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  size?: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  isDiscoveryKit?: boolean;
  kitVials?: string[];
  customMonogram?: string;
}

export interface UserOrder {
  orderId: string;
  userId: string;
  customerEmail: string;
  totalAmount: number;
  status: 'confirmed' | 'processing' | 'macerating' | 'shipped' | 'delivered';
  itemsCount: number;
  items?: OrderItem[];
  sampleChoice?: string;
  trackingNumber?: string;
  shippingAddress?: string;
  createdAt: string;
}

export interface SavedDiscoveryKit {
  kitId: string;
  userId: string;
  vial1: string;
  vial2: string;
  vial3: string;
  monogram?: string;
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  favorites: UserFavorite[];
  orders: UserOrder[];
  ordersLoading: boolean;
  ordersError: string | null;
  savedKits: SavedDiscoveryKit[];
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  toggleFavorite: (perfume: Perfume) => Promise<void>;
  isFavorite: (perfumeId: string) => boolean;
  saveOrder: (order: Omit<UserOrder, 'userId' | 'createdAt'>) => Promise<void>;
  createSampleOrder: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  saveCustomKit: (vials: string[], monogram: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [savedKits, setSavedKits] = useState<SavedDiscoveryKit[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Sync or retrieve user profile in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (!snap.exists()) {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              displayName: currentUser.displayName || 'Scent Connoisseur',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || undefined,
              role: 'connoisseur',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          } else {
            setProfile(snap.data() as UserProfile);
          }
        } catch (err) {
          console.error('Error fetching/creating user profile:', err);
        }
      } else {
        setProfile(null);
        setFavorites([]);
        setOrders([]);
        setSavedKits([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time listener for user favorites
  useEffect(() => {
    if (!user) return;

    const path = `users/${user.uid}/favorites`;
    const favCol = collection(db, 'users', user.uid, 'favorites');
    const unsub = onSnapshot(
      favCol,
      (snapshot) => {
        const favs: UserFavorite[] = snapshot.docs.map((d) => d.data() as UserFavorite);
        setFavorites(favs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsub();
  }, [user]);

  // Real-time listener for user orders from the root 'orders' collection in Firestore
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    const path = 'orders';
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
    
    const unsub = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ords: UserOrder[] = snapshot.docs.map((d) => d.data() as UserOrder);
        setOrders(ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setOrdersLoading(false);
        setOrdersError(null);
      },
      (error) => {
        console.error('Error fetching orders from Firestore:', error);
        setOrdersError(error.message);
        setOrdersLoading(false);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsub();
  }, [user]);

  // Real-time listener for user discovery kits
  useEffect(() => {
    if (!user) return;

    const path = `users/${user.uid}/discoveryKits`;
    const kitsCol = collection(db, 'users', user.uid, 'discoveryKits');
    const unsub = onSnapshot(
      kitsCol,
      (snapshot) => {
        const kits: SavedDiscoveryKit[] = snapshot.docs.map((d) => d.data() as SavedDiscoveryKit);
        setSavedKits(kits);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsub();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign-in error:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
      throw err;
    }
  };

  const toggleFavorite = async (perfume: Perfume) => {
    if (!user) return;

    const favDocRef = doc(db, 'users', user.uid, 'favorites', perfume.id);
    const path = `users/${user.uid}/favorites/${perfume.id}`;

    const exists = favorites.some((f) => f.perfumeId === perfume.id);
    try {
      if (exists) {
        await deleteDoc(favDocRef);
      } else {
        const newFav: UserFavorite = {
          perfumeId: perfume.id,
          perfumeName: perfume.name,
          category: perfume.category,
          addedAt: new Date().toISOString(),
        };
        await setDoc(favDocRef, newFav);
      }
    } catch (err) {
      handleFirestoreError(err, exists ? OperationType.DELETE : OperationType.CREATE, path);
    }
  };

  const isFavorite = (perfumeId: string) => {
    return favorites.some((f) => f.perfumeId === perfumeId);
  };

  // Save order to the root 'orders' collection in Firestore
  const saveOrder = async (orderData: Omit<UserOrder, 'userId' | 'createdAt'>) => {
    if (!user) return;

    const path = `orders/${orderData.orderId}`;
    const orderDocRef = doc(db, 'orders', orderData.orderId);

    const fullOrder: UserOrder = {
      ...orderData,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      // Primary write: Root 'orders' collection
      await setDoc(orderDocRef, fullOrder);

      // Secondary sync: User subcollection for redundancy
      try {
        const userSubDoc = doc(db, 'users', user.uid, 'orders', orderData.orderId);
        await setDoc(userSubDoc, fullOrder);
      } catch {
        // Non-fatal if subcollection write fails
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  // Manually refresh orders from Firestore 'orders' collection
  const refreshOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const ords: UserOrder[] = snap.docs.map((d) => d.data() as UserOrder);
      setOrders(ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setOrdersError(null);
    } catch (err) {
      console.error('Failed to refresh orders:', err);
      setOrdersError(err instanceof Error ? err.message : String(err));
      handleFirestoreError(err, OperationType.LIST, 'orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Create an authentic sample purchase directly in Firestore 'orders' collection for immediate testing
  const createSampleOrder = async () => {
    if (!user) return;
    const sampleOrderId = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
    await saveOrder({
      orderId: sampleOrderId,
      customerEmail: user.email || '',
      totalAmount: 580,
      status: 'confirmed',
      itemsCount: 2,
      items: [
        {
          id: 'obsidian-oud-100ml',
          name: 'Obsidian Oud',
          size: '100ml',
          price: 320,
          quantity: 1,
          image: '/src/assets/images/aura_obsidian_oud_1792573921525.jpg',
          category: 'Woody & Smoky',
        },
        {
          id: 'celestial-rose-50ml',
          name: 'Celestial Rose',
          size: '50ml',
          price: 260,
          quantity: 1,
          image: '/src/assets/images/aura_celestial_rose_1792573921538.jpg',
          category: 'Solar & Floral',
        },
      ],
      sampleChoice: 'Amber Velvet 2ml Extrait',
      trackingNumber: `AUR-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      shippingAddress: 'White Glove Express Courier, Paris Atelier Dispatch',
    });
  };

  const saveCustomKit = async (vials: string[], monogram: string) => {
    if (!user) return;

    const kitId = `kit-${Date.now()}`;
    const path = `users/${user.uid}/discoveryKits/${kitId}`;
    const kitDocRef = doc(db, 'users', user.uid, 'discoveryKits', kitId);

    const kitRecord: SavedDiscoveryKit = {
      kitId,
      userId: user.uid,
      vial1: vials[0] || 'Unassigned',
      vial2: vials[1] || 'Unassigned',
      vial3: vials[2] || 'Unassigned',
      monogram: monogram || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(kitDocRef, kitRecord);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        favorites,
        orders,
        ordersLoading,
        ordersError,
        savedKits,
        signInWithGoogle,
        signOut,
        toggleFavorite,
        isFavorite,
        saveOrder,
        createSampleOrder,
        refreshOrders,
        saveCustomKit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
