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
      <p>Sincronizando infraestrutura...</p>
    </div>
  );

  return (
    <div style={styles.appContainer}>
      {/* Header Estilo CGIU */}
      <header style={styles.header}>
        <div style={styles.headerBrand}>
          <div style={styles.logoCircle}></div>
          <div>
            <h1 style={styles.mainTitle}>Centro de Gestão e Inteligência Urbana</h1>
            <p style={styles.subTitle}>Monitorização de Estacionamento — Matosinhos</p>
          </div>
        </div>
        <div style={styles.statusBadge}>
          <span style={styles.pulseDot}></span> SISTEMA OPERACIONAL
        </div>
      </header>

      {/* Grid de Cartões */}
      <main style={styles.dashboardGrid}>
        {parques.map((parque, idx) => {
          const ocupacao = parseFloat(parque.ocupacaoPercentagem);
          // Cor baseada no estado (Verde, Amarelo, Vermelho)
          const statusColor = ocupacao > 90 ? '#ff4d4f' : ocupacao > 70 ? '#faad14' : '#00f2ff';

          return (
            <section key={idx} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.iconTag}>P</span>
                <h2 style={styles.parkTitle}>{parque.identificadorLocal}</h2>
              </div>

              <div style={styles.dataRow}>
                <div style={styles.mainValueContainer}>
                  <span style={{ ...styles.bigNumber, color: statusColor }}>
                    {parque.lugaresLivres}
                  </span>
                  <span style={styles.unitLabel}>LIVRES</span>
                </div>
                
                <div style={styles.percentageContainer}>
                  <span style={styles.percValue}>{ocupacao}%</span>
                  <span style={styles.percLabel}>OCUPAÇÃO</span>
                </div>
              </div>

              {/* Barra de Progresso Visual */}
              <div style={styles.progressBg}>
                <div style={{ 
                  ...styles.progressFill, 
                  width: `${ocupacao}%`, 
                  backgroundColor: statusColor 
                }}></div>
              </div>

              <footer style={styles.cardFooter}>
                Capacidade: {parque.capacidadeTotal} lugares
              </footer>
            </section>
          );
        })}
      </main>
    </div>
  );
};

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#0a0e14', // Fundo ultra-dark do anexo
    color: '#e6e6e6',
    padding: '30px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    borderBottom: '1px solid #1f262e',
    paddingBottom: '20px',
  },
  headerBrand: { display: 'flex', alignItems: 'center', gap: '15px' },
  logoCircle: { width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #00f2ff', background: 'radial-gradient(circle, #00f2ff 0%, transparent 70%)' },
  mainTitle: { margin: 0, fontSize: '18px', fontWeight: '600', letterSpacing: '0.5px', color: '#fff' },
  subTitle: { margin: 0, fontSize: '12px', color: '#718096', fontWeight: '400' },
  statusBadge: { backgroundColor: '#141a23', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', color: '#00f2ff', border: '1px solid #1f262e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' },
  pulseDot: { width: '6px', height: '6px', backgroundColor: '#00f2ff', borderRadius: '50%', animation: 'pulse 2s infinite' },
  
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#141a23', // Cor dos cards do anexo
    borderRadius: '8px',
    padding: '24px',
    border: '1px solid #1f262e',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  iconTag: { backgroundColor: '#0a0e14', color: '#00f2ff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #1f262e' },
  parkTitle: { margin: 0, fontSize: '14px', color: '#a0aec0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' },
  
  dataRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' },
  mainValueContainer: { display: 'flex', flexDirection: 'column' },
  bigNumber: { fontSize: '48px', fontWeight: '700', lineHeight: '1' },
  unitLabel: { fontSize: '10px', color: '#4a5568', fontWeight: '700', marginTop: '5px' },
  
  percentageContainer: { textAlign: 'right', display: 'flex', flexDirection: 'column' },
  percValue: { fontSize: '20px', fontWeight: '600', color: '#fff' },
  percLabel: { fontSize: '10px', color: '#4a5568', fontWeight: '700' },
  
  progressBg: { width: '100%', height: '4px', backgroundColor: '#0a0e14', borderRadius: '2px', overflow: 'hidden', marginBottom: '15px' },
  progressFill: { height: '100%', transition: 'width 1s ease-in-out' },
  
  cardFooter: { fontSize: '11px', color: '#4a5568', borderTop: '1px solid #1f262e', paddingTop: '12px' },
  
  loadingContainer: { minHeight: '100vh', backgroundColor: '#0a0e14', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#00f2ff' },
  spinner: { width: '40px', height: '40px', border: '3px solid #141a23', borderTop: '3px solid #00f2ff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '15px' }
};

export default PainelCGIU;