import React from 'react';

import css from './styles.module.scss';

const PanelItem: React.FC = ({ children }) => {
  return <div className={css.item}>{children}</div>;
};

export default PanelItem;
