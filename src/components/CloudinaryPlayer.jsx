function CloudinaryPlayer({
  publicId,
  height = "500px",
}) {

  // =========================
  // CLOUDINARY VIDEO URL
  // =========================
  const videoUrl =
    `https://res.cloudinary.com/dbsup8wb8/video/upload/${publicId}.mp4`;

  return (
    <video
      controls
      controlsList="nodownload"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      className="w-full rounded-2xl bg-black"
      style={{ height }}
    >

      <source
        src={videoUrl}
        type="video/mp4"
      />

      Your browser does not support video.

    </video>
  );
}

export default CloudinaryPlayer;
