import test from 'node:test';
import assert from 'node:assert/strict';
import { getBreadcrumbItems, serializeJsonLd } from '../src/utils/seo.ts';

test('breadcrumbs use real hubs and the displayed title', () => {
  assert.deepEqual(getBreadcrumbItems('/blog/clean-architecture-3d/', 'Arquitectura 3D | NainDev'), [
    { name: 'Inicio', item: '/' },
    { name: 'Blog', item: '/blog/' },
    { name: 'Arquitectura 3D', item: '/blog/clean-architecture-3d/' },
  ]);
});

test('breadcrumbs do not invent resource or technology landing pages', () => {
  assert.deepEqual(getBreadcrumbItems('/recursos/checklist-ia/', 'Checklist IA | NainDev'), [
    { name: 'Inicio', item: '/' },
    { name: 'Checklist IA', item: '/recursos/checklist-ia/' },
  ]);
  assert.equal(getBreadcrumbItems('/tecnologia/csharp/', 'C#')[1].item, '/tecnologia/csharp/');
  assert.deepEqual(getBreadcrumbItems('/404/', 'Página no encontrada'), []);
});

test('JSON-LD preserves text without allowing a script element to close', () => {
  const data = { headline: '</script><script>alert("test")</script>', name: 'NainDev & <3D>' };
  const encoded = serializeJsonLd(data);
  assert(!encoded.includes('<'));
  assert.deepEqual(JSON.parse(encoded), data);
});
