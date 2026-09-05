import {useState} from 'react';
const PLAYLIST_ID = "5V8UiJUbYP6PymyFi1RYj8";
function PlaylistPanel() {
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <div className="playlist-body">
      {!loadFailed ? (
        <iframe
          title="Spotify playlist"
          src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
          width="100%"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          onError={() => setLoadFailed(true)}
        ></iframe>
      ) : (
        <p className="playlist-error">
          Couldn't load Spotify — this device or network may be blocking it.
        </p>
      )}
    </div>
  );
}

export default PlaylistPanel;