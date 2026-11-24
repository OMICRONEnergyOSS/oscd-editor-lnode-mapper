import { compareLNodeType } from './diffing.js';
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
export declare function noneEdit(lNode: Element): SetAttributes;
/** Returns the sibling LNode that would share the schema key once `edit` is applied. */
export declare function conflictingSibling(lNode: Element, edit: SetAttributes): Element | undefined;
/** Every LNode that currently shares its schema key with a sibling. */
export declare function duplicateLNodes(doc: XMLDocument): Set<Element>;
export declare function candidatesByClass(doc: XMLDocument): Map<string, Element[]>;
/** Compares LNode types by id pair, caching each pair for the lifetime of the returned function. */
export declare function typeComparer(doc: XMLDocument): BindingContext['compare'];
export declare function bindingContext(doc: XMLDocument): BindingContext;
export declare function bindingStatus(lNode: Element, context: BindingContext): BindingStatus;
/**
 * Candidates for `lNode`, those without a known problem first. A lack of
 * findings is not proof of compatibility: the comparison is directional.
 */
export declare function assessCandidates(lNode: Element, context: BindingContext): CandidateAssessment[];
