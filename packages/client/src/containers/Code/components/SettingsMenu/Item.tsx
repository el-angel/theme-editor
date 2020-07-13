import React from 'react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (...args: any[]) => void;
  children: string;
}

const SettingsMenuItem: React.FC<Props> = ({ onClick, children }) => {
  return <li onClick={onClick}>{children}</li>;
};

export default SettingsMenuItem;
