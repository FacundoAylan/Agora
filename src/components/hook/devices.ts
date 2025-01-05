import { setAudioMuted, setLocalAudioTrack, setLocalVideoTrack, setVideoMuted } from "../redux/actions";
import { AppDispatch } from "../redux/store";
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";

interface DevicesProps {
  client: IAgoraRTCClient;
  dispatch: AppDispatch;
  localAudioTrack: ILocalAudioTrack | null;
  localVideoTrack: ILocalVideoTrack | null;
  localPlayerRef: React.RefObject<HTMLDivElement>;
}

interface TrackNameProps {
  trackMediaType: "audio" | "video";
}

interface UnpublishTrackProps {
  track: ILocalAudioTrack | ILocalVideoTrack | null;
  type: string;
}

let isUpdatingDevices = false; // Control de ejecuciones simultáneas

const updateDevices = async (
  { 
    client, 
    dispatch, 
    localAudioTrack, 
    localVideoTrack, 
    localPlayerRef
 }:DevicesProps): Promise<void> => {
  
  if (isUpdatingDevices) {
    console.log("Actualización de dispositivos ya en progreso. Abortando...");
    return;
  }
  isUpdatingDevices = true;

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    // Filtrar dispositivos de video y audio
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    const audioDevices = devices.filter((device) => device.kind === "audioinput");

    // Verificar si hay dispositivos disponibles
    const videoConnected = videoDevices.length > 0;
    const audioConnected = audioDevices.length > 0;

    // Crear pista de video si es necesario
    const createTrack = async (type: "video" | "audio") => {
      try{

        if (type === "video") {
          if (localVideoTrack) {
            console.log("Pista de video ya existe");
            return;
          }
  
          const publishedVideoTracks = client.localTracks.filter(
            (track:TrackNameProps) => track.trackMediaType === "video"
          );
          if (publishedVideoTracks.length > 0) {
            console.log("Pista de video ya está publicada");
            return;
          }
  
          const videoTrack: ICameraVideoTrack = await AgoraRTC.createCameraVideoTrack();
          dispatch(setLocalVideoTrack(videoTrack));
  
          if (localPlayerRef?.current) {
            localPlayerRef.current.innerHTML = ""; // Limpiar contenido anterior
            videoTrack.play(localPlayerRef.current);
          }
  
          await client.publish([videoTrack]);
          console.log("Cámara conectada y pista de video publicada");
        } else if (type === "audio") {
          if (localAudioTrack) {
            console.log("Pista de audio ya existe");
            return;
          }
  
          const publishedAudioTracks = client.localTracks.filter(
            (track: TrackNameProps) => track.trackMediaType === "audio"
          );
          if (publishedAudioTracks.length > 0) {
            console.log("Pista de audio ya está publicada");
            return;
          }
  
          const audioTrack: ILocalAudioTrack  = await AgoraRTC.createMicrophoneAudioTrack();
          dispatch(setLocalAudioTrack(audioTrack));
          dispatch(setAudioMuted(false));
  
          await client.publish([audioTrack]);
          console.log("Micrófono conectado y pista de audio publicada");
        }
      }catch(error){
        console.log('Error en la publicación de las pistas:',error)
      }
    };

    // Función para despublicar y cerrar una pista
    const unpublishTrack = async ({track, type}: UnpublishTrackProps): Promise<void> => {
      if (track) {
        await client.unpublish([track]);
        track.stop();

        if (type === "video") {
          dispatch(setLocalVideoTrack(null));
          dispatch(setVideoMuted(true));
        } else if (type === "audio") {
          dispatch(setLocalAudioTrack(null));
          dispatch(setAudioMuted(true));
        }

        console.log(`Pista de ${type} despublicada y cerrada`);
      }
    };

    // Crear o despublicar pistas según disponibilidad
    if (videoConnected) {
      await createTrack("video");
    } else {
      await unpublishTrack({ track: localVideoTrack, type: "video" });
    }

    if (audioConnected) {
      await createTrack("audio");
    } else {
      await unpublishTrack({ track: localAudioTrack, type: "audio" });
    }
  } catch (error) {
    console.error("Error al actualizar dispositivos:", error);
  } finally {
    isUpdatingDevices = false; 
  }
};

export default updateDevices;
