import React from 'react';
import cx from 'classnames';
import { useRecoilState } from 'recoil';

import { editCodeState, rawCode } from '~/state/code';

import css from './styles.module.scss';

const CodeInput: React.FC = () => {
  const [_rawCode, setRawCode] = useRecoilState(rawCode);
  const [isEditing] = useRecoilState(editCodeState);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef) {
      textareaRef.current?.select();
    }
  }, [isEditing]);

  return (
    <textarea
      ref={textareaRef}
      spellCheck={false}
      className={cx(css.textArea, css.codeText)}
      onChange={(evt): void => setRawCode(evt.target.value)}
      value={_rawCode}
    />
  );
};

export default CodeInput;
