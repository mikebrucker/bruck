/**
 * Every option map is a `Record<TValue, TValue>` keyed by the component's own
 * literal union, so a control can enumerate the values at runtime while the
 * compiler still rejects a key the component does not accept. Dropping a
 * variant from a component surfaces as a type error instead of a stale
 * dropdown entry.
 *
 * The maps themselves live in the demo that drives them. A demo that reuses
 * another component's scale imports the map from that demo.
 *
 * Prefer deriving from an exported `cva` config where one exists: a component
 * whose props intersect native element attributes (`Input`, `Textarea`) would
 * otherwise collide with the DOM `size` attribute.
 */
export type PropOptions<TValue extends string> = Record<TValue, TValue>;
