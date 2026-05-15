import React, { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config";
import CloudinaryPlayer from "../components/CloudinaryPlayer";

function Home() {
  // =========================
  // STATES
  // =========================
  const [broadcasts, setBroadcasts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetchBroadcasts();
    fetchMessages();
    fetchEvents();
  }, []);

  // =========================
  // BROADCASTS
  // =========================
  const fetchBroadcasts = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/broadcasts`);
      const data = await res.json();

      const sorted = [...data].reverse(); // newest first
      setBroadcasts(sorted);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // MESSAGES
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
  // EVENTS
  // =========================
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/events`);
      const data = await res.json();
      setEvents([...data].reverse());
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // SEARCH FILTER
  // =========================
  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const desc = item.description?.toLowerCase() || "";
      return (
        title.includes(search.toLowerCase()) ||
        desc.includes(search.toLowerCase())
      );
    });
  }, [broadcasts, search]);

  // =========================
  // COPY LINK
  // =========================
  const copyLink = async (link, text = "Link copied!") => {
    try {
      await navigator.clipboard.writeText(link);
      alert(text);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">

      {/* ================= NAV ================= */}
      <nav className="border-b border-zinc-800 sticky top-0 z-50 bg-black">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-12 h-12 rounded-full object-cover" />
            <h1 className="text-purple-400 font-bold text-lg">
              Love Foundation Christian Center
            </h1>
          </div>

          <div className="hidden md:flex gap-6 text-zinc-300">
            <a href="/">Home</a>
            <a href="/about">About</a>
          </div>

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
              Experience powerful worship and life-changing broadcasts.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-2xl overflow-hidden">
            {broadcasts.length > 0 && (
              <CloudinaryPlayer
                publicId={broadcasts[0].videoUrl}
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
              publicId={messages[0].videoUrl}
              height="500px"
            />

            {/* MESSAGE SHARE */}
            <div className="flex justify-center gap-4 mt-8 flex-wrap">

              {(() => {
                const messageLink =
                  `${window.location.origin}/message/${messages[0]._id}`;

                return (
                  <>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        messages[0].title + " " + messageLink
                      )}`}
                      className="bg-green-500 px-5 py-3 rounded-xl"
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        messageLink
                      )}`}
                      className="bg-blue-600 px-5 py-3 rounded-xl"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Facebook
                    </a>

                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        messageLink
                      )}&text=${encodeURIComponent(messages[0].title)}`}
                      className="bg-black border border-zinc-700 px-5 py-3 rounded-xl"
                      target="_blank"
                      rel="noreferrer"
                    >
                      X
                    </a>

                    <button
                      onClick={() =>
                        copyLink(messageLink, "Message link copied!")
                      }
                      className="bg-purple-500 px-5 py-3 rounded-xl"
                    >
                      Copy Link
                    </button>
                  </>
                );
              })()}

            </div>

          </div>
        </section>
      )}

      {/* ================= EVENTS ================= */}
      {events.length > 0 && (
        <section className="py-20 px-4 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-purple-400">
              Events
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {events.map((e, i) => (
                <div key={i} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">

                  {e.mediaUrl?.includes(".mp4") ? (
                    <video controls className="w-full h-72 object-cover">
                      <source src={e.mediaUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={e.mediaUrl}
                      className="w-full h-72 object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="text-xl font-bold">{e.title}</h3>
                    <p className="text-zinc-400">{e.date}</p>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ================= BROADCASTS ================= */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* SEARCH */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Latest Broadcasts</h2>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-zinc-900 border border-zinc-700 px-5 py-3 rounded-xl"
            />
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-3 gap-6">

            {filteredBroadcasts.map((v) => {

              const videoLink =
                `${window.location.origin}/broadcast/${v._id}`;

              const thumbnail =
                `https://res.cloudinary.com/dbsup8wb8/video/upload/so_3/${v.videoUrl}.jpg`;

              return (
                <div
                  key={v._id}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800"
                >

                  {/* CLICKABLE THUMBNAIL */}
                  <a href={videoLink} className="relative block">
                    <img
                      src={thumbnail}
                      className="h-56 w-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/70 w-16 h-16 rounded-full flex items-center justify-center text-3xl">
                        ▶
                      </div>
                    </div>
                  </a>

                  <div className="p-5">

                    <h3 className="text-xl font-bold mb-2">
                      {v.title}
                    </h3>

                    <p className="text-zinc-400 mb-4">
                      {v.description}
                    </p>

                    <a
                      href={videoLink}
                      className="block text-center bg-purple-600 py-3 rounded-xl mb-4"
                    >
                      Watch Broadcast
                    </a>

                    {/* SHARE */}
                    <div className="grid grid-cols-2 gap-3">

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          v.title + " " + videoLink
                        )}`}
                        className="bg-green-500 text-center py-2 rounded-xl"
                      >
                        WhatsApp
                      </a>

                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          videoLink
                        )}`}
                        className="bg-blue-600 text-center py-2 rounded-xl"
                      >
                        Facebook
                      </a>

                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          videoLink
                        )}&text=${encodeURIComponent(v.title)}`}
                        className="bg-black border border-zinc-700 text-center py-2 rounded-xl"
                      >
                        X
                      </a>

                      <button
                        onClick={() =>
                          copyLink(videoLink, "Broadcast link copied!")
                        }
                        className="bg-purple-500 py-2 rounded-xl"
                      >
                        Copy
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;
