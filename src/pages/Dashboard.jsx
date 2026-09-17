import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Dashboard() {
  const navigate = useNavigate();

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

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    }
  }, [navigate, token]);

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

  const extractPublicId = (url) => {
    if (!url) return "";
    if (!url.includes("http")) return url;

    try {
      const split = url.split("public_id=")[1];

      if (!split) return url;

      return decodeURIComponent(split);
    } catch {
      return url;
    }
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

      alert(data.message);

      if (type === "broadcast") fetchBroadcasts();
      if (type === "message") fetchMessages();
      if (type === "event") fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };
 
  const openCloudinaryWidget = (onSuccessCallback, setUploadingState) => {
    
    // Internal function to instantly execute the widget once window.cloudinary is validated
    const launchWidget = () => {
      const myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: "dbsup8wb8",
          uploadPreset: "Love foundation",
          resourceType: "video",
          sources: ["local"],
          multiple: true,
          chunkSize: 20000000,
          maxFileSize: 2500000000,
        },
        (error, result) => {
          if (error) {
            console.error("Widget Error Details:", error);
            setUploadingState(false);
          }
          if (result && result.event === "upload_added") {
            setUploadingState(true);
          }
          if (result && result.event === "success") {
            setUploadingState(false);
            onSuccessCallback(result.info.public_id); 
            alert("Video successfully uploaded to Cloudinary!");
          }
        }
      );
      myWidget.open();
    };

    // 1. If script loaded via index.html, run immediately
    if (window.cloudinary) {
      launchWidget();
      return;
    }

    // 2. If missing, look for a stuck script tag or create one dynamically
    let existingScript = document.querySelector('script[src*="cloudinary"]');

    if (!existingScript) {
      console.log("Cloudinary global script missing. Dynamically injecting fallback element...");
      const script = document.createElement("script");
      script.src = "https://cloudinary.com";
      script.async = true;
      script.type = "text/javascript";
      
      // Hook the success trigger straight into the load completion event listener
      script.onload = () => {
        if (window.cloudinary) {
          launchWidget();
        } else {
          alert("Cloudinary script downloaded but failed to initialize. Please reload.");
        }
      };
      
      script.onerror = () => {
        alert("Failed to reach the Cloudinary CDN. Please verify your internet connection.");
      };

      document.body.appendChild(script);
    } else {
      // The script element is in the HTML, but it hasn't completed loading from the network yet.
      alert("Finalizing secure handshake connection with Cloudinary. Please wait 1 second and click upload again.");
    }
  };

  const handleBroadcast = async () => {
    if (!broadcast.videoUrl) {
      alert("Please upload a video first!");
      return;
    }

    try {
      const payload = {
        ...broadcast,
        videoUrl: broadcast.videoUrl,
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

      alert(data.message);

      setBroadcast({
        title: "",
        description: "",
        videoUrl: "",
      });

      fetchBroadcasts();
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  const handleMessage = async () => {
    if (!message.videoUrl) {
      alert("Please upload a video first!");
      return;
    }

    try {
      const payload = {
        ...message,
        videoUrl: message.videoUrl,
      };

      const res = await fetch(`${API_URL}/cms/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      alert(data.message);

      setMessage({
        title: "",
        videoUrl: "",
      });

      fetchMessages();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEvent = async () => {
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

      alert(data.message);

      setEvent({
        title: "",
        mediaUrl: "",
        date: "",
      });

      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-purple-400">
          LFCC Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 px-5 py-3 rounded-xl"
        >
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
            onChange={(e) =>
              setBroadcast({
                ...broadcast,
                title: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 mb-2"
          />

          <textarea
            placeholder="Description"
            value={broadcast.description}
            onChange={(e) =>
              setBroadcast({
                ...broadcast,
                description: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 mb-2"
          />

          <div className="flex gap-2 items-center mb-4">
            <button
              type="button"
              onClick={() =>
                openCloudinaryWidget(
                  (url) =>
                    setBroadcast({
                      ...broadcast,
                      videoUrl: url,
                    }),
                  setIsUploadingBroadcast
                )
              }
              className="bg-zinc-700 hover:bg-zinc-600 px-4 py-3 rounded text-sm font-medium"
            >
              {isUploadingBroadcast
                ? "Uploading to Cloudinary..."
                : "📁 Choose & Upload Video Device"}
            </button>

            {broadcast.videoUrl && (
              <span className="text-green-400 text-xs truncate max-w-xs">
                ✓ Video Linked
              </span>
            )}
          </div>

          <button
            onClick={handleBroadcast}
            className="bg-purple-500 px-4 py-2 rounded"
          >
            Save Broadcast
          </button>

          <div className="mt-6 space-y-2">
            {broadcasts.map((b) => (
              <div
                key={b._id}
                className="flex justify-between bg-zinc-800 p-3 rounded"
              >
                <div>
                  <p className="font-bold">{b.title}</p>

                  <p className="text-sm text-zinc-400">
                    Views: {b.views || 0}
                  </p>
                </div>

                <button
                  onClick={() => deleteItem("broadcast", b._id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* MESSAGE OF THE WEEK SECTION */}
        <section className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">
            Message of Week
          </h2>

          <input
            placeholder="Title"
            value={message.title}
            onChange={(e) =>
              setMessage({
                ...message,
                title: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 mb-2"
          />

          <div className="flex gap-2 items-center mb-4">
            <button
              type="button"
              onClick={() =>
                openCloudinaryWidget(
                  (url) =>
                    setMessage({
                      ...message,
                      videoUrl: url,
                    }),
                  setIsUploadingMessage
                )
              }
              className="bg-zinc-700 hover:bg-zinc-600 px-4 py-3 rounded text-sm font-medium"
            >
              {isUploadingMessage
                ? "Uploading to Cloudinary..."
                : "📁 Choose & Upload Video Device"}
            </button>

            {message.videoUrl && (
              <span className="text-green-400 text-xs truncate max-w-xs">
                ✓ Video Linked
              </span>
            )}
          </div>

          <button
            onClick={handleMessage}
            className="bg-purple-500 px-4 py-2 rounded"
          >
            Save Message
          </button>

          <div className="mt-6 space-y-2">
            {messages.map((m) => (
              <div
                key={m._id}
                className="flex justify-between bg-zinc-800 p-3 rounded"
              >
                <div>
                  <p className="font-bold">{m.title}</p>
                </div>

                <button
                  onClick={() => deleteItem("message", m._id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* EVENTS SECTION */}
        <section className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Events</h2>

          <input
            placeholder="Event Title"
            value={event.title}
            onChange={(e) =>
              setEvent({
                ...event,
                title: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 mb-2"
          />

          <input
            type="text"
            placeholder="Media URL"
            value={event.mediaUrl}
            onChange={(e) =>
              setEvent({
                ...event,
                mediaUrl: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 mb-2"
          />

          <input
            type="date"
            value={event.date}
            onChange={(e) =>
              setEvent({
                ...event,
                date: e.target.value,
              })
            }
            className="w-full p-3 bg-zinc-800 mb-4"
          />

          <button
            onClick={handleEvent}
            className="bg-purple-500 px-4 py-2 rounded"
          >
            Save Event
          </button>

          <div className="mt-6 space-y-2">
            {events.map((e) => (
              <div
                key={e._id}
                className="flex justify-between bg-zinc-800 p-3 rounded"
              >
                <div>
                  <p className="font-bold">{e.title}</p>

                  <p className="text-sm text-zinc-400">
                    Date: {e.date}
                  </p>
                </div>

                <button
                  onClick={() => deleteItem("event", e._id)}
                  className="bg-red-500 px-3 py-1 rounded"
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
