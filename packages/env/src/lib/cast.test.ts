import { toArray, toBoolean } from '@directus/utils';
import { toNumber, toString } from 'lodash-es';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { getTypeFromMap } from '../utils/get-type-from-map.js';
import { guessType } from '../utils/guess-type.js';
import { getCastFlag } from '../utils/has-cast-prefix.js';
import { tryJson } from '../utils/try-json.js';
import { cast } from './cast.js';

vi.mock('@directus/utils');
vi.mock('lodash-es');
vi.mock('../utils/get-type-from-map.js');
vi.mock('../utils/guess-type.js');
vi.mock('../utils/has-cast-prefix.js');
vi.mock('../utils/try-json.js');

afterEach(() => {
	vi.clearAllMocks();
});

describe('Type extraction', () => {
	test('Uses cast flag if exists', () => {
		vi.mocked(getCastFlag).mockReturnValue('string');

		cast('key', 'value');

		expect(getCastFlag).toHaveBeenCalledWith('value');
		expect(toString).toHaveBeenCalledWith('value');
	});

	test('Uses type map entry if cast flag does not exist', () => {
		vi.mocked(getCastFlag).mockReturnValue(null);
		vi.mocked(getTypeFromMap).mockReturnValue('string');

		cast('key', 'value');

		expect(getTypeFromMap).toHaveBeenCalledWith('key');
		expect(toString).toHaveBeenCalledWith('value');
	});

	test('Uses guessed type if no flag or type map entry exist', () => {
		vi.mocked(getCastFlag).mockReturnValue(null);
		vi.mocked(getTypeFromMap).mockReturnValue(null);
		vi.mocked(guessType).mockReturnValue('string');

		cast('key', 'value');

		expect(guessType).toHaveBeenCalledWith('value');
		expect(toString).toHaveBeenCalledWith('value');
	});
});

describe('Casting', () => {
	test('Uses toString for string types', () => {
		vi.mocked(getCastFlag).mockReturnValue('string');

		vi.mocked(toString).mockReturnValue('cast-value');
		expect(cast('key', 'value')).toBe('cast-value');
	});

	test('Uses toNumber for number types', () => {
		vi.mocked(getCastFlag).mockReturnValue('number');

		vi.mocked(toNumber).mockReturnValue(123);
		expect(cast('key', 'value')).toBe(123);
	});

	test('Uses toBoolean for number types', () => {
		vi.mocked(getCastFlag).mockReturnValue('boolean');

		vi.mocked(toBoolean).mockReturnValue(false);
		expect(cast('key', 'value')).toBe(false);
	});

	test('Uses RegExp for regex types', () => {
		vi.mocked(getCastFlag).mockReturnValue('regex');
		expect(cast('key', 'value')).toBeInstanceOf(RegExp);
	});

	test('Uses toArray for array types', () => {
		vi.mocked(getCastFlag).mockReturnValue('array');

		vi.mocked(toArray).mockReturnValue([1, 2, 3]);
		expect(cast('key', 'value')).toEqual([1, 2, 3]);
	});

	test('Uses tryJson for json types', () => {
		vi.mocked(getCastFlag).mockReturnValue('json');

		vi.mocked(tryJson).mockReturnValue('cast-value');
		expect(cast('key', 'value')).toBe('cast-value');
	});
});
