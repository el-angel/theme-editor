import React from 'react';

import css from './styles.module.scss';

interface Props {
  lineNumber: number;
  children: React.ReactNode;
}

const Line: React.FC<Props> = ({ lineNumber, children }) => (
  <span className={`${css.line} line-${lineNumber}`}>{children}</span>
);

export default React.memo(Line);
