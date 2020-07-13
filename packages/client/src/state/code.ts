import { Code } from '@anche/textmate-grammar-parser';
import { atom, selector } from 'recoil';

import languageService from '~/services/language';
import storage from '~/services/storage';

import { atomKey, selectorKey } from '~/helpers/state';

import languageState from './language';

const initCode = `
import React from 'react';
import main from '~/state/main';
import { getAll } from '~/helpers/getAll';
import Button from '../../component/Button';

import './style.css';

interface Props {
  title: string;
  content: string;
  onClick: (...args: any[]) => void,
}

const Viewer: React.FC<Props>  = ({ title, content, onClick }) => {
  return (
    <div>
      <h1>{title}</h1>

      <p>{content}</p>

      <button
        type="button"
        onClick={onClick}
        className="button"
        >
          Well, what are you waiting for?
        </button>
    </div>
  );
}

export default Viewer;
`;

const _rawCode = atom<string>({
  key: atomKey('RawCode'),
  default: initCode,
});

export const rawCode = selector<string>({
  key: selectorKey('RawCode__Selector'),
  get: ({ get }) => {
    return get(_rawCode);
  },
  set: ({ set, get }, input) => {
    set(_rawCode, input);

    /**
     * @TODO Replace when Atom Effects is introduced
     */
    storage.set(atomKey('RawCode'), get(_rawCode));
  },
});

export const editCodeState = atom<boolean>({
  key: atomKey('EditCode'),
  default: false,
});

const parsedCode = selector<Code>({
  key: selectorKey('Code'),
  get: async ({ get }) => {
    const code = get(_rawCode);
    const language = get(languageState);
    const response = await languageService.parse(code, language);

    return response;
  },
});

export const selectedSubline = atom<Nullable<string>>({
  key: atomKey('SelectedSubline'),
  default: '',
});

export default parsedCode;
