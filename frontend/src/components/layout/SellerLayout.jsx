import { Outlet } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import SellerSidebar from "./SellerSidebar";

const SellerLayout = () => {
  const { user } = useAuth();

  const subscriptionState = useMemo(() => {
    if (!user) {
      return {
        hasPlan: false,
        isActive: false,
        isExpired: false,
        isSubscriptionValid: false,
      };
    }

    const today = new Date();

    const hasPlan = !!user?.subscription?.plan;

    const isActive =
      user?.subscription?.status === "Active";

    const isExpired =
      user?.subscription?.expiryDate &&
      new Date(user.subscription.expiryDate) < today;

    const isSubscriptionValid =
      hasPlan && isActive && !isExpired;

    return {
      hasPlan,
      isActive,
      isExpired,
      isSubscriptionValid,
      subscription: user.subscription,
    };
  }, [user]);

  return (
    <div className="flex bg-[#050505] min-h-screen text-white overflow-hidden">
      <SellerSidebar
        isSubscriptionValid={subscriptionState.isSubscriptionValid}
      />

      <div className="flex-1 lg:ml-64 h-screen overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          <Outlet context={subscriptionState} />
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;