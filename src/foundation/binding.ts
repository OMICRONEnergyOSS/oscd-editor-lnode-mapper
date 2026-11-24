import { compareLNodeType } from './diffing.js';
import { linkEdit, linkedLogicalNode, logicalNodeIndex } from './lnode-mapping.js';

import type { SetAttributes } from '@openscd/oscd-api';

export type TypeComparison = ReturnType<typeof compareLNodeType>;

export type BindingIssue = 'duplicate' | 'missing-target' | 'missing-types' | 'mismatch';

export type BindingStatus = {
  state: 'unbound' | 'bound' | 'warning';
  issues: BindingIssue[];
  instance?: Element;
  comparison?: TypeComparison;
};

export type CandidateAssessment = {
  candidate: Element;
  edit: SetAttributes;
  conflict?: Element;
  comparison?: TypeComparison;
};

export type BindingContext = {
  index: Map<string, Element>;
  candidates: Map<string, Element[]>;
  duplicates: Set<Element>;
  compare: (specified: Element | null, instance: Element | null) => TypeComparison | undefined;
};

// Schema key of the `xs:unique` constraint on LNode children in every
// LNode-bearing parent (SCL 2003, 2007B, 2007B4).
const keyAttributes = ['lnInst', 'lnClass', 'iedName', 'ldInst', 'prefix'] as const;
const keyDefaults: Record<string, string> = { iedName: 'None' };

function keyOf(lNode: Element, overrides: SetAttributes['attributes'] = {}): string {
  return JSON.stringify(
    keyAttributes.map((name) => {
      const value = name in overrides ? overrides[name] : lNode.getAttribute(name);
      return value ?? keyDefaults[name] ?? '';
    }),
  );
}

export function noneEdit(lNode: Element): SetAttributes {
  return { element: lNode, attributes: { iedName: 'None' }, attributesNS: {} };
}

/** Returns the sibling LNode that would share the schema key once `edit` is applied. */
export function conflictingSibling(lNode: Element, edit: SetAttributes): Element | undefined {
  const key = keyOf(lNode, edit.attributes);
  return Array.from(lNode.parentElement?.children ?? []).find(
    sibling => sibling !== lNode && sibling.localName === 'LNode' && keyOf(sibling) === key,
  );
}

/** Every LNode that currently shares its schema key with a sibling. */
export function duplicateLNodes(doc: XMLDocument): Set<Element> {
  const seen = new Map<Element, Map<string, Element>>();
  const duplicates = new Set<Element>();
  for (const lNode of Array.from(doc.querySelectorAll('LNode'))) {
    const parent = lNode.parentElement;
    if (parent === null) {
      continue;
    }
    let keys = seen.get(parent);
    if (keys === undefined) {
      keys = new Map();
      seen.set(parent, keys);
    }
    const key = keyOf(lNode);
    const first = keys.get(key);
    if (first === undefined) {
      keys.set(key, lNode);
    } else {
      duplicates.add(first);
      duplicates.add(lNode);
    }
  }
  return duplicates;
}

export function candidatesByClass(doc: XMLDocument): Map<string, Element[]> {
  const byClass = new Map<string, Element[]>();
  for (const ln of Array.from(doc.querySelectorAll(':root > IED LDevice > LN0, :root > IED LDevice > LN'))) {
    const lnClass = ln.getAttribute('lnClass');
    if (lnClass !== null) {
      byClass.set(lnClass, [...(byClass.get(lnClass) ?? []), ln]);
    }
  }
  return byClass;
}

/** Compares LNode types by id pair, caching each pair for the lifetime of the returned function. */
export function typeComparer(doc: XMLDocument): BindingContext['compare'] {
  const types = new Map<string | null, Element>(
    Array.from(doc.querySelectorAll(':root > DataTypeTemplates > LNodeType')).map(type => [
      type.getAttribute('id'),
      type,
    ]),
  );
  const cache = new Map<string, TypeComparison>();
  return (specified, instance) => {
    const specifiedType = types.get(specified?.getAttribute('lnType') ?? null);
    const instanceType = types.get(instance?.getAttribute('lnType') ?? null);
    if (specifiedType === undefined || instanceType === undefined) {
      return undefined;
    }
    const key = JSON.stringify([specifiedType.getAttribute('id'), instanceType.getAttribute('id')]);
    let comparison = cache.get(key);
    if (comparison === undefined) {
      comparison = compareLNodeType(specifiedType, instanceType);
      cache.set(key, comparison);
    }
    return comparison;
  };
}

export function bindingContext(doc: XMLDocument): BindingContext {
  return {
    index: logicalNodeIndex(doc),
    candidates: candidatesByClass(doc),
    duplicates: duplicateLNodes(doc),
    compare: typeComparer(doc),
  };
}

export function bindingStatus(lNode: Element, context: BindingContext): BindingStatus {
  const issues: BindingIssue[] = [];
  if (context.duplicates.has(lNode)) {
    issues.push('duplicate');
  }
  if (lNode.getAttribute('iedName') === 'None') {
    return { state: issues.length > 0 ? 'warning' : 'unbound', issues };
  }
  const instance = linkedLogicalNode(lNode, context.index);
  if (instance === undefined) {
    issues.push('missing-target');
    return { state: 'warning', issues };
  }
  const comparison = context.compare(lNode, instance);
  if (comparison === undefined) {
    issues.push('missing-types');
  } else if (comparison.different) {
    issues.push('mismatch');
  }
  return { state: issues.length > 0 ? 'warning' : 'bound', issues, instance, comparison };
}

/**
 * Candidates for `lNode`, those without a known problem first. A lack of
 * findings is not proof of compatibility: the comparison is directional.
 */
export function assessCandidates(lNode: Element, context: BindingContext): CandidateAssessment[] {
  const candidates = context.candidates.get(lNode.getAttribute('lnClass') ?? '') ?? [];
  const assessed: CandidateAssessment[] = [];
  for (const candidate of candidates) {
    try {
      const edit = linkEdit(lNode, candidate);
      assessed.push({
        candidate,
        edit,
        conflict: conflictingSibling(lNode, edit),
        comparison: context.compare(lNode, candidate),
      });
    } catch {
      // A candidate without a complete IED/LDevice reference cannot be bound.
    }
  }
  const rank = (a: CandidateAssessment) =>
    (a.conflict !== undefined ? 2 : 0) + (a.comparison?.different === true ? 1 : 0);
  return assessed
    .map((entry, position) => ({ entry, position }))
    .sort((a, b) => rank(a.entry) - rank(b.entry) || a.position - b.position)
    .map(({ entry }) => entry);
}
