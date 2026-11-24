import type { SetAttributes } from '@openscd/oscd-api';
export declare function lNodeTitle(lNode: Element): string;
export declare function anyLnTitle(anyLn: Element): string;
export declare function lNodePath(element: Element): string;
export declare function anyLnPath(element: Element): string;
export declare function logicalNodeIndex(doc: XMLDocument): Map<string, Element>;
export declare function linkedLogicalNode(lNode: Element, index?: Map<string, Element>): Element | undefined;
export declare function linkEdit(lNode: Element, anyLn: Element): SetAttributes;
