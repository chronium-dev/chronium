import { ulid } from 'ulid';

export function createId() {
	return ulid(); // e.g. "01ARZ3NDEKTSV4RRFFQ69G5FAV"
}