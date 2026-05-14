import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

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

      const res = await fetch(`${API_URL}/cms/broadcasts`);

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

      const res = await fetch(`${API_URL}/cms/messages`);

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

      const res = await fetch(`${API_URL}/cms/events`);

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
    await navigator.clipboard.writeText(shareUrl);

    alert("Link copied!");
  };

  return (
    <div className="bg-black min-h-screen text-white">

      {/* ================= NAVBAR ================= */}
      <nav>
           <h1 className="text-purple-400 font-bold text-lg md:text-xl">
              Love Foundation Christian Center
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 text-zinc-300">
            <a href="/" className="hover:text-purple-400 transition">
              Home
            </a>

            <a href="/about" className="hover:text-purple-400 transition">
              About
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              const menu = document.getElementById("mobileMenuHome");
              menu.classList.toggle("hidden");
            }}
            className="md:hidden text-white text-3xl"
          >
            ☰
          </button>

        </div>

        {/* Mobile Menu */}
        <div
          id="mobileMenuHome"
          className="hidden md:hidden flex flex-col gap-4 px-6 pb-4 text-zinc-300"
        >
          <a href="/" className="hover:text-purple-400 transition">
            Home
          </a>

          <a href="/about" className="hover:text-purple-400 transition">
            About
          </a>
        </div>
      </nav>
      {/* ================= HERO ================= */}
      <section className="py-16 px-4">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

          <div>

            <h1 className="text-5xl font-bold mb-6">
              Welcome to Love Foundation
            </h1>

            <p className="text-zinc-400 text-lg">
              Experience powerful messages, worship,
              and life-changing broadcasts.
            </p>

          </div>

          <div className="rounded-2xl overflow-hidden">

            <ReactPlayer
              url={
                broadcasts.length > 0
                  ? broadcasts[0].videoUrl
                  : ""
              }
              controls
              width="100%"
              height="450px"
            />

          </div>

        </div>

      </section>

      {/* ================= MESSAGE OF WEEK ================= */}
      {messages.length > 0 && (

        <section className="py-20 px-4">

          <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-purple-400 text-center mb-6">
              MESSAGE FOR THE WEEK
            </h2>

            <h3 className="text-3xl font-bold text-center mb-6">
              {messages[0].title}
            </h3>

            <ReactPlayer
              url={messages[0].videoUrl}
              controls
              width="100%"
              height="500px"
            />

            {/* SHARE BUTTONS */}
            <div className="flex justify-center gap-4 mt-6 flex-wrap">

              <a
                href={`https://wa.me/?text=${shareUrl}`}
                className="bg-green-500 px-5 py-3 rounded-xl"
                target="_blank"
              >
                WhatsApp
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                className="bg-blue-600 px-5 py-3 rounded-xl"
                target="_blank"
              >
                Facebook
              </a>

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

            {broadcasts.map((v, index) => (

              <div
                key={index}
                className="bg-zinc-900 rounded-2xl overflow-hidden"
              >

                <img
                  src={v.thumbnail}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">

                  <h3 className="text-xl font-bold">
                    {v.title}
                  </h3>

                  <p className="text-zinc-400">
                    {v.description}
                  </p>

                </div>

              </div>
            ))}

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
                  className="bg-zinc-900 rounded-2xl overflow-hidden"
                >

                  <img
                    src={e.mediaUrl}
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
