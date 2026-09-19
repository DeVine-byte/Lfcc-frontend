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

  useEffect(() => {
    fetchBroadcasts();
    fetchMessages();
    fetchEvents();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/broadcasts`);
      const data = await res.json();
      setBroadcasts(data.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/events`);
      const data = await res.json();
      setEvents(data.reverse());
    } catch (err) {
      console.log(err);
    }
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
      alert(data.message);
      if (type === "broadcast") fetchBroadcasts();
      if (type === "message") fetchMessages();
      if (type === "event") fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================================================
  // NATIVE AWS UPLOADER INFRASTRUCTURE WITH CACHE-CLEARING FIX
  // =========================================================
  const handleNativeAWSUpload = async (uiEvent, setUrlCallback, setUploadingState) => {
    const file = uiEvent.target.files[0];
    if (!file) return;

    try {
      setUploadingState(true);

      // Step 1: Secure upload request handshake signature from backend FastAPI
      const signRes = await fetch(
        `${API_URL}/cms/sign-s3?filename=${encodeURIComponent(file.name)}&filetype=${encodeURIComponent(file.type)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!signRes.ok) throw new Error("Could not acquire AWS upload signature bundle");
      const { uploadUrl, downloadUrl } = await signRes.json();

      // Step 2: Push stream directly from visitor client device to Amazon S3 data centers
      const awsTransferRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!awsTransferRes.ok) throw new Error("S3 multi-part streaming injection rejected");

      setUrlCallback(downloadUrl);
      alert("Video safely synchronized and stored across AWS CloudFront distributions!");
    } catch (err) {
      console.error(err);
      alert("AWS cloud channel pipeline interrupted. Check your CORS setup.");
    } finally {
      setUploadingState(false);
      // BUGFIX: Explicitly wipe the target file value so selecting the same file path fires onChange triggers
      uiEvent.target.value = "";
    }
  };

  const handleBroadcast = async () => {
    if (!broadcast.videoUrl) {
      alert("Please upload a video first!");
      return;
    }
    try {
      const payload = { ...broadcast, views: 0, createdAt: new Date().toISOString() };
      const res = await fetch(`${API_URL}/cms/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      alert(data.message);
      setBroadcast({ title: "", description: "", videoUrl: "" });
      fetchBroadcasts();
    } catch (err) {
      alert("Upload failed");
    }
  };

  const handleMessage = async () => {
    if (!message.videoUrl) {
      alert("Please upload a video first!");
      return;
    }
    try {
      const payload = { ...message };
      const res = await fetch(`${API_URL}/cms/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      alert(data.message);
      setMessage({ title: "", videoUrl: "" });
      fetchMessages();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEvent = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(event),
      });
      const data = await res.json();
      alert(data.message);
      setEvent({ title: "", mediaUrl: "", date: "" });
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-purple-400">LFCC Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-500 px-5 py-3 rounded-xl">
          Logout
        </button>
      </div>

      <div className="grid gap-10">
        {/* BROADCAST SECTION */}
        <section className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Broadcasts</h2>
          <input
            placeholder="Title"
            value={broadcast.title}
            onChange={(e) => setBroadcast({ ...broadcast, title: e.target.value })}
            className="w-full p-3 bg-zinc-800 mb-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={broadcast.description}
            onChange={(e) => setBroadcast({ ...broadcast, description: e.target.value })}
            className="w-full p-3 bg-zinc-800 mb-2 rounded"
          />
          <div className="flex gap-2 items-center mb-4">
            <label className="bg-zinc-700 hover:bg-zinc-600 px-4 py-3 rounded text-sm font-medium cursor-pointer transition">
              {isUploadingBroadcast ? "Streaming files to AWS S3..." : "📁 Select Sermon Video Asset"}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                disabled={isUploadingBroadcast}
                onChange={(e) =>
                  handleNativeAWSUpload(e, (url) => setBroadcast({ ...broadcast, videoUrl: url }), setIsUploadingBroadcast)
                }
              />
            </label>
            {broadcast.videoUrl && <span className="text-green-400 text-xs truncate max-w-xs">✓ CloudFront CDN Ready</span>}
          </div>
          <button onClick={handleBroadcast} className="bg-purple-500 px-4 py-2 rounded font-semibold">
            Save Broadcast
          </button>

          <div className="mt-6 space-y-2">
            {broadcasts.map((b) => (
              <div key={b._id} className="flex justify-between bg-zinc-800 p-3 rounded">
                <div>
                  <p className="font-bold">{b.title}</p>
                  <p className="text-sm text-zinc-400">Views: {b.views || 0}</p>
                </div>
                <button onClick={() => deleteItem("broadcast", b._id)} className="bg-red-500 px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* MESSAGE OF THE WEEK SECTION */}
        <section className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Message of Week</h2>
          <input
            placeholder="Title"
            value={message.title}
            onChange={(e) => setMessage({ ...message, title: e.target.value })}
            className="w-full p-3 bg-zinc-800 mb-2 rounded"
          />
          <div className="flex gap-2 items-center mb-4">
            <label className="bg-zinc-700 hover:bg-zinc-600 px-4 py-3 rounded text-sm font-medium cursor-pointer transition">
              {isUploadingMessage ? "Streaming files to AWS S3..." : "📁 Select Weekly Message Asset"}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                disabled={isUploadingMessage}
                onChange={(e) =>
                  handleNativeAWSUpload(e, (url) => setMessage({ ...message, videoUrl: url }), setIsUploadingMessage)
                }
              />
            </label>
            {message.videoUrl && <span className="text-green-400 text-xs truncate max-w-xs">✓ CloudFront CDN Ready</span>}
          </div>
          <button onClick={handleMessage} className="bg-purple-500 px-4 py-2 rounded font-semibold">
            Save Message
          </button>

          <div className="mt-6 space-y-2">
            {messages.map((m) => (
              <div key={m._id} className="flex justify-between bg-zinc-800 p-3 rounded">
                <p>{m.title}</p>
                <button onClick={() => deleteItem("message", m._id)} className="bg-red-500 px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* EVENTS SECTION */}


        {/* EVENTS SECTION */}
        <section className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Events</h2>
          <input
            placeholder="Title"
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
            className="w-full p-3 bg-zinc-800 mb-2 rounded"
          />
          <input
            placeholder="Media URL"
            value={event.mediaUrl}
            onChange={(e) => setEvent({ ...event, mediaUrl: e.target.value })}
            className="w-full p-3 bg-zinc-800 mb-2 rounded"
          />
          <input
            type="date"
            value={event.date}
            onChange={(e) => setEvent({ ...event, date: e.target.value })}
            className="w-full p-3 bg-zinc-800 mb-2 rounded"
          />
          <button onClick={handleEvent} className="bg-purple-500 px-4 py-2 rounded font-semibold">
            Save Event
          </button>

          <div className="mt-6 space-y-2">
            {events.map((e) => (
              <div key={e._id} className="flex justify-between bg-zinc-800 p-3 rounded">
                <p>{e.title}</p>
                <button onClick={() => deleteItem("event", e._id)} className="bg-red-500 px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
