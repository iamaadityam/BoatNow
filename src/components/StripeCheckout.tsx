import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, PaymentLog } from '../types';
import { CreditCard, ShieldCheck, Loader2, CheckCircle2, Ticket, Waves, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

interface StripeCheckoutProps {
  booking: Booking;
  onSuccess: (payment: PaymentLog) => void;
  onClose: () => void;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({ booking, onSuccess, onClose }) => {
  const { processStripePayment, floodSeverity } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'googlepay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardName, setCardName] = useState('Aaditya Malhotra');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('***');
  const [processing, setProcessing] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentLog | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate steps of standard Stripe checkout
    const steps = [
      'Contacting Stripe secure server...',
      'Securing localized puddle merchant tokens...',
      'Conducting anti-flood routing checks...',
      'Filing lifejacket liability waivers...',
      'Finalizing rowboat ledger records...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setStepMessage(steps[i]);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const paymentLog = await processStripePayment(booking.id, paymentMethod, cardNumber);
      setPaymentResult(paymentLog);
      setIsPaid(true);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alert('Simulated processing failure. Please try again!');
    }
  };

  const handleCompleteAndClose = () => {
    if (paymentResult) {
      onSuccess(paymentResult);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border-t sm:border dark:border-slate-800 transition-all max-h-[92vh] overflow-y-auto">
        
        {/* State 1: Active Payment Processing Form */}
        {!isPaid && !processing && (
          <form onSubmit={handlePay} className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-cyan-400">
                  <CreditCard className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-sans text-base font-black text-slate-800 dark:text-white">Secure Stripe Gateway</h3>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Cancel Charter
              </button>
            </div>

            {/* Puddle Surge details */}
            <div className="rounded-2xl bg-blue-50/50 p-4 border border-blue-100/50 dark:bg-slate-800/30 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Vessel Selection</span>
                <span className="text-xs font-black text-blue-700 dark:text-cyan-400">{booking.boatName}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Charter Hours</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{booking.hours} hr(s) @ CP Base</span>
              </div>
              {booking.needLifeJackets && (
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Life Jackets Surcharge</span>
                  <span className="font-semibold text-emerald-600">+ Included (SOS Mandate)</span>
                </div>
              )}
              {floodSeverity === 'boat_recommended' && (
                <div className="mt-1 flex items-center justify-between text-xs text-amber-600">
                  <span className="flex items-center gap-1 font-bold">⚠️ Monsoon Surge Factor</span>
                  <span className="font-black">+20% Surge Active</span>
                </div>
              )}
              <div className="my-2.5 border-t border-dashed border-blue-200 dark:border-slate-800"></div>
              <div className="flex items-center justify-between font-sans text-sm font-black text-slate-800 dark:text-white">
                <span>Total Splash Fare</span>
                <span>{booking.totalPrice} INR</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {(['card', 'applepay', 'googlepay'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-xl py-2.5 text-center text-xs font-bold capitalize transition-all border ${
                    paymentMethod === method
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-cyan-500 dark:bg-slate-800 dark:text-cyan-400'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {method === 'card' ? 'Credit Card' : method === 'applepay' ? 'Apple Pay' : 'Google Pay'}
                </button>
              ))}
            </div>

            {/* Simulated Card inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 font-mono text-sm focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 font-mono text-xs text-center focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                      placeholder="***"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod !== 'card' && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-800">
                <Sparkles className="mx-auto h-6 w-6 text-blue-500 animate-pulse mb-2" />
                Tap below to instantly verify with {paymentMethod === 'applepay' ? 'Apple Pay' : 'Google Pay'} biometric puddle-scanner.
              </div>
            )}

            {/* Best practices warning */}
            <div className="flex gap-2 rounded-xl bg-slate-50 p-3 text-[10px] leading-relaxed text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-blue-600 dark:text-cyan-400" />
              <span>
                <strong>Stripe Compliance Note:</strong> Real-time payment processing is fully simulated. No genuine financial transactions or monetary transfers will take place. This is a secure sandbox dashboard.
              </span>
            </div>

            {/* Action button */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 py-3.5 text-center text-sm font-black text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-cyan-600"
              id="btn-confirm-payment"
            >
              Authorize {booking.totalPrice} INR
            </button>
          </form>
        )}

        {/* State 2: Stripe Processing State */}
        {processing && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-cyan-400" />
            <h4 className="font-sans text-base font-black text-slate-800 dark:text-white">Authorizing Stripe Token</h4>
            <p className="max-w-xs text-xs text-slate-400 animate-pulse">{stepMessage}</p>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full bg-blue-600 dark:bg-cyan-400 animate-[loading_8s_ease-out_infinite]"></div>
            </div>
          </div>
        )}

        {/* State 3: Payment Success Receipt Screen - Transformed to Digital Boarding Pass */}
        {isPaid && paymentResult && (
          <div className="space-y-5 animate-[fadeIn_0.5s_ease-out_1]">
            <div className="text-center py-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-lg font-black text-slate-800 dark:text-white">Boarding Pass Issued</h3>
              <p className="text-xs text-slate-400">Payment Processed Securely by Stripe API</p>
            </div>

            {/* Official Looking Boarding Pass Ticket Card with notches */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
              
              {/* Top Section */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Waves className="h-4 w-4 animate-bounce" />
                  <span className="font-sans text-xs font-black tracking-widest uppercase">MONSOON EXPRESS</span>
                </div>
                <div className="text-right">
                  <span className="rounded bg-white/20 px-2 py-0.5 text-[9px] font-bold tracking-widest">VIP VOYAGER</span>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-5 font-mono text-xs space-y-4 relative">
                
                {/* Boarding details row 1 */}
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3 dark:border-slate-800/60">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Passenger Name</p>
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm font-sans truncate">{paymentResult.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Voyage Class</p>
                    <p className="font-bold text-blue-600 dark:text-cyan-400 text-sm font-sans">1ST-CLASS SPLASH</p>
                  </div>
                </div>

                {/* Boarding details row 2 */}
                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3 dark:border-slate-800/60">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Vessel</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300 truncate">{paymentResult.boatName}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Seat Count</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300">Row {booking.capacity} Max</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Fares Settle</p>
                    <p className="font-sans font-black text-emerald-600 dark:text-emerald-400">{paymentResult.amount} INR</p>
                  </div>
                </div>

                {/* Boarding details row 3 */}
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3 dark:border-slate-800/60">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Boarding Gate</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300">Puddle Stage X:{booking.etaMinutes * 7 % 100}, Y:{booking.etaMinutes * 11 % 100}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Dispatch Status</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      ● Active Rowing
                    </span>
                  </div>
                </div>

                {/* Ticket notches cutting out the sides physically */}
                <div className="absolute -left-3 top-[175px] w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-10"></div>
                <div className="absolute -right-3 top-[175px] w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-10"></div>

                {/* Dashed scissor tear here line */}
                <div className="border-t-2 border-dashed border-slate-200 dark:border-slate-800/80 my-4 relative">
                  <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-slate-50 dark:bg-slate-900 px-2 text-[9px] text-slate-400 font-bold tracking-wider">
                    ✂ TEAR TRANSIT VOUCHER HERE
                  </span>
                </div>

                {/* Voucher bottom details */}
                <div className="grid grid-cols-2 gap-4 pt-1 text-[10px]">
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase font-bold">Terminal Location</p>
                    <p className="font-bold text-slate-600 dark:text-slate-400">Connaught Place Central Basin</p>
                    <p className="text-[8px] text-slate-400 font-mono mt-1">TXID: {paymentResult.transactionRef.substring(0, 14)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-slate-400 uppercase font-bold">Emergency Kit</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                      🛟 Life Jackets Bundled
                    </p>
                    <p className="text-[8px] text-slate-400 mt-1">{new Date(paymentResult.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>

                {/* Vector Barcode rendering */}
                <div className="pt-2 text-center text-slate-700 dark:text-slate-300">
                  <div className="flex justify-center py-2 opacity-80 dark:opacity-60 bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2 border dark:border-slate-800/50">
                    <svg className="w-56 h-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <rect x="2" width="1.5" height="20" fill="currentColor" />
                      <rect x="5" width="2" height="20" fill="currentColor" />
                      <rect x="9" width="1" height="20" fill="currentColor" />
                      <rect x="11" width="3" height="20" fill="currentColor" />
                      <rect x="16" width="1.5" height="20" fill="currentColor" />
                      <rect x="18" width="2" height="20" fill="currentColor" />
                      <rect x="22" width="1" height="20" fill="currentColor" />
                      <rect x="25" width="3" height="20" fill="currentColor" />
                      <rect x="30" width="1.5" height="20" fill="currentColor" />
                      <rect x="33" width="2" height="20" fill="currentColor" />
                      <rect x="37" width="4" height="20" fill="currentColor" />
                      <rect x="43" width="1" height="20" fill="currentColor" />
                      <rect x="46" width="2.5" height="20" fill="currentColor" />
                      <rect x="50" width="3" height="20" fill="currentColor" />
                      <rect x="55" width="1" height="20" fill="currentColor" />
                      <rect x="58" width="2" height="20" fill="currentColor" />
                      <rect x="62" width="1.5" height="20" fill="currentColor" />
                      <rect x="65" width="4" height="20" fill="currentColor" />
                      <rect x="71" width="1" height="20" fill="currentColor" />
                      <rect x="74" width="2" height="20" fill="currentColor" />
                      <rect x="78" width="1.5" height="20" fill="currentColor" />
                      <rect x="81" width="3" height="20" fill="currentColor" />
                      <rect x="86" width="1" height="20" fill="currentColor" />
                      <rect x="89" width="2.5" height="20" fill="currentColor" />
                      <rect x="93" width="1" height="20" fill="currentColor" />
                      <rect x="96" width="3" height="20" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-[8px] font-mono tracking-widest text-slate-400">BARCODE AUTHENTICATED BY MARITIME FORCE</span>
                </div>

              </div>
            </div>

            {/* Funny disclaimer */}
            <div className="rounded-2xl bg-amber-50/70 p-3.5 text-[10px] leading-relaxed text-amber-900 border border-amber-100/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
              <span className="font-extrabold flex items-center gap-1 mb-1 text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" /> Commute Covenant Note
              </span>
              Avoid dangling toes in the puddles during CP commutes. Local fish have been mutated by toxic foam runoff and are highly competitive.
            </div>

            {/* Interacting Share and print triggers */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  alert("🖨️ Printer Simulation: Sending carrier pigeon with your physical layout...");
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Print Ticket 🖨️
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`I just booked my emergency rowboat ride with Captain Verma! Booking Ref: ${paymentResult.transactionRef}`);
                  alert("📋 Boarding pass link copied! Share this with stranded colleagues.");
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Share Boarding Pass 🔗
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={handleCompleteAndClose}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 text-center text-sm font-black text-white hover:opacity-95 shadow-md shadow-blue-500/10"
              id="btn-close-receipt"
            >
              Track Captain Dispatch 🗺️
            </button>
          </div>
        )}

      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
