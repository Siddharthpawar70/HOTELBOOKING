import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hotel, RoomType, HousekeepingRoom, MaintenanceTicket, Coupon, GroupQuoteRequest } from '../types';
import { INITIAL_HOTELS, INITIAL_ROOMS, INITIAL_HOUSEKEEPING, INITIAL_MAINTENANCE, COUPONS_LIST, INITIAL_GROUP_QUOTES } from '../data/mockData';

export interface AdminStats {
  todayRevenue: number;
  occupancyPercent: number;
  checkInsCount: number;
  checkOutsCount: number;
  availableRooms: number;
  pendingBookings: number;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  activeBookings: number;
  pendingCheckIns: number;
  averageDailyRate: number;
  revPAR: number;
  todayCheckIns: number;
  todayCheckOuts: number;
}

export interface AdminRoomItem {
  roomId: string;
  hotelId: string;
  hotelName: string;
  roomName: string;
  totalRooms: number;
  availableRooms: number;
  pricePerNight: number;
  isAvailable: boolean;
}

export interface AdminMaintenanceItem {
  id: string;
  roomNumber: string;
  hotelName: string;
  status: 'Clean & Ready' | 'Cleaning in Progress' | 'Maintenance Required';
  notes: string;
  lastCleaned: string;
}

interface AdminContextType {
  hotels: Hotel[];
  updateHotel: (id: string, updates: Partial<Hotel>) => void;
  rooms: RoomType[];
  updateRoom: (id: string, updates: Partial<RoomType>) => void;
  updateInventory: (roomId: string, date: string, count: number) => void;
  housekeeping: HousekeepingRoom[];
  updateHousekeepingStatus: (roomNumber: string, status: HousekeepingRoom['housekeepingStatus']) => void;
  maintenanceTickets: MaintenanceTicket[];
  addMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'reportedDate'>) => void;
  updateMaintenanceStatus: (id: string, status: any) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;
  toggleCoupon: (codeOrId: string) => void;
  groupQuotes: GroupQuoteRequest[];
  updateQuoteStatus: (id: string, status: GroupQuoteRequest['status']) => void;
  stats: AdminStats;
  analytics: AdminAnalytics;
  roomInventory: AdminRoomItem[];
  toggleRoomAvailability: (roomId: string) => void;
  updateRoomPrice: (roomId: string, newPrice: number) => void;
  maintenanceList: AdminMaintenanceItem[];
}

const defaultStats: AdminStats = {
  todayRevenue: 480000,
  occupancyPercent: 78,
  checkInsCount: 42,
  checkOutsCount: 31,
  availableRooms: 56,
  pendingBookings: 18
};

const defaultAnalytics: AdminAnalytics = {
  totalRevenue: 4850000,
  totalBookings: 184,
  occupancyRate: 84.5,
  activeBookings: 128,
  pendingCheckIns: 42,
  averageDailyRate: 6450,
  revPAR: 5450,
  todayCheckIns: 42,
  todayCheckOuts: 31
};

