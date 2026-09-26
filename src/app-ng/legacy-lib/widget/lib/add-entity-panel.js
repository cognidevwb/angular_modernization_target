/*
 * Copyright © 2016-2020 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The map widget's "add entity" panel (was an `$mdPanel` with add-entity-panel.tpl.html):
 * a list of the entities that have no position yet, opened below `anchor` aligned to its
 * end edge. Clicking an entity closes the panel and calls `onClose(entity)`; a click
 * outside the panel or Escape closes it without a selection.
 */
export function openAddEntityPanel(anchor, entities, onClose) {
	const doc = anchor.ownerDocument;
	const panel = doc.createElement('div');
	panel.className = 'tb-add-entity-panel';
	panel.setAttribute('role', 'list');

	const list = doc.createElement('div');
	list.className = 'tb-add-entity-list';
	entities.forEach((entity) => {
		const item = doc.createElement('button');
		item.type = 'button';
		item.className = 'tb-add-entity-item';
		item.setAttribute('role', 'listitem');
		const label = doc.createElement('span');
		label.textContent = entity.entityLabel || entity.name;
		item.appendChild(label);
		item.addEventListener('click', () => {
			close();
			onClose(entity);
		});
		list.appendChild(item);
	});
	panel.appendChild(list);
	doc.body.appendChild(panel);

	const anchorRect = anchor.getBoundingClientRect();
	const panelRect = panel.getBoundingClientRect();
	panel.style.left = Math.max(0, anchorRect.right - panelRect.width) + 'px';
	panel.style.top = anchorRect.bottom + 'px';

	function onDocumentMouseDown(event) {
		if (!panel.contains(event.target)) {
			close();
		}
	}
	function onKeyDown(event) {
		if (event.key === 'Escape') {
			close();
		}
	}
	function close() {
		doc.removeEventListener('mousedown', onDocumentMouseDown, true);
		doc.removeEventListener('keydown', onKeyDown, true);
		panel.remove();
	}
	// Registered after the opening click has finished propagating, so it does not close the panel at once.
	setTimeout(() => {
		doc.addEventListener('mousedown', onDocumentMouseDown, true);
		doc.addEventListener('keydown', onKeyDown, true);
	});
	return { close };
}
