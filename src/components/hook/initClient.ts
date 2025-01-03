import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { setClient, setJoined } from "../redux/actions";
import { AppDispatch } from "../redux/store";

interface JoinChannelProps {
  dispatch: AppDispatch;
  APP_ID: string;
  CHANNEL: string;
  TOKEN: string | null;
  RTCUID: string; // El uid del usuario
}

export const JoinChannel = async ({ 
  dispatch,
  APP_ID, 
  CHANNEL, 
  TOKEN, 
  RTCUID, 
}: JoinChannelProps) => {

  try {
    // Crea un cliente Agora RTC
    const agoraClient: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    dispatch(setClient(agoraClient));
    // Se une al canal con el APP_ID, CHANNEL y el TOKEN proporcionados
    await agoraClient.join(APP_ID, CHANNEL, TOKEN, RTCUID);
    dispatch(setJoined(true));

  } catch (error) {
    console.error("Error al conectarse con Agora:", error);
  }
};
