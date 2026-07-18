/** A marketing page section with an optional centred heading block. */
export const Section = ({ alt = false, eyebrow, title, lead, children, className = '' }) => (
  <section className={`tn-section ${alt ? 'tn-section-alt' : ''} ${className}`}>
    <div className="container">
      {(eyebrow || title || lead) && (
        <div className="text-center mb-5">
          {eyebrow && <span className="tn-eyebrow mb-3">{eyebrow}</span>}
          {title && <h2 className="mb-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>{title}</h2>}
          {lead && <p className="tn-lead mx-auto mb-0" style={{ maxWidth: 620 }}>{lead}</p>}
        </div>
      )}
      {children}
    </div>
  </section>
);
