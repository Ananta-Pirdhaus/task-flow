import React from "react";

const Newsletter: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold text-gray-800">
        Newsletter Management
      </h1>
      <p className="mt-4 text-gray-600">
        Here you can manage your newsletters. Create, edit, and send newsletters
        to your subscribers.
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
        Create New Newsletter
      </button>
    </div>
  );
};

export default Newsletter;
