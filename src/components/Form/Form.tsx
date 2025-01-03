import React, { useState } from "react";
import { useDispatch} from "react-redux";
import { JoinChannel } from "../hook/initClient";

import { addDoc, collection } from "firebase/firestore";
import {db} from '../../firebase/firebase'
import { AppDispatch } from "../redux/store";

// Define la interfaz para las props
interface FormProps {
  APP_ID: string;
  CHANNEL?: string;
  TOKEN: string | null; 
  RTCUID:string;
}

const FormAgora: React.FC<FormProps> = ({APP_ID, CHANNEL, TOKEN, RTCUID}) => {


  // Estado local para el avatar y el nombre de usuario
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  // Manejador para cuando se selecciona un avatar
  const handleAvatarClick = (avatar: string) => {
    setAvatar(avatar); // Actualiza el avatar seleccionado localmente
  };

  // Manejador para cuando se cambia el nombre de usuario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value); // Actualiza el nombre de usuario localmente
  };

  // Función para unirse al canal
  const joinChannelHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    // Verifica que ambos campos sean válidos antes de continuar
    if (!name || !setAvatar) {
      alert("Por favor, selecciona un avatar y un nombre de usuario.");
      return;
    }

    
    // Llamada a la función JoinChannel
    await JoinChannel({
      dispatch,
      APP_ID,
      CHANNEL: CHANNEL || '',
      TOKEN ,
      RTCUID
    });

    const handleAdd = async () => {
      if (!CHANNEL) {
        console.error("El canal no es válido.");
        return;
      }
      try {
        const docRef = await addDoc(collection(db, CHANNEL), {
          data: {
            uid:RTCUID,
            name:name,
            avatar:avatar,
          },
        });
        console.log("Documento añadido con ID:", docRef.id);
      } catch (error) {
        console.error("Error al añadir documento:", error);
      }
    };
    handleAdd()
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-900">
      <div className="w-[90%] md:w-[40%] bg-[#2b7c85] p-4 rounded-lg shadow-xl flex flex-col gap-2 border-white border-2">
        <h3 className="text-center font-bold text-xl text-white">Selecciona un avatar:</h3>

        {/* Avatares masculinos */}
        <div id="male-avatars" className="flex gap-3 flex-wrap justify-center mb-6">
          {["male-1", "male-2", "male-4", "male-5"].map((avatarKey) => (
            <img
              key={avatarKey}
              className={`w-12 h-12 md:h-20 md:w-20 object-contain border-4 transition-all duration-300 ease-in-out ${
                avatar === avatarKey ? "border-[#55ee68] scale-110" : "border-white opacity-80"
              } rounded-full cursor-pointer m-2 hover:border-[#55ee68] hover:scale-110`}
              src={`avatars/${avatarKey}.png`}
              alt={avatarKey}
              onClick={() => handleAvatarClick(avatarKey)} // Cambiar el avatar al hacer clic
            />
          ))}
        </div>

        {/* Avatares femeninos */}
        <div id="female-avatars" className="flex gap-3 flex-wrap justify-center mb-6">
          {["female-1", "female-2", "female-4", "female-5"].map((avatarKey) => (
            <img
              key={avatarKey}
              className={`w-12 h-12 md:h-20 md:w-20 object-contain border-4 transition-all duration-300 ease-in-out ${
                avatar === avatarKey ? "border-[#55ee68] scale-110" : "border-white opacity-80"
              } rounded-full cursor-pointer m-2 hover:border-[#55ee68] hover:scale-110`}
              src={`avatars/${avatarKey}.png`}
              alt={avatarKey}
              onClick={() => handleAvatarClick(avatarKey)} // Cambiar el avatar al hacer clic
            />
          ))}
        </div>

        <div id="form-fields" className="flex flex-col gap-6">
          <label className="text-white text-lg font-medium">Display Name:</label>
          <input
            required
            name="displayname"
            type="text"
            placeholder="Ingresa tu nombre de usuario..."
            value={name}
            onChange={handleInputChange} // Actualizar el nombre del usuario
            className="p-3 border-2 border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={joinChannelHandler}
            disabled={!name || !avatar} // Deshabilitar si no hay avatar o nombre
            className="p-3 text-gray-600 cursor-pointer bg-[#b1d4e0] font-black rounded-lg border-2 uppercase disabled:bg-gray-400"
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormAgora;
