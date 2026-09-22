import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Plus,
  Check,
  ChevronLeft
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { AVAILABLE_ADD_ONS } from '../../data/mockData';
import { AddOnCard } from '../../components/customer/AddOnCard';
import { PriceBreakdown } from '../../components/customer/PriceBreakdown';
import { AddOn } from '../../types';

const SPECIAL_REQUEST_OPTIONS = [
  'Quiet room on high floor',
  'Large King-size bed',
  'Early check-in (subject to availability)',
  'Late check-out request',
  'Extra feather pillows',
  'Airport transfer driver contact requested',
  'Non-smoking floor'
];

export function BookingCheckoutPage() {
  const navigate = useNavigate();
  const { draft, updateDraft, toggleAddOn } = useBooking();
  const { user } = useAuth();

  // If user navigated directly without draft hotel, provide fallback to first hotel
  const hotel = draft.hotel;
  const room = draft.room;
  const ratePlan = draft.ratePlan || room?.ratePlans[0];

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleGuestChange = (field: string, val: any) => {
    updateDraft({
      guestDetails: {
        ...draft.guestDetails,
        [field]: val
      }
    });
  };

  const toggleSpecialRequest = (req: string) => {
    const current = draft.guestDetails.specialRequests || [];
    const updated = current.includes(req)
      ? current.filter((r) => r !== req)
      : [...current, req];
    handleGuestChange('specialRequests', updated);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!draft.guestDetails.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!draft.guestDetails.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!draft.guestDetails.email.trim() || !draft.guestDetails.email.includes('@')) {
      errors.email = 'Valid email is required';
    }
    if (!draft.guestDetails.phone.trim() || draft.guestDetails.phone.length < 8) {
      errors.phone = 'Valid phone number is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    navigate('/payment');
  };

  // If somehow draft is missing, show notice
  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-lg border border-gray-200">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C5A880] mx-auto flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900">No Room Selected</h2>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            Please choose a luxury hotel and room category before proceeding to checkout.
          </p>
          <Link
            to="/hotels"
            className="px-6 py-3 rounded-2xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors inline-block"
          >
            Browse Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      
      {/* Checkout Progress Bar */}
      <div className="bg-white border-b border-[#EAE6DF] sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <Link
              to={`/hotel/${hotel.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Room Selection</span>
            </Link>

            <div className="flex items-center gap-6 text-xs font-semibold">
              <span className="text-gray-900 font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1E252B] text-white text-[10px] flex items-center justify-center">1</span>
                Guest & Add-ons
              </span>
              <span className="text-gray-300">→</span>
              <span className="text-gray-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[10px] flex items-center justify-center">2</span>
                Payment
              </span>
              <span className="text-gray-300">→</span>
              <span className="text-gray-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[10px] flex items-center justify-center">3</span>
                Confirmed Voucher
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Guest Form & Add-ons (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hotel Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <img
                src={hotel.heroImage}
                alt={hotel.name}
                className="w-full sm:w-36 h-28 rounded-2xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#C5A880] text-[#1E252B]">
                  {hotel.type}
                </span>
                <h2 className="font-display text-xl font-bold text-gray-900 mt-1">
                  {hotel.name}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{hotel.city}, {hotel.state}</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100">
                    Room: <strong>{room.name}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100">
                    Plan: <strong>{ratePlan?.name}</strong>
                  </span>
                  <span className="text-emerald-700">
                    ✓ {draft.nights} Night{draft.nights > 1 ? 's' : ''} ({draft.checkIn} to {draft.checkOut})
                  </span>
                </div>
              </div>
            </div>

            {/* Step 1: Guest Information */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs">
              <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-6">
                <span className="w-7 h-7 rounded-xl bg-[#1E252B] text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900">
                    Primary Guest Information
                  </h3>
                  <p className="text-xs text-gray-500">
                    Reservation confirmation and luxury check-in voucher will be sent to these details.
                  </p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3 sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                    <select
                      value={draft.guestDetails.title}
                      onChange={(e) => handleGuestChange('title', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>

                  <div className="col-span-9 sm:col-span-5">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.guestDetails.firstName}
                      onChange={(e) => handleGuestChange('firstName', e.target.value)}
                      placeholder="e.g. Rahul"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880] ${
                        formErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="text-[10px] text-red-500 mt-1">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div className="col-span-12 sm:col-span-5">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.guestDetails.lastName}
                      onChange={(e) => handleGuestChange('lastName', e.target.value)}
                      placeholder="e.g. Mehta"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880] ${
                        formErrors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="text-[10px] text-red-500 mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={draft.guestDetails.email}
                      onChange={(e) => handleGuestChange('email', e.target.value)}
                      placeholder="rahul.mehta@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880] ${
                        formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-[10px] text-red-500 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mobile Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={draft.guestDetails.phone}
                      onChange={(e) => handleGuestChange('phone', e.target.value)}
                      placeholder="+91 98200 12345"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880] ${
                        formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[10px] text-red-500 mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SPECIAL_REQUEST_OPTIONS.map((req) => {
                      const isChecked = draft.guestDetails.specialRequests?.includes(req);
                      return (
                        <label
                          key={req}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'border-[#1E252B] bg-[#FAF9F6] text-gray-900 font-semibold'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSpecialRequest(req)}
                            className="rounded border-gray-300 text-[#1E252B] focus:ring-[#C5A880] w-4 h-4"
                          />
                          <span>{req}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Bespoke Add-ons */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs">
              <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-6">
                <span className="w-7 h-7 rounded-xl bg-[#1E252B] text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900">
                    Enhance Your Stay with Signature Add-ons
                  </h3>
                  <p className="text-xs text-gray-500">
                    Optional bespoke luxuries and concierge arrangements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_ADD_ONS.map((addOn: AddOn) => {
                  const selectedItem = draft.selectedAddOns.find((item) => item.addOn.id === addOn.id);
                  const isSelected = !!selectedItem;
                  return (
                    <AddOnCard
                      key={addOn.id}
                      addOn={addOn}
                      isSelected={isSelected}
                      quantity={selectedItem?.quantity || 1}
                      onToggle={toggleAddOn}
                    />
                  );
                })}
              </div>
            </section>

          </div>

          {/* Right Column: Price Breakdown & CTA (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="sticky top-28 space-y-6">
              <PriceBreakdown />

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full py-4 bg-[#1E252B] text-white rounded-2xl font-bold text-xs tracking-wider uppercase hover:bg-[#2D3748] transition-all shadow-xl shadow-[#1E252B]/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>PROCEED TO PAYMENT</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EAE6DF] text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>StayAura Booking Guarantee</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Your reservation is held instantly with the property. Free cancellation applies up to 48 hours prior to check-in.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
