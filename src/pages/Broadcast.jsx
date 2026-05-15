import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CloudinaryPlayer from "../components/CloudinaryPlayer";
import { API_URL } from "../config";

function Broadcast() {
  // =========================
  // ROUTER
  // =========================
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================
  const [broadcast, setBroadcast] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenu, setMobileMenu] = useState(false);

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    fetchBroadcast();
  }, [id]);

  const fetchBroadcast = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/cms/broadcasts`);

      if (!res.ok) {
        throw new Error("Failed to fetch broadcast");
      }

      const data = await res.json();

      const found = data.find((item) => item._id === id);

      if (!found) {
        setError("Broadcast not found");
        return;
      }

      setBroadcast(found);
    } catch (err) {
      console.log(err);

      setError(
        "Something went wrong while loading this broadcast."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // COPY LINK
  // =========================
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      alert("Broadcast link copied!");
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // DOWNLOAD VIDEO
  // =========================
  const downloadBroadcast = () => {
    if (!broadcast?.videoUrl) return;

    const url = broadcast.videoUrl.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

    const a = document.createElement("a");

    a.href = url;
    a.download = `${broadcast.title}.mp4`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-zinc-400">
            Loading broadcast...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR UI
  // =========================
  if (error || !broadcast) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Broadcast Not Found
          </h2>

          <p className="text-zinc-400 mb-6">
            {error}
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-purple-500 hover:bg-purple-600 transition px-6 py-3 rounded-xl font-semibold text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-zinc-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <img
              src="/logo.png"
              alt="LFCC Logo"
              className="w-11 h-11 rounded-full object-cover"
            />

            <h1 className="text-purple-400 font-bold text-lg md:text-xl">
              LFCC Broadcast
            </h1>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 text-zinc-300">
            <Link
              to="/"
              className="hover:text-purple-400 transition"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="hover:text-purple-400 transition"
            >
              About
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="md:hidden text-3xl"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="md:hidden border-t border-zinc-800 px-4 py-4 flex flex-col gap-4 text-zinc-300">
            <Link
              to="/"
              onClick={() => setMobileMenu(false)}
              className="hover:text-purple-400 transition"
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenu(false)}
              className="hover:text-purple-400 transition"
            >
              About
            </Link>
          </div>
        )}
      </nav>

      {/* ================= MAIN ================= */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {/* TITLE */}
        <div className="mb-8">
          <p className="text-purple-400 uppercase tracking-widest mb-3">
            Broadcast Message
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {broadcast.title}
          </h1>
        </div>

        {/* PLAYER */}
        <div className="rounded-3xl overflow-hidden border border-zinc-800 mb-8 shadow-2xl">
          <CloudinaryPlayer
            publicId={broadcast.videoUrl}
            height="600px"
            controls
            options={{
              controls: true,
              showLogo: false,
              fluid: true,
              preload: "auto",
              controlBar: {
                download: false,
              },
            }}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            About This Message
          </h2>

          <p className="text-zinc-400 leading-relaxed">
            {broadcast.description}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-4">
          {/* WHATSAPP */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noreferrer"
            className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-xl font-semibold"
          >
            Share On WhatsApp
          </a>

          {/* FACEBOOK */}
          <a
            href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-semibold"
          >
            Share On Facebook
          </a>

          {/* COPY LINK */}
          <button
            onClick={copyLink}
            className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl font-semibold"
          >
            Copy Link
          </button>

          
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-zinc-800 mt-16 py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-purple-400 font-bold text-xl mb-3">
            Love Foundation Christian Center
          </h3>

          <p className="text-zinc-500">
            © {new Date().getFullYear()} All Rights
            Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Broadcast;
