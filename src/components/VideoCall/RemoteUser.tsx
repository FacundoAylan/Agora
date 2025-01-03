import React, { useEffect, useRef, useState } from "react";
import { FaUserAltSlash } from "react-icons/fa";

interface RemoteProps {
  uid: string; // Identificador único del usuario
  userName: string;
  selectedAvatar: string;
  client: any; // Cliente que maneja la comunicación en tiempo real
}

const RemoteUsers: React.FC<RemoteProps> = ({ uid, userName, selectedAvatar, client }) => {

  const [hasVideo, setHasVideo] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUserPublished = async (user: any, mediaType: string) => {
      if (uid === user.uid) {
        if (mediaType === "video") {
          try {
            console.log("Subscribing to video for user:", user.uid);
            await client.subscribe(user, mediaType);
            let video = user.hasVideo
            setHasVideo(video);
            // Crear un div para reproducir el video
            if (video && videoRef.current) {
              user.videoTrack?.play(videoRef.current);
            }
          } catch (error) {
            console.error("Error subscribing to video:", error);
          }
        }else if (mediaType === "audio") {
          user.audioTrack?.play(); // Reproduce el audio directamente
          console.log("Audio is playing for user:", user.uid);
        }
      }
    };

    const handleUserUnpublished = (user: any, mediaType: string) => {
      if (uid === user.uid) {
        if (mediaType === "video") {
          setHasVideo(user.hasVideo);
          if (videoRef.current) {
            videoRef.current.innerHTML = "";
          }
        }else if (mediaType === "audio") {
          user.audioTrack?.stop(); // Detener el audio
          console.log("Audio stopped for user:", user.uid);
        }
      }
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    // Limpieza al desmontar
    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
    };
  }, [client, uid]);

  return (
    <div 
      className="relative w-full h-full flex justify-center items-center border-2 border-[#2b7c85] rounded-2xl overflow-hidden bg-gray-900"
    >
      {/* Nombre del usuario */}
      <h1 className="absolute top-2 left-2 text-2xl text-blue-400 font-bold z-10">
        {userName}
      </h1>

      {!hasVideo && (
        <div className="rounded-full border-4 border-[#2b7c85] w-36 h-36 bg-gray-200 flex items-center justify-center overflow-hidden">
          {selectedAvatar ? (
            <img
              src={`/avatars/${selectedAvatar}.png`}
              alt={selectedAvatar}
              className="object-cover w-full h-full"
            />
          ) : (
            <FaUserAltSlash size={48} color="#2b7c85" />
          )}
        </div>
        )
      }

      <div ref={videoRef} className={hasVideo?'w-full h-full':'block'}/>

    </div>
  );
};

export default RemoteUsers;
