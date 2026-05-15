import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Dashboard() {

  const navigate = useNavigate();

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin-login");
    }

  }, []);

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/";

  };

  // =========================
  // EXTRACT CLOUDINARY PUBLIC ID
  // =========================
  const extractPublicId = (url) => {

    try {

      const split = url.split("public_id=")[1];

      if (!split) return "";

      return decodeURIComponent(split);

    } catch (err) {

      return "";

    }

  };

  // =========================
  // BROADCAST STATE
  // =========================
  const [broadcast, setBroadcast] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });

  // =========================
  // MESSAGE STATE
  // =========================
  const [message, setMessage] = useState({
    title: "",
    videoUrl: "",
  });

  // =========================
  // EVENT STATE
  // =========================
  const [event, setEvent] = useState({
    title: "",
    mediaUrl: "",
    date: "",
  });

  // =========================
  // SAVE BROADCAST
  // =========================
  const handleBroadcast = async () => {

    try {

      const token = localStorage.getItem("token");

      const payload = {
        ...broadcast,
        videoUrl: extractPublicId(
          broadcast.videoUrl
        ),
      };

      const res = await fetch(
        `${API_URL}/cms/broadcast`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      alert(data.message);

      setBroadcast({
        title: "",
        description: "",
        videoUrl: "",
      });

    } catch (err) {

      console.log(err);

      alert("Broadcast upload failed");

    }
  };

  // =========================
  // SAVE MESSAGE
  // =========================
  const handleMessage = async () => {

    try {

      const token = localStorage.getItem("token");

      const payload = {
        ...message,
        videoUrl: extractPublicId(
          message.videoUrl
        ),
      };

      const res = await fetch(
        `${API_URL}/cms/message`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      alert(JSON.stringify(data));

      setMessage({
        title: "",
        videoUrl: "",
      });

    } catch (err) {

      console.log(err);
      alert(err);

    }
  };

  // =========================
  // SAVE EVENT
  // =========================
  const handleEvent = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/cms/event`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(event),
        }
      );

      const data = await res.json();

      alert(data.message);

      setEvent({
        title: "",
        mediaUrl: "",
        date: "",
      });

    } catch (err) {

      console.log(err);

      alert("Event upload failed");

    }
  };

  // =========================
  // CLEAR FORMS
  // =========================
  const clearBroadcast = async (id) => {
    try {
      
      const token =
        localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/cms/broadcast/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      alert(data.message);
      fetchBroadcasts();
    } catch (err) {
      console.log(err);
    }
  };
  const clearMessage = async (id) => {
    try {
      const token =
        localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/cms/message/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      alert(data.message);
      fetchMessages();
    } catch (err) {
      console.log(err);
    }
  };
  const clearEvent = async (id) => {
    try {
      const token =
        localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/cms/event/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      alert(data.message);
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-black min-h-screen text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold text-purple-400">
          LFCC Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl"
        >
          Logout
        </button>

      </div>

      <div className="grid gap-10">

        {/* ================= BROADCAST ================= */}
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">

          <h2 className="text-2xl font-bold mb-6">
            Upload Broadcast
          </h2>

          <div className="grid gap-4">

            <input
              type="text"
              placeholder="Broadcast Title"
              value={broadcast.title}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setBroadcast({
                  ...broadcast,
                  title: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Broadcast Description"
              value={broadcast.description}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setBroadcast({
                  ...broadcast,
                  description: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Cloudinary Embed URL"
              value={broadcast.videoUrl}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setBroadcast({
                  ...broadcast,
                  videoUrl: e.target.value,
                })
              }
            />

            {/* VIDEO PREVIEW */}
            {broadcast.videoUrl && (

              <img
                src={`https://res.cloudinary.com/dbsup8wb8/video/upload/so_3/${extractPublicId(
                  broadcast.videoUrl
                )}.jpg`}
                alt="preview"
                className="rounded-xl h-56 object-cover w-full"
              />

            )}

            <div className="flex gap-4">

              <button
                onClick={handleBroadcast}
                className="bg-purple-500 hover:bg-purple-600 p-4 rounded-xl w-full font-bold"
              >
                Save Broadcast
              </button>

              <button
                onClick={clearBroadcast}
                className="bg-red-500 hover:bg-red-600 p-4 rounded-xl w-full font-bold"
              >
                Clear
              </button>

            </div>

          </div>

        </div>

        {/* ================= MESSAGE ================= */}
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">

          <h2 className="text-2xl font-bold mb-6">
            Message Of The Week
          </h2>

          <div className="grid gap-4">

            <input
              type="text"
              placeholder="Message Title"
              value={message.title}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setMessage({
                  ...message,
                  title: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Cloudinary Embed URL"
              value={message.videoUrl}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setMessage({
                  ...message,
                  videoUrl: e.target.value,
                })
              }
            />

            {/* MESSAGE PREVIEW */}
            {message.videoUrl && (

              <img
                src={`https://res.cloudinary.com/dbsup8wb8/video/upload/so_3/${extractPublicId(
                  message.videoUrl
                )}.jpg`}
                alt="preview"
                className="rounded-xl h-56 object-cover w-full"
              />

            )}

            <div className="flex gap-4">

              <button
                onClick={handleMessage}
                className="bg-purple-500 hover:bg-purple-600 p-4 rounded-xl w-full font-bold"
              >
                Save Message
              </button>

              <button
                onClick={clearMessage}
                className="bg-red-500 hover:bg-red-600 p-4 rounded-xl w-full font-bold"
              >
                Clear
              </button>

            </div>

          </div>

        </div>

        {/* ================= EVENT ================= */}
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">

          <h2 className="text-2xl font-bold mb-6">
            Upload Event
          </h2>

          <div className="grid gap-4">

            <input
              type="text"
              placeholder="Event Title"
              value={event.title}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setEvent({
                  ...event,
                  title: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Flyer/Image URL"
              value={event.mediaUrl}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setEvent({
                  ...event,
                  mediaUrl: e.target.value,
                })
              }
            />

            <input
              type="date"
              value={event.date}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setEvent({
                  ...event,
                  date: e.target.value,
                })
              }
            />

            {/* EVENT PREVIEW */}
            {event.mediaUrl && (

              <img
                src={event.mediaUrl}
                alt="event"
                className="rounded-xl h-56 object-cover w-full"
              />

            )}

            <div className="flex gap-4">

              <button
                onClick={handleEvent}
                className="bg-purple-500 hover:bg-purple-600 p-4 rounded-xl w-full font-bold"
              >
                Save Event
              </button>

              <button
                onClick={clearEvent}
                className="bg-red-500 hover:bg-red-600 p-4 rounded-xl w-full font-bold"
              >
                Clear
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
