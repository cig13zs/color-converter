const assert = require('assert');
const Tool = require('./core');

(async function () {
  assert.strictEqual(Tool.convert('#ff0000').rgb, 'rgb(255, 0, 0)');
  assert.strictEqual(Tool.convert('hsl(120, 100%, 50%)').hex, '#00ff00');
  assert.ok(Tool.convert('#3b82f6').oklch.startsWith('oklch('));
  console.log('ok, tool assertions passed');
})().catch(function (error) {
  console.error(error);
  process.exitCode = 1;
});
