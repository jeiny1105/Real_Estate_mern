import AgentSidebar from "./AgentSidebar";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

const AgentLayout = () => {

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
    <div className="flex">

      <AgentSidebar
        isSubscriptionValid={subscriptionState.isSubscriptionValid}
      />

      <div className="flex-1 bg-gray-100 min-h-screen ml-64">

        <div className="p-6">
          <Outlet context={subscriptionState} />
        </div>

      </div>
    </div>
  );
};

export default AgentLayout;