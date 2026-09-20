import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

// Simple S3 Video Player - replaces CloudinaryPlayer
function S3VideoPlayer({ src, height = "420px" }) {
  if (!src) return null;
  return (
    <video
      controls
      playsInline
      preload="metadata"
      src={src}
      className="w-full bg-black"
      style={{ height }}
    />
  );
}

function Home() {
  const navigate = useNavigate();
  const [broadcasts, setBroadcasts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBroadcasts(), fetchMessages(), fetchEvents()]);
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please refresh.");
    } finally { setLoading(false); }
  };

  const fetchBroadcasts = async () => {
    const res = await fetch(`${API_URL}/cms/broadcasts`);
    if (!res.ok) throw new Error("Failed to fetch broadcasts");
    const data = await res.json();
    const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setBroadcasts(sorted);
  };

  const fetchMessages = async () => {
    const res = await fetch(`${API_URL}/cms/messages`);
    if (!res.ok) throw new Error("Failed to fetch messages");
    const data = await res.json();
    setMessages(data);
  };

  const fetchEvents = async () => {
    const res = await fetch(`${API_URL}/cms/events`);
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    setEvents([...data].reverse());
  };

  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const desc = item.description?.toLowerCase() || "";
      return title.includes(search.toLowerCase()) || desc.includes(search.toLowerCase());
    });
  }, [broadcasts, search]);

  const copyLink = async (link, text = "Broadcast link copied!") => {
    try {
      const fullLink = `${window.location.origin}${link}`;
      await navigator.clipboard.writeText(fullLink);
      alert(text);
    } catch (err) { console.log(err); }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading broadcasts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center px-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-3 text-red-400">Error</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button onClick={fetchAllData} className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <nav className="border-b border-zinc-800 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LFCC Logo" className="w-12 h-12 rounded-full object-cover" />
            <h1 className="text-purple-400 font-bold text-lg md:text-xl">Love Foundation Christian Center</h1>
          </div>
          <input type="text" placeholder="Search broadcasts..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-zinc-900 border border-zinc-700 px-4 py-3 rounded-xl w-full md:w-72 outline-none focus:border-purple-500" />
        </div>
        <div className="hidden md:flex gap-6 text-zinc-300 px-4 max-w-7xl mx-auto pb-3">
          <a href="/" className="hover:text-purple-400">Home</a>
          <a href="/about" className="hover:text-purple-400">About</a>
        </div>
        <button onClick={() => { const menu = document.getElementById("mobileMenuHome"); if (menu) menu.classList.toggle("hidden"); }} className="md:hidden text-white text-3xl px-4 pb-3">☰</button>
        <div id="mobileMenuHome" className="hidden md:hidden flex flex-col gap-4 px-6 pb-4 text-zinc-300">
          <a href="/" className="hover:text-purple-400">Home</a>
          <a href="/about" className="hover:text-purple-400">About</a>
        </div>
      </nav>

      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Welcome to Love Foundation Christian Centre</h1>
            <p className="text-purple-400 font-semibold mb-3 uppercase tracking-widest">A place to find God's love</p>
          </div>
          <div className="border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            {broadcasts[0] && <S3VideoPlayer src={broadcasts[0].videoUrl} height="420px" />}
          </div>
        </div>
      </section>

      {messages[0] && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8">
            <p className="text-center text-purple-400 uppercase tracking-widest mb-3">Message Of The Week</p>
            <h2 className="text-3xl md:text-4xl text-center font-bold mb-8">{messages[0].title}</h2>
            <S3VideoPlayer src={messages[0].videoUrl} height="450px" />
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="py-16 px-4 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-purple-400 mb-10">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {events.map((e, i) => {
                const isVideo = e.mediaUrl?.includes(".mp4") || e.mediaUrl?.includes("video");
                return (
                  <div key={i} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-purple-500 transition">
                    {isVideo? (
                      <video controls playsInline preload="metadata" src={e.mediaUrl} className="w-full h-72 object-cover bg-black" />
                    ) : (
                      <img src={e.mediaUrl} alt={e.title} loading="lazy" className="w-full h-72 object-cover" />
                    )}
                    <div className="p-5">
                      <h3 className="text-2xl font-bold mb-2">{e.title}</h3>
                      <p className="text-zinc-400">{e.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <h2 className="text-4xl font-bold">Latest Broadcasts</h2>
            <p className="text-zinc-400">{filteredBroadcasts.length} broadcasts found</p>
          </div>

          {filteredBroadcasts.length === 0? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
              <h3 className="text-2xl font-bold mb-3">No Broadcasts Found</h3>
              <p className="text-zinc-400">Try searching with another keyword.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBroadcasts.map((v, i) => {
                const videoLink = `/broadcast/${v._id}`;
                return (
                  <div key={i} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-purple-500 transition group">
                    {/* S3 VIDEO THUMBNAIL - No Cloudinary */}
                    <div className="relative cursor-pointer overflow-hidden bg-black" onClick={() => navigate(videoLink)}>
                      <video
                        src={v.videoUrl}
                        preload="metadata"
                        muted
                        playsInline
                        className="h-56 w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                        <div className="bg-black/70 w-16 h-16 rounded-full flex items-center justify-center text-2xl">▶</div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-xl mb-3 line-clamp-2">{v.title}</h3>
                      <p className="text-zinc-400 text-sm mb-6 line-clamp-3">{v.description}</p>
                      <div className="flex flex-col gap-3">
                        <button onClick={() => navigate(videoLink)} className="bg-purple-500 hover:bg-purple-600 w-full py-3 rounded-xl font-semibold">Watch Broadcast</button>
                        <button onClick={() => copyLink(videoLink)} className="border border-zinc-700 hover:border-purple-500 w-full py-3 rounded-xl">Copy Link</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-purple-400 font-bold text-xl mb-3">Love Foundation Christian Center</h3>
          <p className="text-zinc-500">© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
