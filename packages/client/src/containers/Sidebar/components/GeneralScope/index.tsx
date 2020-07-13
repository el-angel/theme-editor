import React from 'react';
import { useRecoilState } from 'recoil';

import generalScopeManager from '~/state/generalScopes';
import editGeneralScopeState from '~/state/generalScopes/edit';

import SidebarItem from '~/components/ui/SidebarItem';

import { GeneralScope as GeneralScopeType } from '~/types';

interface Props {
  scope: string;
}

const GeneralScope: React.FC<Props> = ({ scope }) => {
  const [generalScope] = useRecoilState(generalScopeManager(scope));

  const [editingScope, editScope] = useRecoilState(editGeneralScopeState);

  const isActive = (generalScope as GeneralScopeType)?.scope === editingScope;

  if (!generalScope) {
    return null;
  }

  return (
    <>
      <SidebarItem
        isActive={isActive}
        onClick={(): void => editScope(generalScope.scope)}
        title={generalScope.scope}
        color={generalScope.color}
      />
    </>
  );
};

export default GeneralScope;
