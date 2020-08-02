import { TextMateParserResult } from '@anche/textmate-utilities';
import { atom, selector } from 'recoil';

import textmateService from '~/services/textmate';
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
    key: atomKey('Code', 'Raw'),
    default: initCode,
});

export const rawCode = selector<string>({
    key: selectorKey('Code', 'RawSelector'),
    get: ({ get }) => {
        return get(_rawCode);
    },
    set: ({ set, get }, input) => {
        set(_rawCode, input);

        /**
         * @TODO Replace when Atom Effects is introduced
         */
        storage.set(atomKey('Code', 'Raw'), get(_rawCode));
    },
});

export const editCodeState = atom<boolean>({
    key: atomKey('Code', 'Edit'),
    default: false,
});

const parsedCode = selector<TextMateParserResult>({
    key: selectorKey('Code', 'Parsed'),
    get: async ({ get }) => {
        const code = get(_rawCode);
        const language = get(languageState);
        const response = await textmateService.parse(code, language);

        return response;
    },
});

export const selectedSubline = atom<Nullable<string>>({
    key: atomKey('Code', 'SelectedSubline'),
    default: '',
});

export default parsedCode;
