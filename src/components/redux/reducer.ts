import {
  SET_JOINED,
  SET_CLIENT,
  ActionTypes,
  SET_VIDEO_MUTED,
  SET_AUDIO_MUTED,
  SET_LOCAL_AUDIO_TRACK,
  SET_LOCAL_VIDEO_TRACK,
} from './actions';


// Definir la estructura del estado
interface State {
  userName: string | null;
  selectedAvatar: string | null;
  client: any; 
  joined: boolean;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
  audioMuted: boolean;
  videoMuted: boolean;
}


// Estado inicial con los valores previstos
const initialState: State = {
  userName: null,
  selectedAvatar: null,
  client: null,
  joined: false,
  audioMuted: true,
  videoMuted: true,
  localAudioTrack: null,
  localVideoTrack: null,
};

const reducer = (state = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case SET_CLIENT:
      return { ...state, client: action.payload };

    case SET_JOINED:
      return { ...state, joined: action.payload };
    
    case SET_VIDEO_MUTED:
      return { ...state, videoMuted: action.payload };

    case SET_AUDIO_MUTED:
      return { ...state, audioMuted: action.payload };

    case SET_LOCAL_AUDIO_TRACK:
      return { ...state, localAudioTrack: action.payload };
      
    case SET_LOCAL_VIDEO_TRACK:
      return { ...state, localVideoTrack: action.payload };

    default:
      return state;
  }
};

export default reducer;
