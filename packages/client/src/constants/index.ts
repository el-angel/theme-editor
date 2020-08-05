export enum FontStyle {
    Bold = 'bold',
    Italic = 'italic',
    Underline = 'underline',
}

export enum EntityType {
    SemanticToken,
    Rule,
    GeneralScope,
}

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const GENERAL_SCOPES = <const>[
    'button.background',
    'button.foreground',
    'button.hoverBackground',
    'editor.background',
    'editor.foreground',
    'editor.selectionBackground',
    'editor.selectionForeground',
    'editorGutter.background',
    'editorLineNumber.foreground',
    'focusBorder',
    'foreground',
    'input.background',
    'input.border',
    'input.foreground',
    'input.placeholderForeground',
    'list.focusBackground',
    'list.focusForeground',
    'list.hoverBackground',
    'list.hoverForeground',
    'panel.background',
    'panel.border',
    'quickInput.background',
    'quickInput.foreground',
    'sideBar.background',
    'sideBar.border',
    'sideBar.foreground',
    'statusBar.background',
    'statusBar.border',
    'statusBar.foreground',
    'statusBarItem.activeBackground',
    'statusBarItem.hoverBackground',
];

export const SEMANTIC_HIGHLIGHTING_TEXTMATE_MAP = <const>{
    namespace: ['entity.name.namespace', 'entity.name.type.module'],

    type: ['entity.name.type'],
    'type.defaultLibrary': ['support.type'],

    struct: ['storage.type.struct'],

    class: ['entity.name.type.class'],
    'class.defaultLibrary': ['support.class'],

    interface: ['entity.name.type.interface'],
    'interface.defaultLibrary': ['support.class'],

    function: ['entity.name.function'],
    'function.defaultLibrary': ['support.function'],

    member: ['entity.name.function.member'],

    macro: ['entity.name.other.preprocessor.macro'],

    variable: ['entity.name.variable', 'variable.other.readwrite'],
    'variable.defaultLibrary': ['support.variable'],
    'variable.readonly': ['variable.other.constant'],
    'variable.readonly.defaultLibrary': ['support.constant'],

    parameter: ['variable.parameter'],

    property: ['variable.other.property'],
    'property.readonly': ['variable.other.constant.property'],

    enum: ['entity.name.type.enum'],
    enumMember: ['variable.other.enummember'],

    event: ['variable.other.event'],
};