const initialAdminMaintenance: AdminMaintenanceItem[] = [
  {
    id: 'm-1',
    roomNumber: '304',
    hotelName: 'The StayAura Grand Palace & Spa',
    status: 'Clean & Ready',
    notes: 'Deep cleaned, fresh linens and minibar restocked.',
    lastCleaned: '10 mins ago'
  },
  {
    id: 'm-2',
    roomNumber: '412',
    hotelName: 'StayAura Oasis Beach Resort',
    status: 'Cleaning in Progress',
    notes: 'Turn-down service and balcony glass scrubbing.',
    lastCleaned: 'In progress'
  },
  {
    id: 'm-3',
    roomNumber: '208',
    hotelName: 'StayAura Heritage Haveli',
    status: 'Maintenance Required',
    notes: 'Air conditioner filter check & sensor calibration.',
    lastCleaned: 'Yesterday'
  },
  {
    id: 'm-4',
    roomNumber: '501',
    hotelName: 'StayAura SkyTower & Suites',
    status: 'Clean & Ready',
    notes: 'Executive suite sanitized and inspected by head housekeeper.',
    lastCleaned: '1 hour ago'
  },
  {
    id: 'm-5',
    roomNumber: '102',
    hotelName: 'StayAura Lakeside Grand Palace',
    status: 'Cleaning in Progress',
    notes: 'Post-checkout sanitation & bathroom marble polishing.',
    lastCleaned: '25 mins ago'
  }
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [hotels, setHotels] = useState<Hotel[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_admin_hotels');
      return saved ? JSON.parse(saved) : INITIAL_HOTELS;
    } catch {
      return INITIAL_HOTELS;
    }
  });

  const [rooms, setRooms] = useState<RoomType[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_admin_rooms');
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [housekeeping, setHousekeeping] = useState<HousekeepingRoom[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_admin_housekeeping');
      return saved ? JSON.parse(saved) : INITIAL_HOUSEKEEPING;
    } catch {
      return INITIAL_HOUSEKEEPING;
    }
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_admin_maintenance');
      return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
    } catch {
      return INITIAL_MAINTENANCE;
    }
  });

  const [maintenanceList, setMaintenanceList] = useState<AdminMaintenanceItem[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_admin_maintenance_list');
      return saved ? JSON.parse(saved) : initialAdminMaintenance;
    } catch {
      return initialAdminMaintenance;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_admin_coupons');
      return saved ? JSON.parse(saved) : COUPONS_LIST;
    } catch {
      return COUPONS_LIST;
    }
  });

  const [groupQuotes, setGroupQuotes] = useState<GroupQuoteRequest[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_admin_quotes');
      return saved ? JSON.parse(saved) : INITIAL_GROUP_QUOTES;
    } catch {
      return INITIAL_GROUP_QUOTES;
    }
  });

  const [roomAvailabilityOverrides, setRoomAvailabilityOverrides] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('stayaura_admin_room_avail');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [roomPriceOverrides, setRoomPriceOverrides] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('stayaura_admin_room_prices');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('stayaura_admin_hotels', JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem('stayaura_admin_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('stayaura_admin_housekeeping', JSON.stringify(housekeeping));
  }, [housekeeping]);

  useEffect(() => {
    localStorage.setItem('stayaura_admin_maintenance', JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem('stayaura_admin_maintenance_list', JSON.stringify(maintenanceList));
  }, [maintenanceList]);

  useEffect(() => {
    localStorage.setItem('stayaura_admin_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('stayaura_admin_quotes', JSON.stringify(groupQuotes));
  }, [groupQuotes]);

  useEffect(() => {
    localStorage.setItem('stayaura_admin_room_avail', JSON.stringify(roomAvailabilityOverrides));
  }, [roomAvailabilityOverrides]);

  useEffect(() => {
    localStorage.setItem('stayaura_admin_room_prices', JSON.stringify(roomPriceOverrides));
  }, [roomPriceOverrides]);

  const updateHotel = (id: string, updates: Partial<Hotel>) => {
    setHotels((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const updateRoom = (id: string, updates: Partial<RoomType>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const updateInventory = (roomId: string, date: string, count: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const inv = { ...(r.inventoryByDate || {}), [date]: count };
          return { ...r, inventoryByDate: inv };
        }
        return r;
      })
    );
  };

  const toggleRoomAvailability = (roomId: string) => {
    setRoomAvailabilityOverrides((prev) => {
      const current = prev[roomId] !== undefined ? prev[roomId] : true;
      return {
        ...prev,
        [roomId]: !current
      };
    });
  };

  const updateRoomPrice = (roomId: string, newPrice: number) => {
    setRoomPriceOverrides((prev) => ({
      ...prev,
      [roomId]: newPrice
    }));
    updateRoom(roomId, { basePrice: newPrice });
  };

  const roomInventory: AdminRoomItem[] = rooms.map((r) => {
    const hotel = hotels.find((h) => h.id === r.hotelId);
    const isAvail = roomAvailabilityOverrides[r.id] !== undefined ? roomAvailabilityOverrides[r.id] : r.availableCount > 0;
    const price = roomPriceOverrides[r.id] !== undefined ? roomPriceOverrides[r.id] : r.basePrice;
    return {
      roomId: r.id,
      hotelId: r.hotelId,
      hotelName: hotel?.name || 'StayAura Hotel',
      roomName: r.name,
      totalRooms: r.availableCount,
      availableRooms: isAvail ? r.availableCount : 0,
      pricePerNight: price,
      isAvailable: isAvail
    };
  });

  const updateHousekeepingStatus = (roomNumber: string, status: HousekeepingRoom['housekeepingStatus']) => {
    setHousekeeping((prev) =>
      prev.map((item) => {
        if (item.roomNumber === roomNumber) {
          let generalStatus: HousekeepingRoom['status'] = item.status;
          if (status === 'Ready') generalStatus = 'Ready';
          if (status === 'Dirty') generalStatus = 'Dirty';
          if (status === 'Cleaning') generalStatus = 'Cleaning';
          return {
            ...item,
            housekeepingStatus: status,
            status: generalStatus,
            lastUpdated: 'Just now'
          };
        }
        return item;
      })
    );
  };

  const addMaintenanceTicket = (ticket: Omit<MaintenanceTicket, 'id' | 'reportedDate'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `MT-${Math.floor(100 + Math.random() * 900)}`,
      reportedDate: new Date().toISOString().split('T')[0]
    };
    setMaintenanceTickets((prev) => [newTicket, ...prev]);
  };

  const updateMaintenanceStatus = (id: string, status: any) => {
    setMaintenanceList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status, lastCleaned: 'Just now' } : m))
    );
    setMaintenanceTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const addCoupon = (coupon: Coupon) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: coupon.id || `coupon-${Date.now()}`,
      active: coupon.active !== undefined ? coupon.active : (coupon.isActive !== undefined ? coupon.isActive : true),
      isActive: coupon.isActive !== undefined ? coupon.isActive : (coupon.active !== undefined ? coupon.active : true),
      discountValue: coupon.discountValue || coupon.discountPercent || 10,
      discountPercent: coupon.discountPercent || coupon.discountValue || 10,
      minBookingValue: coupon.minBookingValue || coupon.minSpend || 4000,
      minSpend: coupon.minSpend || coupon.minBookingValue || 4000,
      maxDiscount: coupon.maxDiscount || 2500
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id && c.code !== id));
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id || c.code === id) {
          const next = !c.active;
          return { ...c, active: next, isActive: next };
        }
        return c;
      })
    );
  };

  const toggleCoupon = (codeOrId: string) => {
    toggleCouponActive(codeOrId);
  };

  const updateQuoteStatus = (id: string, status: GroupQuoteRequest['status']) => {
    setGroupQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
  };

  return (
    <AdminContext.Provider
      value={{
        hotels,
        updateHotel,
        rooms,
        updateRoom,
        updateInventory,
        housekeeping,
        updateHousekeepingStatus,
        maintenanceTickets,
        addMaintenanceTicket,
        updateMaintenanceStatus,
        coupons,
        addCoupon,
        deleteCoupon,
        toggleCouponActive,
        toggleCoupon,
        groupQuotes,
        updateQuoteStatus,
        stats: defaultStats,
        analytics: defaultAnalytics,
        roomInventory,
        toggleRoomAvailability,
        updateRoomPrice,
        maintenanceList
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
