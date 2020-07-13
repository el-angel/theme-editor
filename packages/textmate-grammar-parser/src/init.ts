import { loadWASM } from 'onigasm';

const initialize = async (onigasmUrl: string): Promise<void> => {
  const response = await fetch(onigasmUrl);
  const buffer = await response.arrayBuffer();
  await loadWASM(buffer);
};

export default initialize;
