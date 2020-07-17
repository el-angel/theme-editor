import { atom } from 'recoil';

import { atomKey } from '~/helpers/state';

const activeScope = atom<string>({
    key: atomKey('ActiveScope'),
    default: '',
});

export default activeScope;
