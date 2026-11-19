/** Heading whose lines slide up from a mask when scrolled into view. */
export default function SplitTitle({ lines, as: Tag = 'h2', className = 'section-title display', delay = 0 }) {
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span className="split-line" key={i}>
          <span style={{ '--d': `${delay + i * 0.1}s` }}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
