import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hotel } from '../types';
import { INITIAL_HOTELS } from '../data/mockData';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistHotels: Hotel[];
  toggleWishlist: (hotelId: string) => void;
  isWishlisted: (hotelId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_wishlist');
      return saved ? JSON.parse(saved) : ['stayaura-pune-grand', 'stayaura-mumbai-colaba'];
    } catch {
      return ['stayaura-pune-grand', 'stayaura-mumbai-colaba'];
    }
  });

  useEffect(() => {
    localStorage.setItem('stayaura_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const toggleWishlist = (hotelId: string) => {
    setWishlistIds((prev) =>
      prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]
    );
  };

  const isWishlisted = (hotelId: string) => {
    return wishlistIds.includes(hotelId);
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  const wishlistHotels = INITIAL_HOTELS.filter((h) => wishlistIds.includes(h.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistHotels,
        toggleWishlist,
        isWishlisted,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
