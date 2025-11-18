const eventHandlersMap = new WeakMap();

const registeredEvents = new Set();

const rootEventListeners = new WeakMap();

export function setupEventListeners(root) {
  if (!rootEventListeners.has(root)) {
    rootEventListeners.set(root, new Set());
  }

  const registeredForRoot = rootEventListeners.get(root);

  registeredEvents.forEach((eventType) => {
    if (registeredForRoot.has(eventType)) {
      return;
    }

    registeredForRoot.add(eventType);

    root.addEventListener(eventType, (event) => {
      let target = event.target;

      while (target && target !== root.parentElement) {
        const elementHandlers = eventHandlersMap.get(target);

        if (elementHandlers) {
          const handlers = elementHandlers.get(eventType);
          if (handlers) {
            handlers.forEach((handler) => {
              handler.call(target, event);
            });
          }
        }

        if (event.cancelBubble) {
          break;
        }

        target = target.parentElement;
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventHandlersMap.has(element)) {
    eventHandlersMap.set(element, new Map());
  }

  const elementHandlers = eventHandlersMap.get(element);

  if (!elementHandlers.has(eventType)) {
    elementHandlers.set(eventType, new Set());
  }

  elementHandlers.get(eventType).add(handler);

  registeredEvents.add(eventType);
}

export function removeEvent(element, eventType, handler) {
  const elementHandlers = eventHandlersMap.get(element);

  if (!elementHandlers) {
    return;
  }

  const handlers = elementHandlers.get(eventType);

  if (!handlers) {
    return;
  }

  handlers.delete(handler);

  if (handlers.size === 0) {
    elementHandlers.delete(eventType);
  }

  if (elementHandlers.size === 0) {
    eventHandlersMap.delete(element);
  }
}
