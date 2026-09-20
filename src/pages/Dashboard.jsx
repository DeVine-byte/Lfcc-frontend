import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/admin-login");
  }, [token, navigate]);

  const [broadcasts, setBroadcasts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);

  const [broadcast, setBroadcast] = useState({ title: "", description: "", videoUrl: "" });
  const [message, setMessage] = useState({ title: "", videoUrl: "" });
  const [event, setEvent] = useState({ title: "", mediaUrl: "", date: "" });

  const [isUploadingBroadcast, setIsUploadingBroadcast] = useState(false);
  const [isUploadingMessage, setIsUploadingMessage] = useState(false);
  const [isUploadingEvent, setIsUploadingEvent] = useState(false);

  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [messageProgress, setMessageProgress] = useState(0);
  const [eventProgress, setEventProgress] = useState(0);

  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });

  const showPopup = (msg, type = "info") => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "info" }), 4000);
  };

  useEffect(() => {
    fetchBroadcasts();
    fetchMessages();
    fetchEvents();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/broadcasts`);
      const data = await res.json();
      setBroadcasts([...data].reverse());
    } catch (err) { console.log(err); }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (err) { console.log(err); }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/events`);
      const data = await res.json();
      setEvents([...data].reverse());
    } catch (err) { console.log(err); }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const deleteItem = async (type, id) => {
    try {
      const res = await fetch(`${API_URL}/cms/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showPopup(data.message || "Deleted", "success");
      if (type === "broadcast") fetchBroadcasts();
      if (type === "message") fetchMessages();
      if (type === "event") fetchEvents();
    } catch {
      showPopup("Failed to delete", "error");
    }
  };

  // PURE S3 UPLOAD - NO CLOUDINARY
  const handleS3Upload = async (uiEvent, setUrlCallback, setUploading, setProgress) => {
    const file = uiEvent.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);

      const fileType = file.type || "video/mp4";

      // Step 1: Get presigned S3 URL from your FastAPI
      const signRes = await fetch(
        `${API_URL}/cms/sign-s3?filename=${encodeURIComponent(file.name)}&filetype=${encodeURIComponent(fileType)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!signRes.ok) {
        const e = await signRes.json().catch(() => ({}));
        throw new Error(e.detail || "Failed to get S3 URL");
      }

      const { uploadUrl, downloadUrl } = await signRes.json();

      // Step 2: Upload directly to S3 bucket via PUT
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", fileType);

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded * 100) / ev.total));
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`S3 error ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(file);
      });

      setUrlCallback(downloadUrl);
      showPopup("File uploaded to S3!", "success");
    } catch (err) {
      console.error(err);
      showPopup(err.message, "error");
    } finally {
      setUploading(false);
      setProgress(0);
      uiEvent.target.value = "";
    }
  };

  const handleBroadcast = async () => {
    if (!broadcast.videoUrl) return showPopup("Upload video first", "error");
    if (!broadcast.title.trim()) return showPopup("Enter title", "error");
    try {
      const res = await fetch(`${API_URL}/cms/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...broadcast, views: 0, createdAt: new Date().toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showPopup("Broadcast published!", "success");
      setBroadcast({ title: "", description: "", videoUrl: "" });
      fetchBroadcasts();
    } catch (err) { showPopup(err.message, "error"); }
  };

  const handleMessage = async () => {
    if (!message.videoUrl) return showPopup("Upload video first", "error");
    if (!message.title.trim()) return showPopup("Enter title", "error");
    try {
      const res = await fetch(`${API_URL}/cms/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(message),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showPopup("Message published!", "success");
      setMessage({ title: "", videoUrl: "" });
      fetchMessages();
    } catch (err) { showPopup(err.message, "error"); }
  };

  const handleEvent = async () => {
    if (!event.title.trim()) return showPopup("Enter title", "error");
    if (!event.mediaUrl) return showPopup("Attach file", "error");
    if (!event.date) return showPopup("Select date", "error");
    try {
      const res = await fetch(`${API_URL}/cms/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(event),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showPopup("Event added!", "success");
      setEvent({ title: "", mediaUrl: "", date: "" });
      fetchEvents();
    } catch (err) { showPopup(err.message, "error"); }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8 relative">
      {notification.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div className={`px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-md ${notification.type === "success" ? "bg-green-500/20 border-green-500 text-green-300" : "bg-red-500/20 border-red-500 text-red-300"}`}>
            <p className="font-semibold text-sm">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-purple-400">LFCC Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl">Logout</button>
      </div>

      <div className="grid gap-10">
        <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Sermon Broadcasts</h2>
          <input placeholder="Sermon Title" value={broadcast.title} onChange={(e) => setBroadcast({ ...broadcast, title: e.target.value })} className="w-full p-3 bg-zinc-800 border border-zinc-700 mb-3 rounded-xl" />
          <textarea placeholder="Description" value={broadcast.description} onChange={(e) => setBroadcast({ ...broadcast, description: e.target.value })} className="w-full p-3 bg-zinc-800 border border-zinc-700 mb-3 rounded-xl min-h-[100px]" />
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex gap-3 items-center flex-wrap">
              <label className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer">
                {isUploadingBroadcast ? `Uploading ${broadcastProgress}%` : "📁 Choose Sermon Video (S3)"}
                <input type="file" accept="video/*" className="hidden" disabled={isUploadingBroadcast} onChange={(e) => handleS3Upload(e, (url) => setBroadcast({ ...broadcast, videoUrl: url }), setIsUploadingBroadcast, setBroadcastProgress)} />
              </label>
              {broadcast.videoUrl && <span className="text-green-400 text-sm">✓ S3: {broadcast.videoUrl.split("/").pop()}</span>}
            </div>
            {isUploadingBroadcast && <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="bg-purple-500 h-full rounded-full" style={{ width: `${broadcastProgress}%` }} /></div>}
          </div>
          <button onClick={handleBroadcast} disabled={isUploadingBroadcast} className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 px-5 py-3 rounded-xl font-semibold">Publish Sermon</button>
          <div className="mt-6 space-y-2">
            {broadcasts.map((b) => (
              <div key={b._id} className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl gap-4">
                <div className="min-w-0"><p className="font-bold truncate">{b.title}</p><p className="text-sm text-zinc-400">Views: {b.views || 0}</p></div>
                <button onClick={() => deleteItem("broadcast", b._id)} className="bg-red-500/10 hover:bg-red-500 text-red-400 px-4 py-2 rounded-xl text-sm">Delete</button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Message of the Week</h2>
          <input placeholder="Message Title" value={message.title} onChange={(e) => setMessage({ ...message, title: e.target.value })} className="w-full p-3 bg-zinc-800 border border-zinc-700 mb-3 rounded-xl" />
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex gap-3 items-center flex-wrap">
              <label className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer">
                {isUploadingMessage ? `Uploading ${messageProgress}%` : "📁 Choose Video (S3)"}
                <input type="file" accept="video/*" className="hidden" disabled={isUploadingMessage} onChange={(e) => handleS3Upload(e, (url) => setMessage({ ...message, videoUrl: url }), setIsUploadingMessage, setMessageProgress)} />
              </label>
              {message.videoUrl && <span className="text-green-400 text-sm">✓ Attached</span>}
            </div>
            {isUploadingMessage && <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="bg-purple-500 h-full rounded-full" style={{ width: `${messageProgress}%` }} /></div>}
          </div>
          <button onClick={handleMessage} disabled={isUploadingMessage} className="bg-purple-500 hover:bg-purple-600 px-5 py-3 rounded-xl font-semibold">Publish Message</button>
          <div className="mt-6 space-y-2">
            {messages.map((m) => (
              <div key={m._id} className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl gap-4">
                <p className="font-semibold truncate">{m.title}</p>
                <button onClick={() => deleteItem("message", m._id)} className="bg-red-500/10 hover:bg-red-500 text-red-400 px-4 py-2 rounded-xl text-sm">Delete</button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Church Events</h2>
          <input placeholder="Event Title" value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} className="w-full p-3 bg-zinc-800 border border-zinc-700 mb-3 rounded-xl" />
          <input type="date" value={event.date} onChange={(e) => setEvent({ ...event, date: e.target.value })} className="w-full p-3 bg-zinc-800 border border-zinc-700 mb-3 rounded-xl" />
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex gap-3 items-center flex-wrap">
              <label className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer">
                {isUploadingEvent ? `Uploading ${eventProgress}%` : "📁 Choose Flyer / Video (S3)"}
                <input type="file" accept="image/*,video/*" className="hidden" disabled={isUploadingEvent} onChange={(e) => handleS3Upload(e, (url) => setEvent({ ...event, mediaUrl: url }), setIsUploadingEvent, setEventProgress)} />
              </label>
              {event.mediaUrl && <span className="text-green-400 text-sm">✓ Attached</span>}
            </div>
            {isUploadingEvent && <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="bg-purple-500 h-full rounded-full" style={{ width: `${eventProgress}%` }} /></div>}
          </div>
          <button onClick={handleEvent} disabled={isUploadingEvent} className="bg-purple-500 hover:bg-purple-600 px-5 py-3 rounded-xl font-semibold">Add Event</button>
          <div className="mt-6 space-y-2">
            {events.map((ev) => (
              <div key={ev._id} className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl gap-4">
                <p className="font-semibold truncate">{ev.title}</p>
                <button onClick={() => deleteItem("event", ev._id)} className="bg-red-500/10 hover:bg-red-500 text-red-400 px-4 py-2 rounded-xl text-sm">Delete</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
