/**
 * Index of the first element whose bottom edge sits below `line` — the element the line runs
 * through. Elements are expected in DOM order, so the predicate is monotonic and a binary search
 * holds. Measures live rects rather than cached offsets because content can resize at any time.
 */
export function indexUnderLine(elements: Array<HTMLElement | undefined>, line: number) {
  let low = 0;
  let high = elements.length - 1;
  let found = high;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const element = elements[mid];

    if (!element) break;

    if (element.getBoundingClientRect().bottom > line) {
      found = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return found;
}
