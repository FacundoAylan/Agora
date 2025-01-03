import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import './index.css';

const App: React.FC = () => {
  
  const [roomLink, setRoomLink] = useState<string | null>(null);
  const [roomCreated, setRoomCreated] = useState(false);

  const generarNombreCanal = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nombre = '';
    for (let i = 0; i < 8; i++) {
      nombre += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return 'Canal_' + nombre;
  };

  const createRoomAgora = () => {
    const CHANNEL = generarNombreCanal();
    const link = `/#/room/${CHANNEL}`;
    setRoomLink(link);
    setRoomCreated(true);
  };

  const copyLinkToClipboard = () => {
    if (roomLink) {
      navigator.clipboard.writeText(window.location.origin + roomLink)
        .then(() => {
          alert("Enlace copiado al portapapeles!");
        })
        .catch((error) => {
          console.error("Error al copiar el enlace: ", error);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      {!roomCreated ? (
        <button
          onClick={createRoomAgora}
          className="px-6 py-3 text-white font-semibold bg-cyan-600 hover:bg-cyan-500 transition-colors duration-300 rounded-lg shadow-lg"
        >
          Agendar cita
        </button>
      ) : (
        <div className="w-full max-w-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-6 rounded-lg shadow-xl">
          <h1 className="text-3xl font-extrabold text-white text-center mb-4">Fluiana</h1>
          <p className="text-white text-sm text-center mb-6">Puedes compartir este enlace con otros para que se unan a la sala.</p>
          <p className="text-white text-center mb-4">Enlace para compartir:</p>
          
          <div className="relative w-full mb-6">
            <input
              type="text"
              value={roomLink ? window.location.origin + roomLink : ''}
              readOnly
              className="w-full p-3 text-gray-800 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={copyLinkToClipboard}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300 transition-colors duration-200"
            >
              <FiCopy size={20} />
            </button>
          </div>
          
          <button
            className="w-full py-3 text-white font-semibold bg-blue-600 hover:bg-blue-500 transition-colors duration-300 rounded-lg shadow-lg"
          >
            <a href={roomLink ? window.location.origin + roomLink : ''}>
              Ir a la sala
            </a>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
