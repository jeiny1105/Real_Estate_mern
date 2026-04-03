import { useOutletContext } from "react-router-dom";

const AgentDashboard = () => {

  const {
    hasPlan,
    isActive,
    isExpired,
    isSubscriptionValid,
    subscription
  } = useOutletContext();

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">

      {/* Subscription Banner */}
      {!isSubscriptionValid && (
        <div className="mb-6 bg-yellow-100 border border-yellow-300 p-4 rounded-xl">

          {!hasPlan && (
            <p className="text-sm text-yellow-700">
              ⚠️ You don’t have an active subscription.
              Upgrade to access assigned properties and leads.
            </p>
          )}

          {hasPlan && isExpired && (
            <p className="text-sm text-yellow-700">
              ⚠️ Your subscription expired on {formatDate(subscription?.expiryDate)}.
              Renew your plan to continue working with properties.
            </p>
          )}

          {hasPlan && !isActive && !isExpired && (
            <p className="text-sm text-yellow-700">
              ⚠️ Your subscription is currently inactive.
            </p>
          )}

        </div>
      )}

      {/* Dashboard Title */}
      <h1 className="text-2xl font-bold mb-6">
        Agent Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Assigned Properties</h3>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Leads</h3>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Deals Closed</h3>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Earnings</h3>
          <p className="text-2xl font-bold">₹0</p>
        </div>

      </div>

    </div>
  );
};

export default AgentDashboard;