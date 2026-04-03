import React from "react";

function Profile() {

  return (
    <div className="max-w-3xl mx-auto px-6 py-28">

      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-4">

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 rounded bg-white/10 border border-white/20"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-white/10 border border-white/20"
        />

        <input
          type="text"
          placeholder="Phone"
          className="w-full p-3 rounded bg-white/10 border border-white/20"
        />

        <button className="bg-purple-600 px-6 py-3 rounded-xl">
          Update Profile
        </button>

      </div>

    </div>
  );
}

export default Profile;