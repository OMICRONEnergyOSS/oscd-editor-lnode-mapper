import type { SetAttributes } from '@openscd/oscd-api';

export function lNodeTitle(lNode: Element): string {
  return `${lNode.getAttribute('prefix') ?? ''}${lNode.getAttribute('lnClass')}${lNode.getAttribute('lnInst')}`;
}

export function anyLnTitle(anyLn: Element): string {
  return `${anyLn.getAttribute('prefix') ?? ''}${anyLn.getAttribute('lnClass')}${anyLn.getAttribute('inst')}`;
}

export function lNodePath(element: Element): string {
  const parent = element.parentElement;
  if (!parent || parent.tagName === 'SCL') {
    return `${element.getAttribute('name')}`;
  }
  if (element.tagName === 'LNode') {
    return lNodePath(parent);
  }
  return `${lNodePath(parent)}/${element.getAttribute('name')}`;
}

export function anyLnPath(element: Element): string {
  const parent = element.parentElement;
  if (!parent || parent.tagName === 'SCL') {
    return `${element.getAttribute('name')}`;
  }
  if (element.tagName === 'LNode' || element.tagName === 'LN' || element.tagName === 'LN0') {
    return anyLnPath(parent);
  }
  if (element.tagName === 'LDevice') {
    return `${anyLnPath(parent)} ${element.getAttribute('inst')}`;
  }
  if (element.tagName === 'IED') {
    return `${anyLnPath(parent)} ${element.getAttribute('name')}`;
  }
  return anyLnPath(parent);
}

export function matchingLogicalNodes(doc: XMLDocument, lNode: Element): Element[] {
  const lnClass = lNode.getAttribute('lnClass');
  if (!lnClass) {
    return [];
  }
  return Array.from(doc.querySelectorAll(':root > IED LDevice > LN0, :root > IED LDevice > LN'))
    .filter(ln => ln.getAttribute('lnClass') === lnClass);
}

export function logicalNodeIndex(doc: XMLDocument): Map<string, Element> {
  const index = new Map<string, Element>();
  for (const ied of Array.from(doc.querySelectorAll(':root > IED'))) {
    const name = ied.getAttribute('name');
    for (const device of Array.from(ied.querySelectorAll('LDevice'))) {
      const inst = device.getAttribute('inst');
      for (const ln of Array.from(device.querySelectorAll(':scope > LN0, :scope > LN'))) {
        const key = JSON.stringify([
          name,
          inst,
          ln.getAttribute('prefix') ?? '',
          ln.getAttribute('lnClass'),
          ln.getAttribute('inst') ?? '',
        ]);
        if (!index.has(key)) {
          index.set(key, ln);
        }
      }
    }
  }
  return index;
}

export function linkedLogicalNode(
  lNode: Element,
  index = logicalNodeIndex(lNode.ownerDocument),
): Element | undefined {
  const iedName = lNode.getAttribute('iedName');
  const ldInst = lNode.getAttribute('ldInst');
  const lnClass = lNode.getAttribute('lnClass');
  if (iedName === null || ldInst === null || lnClass === null) {
    return undefined;
  }
  return index.get(JSON.stringify([
    iedName,
    ldInst,
    lNode.getAttribute('prefix') ?? '',
    lnClass,
    lNode.getAttribute('lnInst') ?? '',
  ]));
}

export function linkEdit(lNode: Element, anyLn: Element): SetAttributes {
  const iedName = anyLn.closest('IED')?.getAttribute('name');
  const ldInst = anyLn.closest('LDevice')?.getAttribute('inst');
  const lnClass = anyLn.getAttribute('lnClass');
  if (iedName == null || ldInst == null || lnClass === null) {
    throw new Error('The selected logical node has an incomplete IED, LDevice, or LN reference.');
  }
  return {
    element: lNode,
    attributes: {
      iedName,
      ldInst,
      prefix: anyLn.getAttribute('prefix'),
      lnClass,
      lnInst: anyLn.getAttribute('inst'),
    },
    attributesNS: {},
  };
}
