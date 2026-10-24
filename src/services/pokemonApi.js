const BASE_URL = 'https://pokeapi.co/api/v2';


export const getPokemonList = async (limit = 20, offset = 0, signal) => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, { signal });
  if (!response.ok) throw new Error('Error al conectar con la API');
  const data = await response.json();
  return data.results;
};

export const getPokemonDetail = async (identifier, signal) => {
  const cleanId = String(identifier).toLowerCase().trim();
  const response = await fetch(`${BASE_URL}/pokemon/${cleanId}`, { signal });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('NOT_FOUND');
    }
    throw new Error('Error de conexión');
  }

  return await response.json();
};