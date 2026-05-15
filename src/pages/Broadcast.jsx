import React, {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import CloudinaryPlayer from "../components/CloudinaryPlayer";
import { API_URL } from "../config";

function Broadcast() {

  // =========================
  // GET ID FROM URL
  // =========================
  const { id } = useParams();

  // =========================
  // STATES
  // =========================
  const [broadcast, setBroadcast] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH SINGLE BROADCAST
  // =========================
  useEffect(() => {

    fetchBroadcast();

  }, []);

  const fetchBroadcast = async () => {

    try {

      const res = await fetch(
        `${API_URL}/cms/broadcasts`
      );

      const data = await res.json();

      const foundBroadcast =
        data.find((item) => item._id === id);

      setBroadcast(foundBroadcast);

      setLoading(false);

    } catch (err) {

      console.log(err);

      setLoading(false);

    }
  };

  // =========================
  // COPY LINK
  // =========================
  const copyLink = async () => {

    await navigator.clipboard.writeText(
      window.location.href
    );

    alert("Broadcast link copied!");

  };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================
  if (!broadcast) {

    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Broadcast not found
      </div>
    );
  }

  // =========================
  // SHARE LINK
  // =========================
  const shareUrl =
    window.location.href;

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-zinc-800 sticky top-0 z-50 bg-black">

        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          {/* LOGO */}
          <div className="flex items-center gap-3">

            <img
              src="/logo.png"
              alt="LFCC Logo"
              className="w-12 h-12 rounded-full object-cover"
            />

            <h1 className="text-purple-400 font-bold text-lg md:text-xl">
              Love Foundation Christian Center
            </h1>

          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-6 text-zinc-300">

            <a
              href="/"
              className="hover:text-purple-400 transition"
            >
              Home
            </a>

            <a
              href="/about"
              className="hover:text-purple-400 transition"
            >
              About
            </a>

          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => {

              const menu =
                document.getElementById(
                  "mobileMenuHome"
                );

              if (menu) {
                menu.classList.toggle("hidden");
              }

            }}
            className="md:hidden text-white text-3xl"
          >
            ☰
          </button>

        </div>

        {/* MOBILE MENU */}
        <div
          id="mobileMenuHome"
          className="hidden md:hidden flex flex-col gap-4 px-6 pb-4 text-zinc-300"
        >

          <a
            href="/"
            className="hover:text-purple-400 transition"
          >
            Home
          </a>

          <a
            href="/about"
            className="hover:text-purple-400 transition"
          >
            About
          </a>

        </div>

      </nav>
      

      {/* ================= CONTENT ================= */}
      <section className="py-16 px-4">

        <div className="max-w-6xl mx-auto">

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {broadcast.title}
          </h1>

          {/* VIDEO PLAYER */}
          <div className="rounded-3xl overflow-hidden mb-10">

            <CloudinaryPlayer
              publicId={v.videoUrl}
              controls
              options={{
                controls: true,
                showLogo: false,
                fluid: true,
                preload: "auto",
                controlBar: {
                  download: false
                }
              }}
              />

          </div>
          
          {/* DESCRIPTION */}
          <p className="text-zinc-400 text-lg mb-10">
            {broadcast.description}
          </p>

          

          {/* SHARE BUTTONS */}
          <div className="grid md:grid-cols-4 gap-4">

            {/* WHATSAPP */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                shareUrl
              )}`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 text-center py-4 rounded-2xl font-bold"
            >
              Share on WhatsApp
            </a>

            {/* FACEBOOK */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
              )}`}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 text-center py-4 rounded-2xl font-bold"
            >
              Share on Facebook
            </a>

            {/* X */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                shareUrl
              )}&text=${encodeURIComponent(
                broadcast.title
              )}`}
              target="_blank"
              rel="noreferrer"
              className="bg-zinc-900 border border-zinc-700 text-center py-4 rounded-2xl font-bold"
            >
              Share on X
            </a>

            {/* COPY LINK */}
            <button
              onClick={copyLink}
              className="bg-purple-600 hover:bg-purple-700 transition py-4 rounded-2xl font-bold"
            >
              Copy Link
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Broadcast;
