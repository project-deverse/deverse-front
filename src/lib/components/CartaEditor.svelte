<script lang="ts">
import { Carta, MarkdownEditor } from 'carta-md';
import 'carta-md/default.css';

export let value = '';
const carta = new Carta();
</script>

<MarkdownEditor bind:value {carta} placeholder="내용을 입력하세요" />

<style>
:global(.carta-font-code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 1rem;
  line-height: 1.25rem;
}
</style>
