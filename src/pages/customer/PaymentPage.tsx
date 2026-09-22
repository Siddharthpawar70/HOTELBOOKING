import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Loader2,
  Hotel as HotelIcon,
  ChevronLeft
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export function PaymentPage() {
  const navigate = useNavigate();
  const { draft, priceBreakdown, createBooking } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Pay at Hotel'>('UPI');
  const [upiId, setUpiId] = useState('rahul.mehta@oksbi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay');
  
  // Card state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardName, setCardName] = useState(draft.guestDetails?.firstName ? `${draft.guestDetails.firstName} ${draft.guestDetails.lastName}` : 'Rahul Mehta');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStatus('Connecting securely with StayAura payment gateway...');

    setTimeout(() => {
      setProcessingStatus('Verifying authorization & room availability...');
    }, 800);

    setTimeout(() => {
      setProcessingStatus('Generating official reservation voucher...');
    }, 1600);

    setTimeout(() => {
      const confirmedBooking = createBooking(paymentMethod);
      setIsProcessing(false);
      navigate(`/confirmation/${confirmedBooking.id}`);
    }, 2400);
  };

  const hotel = draft.hotel;
  const room = draft.room;

  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-4">No active booking draft found.</p>
          <Link to="/hotels" className="px-6 py-2.5 bg-[#1E252B] text-white rounded-xl text-xs font-bold">
            Return to Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      
      {/* Progress Header */}
      <div className="bg-white border-b border-[#EAE6DF] sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            to="/checkout"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Guest Details</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Bank Grade Encryption</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A880]">
            Step 2 of 2: Payment & Final Guarantee
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Complete Your Reservation
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Total Payable:{' '}
            <strong className="text-base text-gray-900 font-bold">
              ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')}
            </strong>{' '}
            for {draft.nights} Nights at {hotel.name}
          </p>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-sm">
          
          {/* Method Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 p-1.5 bg-[#FAF9F6] rounded-2xl border border-gray-200">
            {[
              { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
              { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
              { id: 'Net Banking', label: 'Net Banking', icon: Building },
              { id: 'Pay at Hotel', label: 'Pay at Hotel', icon: HotelIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = paymentMethod === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setPaymentMethod(tab.id as any)}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E252B] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-[#C5A880]' : 'text-gray-500'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handlePayNow} className="space-y-6">
            
            {/* 1. UPI Tab Content */}
            {paymentMethod === 'UPI' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <p className="text-xs font-bold text-gray-700">Select Instant UPI App</p>
                <div className="grid grid-cols-4 gap-3">
                  {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                    <button
                      type="button"
                      key={app}
                      onClick={() => setSelectedUpiApp(app)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedUpiApp === app
                          ? 'border-[#1E252B] bg-[#FAF9F6] ring-1 ring-[#1E252B] font-bold text-gray-900'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-xs font-bold">{app}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Instant</p>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Or Enter UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@bank"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    A payment authorization request will be sent to your UPI app.
                  </p>
                </div>
              </div>
            )}

            {/* 2. Credit/Debit Card Tab */}
            {paymentMethod === 'Card' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name as printed on card"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>
              </div>
            )}

            {/* 3. Net Banking Tab */}
            {paymentMethod === 'Net Banking' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <p className="text-xs font-bold text-gray-700">Select Popular Banks</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Other Bank'].map(
                    (bank) => (
                      <button
                        type="button"
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedBank === bank
                            ? 'border-[#1E252B] bg-[#FAF9F6] ring-1 ring-[#1E252B] font-bold text-gray-900'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-xs font-bold">{bank}</p>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* 4. Pay at Hotel Tab */}
            {paymentMethod === 'Pay at Hotel' && (
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-2 animate-in fade-in duration-150">
                <h4 className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No Advance Payment Required Today</span>
                </h4>
                <p className="text-xs leading-relaxed text-amber-800">
                  Your reservation is fully confirmed instantly. You can pay the total amount of ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')} directly at the hotel front desk during check-in via cash, card, or UPI.
                </p>
              </div>
            )}

            {/* Summary Price Callout */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">Amount to Charge</span>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Hidden Fees</span>
              </div>
            </div>

            {/* Submit Payment CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#1E252B] text-white rounded-2xl font-bold text-xs tracking-wider uppercase hover:bg-[#2D3748] transition-all shadow-xl shadow-[#1E252B]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
                  <span>{processingStatus || 'Processing Securely...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'Pay at Hotel'
                      ? 'CONFIRM RESERVATION & PAY AT CHECK-IN'
                      : `PAY ₹${priceBreakdown.grandTotal.toLocaleString('en-IN')} & CONFIRM BOOKING`}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#C5A880]" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
