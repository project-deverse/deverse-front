<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
  
	export let value = '';
  
	let editor: HTMLDivElement;
	let preview: HTMLDivElement;
  
	onMount(() => {
	  // 초기값 동기화
	  editor.textContent = value;
	  renderMarkdown();
	});
  
	async function handleInput() {
	  // innerText 대신 textContent 사용 권장
	  value = editor.textContent || '';
	  await tick();
	  renderMarkdown();
	}
  
	async function renderMarkdown() {
	  if (preview) {
		const htmlText = DOMPurify.sanitize(await marked(value));
		preview.innerHTML = htmlText;
	  }
	}
  
	/**
	 * 노드/오프셋을 실제 텍스트 오프셋으로 변환하기 위한 보조 함수
	 */
	function getNormalizedOffset(node: Node, offset: number): number {
	  if (node.nodeType === Node.TEXT_NODE) {
		return offset;
	  }
	  
	  let totalOffset = 0;
	  const childNodes = node.childNodes;
	  
	  for (let i = 0; i < childNodes.length; i++) {
		const child = childNodes[i];
		if (i < offset) {
		  totalOffset += child.textContent?.length || 0;
		}
	  }
	  
	  return totalOffset;
	}
  
	/**
	 * 새로운 cursorPos에 해당하는 노드와 offset을 찾는 함수
	 */
	function findNodeAndOffset(root: Node, cursorPos: number) {
	  let accumulated = 0;
	  let targetNode: ChildNode | null = null;
	  let targetOffset = 0;
  
	  for (const child of root.childNodes) {
		const nodeLength = child.textContent?.length ?? 0;
		if (accumulated + nodeLength >= cursorPos) {
		  targetNode = child;
		  targetOffset = cursorPos - accumulated;
		  break;
		}
		accumulated += nodeLength;
	  }
	  return { targetNode, targetOffset };
	}
  
	function handleKeydown(event: KeyboardEvent) {
	  const selection = window.getSelection();
	  if (!selection?.rangeCount) return;
  
	  // 이미 존재하는 Range
	  const range = selection.getRangeAt(0);
  
	  // -- Tab 처리 --
	  if (event.key === 'Tab') {
		event.preventDefault();
  
		const text = editor.textContent || '';
		const lines = text.split('\n');
  
		// 커서의 실제 위치 계산
		let cursorOffset = 0;
		if (range.startContainer === editor) {
		  cursorOffset = getNormalizedOffset(editor, range.startOffset);
		} else {
		  let node = range.startContainer;
		  let offset = range.startOffset;
		  
		  while (node !== editor) {
			const parent = node.parentNode;
			if (!parent) break;
  
			const siblings = Array.from(parent.childNodes);
			const nodeIndex = siblings.indexOf(node as ChildNode);
  
			for (let i = 0; i < nodeIndex; i++) {
			  cursorOffset += siblings[i].textContent?.length || 0;
			}
  
			if (node.nodeType === Node.TEXT_NODE) {
			  cursorOffset += offset;
			}
  
			node = parent;
		  }
		}
  
		// 현재 라인 찾기
		let currentPos = 0;
		let currentLineIndex = -1;
  
		for (let i = 0; i < lines.length; i++) {
		  const lineLength = lines[i].length + (i < lines.length - 1 ? 1 : 0);
		  if (cursorOffset >= currentPos && cursorOffset <= currentPos + lineLength) {
			currentLineIndex = i;
			break;
		  }
		  currentPos += lineLength;
		}
  
		// 들여쓰기 적용
		if (currentLineIndex >= 0) {
		  // '-' 또는 '*' 로 시작하는 라인만 들여쓰기 (4칸)
		  if (lines[currentLineIndex].trim().startsWith('-') 
		   || lines[currentLineIndex].trim().startsWith('*')) {
			
			lines[currentLineIndex] = '    ' + lines[currentLineIndex];
  
			// 새 텍스트 생성
			const newText = lines.join('\n');
			editor.textContent = newText;
  
			// 커서 위치를 다시 계산
			const lineStartOffset = currentPos;
			const offsetInLine = cursorOffset - lineStartOffset;
			const newCursorPos = lineStartOffset + 4 + offsetInLine;
  
			// Selection 다시 설정
			selection.removeAllRanges();
			const { targetNode, targetOffset } = findNodeAndOffset(editor, newCursorPos);
			if (targetNode) {
			  const newRange = document.createRange();
			  newRange.setStart(targetNode, targetOffset);
			  newRange.setEnd(targetNode, targetOffset);
			  selection.addRange(newRange);
			}
  
			handleInput();
		  }
		}
	  }
	  // -- Enter 처리 --
	  else if (event.key === 'Enter') {
		event.preventDefault();
		
		// 현재 textContent와 커서 오프셋 계산
		const text = editor.textContent || '';
		let cursorOffset = 0;
  
		if (range.startContainer === editor) {
		  cursorOffset = getNormalizedOffset(editor, range.startOffset);
		} else {
		  let node = range.startContainer;
		  let offset = range.startOffset;
		  
		  while (node !== editor) {
			const parent = node.parentNode;
			if (!parent) break;
  
			const siblings = Array.from(parent.childNodes);
			const nodeIndex = siblings.indexOf(node as ChildNode);
  
			for (let i = 0; i < nodeIndex; i++) {
			  cursorOffset += siblings[i].textContent?.length || 0;
			}
  
			if (node.nodeType === Node.TEXT_NODE) {
			  cursorOffset += offset;
			}
  
			node = parent;
		  }
		}
  
		// 개행문자(\n) 삽입
		const newText = text.slice(0, cursorOffset) + '\n' + text.slice(cursorOffset);
		editor.textContent = newText;
  
		// 새로운 커서 위치
		const newCursorPos = cursorOffset + 1;
  
		// Selection 재설정
		selection.removeAllRanges();
		const { targetNode, targetOffset } = findNodeAndOffset(editor, newCursorPos);
		if (targetNode) {
		  const newRange = document.createRange();
		  newRange.setStart(targetNode, targetOffset);
		  newRange.setEnd(targetNode, targetOffset);
		  selection.addRange(newRange);
		}
		
		handleInput();
	  }
	}
  </script>
  
  
  <div class="markdown-editor">
	<div class="preview-wrapper">
	  <div bind:this={preview} class="preview"></div>
	</div>
	<div class="editor-wrapper">
	  <div
		bind:this={editor}
		contenteditable="true"
		on:input={handleInput}
		on:keydown={handleKeydown}
		role="textbox"
		tabindex="0"
		aria-multiline="true"
		class="editor"
		spellcheck="false"
	  ></div>
	</div>
  </div>
  