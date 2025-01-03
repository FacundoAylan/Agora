import { Dispatch } from "redux";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { setClient, setJoined } from "../redux/actions";

interface JoinChannelProps {
  dispatch: Dispatch;
  APP_ID: string;
  CHANNEL: string;
  TOKEN: string;
  RTCUID: string; // El uid del usuario
  userName: string; // Nombre del usuario
  avatar: string; // Avatar del usuario
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
