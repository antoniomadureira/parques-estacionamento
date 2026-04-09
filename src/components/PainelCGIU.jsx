import React, { useEffect, useState } from 'react';
import { fetchParkingData } from '../services/api';

const PainelCGIU = () => {
  const [parques, setParques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchParkingData();
      setParques(data.filter(p => p.identificadorLocal));
      setLoading(false);
    };
    loadData();
    const interval = setInterval(loadData, 15000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={{ color: '#888', marginTop: '10px' }}>Sincronizando CGIU...</p>
    </div>
  );

  return (
    <div style={styles.appContainer}>
      {/* Header com estilo idêntico ao Meteo */}
      <header style={styles.header}>
        <div style={styles.headerInfo}>
          <h1 style={styles.headerTitle}>Centro de Gestão e Inteligência Urbana</h1>
          <p style={styles.headerSubtitle}>Monitorização de Estacionamento — Matosinhos</p>
        </div>
        <div style={styles.refreshControl}>
          <div style={styles.pulse}></div>
          <span style={styles.updateText}>LIVE</span>
        </div>
      </header>

      {/* Grid Principal */}
      <main style={styles.grid}>
        {parques.map((parque, idx) => {
          const ocupacao = parseFloat(parque.ocupacaoPercentagem);
          // Cores de acento baseadas no projeto Meteo
          const accentColor = ocupacao > 90 ? '#ff4d4f' : ocupacao > 70 ? '#faad14' : '#00d2ff';

          return (
            <div key={idx} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{...styles.iconBox, color: accentColor}}>P</div>
                <h2 style={styles.parkName}>{parque.identificadorLocal}</h2>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.mainInfo}>
                  <h3 style={{...styles.bigNumber, color: accentColor}}>
                    {parque.lugaresLivres}
                  </h3>
                  <p style={styles.label}>LIVRES</p>
                </div>

                <div style={styles.secondaryInfo}>
                  <div style={styles.infoBlock}>
                    <span style={styles.infoValue}>{ocupacao}%</span>
                    <span style={styles.infoLabel}>OCUPAÇÃO</span>
                  </div>
                  <div style={styles.infoBlock}>
                    <span style={styles.infoValue}>{parque.capacidadeTotal}</span>
                    <span style={styles.infoLabel}>TOTAL</span>
                  </div>
                </div>
              </div>

              {/* Barra de Progresso Estilo Meteo */}
              <div style={styles.progressBarBg}>
                <div style={{ 
                  ...styles.progressBarFill, 
                  width: `${ocupacao}%`, 
                  backgroundColor: accentColor,
                  boxShadow: `0 0 10px ${accentColor}44` 
                }}></div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

// CSS Injetado com base no projeto antoniomadureira.github.io/meteo/
const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#0c1117', // Cor de fundo do projeto Meteo
    color: '#f0f6fc',
    padding: '40px 20px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 40px auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: '24px', fontWeight: '600', margin: 0, color: '#fff' },
  headerSubtitle: { fontSize: '14px', color: '#8b949e', margin: '4px 0 0 0' },
  refreshControl: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#161b22', padding: '8px 16px', borderRadius: '20px', border: '1px solid #30363d' },
  pulse: { width: '8px', height: '8px', backgroundColor: '#00d2ff', borderRadius: '50%', boxShadow: '0 0 8px #00d2ff' },
  updateText: { fontSize: '12px', fontWeight: 'bold', color: '#00d2ff' },

  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#161b22', // Cartões do Meteo
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #30363d',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  iconBox: { width: '32px', height: '32px', backgroundColor: '#0c1117', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', border: '1px solid #30363d' },
  parkName: { fontSize: '14px', fontWeight: '500', color: '#8b949e', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' },

  cardBody: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  bigNumber: { fontSize: '56px', fontWeight: '700', margin: 0, lineHeight: '1' },
  label: { fontSize: '11px', fontWeight: 'bold', color: '#484f58', marginTop: '4px' },

  secondaryInfo: { display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'right' },
  infoBlock: { display: 'flex', flexDirection: 'column' },
  infoValue: { fontSize: '18px', fontWeight: '600', color: '#fff' },
  infoLabel: { fontSize: '9px', fontWeight: 'bold', color: '#484f58' },

  progressBarBg: { width: '100%', height: '6px', backgroundColor: '#0d1117', borderRadius: '3px', overflow: 'hidden' },
  progressBarFill: { height: '100%', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' },

  loadingContainer: { minHeight: '100vh', backgroundColor: '#0c1117', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  spinner: { width: '30px', height: '30px', border: '3px solid #161b22', borderTop: '3px solid #00d2ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};

export default PainelCGIU;