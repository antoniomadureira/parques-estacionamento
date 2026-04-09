const DOMAIN = import.meta.env.VITE_HUWISE_DOMAIN;
const API_KEY = import.meta.env.VITE_HUWISE_API_KEY;
const DATASET = import.meta.env.VITE_DATASET_ID;

export const fetchParkingData = async (offset = 0, retries = 3, backoff = 1000) => {
  // Atualizámos o 'select' para os nomes reais das colunas da SABA
  const url = `https://${DOMAIN}/api/explore/v2.1/catalog/datasets/${DATASET}/records?select=aparcamiento_desc,plazas,plazas_totales,porcentaje_de_ocupacion,coordenadas&limit=100&offset=${offset}&lang=pt`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Apikey ${API_KEY}`
      }
    });

    if (response.status === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchParkingData(offset, retries - 1, backoff * 2);
    }

    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
    
    const data = await response.json();
    
    // Mapeamento ENTI com a estrutura da SABA
    return data.results.map(record => ({
      identificadorLocal: record.aparcamiento_desc, // Ex: "MATOSINHOS MERCADO P2"
      capacidadeTotal: record.plazas_totales,       // Ex: 169
      lugaresLivres: record.plazas,                 // Ex: 34
      ocupacaoAbsoluta: record.plazas_totales - record.plazas, // 169 - 34 = 135 lugares ocupados
      ocupacaoPercentagem: record.porcentaje_de_ocupacion,     // Ex: 79
      coordenadasGlobais: record.coordenadas        // { lat, lon }
    }));

  } catch (error) {
    console.error("Falha na sincronização dos parques:", error);
    return [];
  }
};