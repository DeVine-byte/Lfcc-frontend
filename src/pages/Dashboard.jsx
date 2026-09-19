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

  const [broadcast, setBroadcast] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });

  const [message, setMessage] = useState({
    title: "",
    videoUrl: "",
  });

  const [event, setEvent] = useState({
    title: "",
    mediaUrl: "",
    date: "",
  });

  const [isUploadingBroadcast, setIsUploadingBroadcast] = useState(false);
  const [isUploadingMessage, setIsUploadingMessage] = useState(false);
  const [isUploadingEvent, setIsUploadingEvent] = useState(false);

  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [messageProgress, setMessageProgress] = useState(0);
  const [eventProgress, setEventProgress] = useState(0);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showPopup = (msg, type = "info") => {
    setNotification({
      show: true,
      message: msg,
      type,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "info",
      });
    }, 4000);
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
      setEvents([...data].reverse());
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete item.");
      }

      showPopup(data.message || "Item deleted successfully.", "success");

      if (type === "broadcast") fetchBroadcasts();
      if (type === "message") fetchMessages();
      if (type === "event") fetchEvents();
    } catch (err) {
      console.log(err);
      showPopup("Failed to delete the chosen item.", "error");
    }
  };

  // =========================================================
  // NATIVE AWS S3 UPLOAD ENGINE WITH REAL-TIME PROGRESS
  // =========================================================
  const handleNativeAWSUpload = async (
    uiEvent,
    setUrlCallback,
    setUploadingState,
    setProgressCallback
  ) => {
    const file = uiEvent.target.files[0];

    if (!file) return;

    try {
      setUploadingState(true);
      setProgressCallback(0);

      const signRes = await fetch(
        `${API_URL}/cms/sign-s3?filename=${encodeURIComponent(
          file.name
        )}&filetype=${encodeURIComponent(file.type)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!signRes.ok) {
        throw new Error("Could not initialize upload channel session.");
      }

      const { uploadUrl, downloadUrl } = await signRes.json();

      const xhr = new XMLHttpRequest();

      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setProgressCallback(percentage);
        }
      };

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(
              new Error("Storage server rejected the media file stream.")
            );
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network connection dropped mid-upload."));
        };

        xhr.onabort = () => {
          reject(new Error("Upload was cancelled."));
        };
      });

      xhr.send(file);

      await uploadPromise;

      setUrlCallback(downloadUrl);

      showPopup("Media file attached successfully!", "success");
    } catch (err) {
      console.error(err);
      showPopup(`Upload Interrupted: ${err.message}`, "error");
    } finally {
      setUploadingState(false);
      setProgressCallback(0);
      uiEvent.target.value = "";
    }
  };

  const handleBroadcast = async () => {
    if (!broadcast.videoUrl) {
      showPopup("Please upload and attach a video first!", "error");
      return;
    }

    if (!broadcast.title.trim()) {
      showPopup("Please enter a sermon title first!", "error");
      return;
    }

    try {
      const payload = {
        ...broadcast,
        views: 0,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(`${API_URL}/cms/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to publish broadcast.");
      }

      showPopup(
        data.message || "Broadcast sermon successfully published!",
        "success"
      );

      setBroadcast({
        title: "",
        description: "",
        videoUrl: "",
      });

      fetchBroadcasts();
    } catch (err) {
      console.error(err);
      showPopup(
        err.message || "Failed to publish broadcast record.",
        "error"
      );
    }
  };

  const handleMessage = async () => {
    if (!message.videoUrl) {
      showPopup("Please upload and attach a video first!", "error");
      return;
    }

    if (!message.title.trim()) {
      showPopup("Please enter a message title first!", "error");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cms/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update weekly message.");
      }

      showPopup(
        data.message || "Weekly message updated successfully!",
        "success"
      );

      setMessage({
        title: "",
        videoUrl: "",
      });

      fetchMessages();
    } catch (err) {
      console.error(err);
      showPopup(
        err.message || "Failed to update weekly message record.",
        "error"
      );
    }
  };

  const handleEvent = async () => {
    if (!event.title.trim()) {
      showPopup("Please enter the event title first!", "error");
      return;
    }

    if (!event.mediaUrl) {
      showPopup(
        "Please attach a flyer photo or event video first!",
        "error"
      );
      return;
    }

    if (!event.date) {
      showPopup("Please select the event calendar date!", "error");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cms/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add calendar event.");
      }

      showPopup(
        data.message || "Church event successfully added to calendar!",
        "success"
      );

      setEvent({
        title: "",
        mediaUrl: "",
        date: "",
      });

      fetchEvents();
    } catch (err) {
      console.error(err);
      showPopup(
        err.message || "Failed to add calendar event.",
        "error"
      );
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8 relative">

      {/* NOTIFICATION TOAST */}
      {notification.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-md ${
              notification.type === "success"
                ? "bg-green-500/20 border-green-500 text-green-300"
                : notification.type === "error"
                ? "bg-red-500/20 border-red-500 text-red-300"
                : "bg-purple-500/20 border-purple-500 text-purple-300"
            }`}
          >
            <span className="text-xl">
              {notification.type === "success"
                ? "🏆"
                : notification.type === "error"
                ? "⚠️"
                : "ℹ️"}
            </span>

            <p className="font-semibold text-sm tracking-wide">
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-purple-400">
          LFCC Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 transition px-5 py-3 rounded-xl font-medium"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-10">

        {/* =====================================================
            BROADCAST SECTION
        ===================================================== */}
        <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">
            Sermon Broadcasts
          </h2>

          <input
            placeholder="Sermon Title"
            value={broadcast.title}
            onChange={(e) =>
              setBroadcast({
                ...broadcast,
                title: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 border border-zinc-700 mb-3 rounded-xl focus:outline-none focus:border-purple-500"
          />

          <textarea
            placeholder="Sermon Description or Bible Passages"
            value={broadcast.description}
            onChange={(e) =>
              setBroadcast({
                ...broadcast,
                description: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 border border-zinc-700 mb-3 rounded-xl min-h-[100px] focus:outline-none focus:border-purple-500"
          />

          <div className="flex flex-col gap-3 mb-5">

            <div className="flex gap-3 items-center flex-wrap">
              <label className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition shadow-lg">
                {isUploadingBroadcast
                  ? "Uploading Media..."
                  : "📁 Choose Sermon Video"}

                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  disabled={isUploadingBroadcast}
                  onChange={(e) =>
                    handleNativeAWSUpload(
                      e,
                      (url) =>
                        setBroadcast({
                          ...broadcast,
                          videoUrl: url,
                        }),
                      setIsUploadingBroadcast,
                      setBroadcastProgress
                    )
                  }
                />
              </label>

              {broadcast.videoUrl && (
                <span className="text-green-400 text-sm">
                  ✓ Video Attached
                </span>
              )}
            </div>

            {isUploadingBroadcast && (
              <div className="w-full">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Uploading sermon video...</span>
                  <span>{broadcastProgress}%</span>
                </div>

                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-150 ease-out"
                    style={{
                      width: `${broadcastProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleBroadcast}
            disabled={isUploadingBroadcast}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold transition"
          >
            Publish Sermon
          </button>

          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">
              Active Broadcasts
            </h3>

            {broadcasts.map((b) => (
              <div
                key={b._id}
                className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl gap-4"
              >
                <div className="min-w-0">
                  <p className="font-bold truncate">
                    {b.title}
                  </p>

                  <p className="text-sm text-zinc-400">
                    Views: {b.views || 0}
                  </p>
                </div>

                <button
                  onClick={() =>
                    deleteItem("broadcast", b._id)
                  }
                  className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            MESSAGE OF THE WEEK
        ===================================================== */}
        <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">
            Message of the Week
          </h2>

          <input
            placeholder="Message Title"
            value={message.title}
            onChange={(e) =>
              setMessage({
                ...message,
                title: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 border border-zinc-700 mb-3 rounded-xl focus:outline-none focus:border-purple-500"
          />

          <div className="flex flex-col gap-3 mb-5">

            <div className="flex gap-3 items-center flex-wrap">
              <label className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition shadow-lg">
                {isUploadingMessage
                  ? "Uploading Media..."
                  : "📁 Choose Weekly Message Video"}

                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  disabled={isUploadingMessage}
                  onChange={(e) =>
                    handleNativeAWSUpload(
                      e,
                      (url) =>
                        setMessage({
                          ...message,
                          videoUrl: url,
                        }),
                      setIsUploadingMessage,
                      setMessageProgress
                    )
                  }
                />
              </label>

              {message.videoUrl && (
                <span className="text-green-400 text-sm">
                  ✓ Video Attached
                </span>
              )}
            </div>

            {isUploadingMessage && (
              <div className="w-full">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Uploading weekly message...</span>
                  <span>{messageProgress}%</span>
                </div>

                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-150 ease-out"
                    style={{
                      width: `${messageProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleMessage}
            disabled={isUploadingMessage}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold transition"
          >
            Publish Message
          </button>

          <div className="mt-6 space-y-2">
            {messages.map((m) => (
              <div
                key={m._id}
                className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl gap-4"
              >
                <p className="font-semibold truncate">
                  {m.title}
                </p>

                <button
                  onClick={() =>
                    deleteItem("message", m._id)
                  }
                  className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            EVENTS SECTION
        ===================================================== */}
        <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">
            Church Events
          </h2>

          <input
            placeholder="Event Title"
            value={event.title}
            onChange={(e) =>
              setEvent({
                ...event,
                title: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 border border-zinc-700 mb-3 rounded-xl focus:outline-none focus:border-purple-500"
          />

          <div className="flex flex-col gap-3 mb-5">

            <div className="flex gap-3 items-center flex-wrap">
              <label className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition shadow-lg">
                {isUploadingEvent
                  ? "Uploading Media..."
                  : "📁 Choose Event Flyer / Video"}

                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  disabled={isUploadingEvent}
                  onChange={(e) =>
                    handleNativeAWSUpload(
                      e,
                      (url) =>
                        setEvent({
                          ...event,
                          mediaUrl: url,
                        }),
                      setIsUploadingEvent,
                      setEventProgress
                    )
                  }
                />
              </label>

              {event.mediaUrl && (
                <span className="text-green-400 text-sm">
                  ✓ Event Media Attached
                </span>
              )}
            </div>

            {isUploadingEvent && (
              <div className="w-full">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Uploading event media...</span>
                  <span>{eventProgress}%</span>
                </div>

                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-150 ease-out"
                    style={{
                      width: `${eventProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <input
            type="date"
            value={event.date}
            onChange={(e) =>
              setEvent({
                ...event,
                date: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 border border-zinc-700 mb-4 rounded-xl focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={handleEvent}
            disabled={isUploadingEvent}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold transition"
          >
            Add Event
          </button>

          <div className="mt-6 space-y-2">
            {events.map((e) => (
              <div
                key={e._id}
                className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl gap-4"
              >
                <div className="min-w-0">
                  <p className="font-bold truncate">
                    {e.title}
                  </p>

                  <p className="text-sm text-zinc-400">
                    {e.date}
                  </p>
                </div>

                <button
                  onClick={() =>
                    deleteItem("event", e._id)
                  }
                  className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0"
                >
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
