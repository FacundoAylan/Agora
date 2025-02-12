import { useDispatch, useSelector } from "react-redux";
import ControlPanel from "./Controlers";
import {
  setAudioMuted,
  setJoined,
  setLocalAudioTrack,
  setLocalVideoTrack,
  setVideoMuted,
} from "../redux/actions";
import { useEffect, useRef, useState } from "react";
import LocalPlayer from "./LocalPlayer";
import updateDevices from "../hook/devices";
import { collection, deleteDoc, doc, getDocs, query, where, onSnapshot, Firestore, writeBatch } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import RemoteUsers from "./RemoteUser.js";
import { AppDispatch } from "../redux/store.js";
import { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";


interface State {
  client: any;
  localAudioTrack: ILocalAudioTrack | null;
  localVideoTrack: ILocalVideoTrack | null;
}

interface Users{
  uid: string;
  name: string;
  avatar:string
}

interface VideoCallProps {
  CHANNEL?: string;
  RTCUID: string | null;
}


const VideoCall: React.FC<VideoCallProps> = ({ CHANNEL, RTCUID }) => {

  const client = useSelector((state: State) => state.client);
  const localAudioTrack = useSelector((state: State) => state.localAudioTrack);
  const localVideoTrack = useSelector((state: State) => state.localVideoTrack);
  const [remoteUsers, setRemoteUsers] = useState<Users[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const localPlayerRef = useRef<HTMLDivElement | null>(null);

  //Estado para controlar el mensaje de finalización de la llamada
  const [ showMessage, SetShowMessage ] = useState(false);

  useEffect(() => {
    if (!client) {
      console.error("Client no está definido.");
      return;
    }
  
    // Funcionalidad para la detección de dispositivos
      const handleDeviceChange = async() => {
        await updateDevices({
          client,
          dispatch,
          localAudioTrack,
          localVideoTrack,
          localPlayerRef,
        });
      };
      handleDeviceChange();

  
    // Agregar listener para cambios en dispositivos
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

  
    // Cleanup al desmontar
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange); 
    };
  }, [client, localAudioTrack, localVideoTrack, localPlayerRef, RTCUID]);
  
  useEffect(() => {

    if (!CHANNEL) {
      console.error("CHANNEL no está definido en la URL");
      return; 
    }

    const collectionRef = collection(db, CHANNEL);

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const users: Users[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data().data;
        if (data?.uid && data?.name) {
          users.push({
            uid: data.uid,
            name: data.name,
            avatar: data.avatar || "",
          });
        }
      });

      // Solo actualizar el estado si hay cambios
      if (JSON.stringify(users) !== JSON.stringify(remoteUsers)) {
        console.log("Actualizando remoteUsers:", users);
        setRemoteUsers(users);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [CHANNEL, remoteUsers]);

  //Salida de la sala
  const leaveChannel = async () => {
    try {
      if (localVideoTrack) {
        localVideoTrack.stop();
      }

      if (localAudioTrack) {
        localAudioTrack.stop();
      }

      if (client) {
        await client.leave();
      }

      dispatch(setLocalAudioTrack(null));
      dispatch(setLocalVideoTrack(null));
      dispatch(setJoined(false));
      dispatch(setAudioMuted(true));
      dispatch(setVideoMuted(true));


      const handleDelete = async (uid: string): Promise<void> => {

        try{
          if (!CHANNEL) {
            console.error("CHANNEL no está definido en la URL");
            return; 
          }
          
          const channelsRef = collection(db, CHANNEL);
  
          // Realizar una consulta para encontrar el documento con el uid especificado
          const q = query(channelsRef, where('data.uid', '==', uid));
          
          // Obtener los documentos que coinciden con la consulta
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Si se encuentra el documento, eliminarlo
            querySnapshot.forEach(async (docSnapshot) => {
              await deleteDoc(doc(db, CHANNEL, docSnapshot.id)); // Eliminar el documento por su ID
              console.log('Documento eliminado con UID:', uid);
            });
          } 

        }catch(error) {
          console.log('No se encontró ningún documento con el UID:', error);
        }
      };
      // Llama a la función con el uid que deseas eliminar
      if(!RTCUID){
        console.log('RTCUID invalid:')
        return
      }
      handleDelete(RTCUID);

    } catch (error) {
      console.error("Error al salir del canal:", error);
    }
  };

  useEffect(()=>{

    // Tiempo para la salida de la sala (2 horas en milisegundos)
    const timeToLeave = 2 * 60 * 60 * 1000; // 7200000 ms
    // Tiempo para mostrar el aviso (10 minutos antes de 2 horas)
    const timeToAlert = timeToLeave - 10 * 60 * 1000; // 120000 ms antes

    //Logica para la salida de la sala y eliminacion de la misma dentro de 2 horas 
    const clearChannel = setTimeout(()=>{
  
      leaveChannel()
  
      const deleteCollection = async (db:Firestore, collectionName:string) => {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);
        const batch = writeBatch(db);
      
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
      
        await batch.commit();
        console.log(`La colección '${collectionName}' ha sido eliminada completamente.`);
      };
      
      // Llamar a la función para eliminar la colección
      if(CHANNEL){
        deleteCollection(db, CHANNEL);
      }else{
        console.log('CHANNEL undefined.');
      }
    },timeToLeave);
  
    //Funcionalidad para avisar al usuario que la reunión va a finalizar
    const alertTime = setTimeout(()=>{
      SetShowMessage(previu => !previu);
    },timeToAlert)

    return ()=>{
      clearTimeout(clearChannel);
      clearTimeout(alertTime);
    }
  },[])

  return (
    <div className="w-full h-screen relative">
      {/*Visualizacion del mensaje de finalización */}
      { showMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-300 p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-gray-800 text-lg font-medium">Esta reunión finalizará en 10 minutos</p>
            <button 
              onClick={() => SetShowMessage(prev => !prev)}
              className="bg-[#111827] text-white px-6 py-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Aceptar
            </button>
          </div>
        </div>

      )}
      {/*Visualización de los usuarios */}
      <div
        className={`w-full h-[90%] grid ${
          remoteUsers.length === 1
            ? "grid-cols-1"
            : remoteUsers.length === 2
            ? "grid-rows-2 lg:grid-cols-2 lg:grid-rows-none"
            : remoteUsers.length <= 4
            ? "grid-cols-2"
            : "grid-cols-3"
        } gap-2 px-2 py-6 lg:p-2 bg-gray-900`}
      >
        {remoteUsers.map((user) => {
          const isLocalUser = user.uid === RTCUID;
          return ( 
            <div key={user.uid} className="relative w-full h-full">
              {isLocalUser ? (
                <LocalPlayer
                  localPlayerRef={localPlayerRef}
                  userName={user.name}
                  selectedAvatar={user.avatar}
                />
              ) : (
                <RemoteUsers 
                  uid = {user.uid}
                  userName={user.name} 
                  selectedAvatar={user.avatar} 
                  client={client}
                />
              )}
            </div>
          );
        })}
      </div>

      {/*Controladores del usuario */}
      <ControlPanel 
        leaveChannel={leaveChannel} 
        localPlayerRef={localPlayerRef}
        localAudioTrack={localAudioTrack}
      />
    </div>

  );
};

export default VideoCall;