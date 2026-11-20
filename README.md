# LNode Mapper

An OpenSCD editor for linking Substation LNodes to LN/LN0 instances across
the document's IEDs. Select equipment in the diagram to narrow the LNode list,
then use the link action on an unlinked LNode.

The diagram supports drag panning, wheel and keyboard zoom, and fit-to-view.
Files using the older SLD layout must first be converted in the standalone
Single Line Diagram editor. The document must already contain a Substation and
LNodes; this editor does not create them.

## Development

The shared `@omicronenergy/oscd-tooling` supplies `npm run build`, `npm test`,
`npm run lint`, `npm run bundle` and `npm start`. In the illustrative demo,
inspect the bound `CSWI1` or link `XCBR1` to the second IED (`Switchgear`) and
inspect the type differences. Until the directory is initialized as a Git
repository, install with `npm install --ignore-scripts`; the scaffold's
`prepare` script otherwise attempts to configure Git hooks.

See `worklog.md` for migration status and outstanding verification.
