import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hotel, RoomType, RatePlan, AddOn, Booking, GuestDetails, Coupon, Review } from '../types';
import { INITIAL_BOOKINGS, INITIAL_REVIEWS, COUPONS_LIST } from '../data/mockData';

interface BookingDraft {
  hotel: Hotel | null;
  room: RoomType | null;
  ratePlan: RatePlan | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomsCount: number;
  adultsCount: number;
  childrenCount: number;
  selectedAddOns: { addOn: AddOn; quantity: number }[];
  guestDetails: GuestDetails;
  appliedCoupon: Coupon | null;
}

interface PriceBreakdown {
  roomTotal: number;
  addOnsTotal: number;
  subTotal: number;
  taxesAndFees: number;
  serviceFee: number;
  discount: number;
  grandTotal: number;
}

interface BookingContextType {
  draft: BookingDraft;
  updateDraft: (updates: Partial<BookingDraft>) => void;
  resetDraft: () => void;
  selectHotelAndRoom: (hotel: Hotel, room: RoomType, ratePlan?: RatePlan) => void;
  toggleAddOn: (addOn: AddOn, quantity?: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  priceBreakdown: PriceBreakdown;
  bookings: Booking[];
  createBooking: (paymentMethod: Booking['paymentMethod']) => Booking;
  getBookingById: (id: string) => Booking | undefined;
  modifyBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string, reason: string) => void;
  checkInGuest: (id: string) => void;
  checkOutGuest: (id: string) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  getHotelReviews: (hotelId: string) => Review[];
}

const defaultGuestDetails: GuestDetails = {
  title: 'Mr.',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  nationality: 'Indian',
  specialRequests: [],
  otherRequests: ''
};

