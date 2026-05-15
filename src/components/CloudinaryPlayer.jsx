function CloudinaryPlayer({ publicId, height = "500px" }) {
  // fl_nodownload prevents the download button in supported browsers
  const videoUrl = `https://res.cloudinary.com/dbsup8wb8/video/upload/fl_nodownload/${publicId}.mp4`;

  return (
    <video
      controls
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()} // blocks right-click save
      playsInline
      className="w-full rounded-2xl bg-black"
      style={{ height }}
    >
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support video.
    </video>
  );
}

export default CloudinaryPlayer;
