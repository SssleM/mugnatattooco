import { LOGO_PATHS, LOGO_VIEWBOX } from './logo-paths';

/** The MUGNA emblem as inline SVG (inherits text colour). */
export function Emblem({ className = '', title = 'MUGNA Tattoo Co.', ...rest }) {
  return (
    <svg className={`emblem ${className}`} viewBox={LOGO_VIEWBOX} role="img" aria-label={title} {...rest}
      dangerouslySetInnerHTML={{ __html: LOGO_PATHS }} />
  );
}

/** Emblem + wordmark lockup used in the nav, footer and admin. */
export default function Logo({ sub = 'Tattoo Co.', className = '' }) {
  return (
    <span className={`brand ${className}`}>
      <Emblem className="brand-mark" title="" aria-hidden="true" />
      <span className="brand-text">
        <span className="display">Mugna</span>
        <span className="gothic">{sub}</span>
      </span>
    </span>
  );
}
