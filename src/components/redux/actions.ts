// Definir los tipos de acción como cadenas literales
export const SET_JOINED = "SET_JOINED";
export const SET_CLIENT = "SET_CLIENT";

// Controladores de botón de video y cámara
export const SET_VIDEO_MUTED = "SET_VIDEO_MUTED";
export const SET_AUDIO_MUTED = "SET_AUDIO_MUTED";

// Estado de video y audio
export const SET_LOCAL_AUDIO_TRACK = "SET_LOCAL_AUDIO_TRACK";
export const SET_LOCAL_VIDEO_TRACK = "SET_LOCAL_VIDEO_TRACK";


interface SetJoinedAction {
  type: typeof SET_JOINED;
  payload: boolean;
}

interface SetClientAction {
  type: typeof SET_CLIENT;
  payload: any; // Aquí puedes cambiar 'any' por el tipo específico de tu cliente
}

interface SetVideoMutedAction {
  type: typeof SET_VIDEO_MUTED;
  payload: boolean;
}

interface SetAudioMutedAction {
  type: typeof SET_AUDIO_MUTED;
  payload: boolean;
}

interface SetLocalAudioTrackAction {
  type: typeof SET_LOCAL_AUDIO_TRACK;
  payload: MediaStreamTrack | null;
}

interface SetLocalVideoTrackAction {
  type: typeof SET_LOCAL_VIDEO_TRACK;
  payload: MediaStreamTrack | null;
}


// Definir un tipo para todas las acciones
export type ActionTypes =
  | SetJoinedAction
  | SetClientAction
  | SetVideoMutedAction
  | SetAudioMutedAction
  | SetLocalAudioTrackAction
  | SetLocalVideoTrackAction

// Creadores de acciones con tipos

export const setJoined = (joined: boolean): SetJoinedAction => ({
  type: SET_JOINED,
  payload: joined,
});

export const setClient = (client: any): SetClientAction => ({
  type: SET_CLIENT,
  payload: client,
});

export const setVideoMuted = (videoMuted: boolean): SetVideoMutedAction => ({
  type: SET_VIDEO_MUTED,
  payload: videoMuted,
});

export const setAudioMuted = (audioMuted: boolean): SetAudioMutedAction => ({
  type: SET_AUDIO_MUTED,
  payload: audioMuted,
});

export const setLocalAudioTrack = (
  track: MediaStreamTrack | null
): SetLocalAudioTrackAction => ({
  type: SET_LOCAL_AUDIO_TRACK,
  payload: track,
});

export const setLocalVideoTrack = (
  track: MediaStreamTrack | null
): SetLocalVideoTrackAction => ({
  type: SET_LOCAL_VIDEO_TRACK,
  payload: track,
});

