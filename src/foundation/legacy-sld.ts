const legacySldNamespace = 'https://transpower.co.nz/SCL/SSD/SLD/v0';

export function hasLegacySldLayout(doc: XMLDocument): boolean {
  for (const substation of Array.from(doc.querySelectorAll(':root > Substation'))) {
    for (const element of [substation, ...Array.from(substation.querySelectorAll('*'))]) {
      if (
        element.namespaceURI === legacySldNamespace ||
        (element.localName === 'Private' && element.getAttribute('type') === 'Transpower-SLD-Vertices') ||
        Array.from(element.attributes).some(attribute => attribute.namespaceURI === legacySldNamespace)
      ) {
        return true;
      }
    }
  }
  return false;
}
