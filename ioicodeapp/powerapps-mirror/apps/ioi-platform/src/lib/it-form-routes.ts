const FORM_CODE_TO_ROUTE_SLUG: Record<string, string> = {
  ASSETSUBMISSION: 'asset-submission',
  ASSET: 'asset-submission',
  DCAL: 'dcal',
  DCALOG: 'dcal',
  DRR: 'drr',
  DATAREST: 'drr',
  EAF: 'eaf',
  VPN: 'eaf',
  VPNACCESS: 'eaf',
  EDL: 'edl',
  HI: 'hi',
  HIJHR: 'hi',
  HWINVPRAI: 'hi',
  HWRR: 'hwrr',
  IAL1: 'srl',
  IAL2: 'dcal',
  IAL3: 'ite',
  IAL4: 'srvr',
  IAL5: 'drr',
  IOIP: 'ioip',
  IOIPOL: 'ioip',
  ISGDOC: 'isgdoc',
  ITDAILYRPT: 'itdr',
  ITDR: 'itdr',
  ITDR2: 'itdr2',
  ITE: 'ite',
  ITEVT: 'ite',
  ITINFO: 'itinfo',
  ITI: 'itinfo',
  ITP: 'itp',
  ITP2: 'itp',
  ITSC: 'itsc',
  ITSSR: 'itssr',
  MPSPRN: 'mpsprn',
  NIR: 'nir',
  NOTESID: 'nir',
  PRF: 'prf',
  RS: 'rs',
  PWDRESET: 'rs',
  SAPAMR: 'sapamr',
  SAPAUTH: 'sapamr',
  SAPCA: 'sapca',
  SAPACC: 'sapca',
  SAPCR: 'sapcr',
  SAPDRP: 'sapdrp',
  SAPINC: 'sap-inc',
  SAPSLCF: 'sapslcf',
  SAPSOF: 'sapsof2',
  SAPSOF2: 'sapsof2',
  SILOUATSOF: 'sapsof2',
  INTUATSOF: 'sapsof2',
  SAPTRANS: 'saptr',
  SAPTR: 'saptr',
  SFAR: 'sfar',
  SRL: 'srl',
  SRR: 'srr',
  SRVR: 'srvr',
  SVRREC: 'srvr',
  SVRREBOOT: 'srl',
  TRNMAN: 'trnman',
  UR: 'ur',
  USERID: 'ur',
};

export function normalizeITFormRouteSlug(formCode: string | null | undefined): string {
  const raw = formCode?.trim();
  if (!raw) return '';

  const upper = raw.toUpperCase();
  const compact = upper.replace(/[^A-Z0-9]/g, '');
  return FORM_CODE_TO_ROUTE_SLUG[upper] ?? FORM_CODE_TO_ROUTE_SLUG[compact] ?? raw.toLowerCase().replace(/_/g, '-');
}

export function getITFormDetailPath(
  formCode: string | null | undefined,
  id: string | number | null | undefined
): string {
  if (id === null || id === undefined || id === '') return '/it/forms';
  const slug = normalizeITFormRouteSlug(formCode);
  return slug ? `/it/forms/${slug}/detail/${id}` : '/my-submissions';
}

export function getITFormCodeAliases(formCodeOrSlug: string | null | undefined): string[] {
  const raw = formCodeOrSlug?.trim();
  if (!raw) return [];

  const normalizedSlug = normalizeITFormRouteSlug(raw);
  const rawUpper = raw.toUpperCase();
  const rawCompact = rawUpper.replace(/[^A-Z0-9]/g, '');
  const aliases = new Set<string>();

  Object.entries(FORM_CODE_TO_ROUTE_SLUG).forEach(([code, slug]) => {
    if (slug === normalizedSlug) aliases.add(code);
  });

  aliases.add(rawUpper);
  aliases.add(rawCompact);

  return Array.from(aliases).filter(Boolean);
}

export function getITFormCodeFilter(
  formCodeOrSlug: string | null | undefined,
  fieldName = 'formcode'
): string | undefined {
  const aliases = getITFormCodeAliases(formCodeOrSlug);
  if (aliases.length === 0) return undefined;
  return aliases.map((code) => `${fieldName} eq '${code.replace(/'/g, "''")}'`).join(' or ');
}
