import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import CloudinaryPlayer from "../components/CloudinaryPlayer";

function Home() {

  // =========================
  // STATES
  // =========================
  const [broadcasts, setBroadcasts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    fetchBroadcasts();
    fetchMessages();
    fetchEvents();

  }, []);

  // =========================
  // GET BROADCASTS
  // =========================
  const fetchBroadcasts = async () => {

    try {

      const res = await fetch(
        `${API_URL}/cms/broadcasts`
      );

      const data = await res.json();

      setBroadcasts(data);

    } catch (err) {

      console.log(err);

    }
  };

  // =========================
  // GET MESSAGE OF WEEK
  // =========================
  const fetchMessages = async () => {

    try {

      const res = await fetch(
        `${API_URL}/cms/messages`
      );

      const data = await res.json();

      setMessages(data);

    } catch (err) {

      console.log(err);

    }
  };

  // =========================
  // GET EVENTS
  // =========================
  const fetchEvents = async () => {

    try {

      const res = await fetch(
        `${API_URL}/cms/events`
      );

      const data = await res.json();

      setEvents(data);

    } catch (err) {

      console.log(err);

    }
  };

  // =========================
  // SHARE
  // =========================
  const shareUrl = window.location.href;

  const copyLink = async () => {

    await navigator.clipboard.writeText(
      shareUrl
    );

    alert("Link copied!");

  };

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

      {/* ================= HERO ================= */}
      <section className="py-16 px-4">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div>

            <h1 className="text-5xl font-bold mb-6">
              Welcome to Love Foundation
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed">
              Experience powerful worship,
              transformational teachings,
              and life-changing broadcasts
              from Love Foundation Christian Center.
            </p>

          </div>

          {/* RIGHT */}
          <div className="rounded-2xl overflow-hidden border border-zinc-800">

            {broadcasts.length > 0 && (

              <CloudinaryPlayer
                publicId={
                  broadcasts[0].videoUrl
                }
                height="450px"
              />

            )}

          </div>

        </div>

      </section>

      {/* ================= MESSAGE OF WEEK ================= */}
      {messages.length > 0 && (

        <section className="py-20 px-4">

          <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-purple-400 text-center mb-6 font-bold">
              MESSAGE FOR THE WEEK
            </h2>

            <h3 className="text-3xl font-bold text-center mb-6">
              {messages[0].title}
            </h3>

            <CloudinaryPlayer
              publicId={
                messages[0].videoUrl
              }
              height="500px"
            />

            {/* SHARE BUTTONS */}
            <div className="flex justify-center gap-4 mt-8 flex-wrap">

              {/* WHATSAPP */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  shareUrl
                )}`}
                className="bg-green-500 px-5 py-3 rounded-xl"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>

              {/* FACEBOOK */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}`}
                className="bg-blue-600 px-5 py-3 rounded-xl"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>

              {/* X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareUrl
                )}`}
                className="bg-black border border-zinc-700 px-5 py-3 rounded-xl"
                target="_blank"
                rel="noreferrer"
              >
                X
              </a>

              {/* COPY */}
              <button
                onClick={copyLink}
                className="bg-purple-500 px-5 py-3 rounded-xl"
              >
                Copy Link
              </button>

            </div>

          </div>

        </section>

      )}

      {/* ================= BROADCASTS ================= */}
      <section className="py-20 px-4">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-bold mb-10">
            Latest Broadcasts
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {broadcasts.map((v, index) => {

              // =========================
              // VIDEO PAGE LINK
              // =========================
              const videoLink =
                `${window.location.origin}/broadcast/${v._id}`;

              // =========================
              // AUTO THUMBNAIL
              // =========================
              const thumbnail =
                `https://res.cloudinary.com/dbsup8wb8/video/upload/so_3/${v.videoUrl}.jpg`;

              // =========================
              // COPY LINK
              // =========================
              const copyBroadcastLink = async () => {

                await navigator.clipboard.writeText(
                  videoLink
                );

                alert(
                  "Broadcast link copied!"
                );

              };

              return (

                <div
                  key={index}
                  className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-purple-500 transition-all duration-300"
                >

                  {/* THUMBNAIL */}
                  <div className="relative">

                    <img
                      src={thumbnail}
                      alt={v.title}
                      className="h-56 w-full object-cover"
                    />

                    {/* PLAY ICON */}
                    <div className="absolute inset-0 flex items-center justify-center">

                      <div className="bg-black/70 w-16 h-16 rounded-full flex items-center justify-center text-3xl">
                        ▶
                      </div>

                    </div>

                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    <h3 className="text-xl font-bold mb-3">
                      {v.title}
                    </h3>

                    <p className="text-zinc-400 mb-5 line-clamp-3">
                      {v.description}
                    </p>

                    {/* WATCH */}
                    <a
                      href={videoLink}
                      className="block text-center bg-purple-600 hover:bg-purple-700 transition px-4 py-3 rounded-xl mb-4"
                    >
                      Watch Broadcast
                    </a>

                    {/* SHARE */}
                    <div className="grid grid-cols-2 gap-3">

                      {/* WHATSAPP */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `${v.title} ${videoLink}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-500 text-center py-2 rounded-xl"
                      >
                        WhatsApp
                      </a>

                      {/* FACEBOOK */}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          videoLink
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-600 text-center py-2 rounded-xl"
                      >
                        Facebook
                      </a>

                      {/* X */}
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          videoLink
                        )}&text=${encodeURIComponent(
                          v.title
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-black border border-zinc-700 text-center py-2 rounded-xl"
                      >
                        X
                      </a>

                      {/* COPY */}
                      <button
                        onClick={
                          copyBroadcastLink
                        }
                        className="bg-purple-500 py-2 rounded-xl"
                      >
                        Copy Link
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* ================= EVENTS ================= */}
      {events.length > 0 && (

        <section className="py-20 px-4 bg-zinc-950">

          <div className="max-w-7xl mx-auto">

            <h2 className="text-3xl font-bold mb-10 text-purple-400">
              Events
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {events.map((e, index) => (

                <div
                  key={index}
                  className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800"
                >

                  <img
                    src={e.mediaUrl}
                    alt={e.title}
                    className="h-64 w-full object-cover"
                  />

                  <div className="p-5">

                    <h3 className="text-xl font-bold">
                      {e.title}
                    </h3>

                    <p className="text-zinc-400">
                      {e.date}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>

      )}

    </div>
  );
}

export default Home;
