import { useSelector } from "react-redux"; 
import FormAgora from "../Form/Form";
import VideoCall from "../VideoCall/VideoCall";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { useState } from "react";


const Home = () => {

    //VAriables para crear el cliente
    const joined = useSelector((state: { joined: boolean }) => state.joined);
    const APP_ID: string = import.meta.env.VITE_AGORA_API;
    const { CHANNEL } = useParams<{ CHANNEL: string }>();
    const TOKEN: string | null = null;
    const [RTCUID] = useState(v4()); 


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
