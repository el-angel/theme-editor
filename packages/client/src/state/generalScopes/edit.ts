import { atom } from 'recoil';

import { atomKey } from '~/helpers/state';

import { GeneralScope } from '~/types';

const editGeneralScopeState = atom<Maybe<GeneralScope['scope']>>({
    key: atomKey('EditGeneralScopeID'),
    default: undefined,
});

export default editGeneralScopeState;