const defaultDraft: BookingDraft = {
  hotel: null,
  room: null,
  ratePlan: null,
  checkIn: '2026-09-25',
  checkOut: '2026-09-28',
  nights: 3,
  roomsCount: 1,
  adultsCount: 2,
  childrenCount: 0,
  selectedAddOns: [],
  guestDetails: defaultGuestDetails,
  appliedCoupon: null
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(() => {
    try {
      const saved = localStorage.getItem('stayaura_booking_draft');
      return saved ? JSON.parse(saved) : defaultDraft;
    } catch {
      return defaultDraft;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  useEffect(() => {
    localStorage.setItem('stayaura_booking_draft', JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    localStorage.setItem('stayaura_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('stayaura_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const updateDraft = (updates: Partial<BookingDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const resetDraft = () => {
    setDraft(defaultDraft);
  };

  const selectHotelAndRoom = (hotel: Hotel, room: RoomType, ratePlan?: RatePlan) => {
    const plan = ratePlan || room.ratePlans[0];
    setDraft((prev) => ({
      ...prev,
      hotel,
      room,
      ratePlan: plan
    }));
  };

  const toggleAddOn = (addOn: AddOn, quantity?: number) => {
    setDraft((prev) => {
      const existing = prev.selectedAddOns.find((item) => item.addOn.id === addOn.id);
      let newAddOns = [...prev.selectedAddOns];
      if (quantity === 0) {
        newAddOns = newAddOns.filter((item) => item.addOn.id !== addOn.id);
      } else if (existing) {
        if (quantity !== undefined) {
          newAddOns = newAddOns.map((item) =>
            item.addOn.id === addOn.id ? { ...item, quantity } : item
          );
        } else {
          newAddOns = newAddOns.filter((item) => item.addOn.id !== addOn.id);
        }
      } else {
        newAddOns.push({ addOn, quantity: quantity || 1 });
      }
      return { ...prev, selectedAddOns: newAddOns };
    });
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = COUPONS_LIST.find((c) => c.code === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    // Check minimum booking value
    const minVal = found.minBookingValue || found.minSpend || 0;
    const baseRoom = (draft.ratePlan?.pricePerNight || draft.room?.basePrice || 4999) * draft.nights * draft.roomsCount;
    if (baseRoom < minVal) {
      return {
        success: false,
        message: `This coupon requires a minimum booking value of ₹${minVal.toLocaleString('en-IN')}.`
      };
    }

    setDraft((prev) => ({ ...prev, appliedCoupon: found }));
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setDraft((prev) => ({ ...prev, appliedCoupon: null }));
  };

  // Price Calculation
  const priceBreakdown = React.useMemo<PriceBreakdown>(() => {
    const pricePerNight = draft.ratePlan?.pricePerNight || draft.room?.basePrice || 4999;
    const roomTotal = pricePerNight * (draft.nights || 1) * (draft.roomsCount || 1);

    let addOnsTotal = 0;
    draft.selectedAddOns.forEach(({ addOn, quantity }) => {
      if (addOn.priceType === 'per_night') {
        addOnsTotal += addOn.price * quantity * (draft.nights || 1);
      } else if (addOn.priceType === 'per_guest') {
        addOnsTotal += addOn.price * quantity * (draft.adultsCount + draft.childrenCount);
      } else {
        addOnsTotal += addOn.price * quantity;
      }
    });

    const subTotal = roomTotal + addOnsTotal;

    let discount = 0;
    if (draft.appliedCoupon) {
      const discVal = draft.appliedCoupon.discountValue || draft.appliedCoupon.discountPercent || 0;
      if (draft.appliedCoupon.discountType === 'fixed') {
        discount = discVal;
      } else {
        discount = Math.round((subTotal * discVal) / 100);
        if (draft.appliedCoupon.maxDiscount && discount > draft.appliedCoupon.maxDiscount) {
          discount = draft.appliedCoupon.maxDiscount;
        }
      }
    }

    // Taxes: 18% GST on room and services
    const taxesAndFees = Math.round((subTotal - discount) * 0.18);
    const serviceFee = 300;
    const grandTotal = Math.max(0, subTotal - discount + taxesAndFees + serviceFee);

    return {
      roomTotal,
      addOnsTotal,
      subTotal,
      taxesAndFees,
      serviceFee,
      discount,
      grandTotal
    };
  }, [draft]);

  const createBooking = (paymentMethod: Booking['paymentMethod']): Booking => {
    const bookingId = `HTL${Math.floor(10000 + Math.random() * 90000)}`;
    const hotel = draft.hotel!;
    const room = draft.room!;
    const ratePlan = draft.ratePlan || room.ratePlans[0];

    const newBooking: Booking = {
      id: bookingId,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelAddress: hotel.address,
      hotelCity: hotel.city,
      hotelImage: hotel.heroImage,
      hotelPhone: '+91 20 6688 9900',
      roomId: room.id,
      roomName: room.name,
      ratePlanId: ratePlan.id,
      ratePlanName: ratePlan.name,
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      nights: draft.nights,
      roomsCount: draft.roomsCount,
      adultsCount: draft.adultsCount,
      childrenCount: draft.childrenCount,
      guestDetails: { ...draft.guestDetails },
      selectedAddOns: draft.selectedAddOns.map(({ addOn, quantity }) => {
        let total = addOn.price * quantity;
        if (addOn.priceType === 'per_night') total *= draft.nights;
        if (addOn.priceType === 'per_guest') total *= (draft.adultsCount + draft.childrenCount);
        return { addOn, quantity, total };
      }),
      baseRoomPrice: ratePlan.pricePerNight,
      totalRoomPrice: priceBreakdown.roomTotal,
      totalAddOnsPrice: priceBreakdown.addOnsTotal,
      taxesAndFees: priceBreakdown.taxesAndFees,
      serviceFee: priceBreakdown.serviceFee,
      couponCode: draft.appliedCoupon?.code,
      discountAmount: priceBreakdown.discount,
      grandTotal: priceBreakdown.grandTotal,
      paymentMethod,
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
      bookedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      assignedRoomNumber: `${Math.floor(100 + Math.random() * 300)}`
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const getBookingById = (id: string) => {
    return bookings.find((b) => b.id.toUpperCase() === id.toUpperCase());
  };

  const modifyBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const cancelBooking = (id: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const cancellationFee = 1500;
          const refundAmount = Math.max(0, b.grandTotal - cancellationFee);
          return {
            ...b,
            bookingStatus: 'Cancelled',
            paymentStatus: 'Refunded',
            cancellationReason: reason,
            cancellationFee,
            refundAmount,
            refundStatus: 'Refund Processing'
          };
        }
        return b;
      })
    );
  };

  const checkInGuest = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              bookingStatus: 'Checked In',
              checkInTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
            }
          : b
      )
    );
  };

  const checkOutGuest = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              bookingStatus: 'Checked Out',
              checkOutTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
            }
          : b
      )
    );
  };

  const addReview = (newRev: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const rev: Review = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      helpfulCount: 0
    };
    setReviews((prev) => [rev, ...prev]);
  };

  const getHotelReviews = (hotelId: string) => {
    return reviews.filter((r) => r.hotelId === hotelId);
  };

  return (
    <BookingContext.Provider
      value={{
        draft,
        updateDraft,
        resetDraft,
        selectHotelAndRoom,
        toggleAddOn,
        applyCoupon,
        removeCoupon,
        priceBreakdown,
        bookings,
        createBooking,
        getBookingById,
        modifyBooking,
        cancelBooking,
        checkInGuest,
        checkOutGuest,
        reviews,
        addReview,
        getHotelReviews
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
