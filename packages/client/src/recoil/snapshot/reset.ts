import { MutableSnapshot } from 'recoil';

import { generalScopeState } from '~/state/generalScopes';
import { ruleIds, ruleState } from '~/state/rules';
import { semanticTokenIds, semanticTokenState } from '~/state/semanticTokens';
import { themeStyle } from '~/state/theme';

import { GENERAL_SCOPES } from '~/constants';

const resetState = async (snapshot: MutableSnapshot): Promise<void> => {
    snapshot.reset(themeStyle);
    GENERAL_SCOPES.map(name => snapshot.reset(generalScopeState(name)));

    const ids = await snapshot.getPromise(ruleIds);
    let length = ids.length,
        i = 0;

    for (; i < length; i++) {
        const id = ids[i];
        snapshot.reset(ruleState(id));
    }

    const tokenIds = await snapshot.getPromise(semanticTokenIds);
    length = tokenIds.length;
    i = 0;

    for (; i < length; i++) {
        const id = tokenIds[i];
        snapshot.reset(semanticTokenState(id));
    }

    snapshot.set(semanticTokenIds, []);
};

export default resetState;
