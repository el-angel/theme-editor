import React from 'react';

import Button from '~/components/ui/Button';

import css from './styles.module.scss';

interface Props {
  onConfirm: () => void;
  onReject: () => void;
}

const Confirm: React.FC<Props> = ({ onConfirm, onReject, children }) => {
  return (
    <div className={css.container}>
      <div className={css.content}>{children}</div>
      <div className={css.buttons}>
        <Button onClick={onConfirm}>Yes</Button>
        <Button onClick={onReject}>No</Button>
      </div>
    </div>
  );
};

export default Confirm;
