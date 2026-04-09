import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { fetchParkingData } from '../services/api';

const MapDashboard = () => {
  const [parques, setParques] = useState([]);
  const [loading, setLoading] = useState(true);

  // Coordenadas centrais de Matosinhos
  const position = [41.1844, -8.6963]; 

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchParkingData();
      setParques(data);
      setLoading(false);
    };
    loadData();
    // Atualiza a cada 5 minutos
    const interval = setInterval(loadData, 300000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>A carregar dados de ocupação...</div>;

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parques.map((parque, idx) => (
          parque.coordenadasGlobais && (
            <Marker key={idx} position={[parque.coordenadasGlobais.lat, parque.coordenadasGlobais.lon]}>
              <Popup>
                <strong>{parque.identificadorLocal}</strong><br/>
                Ocupação: {parque.ocupacaoPercentagem}% <br/>
                ({parque.ocupacaoAbsoluta} de {parque.capacidadeTotal} lugares)
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapDashboard;