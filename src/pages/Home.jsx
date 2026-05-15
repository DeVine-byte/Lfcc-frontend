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

      // latest first
      setBroadcasts(data.reverse());
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
      setEvents(data.reverse());
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
  const copyLink = async (link, text = "Copied!") => {
    try {
      await navigator.clipboard.writeText(link);
      alert(text);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // DOWNLOAD MESSAGE
  // =========================
  const downloadMessage = () => {
    if (!messages.length) return;
    const url = messages[0].videoUrl.replace('/upload/', '/upload/fl_attachment/');
    const a = document.createElement("a");
    a.href = url;
    a.download = messages[0].title || "message.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div className="bg-black min-h-screen text-white">

      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-zinc-800 sticky top-0 z-50 bg-black">
        <div className="flex items-center gap-3"> 
          <img src="/logo.png" alt="LFCC Logo" className="w-12 h-12 rounded-full object-cover" /> 
          <h1 className="text-purple-400 font-bold text-lg md:text-xl"> 
            Love Foundation Christian Center
          </h1> 
        </div>

          <input
            type="text"
            placeholder="Search broadcasts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 px-4 py-2 rounded-xl w-64 outline-none"
          />
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

          <div>
            <h1 className="text-5xl font-bold mb-4">
              Welcome to Love Foundation Christian Center 
            </h1>
            <p className="text-zinc-400">
              We gather here to encounter and worship God together.  
              May this time draw you closer to Christ.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden">
            {broadcasts[0] && (
              <CloudinaryPlayer
                publicId={broadcasts[0].videoUrl}
                height="420px"
              />
            )}
          </div>

        </div>
      </section>

      {/* ================= MESSAGE OF WEEK ================= */}
      {messages[0] && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

            <h2 className="text-center text-purple-400 mb-4">
              MESSAGE OF THE WEEK
            </h2>

            <h3 className="text-2xl text-center font-bold mb-6">
              {messages[0].title}
            </h3>

            <CloudinaryPlayer
              publicId={messages[0].videoUrl}
              height="450px"
            />

            {/* DOWNLOAD BUTTON */}
            <div className="flex justify-center mt-6">
              <button
                onClick={downloadMessage}
                className="bg-purple-500 px-6 py-3 rounded-xl font-bold"
              >
                Download Message
              </button>
            </div>

          </div>
        </section>
      )}

      {/* ================= EVENTS (NOW FIRST BEFORE BROADCASTS) ================= */}
      {events.length > 0 && (
        <section className="py-16 px-4 bg-zinc-950">
          <div className="max-w-7xl mx-auto">

            <h2 className="text-3xl font-bold text-purple-400 mb-8">
              Events
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {events.map((e, i) => {
                const isVideo =
                  e.mediaUrl?.includes("video") ||
                  e.mediaUrl?.endsWith(".mp4");

                return (
                  <div
                    key={i}
                    className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800"
                  >

                    {isVideo ? (
                      <video controls className="w-full h-72 object-cover">
                        <source src={e.mediaUrl} />
                      </video>
                    ) : (
                      <img
                        src={e.mediaUrl}
                        className="w-full h-72 object-cover"
                        alt={e.title}
                      />
                    )}

                    <div className="p-4">
                      <h3 className="text-xl font-bold">
                        {e.title}
                      </h3>
                      <p className="text-zinc-400">
                        {e.date}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </section>
      )}

      {/* ================= BROADCASTS ================= */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-bold mb-6">
            Latest Broadcasts
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {filteredBroadcasts.map((v, i) => {

              const videoLink = `/broadcast/${v._id}`;

              const thumbnail =
                `https://res.cloudinary.com/dbsup8wb8/video/upload/so_3/${v.videoUrl}.jpg`;

              return (
                <div
                  key={i}
                  className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800"
                >

                  {/* CLICKABLE THUMBNAIL */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => (window.location.href = videoLink)}
                  >
                    <img
                      src={thumbnail}
                      className="h-56 w-full object-cover"
                      alt={v.title}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/70 w-14 h-14 rounded-full flex items-center justify-center">
                        ▶
                      </div>
                    </div>
                  </div>

                  <div className="p-4">

                    <h3 className="font-bold mb-2">
                      {v.title}
                    </h3>

                    <p className="text-zinc-400 text-sm mb-4">
                      {v.description}
                    </p>

                    <button
                      onClick={() =>
                        copyLink(videoLink, "Broadcast link copied!")
                      }
                      className="bg-purple-500 w-full py-2 rounded-xl"
                    >
                      Copy Link
                    </button>

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
