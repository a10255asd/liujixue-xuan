import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { xuanCoreTools, xuanPrimaryWorkflows, xuanSecondaryTools, xuanTools, xuanToolSuites } from '../lib/site.js'

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

test('tool page shell titles match site catalogue titles', () => {
  for (const tool of xuanTools) {
    const pagePath = path.join(process.cwd(), 'app', tool.href.replace(/^\//, ''), 'page.jsx')
    if (!fs.existsSync(pagePath)) continue

    const source = fs.readFileSync(pagePath, 'utf8')
    const frameTitle = source.match(/<ToolPageFrame\s+title='([^']+)'/)?.[1]

    if (frameTitle) {
      assert.equal(frameTitle, tool.title, `${tool.href} should match xuanTools title`)
    }
  }
})

test('xuan tool suites cover every online tool once', () => {
  const groupedHrefs = xuanToolSuites.flatMap(suite => suite.toolHrefs)
  const expectedHrefs = xuanTools.map(tool => tool.href).sort()

  assert.deepEqual([...new Set(groupedHrefs)].sort(), expectedHrefs)
})

test('homepage curation keeps core tools smaller than full catalogue', () => {
  const toolHrefs = new Set(xuanTools.map(tool => tool.href))
  const coreHrefs = new Set(xuanCoreTools.map(tool => tool.href))
  const secondaryHrefs = new Set(xuanSecondaryTools.map(tool => tool.href))

  assert.ok(xuanCoreTools.length < xuanTools.length)
  assert.ok(xuanCoreTools.length >= 5)
  assert.equal(coreHrefs.size, xuanCoreTools.length)
  assert.equal(secondaryHrefs.size, xuanSecondaryTools.length)

  for (const href of coreHrefs) {
    assert.ok(toolHrefs.has(href), `core tool ${href} should exist`)
    assert.equal(secondaryHrefs.has(href), false, `core tool ${href} should not also be secondary`)
  }

  assert.equal(coreHrefs.size + secondaryHrefs.size, xuanTools.length)
})

test('primary workflows point to existing tools and stay focused', () => {
  const toolHrefs = new Set(xuanTools.map(tool => tool.href))

  assert.equal(xuanPrimaryWorkflows.length, 3)

  for (const workflow of xuanPrimaryWorkflows) {
    assert.ok(toolHrefs.has(workflow.href), `${workflow.title} primary href should exist`)
    assert.ok(workflow.supportingHrefs.length <= 4, `${workflow.title} should stay curated`)
    assert.equal(workflow.checkpoints.length, 3)

    for (const href of workflow.supportingHrefs) {
      assert.ok(toolHrefs.has(href), `${workflow.title} supporting href ${href} should exist`)
    }
  }
})
