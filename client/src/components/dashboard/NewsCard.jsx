import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import { formatRelativeTime } from '../../utils/format.js';

export const NewsCard = ({ news = [], loading }) => (
  <Card className="h-100">
    <CardHeader title="Market news" subtitle="Latest headlines" icon="fa-newspaper" />
    <CardBody className="pt-2">
      {loading ? (
        <div className="tn-skeleton" style={{ height: 180 }} />
      ) : (
        news.map((item) => (
          <article key={item.id} className="d-flex gap-3 py-2">
            <div
              className="tn-stat-icon flex-shrink-0"
              style={{ background: 'var(--tn-primary-subtle)', color: 'var(--tn-primary)', width: 32, height: 32 }}
            >
              <i className="fa-solid fa-newspaper" style={{ fontSize: '0.75rem' }} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="small fw-semibold mb-0" style={{ color: 'var(--tn-ink)' }}>
                {item.title}
              </h3>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                {item.source} · {item.category} · {formatRelativeTime(item.publishedAt)}
              </div>
            </div>
          </article>
        ))
      )}
    </CardBody>
  </Card>
);
