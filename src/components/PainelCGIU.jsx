import React, { useEffect, useState } from 'react';
import { fetchParkingData } from '../services/api';

const PainelCGIU = () => {
  const [parques, setParques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchParkingData();
        setParques(data.filter(p => p && p.identificadorLocal));
      } catch (error) {
        console.error("[CGIU Dashboard] Erro ao carregar dados da API:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 15000); 
    return () => clearInterval(interval);
  }, []);

  // Função robusta com mapeamento específico (Overrides) para Google Maps
  const getGoogleMapsUrl = (parque) => {
    const nomeParque = parque.identificadorLocal ? parque.identificadorLocal.toUpperCase() : '';
    const baseUrl = 'https://www.google.com/maps/search/?api=1&query=';

    // Override para P1: Aponta para a morada exata do parque SABA na Rua de Tomaz Ribeiro
    if (nomeParque.includes('P1') || nomeParque.includes('MARISQUEIRAS')) {
      return `${baseUrl}${encodeURIComponent("Parque estacionamento SABA Rua de Tomaz Ribeiro Matosinhos")}`;
    }
    
    // Override para P2: Mantém a query que validou estar a funcionar perfeitamente
    if (nomeParque.includes('P2') || nomeParque.includes('MERCADO')) {
      return `${baseUrl}${encodeURIComponent("Mercado P2 Matosinhos")}`;
    }

    // Fallback normal usando coordenadas se existirem
    if (parque.latitude && parque.longitude) {
      return `${baseUrl}${parque.latitude},${parque.longitude}`;
    }

    // Último recurso: pesquisa pelo nome recebido da API
    return `${baseUrl}${encodeURIComponent(`${parque.identificadorLocal} Matosinhos Portugal`)}`;
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
    </div>
  );

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <div style={styles.headerInfo}>
          <h1 style={styles.headerTitle}>Centro de Gestão e Inteligência Urbana</h1>
          <p style={styles.headerSubtitle}>Monitorização de Estacionamento — Matosinhos</p>
        </div>
        
        <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <span style={{...styles.legendDot, backgroundColor: '#52c41a'}}></span>
            <span style={styles.legendText}>Livre</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{...styles.legendDot, backgroundColor: '#faad14'}}></span>
            <span style={styles.legendText}>Condicionado</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{...styles.legendDot, backgroundColor: '#ff4d4f'}}></span>
            <span style={styles.legendText}>Crítico</span>
          </div>
          
          <div style={styles.liveContainer}>
            <div style={styles.pulseIndicator}></div>
            <span style={styles.liveText}>TEMPO REAL</span>
          </div>
        </div>
      </header>

      <main style={styles.grid}>
        {parques.map((parque, idx) => {
          const ocupacao = parseFloat(parque.ocupacaoPercentagem || 0);
          const accentColor = ocupacao > 90 ? '#ff4d4f' : ocupacao > 70 ? '#faad14' : '#52c41a';
          const mapLink = getGoogleMapsUrl(parque);

          return (
            <div key={idx} style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.parkName}>{parque.identificadorLocal}</h2>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.mainInfo}>
                  <h3 style={{...styles.bigNumber, color: accentColor}}>
                    {parque.lugaresLivres}
                  </h3>
                  <p style={styles.label}>LUGARES LIVRES</p>
                </div>

                <div style={styles.secondaryInfo}>
                  <div style={styles.infoBlock}>
                    <span style={styles.infoValue}>{ocupacao}%</span>
                    <span style={styles.infoLabel}>OCUPAÇÃO</span>
                  </div>
                  <div style={styles.infoBlock}>
                    <span style={styles.infoValue}>{parque.capacidadeTotal}</span>
                    <span style={styles.infoLabel}>CAPACIDADE</span>
                  </div>
                </div>
              </div>

              <div style={styles.progressBarBg}>
                <div style={{ 
                  ...styles.progressBarFill, 
                  width: `${ocupacao}%`, 
                  backgroundColor: accentColor,
                  boxShadow: `0 0 12px ${accentColor}33` 
                }}></div>
              </div>
              
              <a href={mapLink} target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
                ver localização no mapa
              </a>
            </div>
          );
        })}
      </main>
    </div>
  );
};

const styles = {
  appContainer: { minHeight: '100vh', backgroundColor: '#0c1117', color: '#f0f6fc', padding: '40px 20px', fontFamily: "Inter, -apple-system, sans-serif" },
  header: { maxWidth: '1200px', margin: '0 auto 40px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' },
  headerTitle: { fontSize: '22px', fontWeight: '600', margin: 0, color: '#fff', letterSpacing: '-0.5px' },
  headerSubtitle: { fontSize: '13px', color: '#8b949e', margin: '4px 0 0 0' },
  
  legendContainer: { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#161b22', padding: '10px 20px', borderRadius: '12px', border: '1px solid #30363d' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  legendDot: { width: '8px', height: '8px', borderRadius: '50%' },
  legendText: { fontSize: '11px', fontWeight: '600', color: '#8b949e', textTransform: 'uppercase' },
  
  liveContainer: { display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px', paddingLeft: '20px', borderLeft: '1px solid #30363d' },
  pulseIndicator: { width: '8px', height: '8px', backgroundColor: '#00D2FF', borderRadius: '50%', boxShadow: '0 0 8px #52c41a', animation: 'pulse 2s infinite' },
  liveText: { fontSize: '11px', fontWeight: '800', color: '#00D2FF', letterSpacing: '0.5px', textTransform: 'uppercase' },
  
  grid: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' },
  card: { backgroundColor: '#161b22', borderRadius: '16px', padding: '28px', border: '1px solid #30363d', display: 'flex', flexDirection: 'column', position: 'relative' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' },
  parkName: { fontSize: '14px', fontWeight: '600', color: '#8b949e', textTransform: 'uppercase', margin: 0, letterSpacing: '0.8px', flex: 1 },
  cardBody: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  bigNumber: { fontSize: '64px', fontWeight: '700', margin: 0, lineHeight: '1' },
  label: { fontSize: '10px', fontWeight: '800', color: '#484f58', marginTop: '8px', letterSpacing: '1px' },
  secondaryInfo: { display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'right' },
  infoBlock: { display: 'flex', flexDirection: 'column' },
  infoValue: { fontSize: '20px', fontWeight: '600', color: '#fff' },
  infoLabel: { fontSize: '9px', fontWeight: '800', color: '#484f58', letterSpacing: '0.5px' },
  progressBarBg: { width: '100%', height: '5px', backgroundColor: '#0d1117', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' },
  progressBarFill: { height: '100%', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' },
  
  footerLink: { 
    fontSize: '10px', 
    color: 'rgb(0, 210, 255)', 
    textDecoration: 'none', 
    fontWeight: '800', 
    paddingTop: '15px', 
    borderTop: '1px solid rgb(48, 54, 61)',
    textAlign: 'center',
    transition: 'color 0.2s',
    letterSpacing: '1px',
    display: 'block',
    width: '100%',
    textTransform: 'uppercase'
  },
  
  loadingContainer: { minHeight: '100vh', backgroundColor: '#0c1117', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  spinner: { width: '30px', height: '30px', border: '3px solid #161b22', borderTop: '3px solid #52c41a', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};

// Injeção de CSS global
const injectGlobalStyles = () => {
  if (!document.getElementById('cgiu-global-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'cgiu-global-styles';
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes pulse { 
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(82, 196, 26, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(82, 196, 26, 0); }
      }
      a:hover { opacity: 0.8 !important; }
    `;
    document.head.appendChild(styleSheet);
  }
};
injectGlobalStyles();

export default PainelCGIU;