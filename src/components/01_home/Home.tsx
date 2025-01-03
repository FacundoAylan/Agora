import { useSelector } from "react-redux"; 
import FormAgora from "../Form/Form";
import VideoCall from "../VideoCall/VideoCall";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { useState } from "react";

const Home  = () => {

    //Variables para crear el cliente
    const joined = useSelector((state: { joined: boolean }) => state.joined);
    const APP_ID: string = import.meta.env.VITE_AGORA_API;
    let { CHANNEL } = useParams<{ CHANNEL: string }>();
    const TOKEN: string | null = null;
    const [RTCUID] = useState(v4()); 

    CHANNEL = CHANNEL?? '';

  return (
    <>
      {!joined && (
        <FormAgora 
          APP_ID ={APP_ID}
          CHANNEL={CHANNEL}
          TOKEN={TOKEN}
          RTCUID={RTCUID}
        />
      ) 
      }
      {joined && (
        <VideoCall 
          CHANNEL={CHANNEL}
          RTCUID={RTCUID}
        />
        ) 
      }
    </>
  );
  
};

export default Home;