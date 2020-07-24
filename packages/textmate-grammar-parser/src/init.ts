import { loadWASM } from 'onigasm';

export const fetchOnigasm = async (url: string): Promise<ArrayBuffer> => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    return buffer;
};

const initialize = async (onigasmUrl: string): Promise<void> => {
    await loadWASM(await fetchOnigasm(onigasmUrl));
};

export default initialize;
