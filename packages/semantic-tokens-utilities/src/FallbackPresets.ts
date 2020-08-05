import { FallbackRegister } from './types';

export const vscode = (register: FallbackRegister): void => {
    register('namespace', ['entity.name.namespace']);
    register('type', ['entity.name.type', 'support.type']);
    register('class', ['entity.name.type.class', 'support.class']);
    register('interface', ['entity.name.type.interface']);
    register('enum', ['entity.name.type.enum']);
    register('typeParameter', ['entity.name.type.parameter']);
    register('function', ['entity.name.function', 'support.function']);
    register('member', ['entity.name.function.member', 'support.function']);
    register('variable', ['variable.other.readwrite', 'entity.name.variable']);
    register('parameter', ['variable.parameter']);
    register('property', ['variable.other.property']);
    register('enumMember', ['variable.other.enummember']);

    register('variable.readonly', ['variable.other.constant']);
    register('property.readonly', ['variable.other.constant.property']);
    register('type.defaultLibrary', ['support.type']);
    register('class.defaultLibrary', ['support.class']);
    register('interface.defaultLibrary', ['support.class']);
    register('variable.defaultLibrary', ['support.variable', 'support.other.variable']);
    register('variable.defaultLibrary.readonly', ['support.constant']);
    register('property.defaultLibrary', ['support.variable.property']);
    register('property.defaultLibrary.readonly', ['support.constant.property']);
    register('function.defaultLibrary', ['support.function']);
    register('member.defaultLibrary', ['support.function']);
};
