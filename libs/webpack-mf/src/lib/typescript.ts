import {
  getRootTsConfigPath,
  readTsConfig,
} from '@nrwl/workspace/src/utilities/typescript';
import { existsSync } from 'fs';
import { ParsedCommandLine } from 'typescript';

let tsConfig: ParsedCommandLine;
let tsPathMappings: Record<string, string[]>;
export function readTsPathMappings(
  tsConfigPath = process.env['NX_TSCONFIG_PATH'] ?? getRootTsConfigPath()
): Record<string, string[]> {
  if (!tsConfigPath) {
    throw new Error('A root tsconfig could not be found.');
  }

  if (tsPathMappings) {
    return tsPathMappings;
  }

  tsConfig ??= readTsConfiguration(tsConfigPath);
  tsPathMappings = {};
  Object.entries(tsConfig.options?.paths ?? {}).forEach(([alias, paths]) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    tsPathMappings![alias] = paths.map((path) => path.replace(/^\.\//, ''));
  });

  return tsPathMappings;
}

function readTsConfiguration(tsConfigPath: string): ParsedCommandLine {
  if (!existsSync(tsConfigPath)) {
    throw new Error(
      `NX MF: TsConfig Path for workspace libraries does not exist! (${tsConfigPath}).`
    );
  }

  return readTsConfig(tsConfigPath);
}
