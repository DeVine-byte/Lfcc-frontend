import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CloudinaryPlayer from "../components/CloudinaryPlayer";
import { API_URL } from "../config";

function Broadcast() {
  const { id } = useParams();

  const [broadcast, setBroadcast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBroadcast();
  }, []);

  const fetchBroadcast = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/broadcasts`);
      const data = await res.json();

      const found = data.find((item) => item._id === id);

      setBroadcast(found || null);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Broadcast link copied!");
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Loading broadcast...
      </div>
    );
  }

  if (!broadcast) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Broadcast not found
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">

      {/* NAV */}
      <nav className="border-b border-zinc-800 bg-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between px-6 py-4">
          <h1 className="text-purple-400 font-bold">
            LFCC Broadcast
          </h1>

          <a href="/" className="text-zinc-300 hover:text-purple-400">
            Home
          </a>
        </div>
      </nav>

      {/* PLAYER */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        <h1 className="text-4xl font-bold mb-6">
          {broadcast.title}
        </h1>

        <div className="rounded-3xl overflow-hidden mb-8 border border-zinc-800">

          <CloudinaryPlayer
            publicId={broadcast.videoUrl}
            height="70vh"
          />

        </div>

        <p className="text-zinc-400 mb-8">
          {broadcast.description}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-4 flex-wrap">

          <a
            href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
            className="bg-green-500 px-5 py-3 rounded-xl"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>

          <a
            href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            className="bg-blue-600 px-5 py-3 rounded-xl"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>

          <button
            onClick={copyLink}
            className="bg-purple-600 px-5 py-3 rounded-xl"
          >
            Copy Link
          </button>

        </div>

      </div>

    </div>
  );
}

export default Broadcast;
