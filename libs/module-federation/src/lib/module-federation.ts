export type ResolveRemoteUrlFunction = (
  remoteName: string
) => string | Promise<string>;

declare const window: Window & { NX_MODULE_FEDERATION_SSR?: boolean };
declare const __webpack_init_sharing__: (scope: 'default') => Promise<void>;
declare const __webpack_share_scopes__: { default: unknown };

let resolveRemoteUrl: ResolveRemoteUrlFunction;
export function setRemoteUrlResolver(
  _resolveRemoteUrl: ResolveRemoteUrlFunction
) {
  resolveRemoteUrl = _resolveRemoteUrl;
}

let remoteUrlDefinitions: Record<string, string>;
export function setRemoteDefinitions(definitions: Record<string, string>) {
  remoteUrlDefinitions = definitions;
}

const remoteModuleMap = new Map<string, unknown>();
const remoteContainerMap = new Map<string, unknown>();
export async function loadRemoteModule(remoteName: string, moduleName: string) {
  const remoteModuleKey = `${remoteName}:${moduleName}`;
  if (remoteModuleMap.has(remoteModuleKey)) {
    return remoteModuleMap.get(remoteModuleKey);
  }

  const container = remoteContainerMap.has(remoteName)
    ? remoteContainerMap.get(remoteName)
    : await loadRemoteContainer(remoteName);

  const factory = await container.get(moduleName);
  const Module = factory();

  remoteModuleMap.set(remoteModuleKey, Module);

  return Module;
}

let initialSharingScopeCreated = false;
async function loadRemoteContainer(remoteName: string) {
  if (!resolveRemoteUrl && !remoteUrlDefinitions) {
    throw new Error(
      'Call setRemoteDefinitions or setRemoteUrlResolver to allow Dynamic Federation to find the remote apps correctly.'
    );
  }

  if (!initialSharingScopeCreated) {
    initialSharingScopeCreated = true;
    await __webpack_init_sharing__('default');
  }

  const containerUrl = await buildContainerUrl(remoteName);
  const container = await loadContainer(containerUrl, remoteName);
  await container.init(__webpack_share_scopes__.default);

  remoteContainerMap.set(remoteName, container);
  return container;
}

async function buildContainerUrl(remoteName: string) {
  const remoteUrlDefinition = remoteUrlDefinitions
    ? remoteUrlDefinitions[remoteName]
    : await resolveRemoteUrl(remoteName);

  let remoteUrl: string;
  if (Array.isArray(remoteUrlDefinition)) {
    remoteUrl = isBrowserPlatform()
      ? remoteUrlDefinition[0]
      : remoteUrlDefinition[1];
  } else if (typeof remoteUrlDefinition === 'string') {
    remoteUrl = remoteUrlDefinition;
  } else {
    throw new Error(
      `Remote url definition for "${remoteName}" is not a string or an array of two strings.`
    );
  }

  const extension = isBrowserPlatform() ? '.mjs' : '.js';
  const containerUrl = `${remoteUrl}${
    remoteUrl.endsWith('/') ? '' : '/'
  }remoteEntry${extension}`;

  return containerUrl;
}

function loadContainer(url: string, remoteName: string) {
  return isBrowserPlatform() ? loadModule(url) : loadScript(url, remoteName);
}

async function loadModule(url: string) {
  return await import(/* webpackIgnore:true */ url);
}

async function loadScript(url: string, remoteName: string) {
  const { default: fetch } = await import(
    /* webpackIgnore:true */ 'node-fetch'
  );
  const remoteText = await fetch(url).then((response) => response.text());

  // TODO: using vm??
  const remote = eval(
    `${remoteText}
    try {
      ${remoteName.replace(/-/g, '_')};
    } catch(e) {
      null;
    };`
  );

  return remote;
}

function isBrowserPlatform(): boolean {
  return typeof window !== 'undefined' && !window.NX_MODULE_FEDERATION_SSR;
}
