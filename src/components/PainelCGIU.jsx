import React, { useEffect, useState } from 'react';
import { fetchParkingData } from '../services/api';

const PainelCGIU = () => {
  const [parques, setParques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchParkingData();
      const parquesValidos = data.filter(p => p.identificadorLocal);
      setParques(parquesValidos);
      setLoading(false);
    };
    
    loadData();
    // Atualização a cada 15 segundos (15000 milissegundos)
    const interval = setInterval(loadData, 15000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#fff' }}>A carregar dados do CGIU...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>CGIU | Estado dos Parques</h1>
        <p style={styles.subtitle}>Matosinhos - Atualização a cada 15 segundos</p>
      </header>

      <div style={styles.grid}>
        {parques.map((parque, idx) => (
          <div key={idx} style={styles.card}>
            <h2 style={styles.parkName}>{parque.identificadorLocal}</h2>
            <div style={styles.spotsContainer}>
              <span style={{ 
                ...styles.number, 
                color: parque.lugaresLivres < 5 ? '#ff4d4f' : '#52c41a' 
              }}>
                {parque.lugaresLivres}
              </span>
              <span style={styles.text}>lugares disponíveis</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#141414', color: '#ffffff', padding: '40px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' },
  header: { borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '40px' },
  title: { margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#1890ff' },
  subtitle: { margin: '10px 0 0 0', fontSize: '1.2rem', color: '#8c8c8c' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' },
  card: { backgroundColor: '#1f1f1f', borderRadius: '12px', padding: '30px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  parkName: { margin: '0 0 20px 0', fontSize: '1.5rem', color: '#ffffff', lineHeight: '1.3' },
  spotsContainer: { display: 'flex', alignItems: 'baseline', gap: '10px' },
  number: { fontSize: '4rem', fontWeight: 'bold', lineHeight: '1' },
  text: { fontSize: '1.2rem', color: '#bfbfbf', textTransform: 'uppercase', letterSpacing: '1px' }
};

export default PainelCGIU;