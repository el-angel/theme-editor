import React from 'react';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';

import { editCodeState } from '~/state/code';

import CodeInput from '~/containers/Code/components/CodeInput';
import CodeView from '~/containers/Code/components/CodeView';

import css from './styles.module.scss';

const Editor: React.FC = () => {
  const isEditing = useRecoilValue(editCodeState);

  return (
    <div className={css.outer}>
      <code className={css.container}>
        <pre className={cx(css.code, css.codeText)}>
          {isEditing ? (
            <CodeInput />
          ) : (
            <div className={css.codeWrapper}>
              <CodeView />
            </div>
          )}
        </pre>
      </code>
    </div>
  );
};

export default Editor;
