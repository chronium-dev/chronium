import { writable } from 'svelte/store';

export type EditMode = 'view' | 'edit' | 'saving';

export type EditableField<T> = {
	key: string;
	value: T;
	draft: T | null;
	mode: EditMode;
	error?: string;
};

type EditorState = {
	activeKey: string | null;
};

export const editorState = writable<EditorState>({
	activeKey: null
});
