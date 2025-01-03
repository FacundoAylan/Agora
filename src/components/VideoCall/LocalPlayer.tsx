import React, { useEffect, useRef } from "react";
import { FaUserAltSlash } from 'react-icons/fa';
import { useSelector } from "react-redux";

interface LocalPlayerProps {
  videoMuted: boolean;
  selectedAvatar: string | null;
  localPlayerRef: React.RefObject<HTMLDivElement>;
  userName: string;
  remoteUsers: string[];
  localVideoTrack: any;
}

const LocalPlayer: React.FC<LocalPlayerProps> = ({ localPlayerRef, userName, selectedAvatar }) => {

  const localVideoTrack = useSelector((state: LocalPlayerProps) => state.localVideoTrack);
  const videoMuted = useSelector((state: LocalPlayerProps) => state.videoMuted);

  // Referencia al video para controlarlo
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reproducir el video si no está silenciado
  useEffect(() => {
    if (videoRef.current && localVideoTrack && !videoMuted) {
      // Reproducir el video si no está silenciado
      localVideoTrack.play(videoRef.current);
    } else if (videoRef.current && localVideoTrack && videoMuted) {
      // Detener la reproducción si está silenciado
      localVideoTrack.stop();
    }
  }, [localVideoTrack, videoMuted]); // Se ejecuta cuando localVideoTrack o videoMuted cambian

  return (
    <div
      className="w-full h-full border-2 border-[#2b7c85] rounded-2xl overflow-hidden"
    >
      <h1 
        className="absolute top-2 left-2 text-2xl text-blue-400 text-bold z-10"
      >
        {userName}
      </h1>
      {
        videoMuted ? (
          <div className="w-full h-full flex justify-center items-center">
            <div className="rounded-full border-4 border-[#2b7c85] w-36 h-36 bg-gray-200 flex items-center justify-center overflow-hidden">
              {selectedAvatar ? (
                <img src={`/avatars/${selectedAvatar}.png`} alt={selectedAvatar} className="object-cover w-full h-full" />
              ) : (
                <FaUserAltSlash size={48} color="#2b7c85" />
              )}
            </div>
          </div>
        ) : (
          <div
            id="local-player"
            ref={localPlayerRef}
            className="bg-black flex justify-center items-center w-full h-full"
          >
            {/* Aquí se inserta el video cuando no está silenciado */}
            <div id="local-video" className="w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              >
              </video>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default LocalPlayer;
