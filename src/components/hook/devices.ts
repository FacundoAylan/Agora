import AgoraRTC from "agora-rtc-sdk-ng";
import { setAudioMuted, setLocalAudioTrack, setLocalVideoTrack, setVideoMuted } from "../redux/actions";

let isUpdatingDevices = false; // Control de ejecuciones simultáneas

const updateDevices = async ({ client, dispatch, localAudioTrack, localVideoTrack, localPlayerRef }): Promise<void> => {
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
      if (type === "video") {
        if (localVideoTrack) {
          console.log("Pista de video ya existe");
          return;
        }

        const publishedVideoTracks = client.localTracks.filter(
          (track) => track.trackMediaType === "video"
        );
        if (publishedVideoTracks.length > 0) {
          console.log("Pista de video ya está publicada");
          return;
        }

        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        dispatch(setLocalVideoTrack(videoTrack));
        dispatch(setVideoMuted(false));

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
          (track) => track.trackMediaType === "audio"
        );
        if (publishedAudioTracks.length > 0) {
          console.log("Pista de audio ya está publicada");
          return;
        }

        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        dispatch(setLocalAudioTrack(audioTrack));
        dispatch(setAudioMuted(false));

        await client.publish([audioTrack]);
        console.log("Micrófono conectado y pista de audio publicada");
      }
    };

    // Función para despublicar y cerrar una pista
    const unpublishTrack = async (track, type: "video" | "audio") => {
      if (track) {
        await client.unpublish([track]);
        track.stop();
        track.close();

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
      await unpublishTrack(localVideoTrack, "video");
    }

    if (audioConnected) {
      await createTrack("audio");
    } else {
      await unpublishTrack(localAudioTrack, "audio");
    }
  } catch (error) {
    console.error("Error al actualizar dispositivos:", error);
  } finally {
    isUpdatingDevices = false; // Liberar bloqueo
  }
};

export default updateDevices;
