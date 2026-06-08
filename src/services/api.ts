// src/services/api.ts

// 1. Definindo as tipagens (Equivalente aos seus DTOs no C#)
export interface DadosClima {
  temperatura: number;
  umidade: number;
  precipitacao: number;
  velocidadeVento: number;
}

export interface Alerta {
  tipo: string;
  descricao: string;
  nivelRisco: 'Baixo' | 'Medio' | 'Alto';
}

export interface ResultadoMonitoramento {
  clima: DadosClima;
  ndvi: number;
  saudeVegetacao: string;
  alerta: Alerta | null;
}

// 2. Serviço de consumo da Open-Meteo (Equivalente ao ClimaApiClient.cs)
export const obterDadosMonitoramento = async (
  latitude: number,
  longitude: number
): Promise<ResultadoMonitoramento | null> => {
  try {
    // Montando a URL exatamente com os parâmetros climáticos do seu projeto C#
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.current) {
      throw new Error("Dados não encontrados na Open-Meteo");
    }

    const clima: DadosClima = {
      temperatura: data.current.temperature_2m,
      umidade: data.current.relative_humidity_2m,
      precipitacao: data.current.precipitation,
      velocidadeVento: data.current.wind_speed_10m,
    };

    // 3. Simulando a regra de negócio do NDVI do seu C#
    // Umidade alta e temperatura amena geram NDVI melhor. Seca derruba o índice.
    let ndviCalculado = (clima.umidade * 0.01) - (clima.temperatura > 30 ? 0.2 : 0);
    // Garantindo que fique entre 0.1 e 0.9 para ser realista
    ndviCalculado = Math.max(0.1, Math.min(0.9, ndviCalculado)); 

    let saude = "Boa";
    if (ndviCalculado < 0.25) saude = "Crítica";
    else if (ndviCalculado < 0.45) saude = "Estressada";
    else if (ndviCalculado > 0.65) saude = "Excelente";

    // 4. Regra de negócio para Alertas (Equivalente ao AlertasController.cs)
    let alerta: Alerta | null = null;
    
    if (clima.precipitacao === 0 && clima.umidade < 30) {
      alerta = {
        tipo: "Seca",
        descricao: `Atenção: Umidade em ${clima.umidade}%. Risco alto de estresse hídrico.`,
        nivelRisco: "Alto"
      };
    } else if (clima.velocidadeVento > 25) {
      alerta = {
        tipo: "Vento Forte",
        descricao: `Ventos de ${clima.velocidadeVento}km/h. Risco de danos físicos à cultura.`,
        nivelRisco: "Medio"
      };
    }

    return {
      clima,
      ndvi: Number(ndviCalculado.toFixed(4)),
      saudeVegetacao: saude,
      alerta
    };

  } catch (error) {
    console.error("Erro ao buscar dados do clima:", error);
    return null;
  }
};