import { atom } from 'recoil';

import { atomKey } from '~/helpers/state';

import { Rule } from '~/types';

const editRuleState = atom<Rule['id']>({
  key: atomKey('EditRuleID'),
  default: '',
});

export default editRuleState;
