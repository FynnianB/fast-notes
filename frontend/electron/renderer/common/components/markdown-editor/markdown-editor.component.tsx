import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import type React from 'react';
import classNames from 'classnames';
import style from './markdown-editor.module.less';

import 'codemirror/lib/codemirror.css';
import 'hypermd/mode/hypermd.css';
import './hypermd-dark-custom.css';

import 'codemirror/lib/codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/gfm/gfm';

import 'hypermd/core';
import 'hypermd/mode/hypermd';

import 'hypermd/addon/hide-token';
import 'hypermd/addon/cursor-debounce';
import 'hypermd/addon/fold';
import 'hypermd/addon/read-link';
import 'hypermd/addon/click';
import 'hypermd/addon/hover';
import 'hypermd/addon/paste';
import 'hypermd/addon/insert-file';
import 'hypermd/addon/mode-loader';
import 'hypermd/addon/table-align';

interface MarkdownEditorProps {
    initialText: string;
    onChange?: (value: string) => void;
    onKeyUp?: (event: React.KeyboardEvent) => void;
    fixFullHeight?: boolean;
}

const MarkdownEditor = ({
    initialText,
    onChange = () => {},
    onKeyUp = () => {},
    fixFullHeight = false,
}: MarkdownEditorProps) => {
    const options = {
        mode: 'hypermd',
        theme: 'hypermd-dark',
        lineWrapping: true,
        tabSize: 2,
        autofocus: true,
        hmdFold: {
            image: true,
            link: true,
            math: true,
        },
        hmdHideToken: true,
        hmdCursorDebounce: true,
        hmdPaste: true,
        hmdClick: true,
        hmdHover: true,
        hmdTableAlign: true,
    };

    return (
        <ReactCodeMirror
            value={initialText}
            options={options}
            className={classNames(style.editor, { [style.fixFullHeight]: fixFullHeight })}
            onKeyUp={(_editor, event) => onKeyUp(event)}
            onUpdate={(editor) => onChange(editor.getValue())}
        />
    );
};

export default MarkdownEditor;
