/**
 * Type definitions for diff library
 */

declare module 'diff' {
  export interface Change {
    value: string;
    added?: boolean;
    removed?: boolean;
    count?: number;
  }

  export interface ArrayChange<T> extends Change {
    value: T[];
  }

  export interface Options {
    callback?: (err: undefined, result: Change[]) => void;
    ignoreCase?: boolean;
    ignoreWhitespace?: boolean;
    newlineIsToken?: boolean;
    comparator?: (left: string, right: string) => boolean;
  }

  export function diffChars(
    oldStr: string,
    newStr: string,
    options?: Options
  ): Change[];

  export function diffWords(
    oldStr: string,
    newStr: string,
    options?: Options
  ): Change[];

  export function diffWordsWithSpace(
    oldStr: string,
    newStr: string,
    options?: Options
  ): Change[];

  export function diffLines(
    oldStr: string,
    newStr: string,
    options?: Options
  ): Change[];

  export function diffTrimmedLines(
    oldStr: string,
    newStr: string,
    options?: Options
  ): Change[];

  export function diffSentences(
    oldStr: string,
    newStr: string,
    options?: Options
  ): Change[];

  export function diffCss(
    oldStr: string,
    newStr: string,
    options?: Options
  ): Change[];

  export function diffJson(
    oldObj: any,
    newObj: any,
    options?: Options
  ): Change[];

  export function diffArrays<T>(
    oldArr: T[],
    newArr: T[],
    options?: Options
  ): ArrayChange<T>[];

  export function createTwoFilesPatch(
    oldFileName: string,
    newFileName: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string,
    options?: Options
  ): string;

  export function createPatch(
    fileName: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string,
    options?: Options
  ): string;

  export function structuredPatch(
    oldFileName: string,
    newFileName: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string,
    options?: Options
  ): {
    oldFileName: string;
    newFileName: string;
    oldHeader: string;
    newHeader: string;
    hunks: Array<{
      oldStart: number;
      oldLines: number;
      newStart: number;
      newLines: number;
      lines: string[];
    }>;
  };

  export function applyPatch(
    source: string,
    patch: string | Array<any>,
    options?: {
      fuzzFactor?: number;
      compareLine?: (
        lineNumber: number,
        line: string,
        operation: string,
        patchContent: string
      ) => boolean;
    }
  ): string | false;

  export function applyPatches(
    patch: Array<any>,
    options?: {
      loadFile?: (
        index: any,
        callback: (err: any, data: string) => void
      ) => void;
      patched?: (index: any, content: string, callback: (err: any) => void) => void;
      complete?: (err: any) => void;
    }
  ): void;

  export function parsePatch(uniDiff: string): Array<{
    oldFileName: string;
    newFileName: string;
    oldHeader: string;
    newHeader: string;
    hunks: Array<{
      oldStart: number;
      oldLines: number;
      newStart: number;
      newLines: number;
      lines: string[];
    }>;
  }>;

  export function convertChangesToDMP(changes: Change[]): Array<[number, string]>;

  export function convertChangesToXML(changes: Change[]): string;

  export function canonicalize(obj: any): string;
}
