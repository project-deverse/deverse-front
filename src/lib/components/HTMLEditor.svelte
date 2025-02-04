<script lang="ts">
	import { onMount } from 'svelte';
  import '$styles/editor.css';
  
	export let value = '';

	let editorRef: HTMLDivElement;

	onMount(() => {
		editorRef.innerHTML = value;
	});

	function handleInput() {
		value = editorRef.innerHTML;
	}

	function execCommand(command: string, value: string | undefined = undefined) {
		document.execCommand(command, false, value);
		editorRef.focus();
	}

	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = document.createElement('img');
				img.src = e.target?.result as string;
				img.style.maxWidth = '100%';
				editorRef.focus();
				document.execCommand('insertHTML', false, img.outerHTML);
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<div class="editor-container">
	<div class="toolbar">
		<button on:click={() => execCommand('bold')}>Bold</button>
		<button on:click={() => execCommand('italic')}>Italic</button>
		<button on:click={() => execCommand('underline')}>Underline</button>
		<button on:click={() => execCommand('insertUnorderedList')}>Bullet List</button>
		<button on:click={() => execCommand('insertOrderedList')}>Numbered List</button>
		<button on:click={() => execCommand('justifyLeft')}>Align Left</button>
		<button on:click={() => execCommand('justifyCenter')}>Align Center</button>
		<button on:click={() => execCommand('justifyRight')}>Align Right</button>
		<input type="file" accept="image/*" on:change={handleImageUpload} />
	</div>
	<div
		bind:this={editorRef}
		contenteditable="true"
		on:input={handleInput}
		class="editor-content"
	></div>
</div>