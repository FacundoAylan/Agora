import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setAudioMuted, setVideoMuted } from '../redux/actions';
import { AppDispatch } from '../redux/store';

interface State {
  audioMuted: boolean;
  videoMuted: boolean;
  localVideoTrack:any
};
interface ControlPanelProps{
  leaveChannel: () => Promise<void>;
  localPlayerRef: React.RefObject<HTMLDivElement>
};

const ControlPanel: React.FC<ControlPanelProps> = ({leaveChannel, localPlayerRef}) => {

  const videoMuted = useSelector((state: State) => state.videoMuted);
  const audioMuted = useSelector((state: State) => state.audioMuted);
  const localVideoTrack = useSelector((state: State) => state.localVideoTrack);

  const dispatch = useDispatch<AppDispatch>();

  const toggleAudio = ()=>{
    dispatch(setAudioMuted(!audioMuted));
  }

  const toggleVideo = () => {
    if (!localVideoTrack) return; // Verificar si existe el track de video
  
    // Actualizar el estado de videoMuted
    dispatch(setVideoMuted(!videoMuted));
  
    const isMuted = !videoMuted;
  
    if (isMuted) {
      // Detener y desactivar el video
      localVideoTrack.setEnabled(false); // Desactivar la pista de video
      localVideoTrack.stop(); // Detener el video
    } else {
      // Activar y reproducir el video
      localVideoTrack.setEnabled(true); // Activar la pista de video
      localVideoTrack.play(localPlayerRef.current); // Reproducir el video local
    }
  };
  

  return (
    <div className="absolute bottom-0 w-full flex justify-center items-center gap-4 py-2 bg-[#2b7c85] border-t-2 border-white">
      {/* Botón de audio */}
      <button 
        onClick={toggleAudio}
        className="px-6 py-3 bg-[#2b7c85] text-white rounded-md border-2 border-white"
      >
        {audioMuted ? (
          <FaMicrophoneSlash className="text-xl" />
        ) : (
          <FaMicrophone className="text-xl" />
        )}
      </button>

      {/* Botón de video */}
      <button 
        onClick={localVideoTrack ? toggleVideo : undefined}
        className="px-6 py-3 bg-[#2b7c85] text-white rounded-md border-2 border-white"
      >
        {videoMuted ? (
          <FaVideoSlash className="text-xl" />
        ) : (
          <FaVideo className="text-xl" />
        )}
      </button>

      {/* Botón para salir */}
      <button 
        onClick={leaveChannel}
        className="px-6 py-3 bg-[#d93025] text-white rounded-md border-2 border-white"
      >
        <FaSignOutAlt className="text-xl" />
      </button>
    </div>
  );
};

export default ControlPanel;
