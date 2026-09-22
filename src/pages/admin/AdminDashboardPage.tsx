import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Wrench,
  Tag,
  Users,
  Search,
  Plus,
  TrendingUp,
  DollarSign,
  Bed,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  UserMinus,
  Edit2,
  Filter,
  ArrowUpRight,
  Shield,
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useAdmin, AdminRoomItem, AdminMaintenanceItem } from '../../context/AdminContext';
import { useBooking } from '../../context/BookingContext';
import { INITIAL_HOTELS } from '../../data/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Coupon } from '../../types';

export function AdminDashboardPage() {
  const {
    analytics,
    roomInventory,
    toggleRoomAvailability,
    updateRoomPrice,
    maintenanceList,
    updateMaintenanceStatus,
    coupons,
    addCoupon,
    toggleCoupon,
    groupQuotes
  } = useAdmin();

  const { bookings, checkInGuest, checkOutGuest, cancelBooking } = useBooking();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'inventory' | 'maintenance' | 'coupons'>('overview');
  const [bookingFilter, setBookingFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');

  // Coupon creator modal/form state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscountPercent, setNewDiscountPercent] = useState(15);
  const [newMaxDiscount, setNewMaxDiscount] = useState(2500);
  const [newMinSpend, setNewMinSpend] = useState(5000);
  const [newDescription, setNewDescription] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newCoupon: Coupon = {
      code: newCouponCode.toUpperCase().trim(),
      discountPercent: newDiscountPercent,
      maxDiscount: newMaxDiscount,
      minSpend: newMinSpend,
      validUntil: '2026-12-31',
      isActive: true,
      description: newDescription || `${newDiscountPercent}% off luxury stays`
    };
    addCoupon(newCoupon);
    setShowCouponModal(false);
    setNewCouponCode('');
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === 'All' || b.bookingStatus === bookingFilter;
    const matchesSearch =
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.guestDetails?.firstName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.guestDetails?.lastName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.hotelName.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#1E252B] text-white shrink-0 hidden md:flex flex-col justify-between p-6">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A880]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-lg font-bold">
                Stay<span className="text-[#C5A880]">Aura</span>
              </span>
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
              { id: 'bookings', label: 'All Bookings', icon: CalendarCheck, badge: bookings.length },
              { id: 'inventory', label: 'Rooms & Rates', icon: Building2 },
              { id: 'maintenance', label: 'Housekeeping', icon: Wrench, badge: maintenanceList.filter((m: AdminMaintenanceItem) => m.status !== 'Clean & Ready').length },
              { id: 'coupons', label: 'Coupons & Promos', icon: Tag, badge: coupons.length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A880] text-[#1E252B] font-bold shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#1E252B] text-white' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Footer Badge */}
        <div className="pt-6 border-t border-white/10 text-[11px] text-gray-400 space-y-1">
          <p className="font-bold text-white">Console Session: Online</p>
          <p>Logged in as Chief Operations</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 text-[#C5A880] font-bold hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to guest site
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 overflow-y-auto">
        <div className="md:hidden flex items-center justify-between mb-6">
          <div>
            <p className="font-display text-lg font-bold text-[#1E252B]">
              Stay<span className="text-[#C5A880]">Aura</span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Admin Console</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] font-bold text-gray-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Guest site
          </Link>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {['overview', 'bookings', 'inventory', 'maintenance', 'coupons'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap ${
                activeTab === tab ? 'bg-[#1E252B] text-white' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 1. OVERVIEW & KPIS TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Live Property Operations
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                Executive Analytics Dashboard
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Real-time booking volumes, occupancy ratios, front-desk movements, and revenue metrics.
              </p>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{analytics.totalRevenue.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% vs last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Reservations</span>
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
                <p className="text-[11px] text-gray-500 mt-2">
                  Across 12 luxury suites & villas
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Today's Check-ins</span>
                  <UserCheck className="w-4 h-4 text-[#C5A880]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.todayCheckIns}</p>
                <p className="text-[11px] text-gray-500 mt-2">
                  {analytics.todayCheckOuts} check-outs scheduled
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Occupancy Rate</span>
                  <Bed className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.occupancyRate}%</p>
                <div className="w-full h-1.5 rounded-full bg-gray-100 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${analytics.occupancyRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Visual Analytics / Revenue Trends Chart Simulation */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE6DF] shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">
                    Monthly Revenue & Occupancy Pace
                  </h3>
                  <p className="text-xs text-gray-500">
                    Simulated booking volume across Q2-Q3 2026 (INR in Lakhs)
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800">
                  Target: 85% Occupancy Achieved
                </span>
              </div>

              {/* Bar Visualizer */}
              <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-48 pt-6 border-b border-gray-100">
                {[
                  { month: 'Apr', val: 65, rev: '₹14.2L' },
                  { month: 'May', val: 72, rev: '₹18.5L' },
                  { month: 'Jun', val: 80, rev: '₹22.1L' },
                  { month: 'Jul', val: 84, rev: '₹25.8L' },
                  { month: 'Aug', val: 88, rev: '₹28.4L' },
                  { month: 'Sep (Now)', val: 92, rev: '₹31.2L' }
                ].map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                      {item.rev}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-[#1E252B] to-[#C5A880] rounded-xl group-hover:brightness-110 transition-all cursor-pointer"
                      style={{ height: `${item.val}%` }}
                    />
                    <span className="text-xs font-semibold text-gray-600 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings Snapshot */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE6DF] shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">
                    Latest Guest Reservations
                  </h3>
                  <p className="text-xs text-gray-500">
                    Most recently submitted guest orders and confirmation receipts.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-[#C5A880] hover:text-[#977341] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Bookings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Ref ID</th>
                      <th className="pb-3">Primary Guest</th>
                      <th className="pb-3">Hotel & Room</th>
                      <th className="pb-3">Stay Dates</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-gray-900">#{b.id}</td>
                        <td className="py-3.5">
                          <p className="font-bold text-gray-900">
                            {b.guestDetails?.firstName} {b.guestDetails?.lastName}
                          </p>
                          <p className="text-[10px] text-gray-500">{b.guestDetails?.phone}</p>
                        </td>
                        <td className="py-3.5">
                          <p className="font-medium text-gray-900">{b.hotelName}</p>
                          <p className="text-[10px] text-gray-500">{b.roomName}</p>
                        </td>
                        <td className="py-3.5 text-gray-600">
                          {b.checkIn} → {b.checkOut}
                        </td>
                        <td className="py-3.5 font-bold text-gray-900">
                          ₹{b.grandTotal.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5">
                          <StatusBadge status={b.bookingStatus} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. BOOKINGS MANAGEMENT TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Guest Ledger
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                Reservations & Guest Stays ({bookings.length})
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Filter by booking state, assign room keys, process manual cancellations, or update check-in movements.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#EAE6DF] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {['All', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setBookingFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      bookingFilter === status
                        ? 'bg-[#1E252B] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search guest, ID, hotel..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-3xl border border-[#EAE6DF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Guest Details</th>
                      <th className="py-3 px-4">Property & Room</th>
                      <th className="py-3 px-4">Schedule</th>
                      <th className="py-3 px-4">Room #</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Operational Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500">
                          No reservations match your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                            #{b.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-gray-900">
                              {b.guestDetails?.firstName} {b.guestDetails?.lastName}
                            </p>
                            <p className="text-[10px] text-gray-400">{b.guestDetails?.email}</p>
                            <p className="text-[10px] text-gray-400">{b.guestDetails?.phone}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-gray-900">{b.hotelName}</p>
                            <p className="text-[11px] text-gray-500">{b.roomName}</p>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600">
                            <p className="font-semibold text-gray-800">{b.checkIn} → {b.checkOut}</p>
                            <p className="text-[10px] text-gray-400">{b.nights} nights ({b.adultsCount} adults)</p>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#977341]">
                            {b.assignedRoomNumber ? `Suite ${b.assignedRoomNumber}` : '—'}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-gray-900">₹{b.grandTotal.toLocaleString('en-IN')}</p>
                            <p className="text-[10px] text-emerald-700">{b.paymentStatus}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={b.bookingStatus} size="sm" />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.bookingStatus === 'Confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => checkInGuest(b.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] transition-colors"
                                >
                                  Check In
                                </button>
                              )}
                              {b.bookingStatus === 'Checked In' && (
                                <button
                                  type="button"
                                  onClick={() => checkOutGuest(b.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[10px] transition-colors"
                                >
                                  Check Out
                                </button>
                              )}
                              {b.bookingStatus === 'Confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => cancelBooking(b.id, 'Admin cancellation')}
                                  className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-[10px] transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ROOMS & INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Live Inventory Allocation
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                Room Types & Dynamic Pricing
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Toggle room availability (In Stock / Sold Out) and fine-tune night rates live across all properties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomInventory.map((item: AdminRoomItem) => (
                <div
                  key={item.roomId}
                  className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {item.hotelName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-gray-900">{item.roomName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Total Allocation: {item.totalRooms} Rooms</p>

                    <div className="mt-4 p-3 rounded-2xl bg-[#FAF9F6] border border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Price / Night</span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.pricePerNight.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateRoomPrice(item.roomId, Math.max(1000, item.pricePerNight - 500))}
                          className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-xs hover:bg-gray-100"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => updateRoomPrice(item.roomId, item.pricePerNight + 500)}
                          className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-xs hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-600">Booking Status:</span>
                    <button
                      type="button"
                      onClick={() => toggleRoomAvailability(item.roomId)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        item.isAvailable
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {item.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. HOUSEKEEPING & MAINTENANCE TAB */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Housekeeping Command
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                Room Inspection & Readiness
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Monitor room sanitation cycles, deep cleaning schedules, and maintenance work orders.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAE6DF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Room No.</th>
                      <th className="py-3 px-4">Hotel Property</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4">Inspection Notes</th>
                      <th className="py-3 px-4">Last Inspected</th>
                      <th className="py-3 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {maintenanceList.map((m: AdminMaintenanceItem) => (
                      <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          Suite #{m.roomNumber}
                        </td>
                        <td className="py-3.5 px-4 text-gray-700 font-medium">
                          {m.hotelName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              m.status === 'Clean & Ready'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : m.status === 'Cleaning in Progress'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-600 border border-red-200'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">
                          {m.notes}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                          {m.lastCleaned}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={m.status}
                            onChange={(e) => updateMaintenanceStatus(m.id, e.target.value as any)}
                            className="px-2.5 py-1 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                          >
                            <option value="Clean & Ready">Clean & Ready</option>
                            <option value="Cleaning in Progress">Cleaning in Progress</option>
                            <option value="Maintenance Required">Maintenance Required</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. COUPONS & PROMOS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                  Marketing & Yield Management
                </span>
                <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                  Promotional Promo Codes
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Configure discount promo vouchers, percentage incentives, and seasonal campaign codes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCouponModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#C5A880]" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-base font-bold px-3 py-1 rounded-xl bg-[#FAF5EB] text-[#977341] border border-[#E9D8B4]">
                        {c.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <h4 className="font-display text-lg font-bold text-gray-900">
                      {c.discountPercent}% Instant Off
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{c.description}</p>

                    <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                      <p>Max Discount: ₹{(c.maxDiscount || 0).toLocaleString('en-IN')}</p>
                      <p>Min Spend: ₹{(c.minSpend || c.minBookingValue || 0).toLocaleString('en-IN')}</p>
                      <p>Valid Until: {c.validUntil}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Campaign Status:</span>
                    <button
                      type="button"
                      onClick={() => toggleCoupon(c.code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        c.isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Create Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-1">
              Create Promotional Coupon
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Add a new promotional voucher code for guests to redeem during checkout.
            </p>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE25"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    min={1}
                    max={70}
                    value={newDiscountPercent}
                    onChange={(e) => setNewDiscountPercent(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    step={100}
                    value={newMaxDiscount}
                    onChange={(e) => setNewMaxDiscount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Min Spend Required (₹)</label>
                <input
                  type="number"
                  step={500}
                  value={newMinSpend}
                  onChange={(e) => setNewMinSpend(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Special festival luxury discount"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] cursor-pointer"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
