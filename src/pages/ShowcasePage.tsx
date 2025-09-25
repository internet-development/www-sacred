/**
 * ShowcasePage — a lightweight, optional "homepage" showcase you can ship with SRCL.
 *
 * What it is:
 * - A small, dependency-light page that demonstrates common SRCL components together.
 * - Safe to include in your package as an optional export for demos/docs/playgrounds.
 *
 * How to use:
 *   1) Import global styles once in your app (recommended):
 *        import 'srcl/global.css';
 *   2) Import and render the page:
 *        import ShowcasePage from 'srcl/pages/ShowcasePage';
 *        export default function App() {
 *          return <ShowcasePage title="My App" version="1.0.0" />;
 *        }
 *
 * How to avoid bundling it (if you don't want it):
 * - Simply do not import 'srcl/pages/ShowcasePage' (or any alias like 'srcl/ShowcasePage').
 * - Prefer subpath imports elsewhere (e.g., 'srcl/components/Button'); modern bundlers will not include
 *   modules you don't import thanks to ESM tree-shaking and our subpath exports setup.
 * - If you code split your app routes, you can optionally lazy-load it only in a docs route:
 *      const ShowcasePage = React.lazy(() => import('srcl/pages/ShowcasePage'));
 *      // This keeps it out of the main bundle.
 */

import * as React from 'react';

// Keep imports minimal to avoid pulling the entire kitchen sink.
// These are widely used, stable UI atoms and layout primitives.
import Grid from '@components/Grid';
import Row from '@components/Row';
import Card from '@components/Card';
import Button from '@components/Button';
import Text from '@components/Text';
import Badge from '@components/Badge';
import ActionListItem from '@components/ActionListItem';

type ShowcaseLink = {
  label: string;
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
};

type ShowcaseAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
};

export interface ShowcasePageProps {
  title?: React.ReactNode;
  version?: string;
  tagline?: React.ReactNode;
  description?: React.ReactNode;
  links?: ShowcaseLink[];
  actions?: ShowcaseAction[];
  children?: React.ReactNode;
}

const fallbackLinks: ShowcaseLink[] = [
  { label: 'SRCL Source', href: 'https://github.com/internet-development/www-sacred', target: '_blank' },
  { label: 'Studio', href: 'https://internet.dev', target: '_blank' },
];

const ShowcasePage: React.FC<ShowcasePageProps> = ({
  title = 'SRCL Showcase',
  version,
  tagline = 'A minimal page demonstrating common SRCL components.',
  description = (
    <>
      This page stays intentionally small and focuses on a few core components: Grid, Row, Card, Text, Badge, and Button.
      Add or remove sections below to fit your own docs or demos.
    </>
  ),
  links = fallbackLinks,
  actions,
  children,
}) => {
  return (
    <main style={{ padding: 16 }}>
      <Grid>
        <Row style={{ alignItems: 'center', gap: 8 }}>
          <Text>{title}</Text>
          {version ? <Badge>{version}</Badge> : null}
        </Row>
        {tagline ? (
          <Row>
            <Text>{tagline}</Text>
          </Row>
        ) : null}
      </Grid>

      {description ? (
        <Grid>
          <Card style={{ padding: 16 }}>
            <Text>{description}</Text>
          </Card>
        </Grid>
      ) : null}

      {Array.isArray(links) && links.length > 0 ? (
        <Grid>
          {links.map((link) => (
            <ActionListItem key={`${link.label}:${link.href}`} href={link.href} target={link.target} icon="⭢">
              {link.label}
            </ActionListItem>
          ))}
        </Grid>
      ) : null}

      {Array.isArray(actions) && actions.length > 0 ? (
        <Grid>
          <Row style={{ gap: 8, flexWrap: 'wrap' }}>
            {actions.map((a) =>
              a.href ? (
                <a key={a.label} href={a.href} target={a.target} rel={a.target === '_blank' ? 'noreferrer' : undefined}>
                  <Button>{a.label}</Button>
                </a>
              ) : (
                <Button key={a.label} onClick={a.onClick}>
                  {a.label}
                </Button>
              )
            )}
          </Row>
        </Grid>
      ) : null}

      {/* Consumer-provided extra content (optional) */}
      {children ? (
        <Grid>
          <Card style={{ padding: 16 }}>{children}</Card>
        </Grid>
      ) : null}

      <Grid>
        <Row style={{ marginTop: 24 }}>
          <Text style={{ opacity: 0.7 }}>
            Tip: Import only what you use from SRCL subpaths (e.g., `srcl/components/Button`) for best tree-shaking.
          </Text>
        </Row>
      </Grid>
    </main>
  );
};

export default ShowcasePage;
