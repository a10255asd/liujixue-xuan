import assert from 'node:assert/strict'
import test from 'node:test'
import { xuanTools, xuanToolSuites } from '../lib/site.js'

test('xuan tool suites reference existing tools', () => {
  const toolHrefs = new Set(xuanTools.map(tool => tool.href))

  for (const suite of xuanToolSuites) {
    assert.ok(toolHrefs.has(suite.primaryHref), `${suite.title} primary tool should exist`)
    assert.ok(suite.toolHrefs.length >= 2, `${suite.title} should expose at least two tools`)
    assert.equal(new Set(suite.toolHrefs).size, suite.toolHrefs.length, `${suite.title} should not repeat tools`)

    for (const href of suite.toolHrefs) {
      assert.ok(toolHrefs.has(href), `${suite.title} references missing tool ${href}`)
    }
  }
})

test('xuan tools expose unique page titles for tool shell lookup', () => {
  const titles = xuanTools.map(tool => tool.title)

  assert.equal(new Set(titles).size, titles.length)
})

test('xuan tool suites cover every online tool once', () => {
  const groupedHrefs = xuanToolSuites.flatMap(suite => suite.toolHrefs)
  const expectedHrefs = xuanTools.map(tool => tool.href).sort()

  assert.deepEqual([...new Set(groupedHrefs)].sort(), expectedHrefs)
})
