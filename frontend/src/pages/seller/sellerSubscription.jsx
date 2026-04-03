import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../app/apiClient";
import loadRazorpay from "../../utils/loadRazorpay";
import { useAuth } from "../../context/AuthContext";

const SellerSubscription = () => {
  const {
    isSubscriptionValid,
    subscription
  } = useOutletContext();

  const { setUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [autoRenew, setAutoRenew] = useState(subscription?.autoRenew || false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/subscriptionPlans/available");
        setPlans(res.data.data);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (price) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const handlePayment = async (planId) => {
    try {
      setProcessing(true);

      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // Determine endpoint
      const endpoint = isSubscriptionValid
        ? "/subscription/upgrade"
        : "/payments/seller/create-order";

      const payload = isSubscriptionValid
        ? { newPlanId: planId }
        : { subscriptionPlanId: planId };

      const { data } = await api.post(endpoint, payload);

      const orderData = isSubscriptionValid
        ? data.order
        : data.data;

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DreamHaven",
        description: "Subscription Payment",
        order_id: orderData.orderId,
        handler: async function (response) {

          const verifyEndpoint = isSubscriptionValid
            ? "/subscription/upgrade/verify"
            : "/payments/verify";

          const verifyPayload = isSubscriptionValid
            ? {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              newPlanId: planId,
            }
            : {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionPlanId: planId,
            };

          const verifyRes = await api.post(verifyEndpoint, verifyPayload);
          console.log("VERIFY SUCCESS", verifyRes.data);

          const updated = await api.get("/users/me");
          console.log("FETCHED USER", updated.data);

          setUser(updated.data.data);
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const toggleAutoRenew = async () => {
    try {
      const endpoint = autoRenew
        ? "/subscription/cancel"
        : "/subscription/auto-renew/enable";

      await api.post(endpoint);

      setAutoRenew(!autoRenew);

    } catch (err) {
      console.error("Auto renew toggle failed", err);
      alert("Failed to update auto-renew setting");
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-black">
          Subscription <span className="text-purple-500 font-light">Plans</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Choose a plan to unlock seller features.
        </p>
      </div>

      {loading && (
        <p className="text-slate-400">Loading plans...</p>
      )}

      {!loading && plans.length === 0 && (
        <p className="text-slate-400">No plans available.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {

          const isCurrent =
            isSubscriptionValid &&
            subscription?.plan === plan._id;

          return (
            <div
              key={plan._id}
              className={`bg-white/5 border rounded-3xl p-8 transition-all hover:border-purple-500/40 ${isCurrent
                ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                : "border-white/10"
                }`}
            >
              <h3 className="text-xl font-bold mb-2">
                {plan.name}
              </h3>

              <p className="text-slate-400 text-sm mb-6">
                {plan.description}
              </p>

              <div className="text-4xl font-black mb-2">
                {formatPrice(plan.pricing.price)}
              </div>

              <p className="text-xs text-slate-500 mb-6">
                {plan.pricing.durationInDays} days validity
              </p>

              <div className="text-sm text-slate-300 space-y-2 mb-8">
                <p>✔ {plan.limits.maxListings} Active Listings</p>
                <p>✔ {plan.limits.activeListingDays} Days per Listing</p>
                {plan.limits.maxFeaturedListings > 0 && (
                  <p>✔ {plan.limits.maxFeaturedListings} Featured Listings</p>
                )}
              </div>

              {isCurrent ? (
                <div className="space-y-4">

                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-green-500/20 text-green-400 font-semibold border border-green-400/30"
                  >
                    Current Plan
                  </button>

                  {/* Auto Renew Toggle */}
                  <div className="flex items-center justify-between text-sm text-slate-300 border-t border-white/10 pt-4">
                    <span>Auto Renew</span>

                    <button
                      onClick={toggleAutoRenew}
                      className={`px-4 py-1 rounded-full text-xs font-semibold transition ${autoRenew
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-slate-400"
                        }`}
                    >
                      {autoRenew ? "ON" : "OFF"}
                    </button>
                  </div>

                </div>
              ) : (
                <button
                  disabled={processing}
                  onClick={() => handlePayment(plan._id)}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {isSubscriptionValid ? "Upgrade Plan" : "Buy Plan"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerSubscription;