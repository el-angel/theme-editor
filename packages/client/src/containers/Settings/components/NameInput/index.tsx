import React from 'react';
import cx from 'classnames';

import css from './styles.module.scss';

interface Props {
  value: string;
  readonly?: boolean;
  onChange?: (name: string) => void;
}

const NameInput: React.FC<Props> = ({
  value: currentValue,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (): void => {},
  readonly,
}) => {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(currentValue);

  const onClick = React.useCallback(() => {
    if (readonly) {
      return;
    }
    setEditing(true);
  }, [readonly]);

  const onInputBlur = React.useCallback(() => {
    if (readonly) {
      return;
    }

    setEditing(false);

    onChange!(value);
  }, [onChange, readonly, value]);

  const onKeyDown = React.useCallback(
    (evt: React.KeyboardEvent) => {
      if (readonly) {
        return;
      }

      if (evt.key === 'Enter') {
        onInputBlur();
      }
    },
    [onInputBlur, readonly],
  );

  React.useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  return (
    <div>
      <input
        onClick={onClick}
        readOnly={!editing || readonly}
        className={cx(css.name, {
          [css.editable]: editing && !readonly,
          [css.readonly]: readonly,
        })}
        type="text"
        value={value}
        onChange={(evt): void => setValue(evt.target.value)}
        onBlur={onInputBlur}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default NameInput;
