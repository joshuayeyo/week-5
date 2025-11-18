import { setupEventListeners } from './eventManager';
import { createElement } from './createElement';
import { normalizeVNode } from './normalizeVNode';

export function renderElement(vNode, container) {
  container.innerHTML = '';

  const normalizedVNode = normalizeVNode(vNode);

  const element = createElement(normalizedVNode);

  container.appendChild(element);

  setupEventListeners(container);
}
