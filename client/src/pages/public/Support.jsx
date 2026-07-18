import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Card, CardBody } from '../../components/ui/Card.jsx';
import { FormField } from '../../components/ui/FormField.jsx';

const CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting started',
    icon: 'fa-rocket',
    blurb: 'Accounts, virtual capital, and finding your way around.',
    faqs: [
      {
        q: 'How do I open an account?',
        a: 'Use the Open an account link, enter your name, email, and a password, and you are in. There is no verification step, no document upload, and no payment details — this is a demonstration platform, not a regulated brokerage.',
      },
      {
        q: 'Where does my starting balance come from?',
        a: 'Every new account is issued virtual capital by the app itself. It is not real money and cannot be withdrawn to a bank. You can top it up at any time from the Funds page.',
      },
      {
        q: 'Are the prices I see real?',
        a: 'No. Quotes come from a simulated market feed that moves on an interval. They do not reflect real exchange prices for any listed company, and no outcome in TradeNest predicts a real investment result.',
      },
      {
        q: 'Where should I start?',
        a: 'Add a few symbols to your Watchlist, place a market order, then open the Dashboard. Seeing day P&L and overall P&L move against a position you actually placed is the fastest way to understand the platform.',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders & trading',
    icon: 'fa-receipt',
    blurb: 'Order types, fills, cancellations, and holdings.',
    faqs: [
      {
        q: 'What order types can I place?',
        a: 'Market and limit. A market order fills immediately against the simulated last-traded price. A limit order rests as pending until the simulated price reaches your limit, at which point it executes.',
      },
      {
        q: 'What do the order statuses mean?',
        a: 'Pending means the order is live but unfilled. Executed means it filled. Cancelled means you withdrew it before it filled. Rejected means it failed validation — most often insufficient funds or a quantity you do not hold.',
      },
      {
        q: 'Can I cancel an order?',
        a: 'Any order still in pending status can be cancelled from the Orders page. Once an order is executed it cannot be reversed — you would place an opposing order instead.',
      },
      {
        q: 'How is my average cost calculated?',
        a: 'Buying the same symbol more than once blends into a single average cost basis, weighted by quantity. That average is what unrealised P&L on the holding is measured against.',
      },
      {
        q: 'Why was my order rejected?',
        a: 'The usual causes are not enough available funds to cover a buy, or trying to sell more units than you hold. The Orders page shows the reason on the rejected row.',
      },
    ],
  },
  {
    id: 'funds',
    title: 'Funds',
    icon: 'fa-wallet',
    blurb: 'Deposits, withdrawals, and your transaction history.',
    faqs: [
      {
        q: 'How do I add funds?',
        a: 'Go to Funds and use Deposit. The balance updates immediately. No payment method is involved and nothing is charged — the funds are virtual capital created by the app.',
      },
      {
        q: 'Do deposits count as profit?',
        a: 'No, and this is deliberate. Adding funds increases your balance but never touches your P&L or the growth chart. Performance and cash flow are kept strictly separate.',
      },
      {
        q: 'Can I withdraw?',
        a: 'You can withdraw against your available balance within the app, which reduces your buying power and appears in your transaction history. Nothing leaves the platform — there is no bank connection.',
      },
      {
        q: 'Where can I see past transactions?',
        a: 'The Funds page keeps a full record of every deposit, withdrawal, and trade settlement, with timestamps.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & security',
    icon: 'fa-shield-halved',
    blurb: 'Sign-in, sessions, and how your data is handled.',
    faqs: [
      {
        q: 'How does sign-in work?',
        a: 'Logging in issues a JWT that is stored in an HTTP-only cookie, so page scripts cannot read it. Passwords are hashed with bcrypt and are never stored in readable form.',
      },
      {
        q: 'I forgot my password.',
        a: 'Password reset is not implemented in this demonstration build. Since accounts hold only virtual capital, the practical answer is to register a new one.',
      },
      {
        q: 'Can I delete my account?',
        a: 'There is no self-serve deletion in this build. Email the address below and it can be removed manually.',
      },
      {
        q: 'How safe is my data here?',
        a: 'Reasonable practices are in place — hashed passwords, HTTP-only cookies, server-side validation — but this is a portfolio project, not audited production infrastructure. Please do not enter sensitive personal information or reuse a password from another service.',
      },
    ],
  },
];

const RESPONSE_TIMES = [
  { icon: 'fa-envelope', channel: 'Email', detail: 'help@tradenest.app', time: 'Within 2 working days' },
  { icon: 'fa-phone', channel: 'Phone', detail: '1800 200 4000', time: 'Mon–Fri, 9:00–18:00 IST' },
  { icon: 'fa-bolt', channel: 'Priority queue', detail: 'Active & Institutional plans', time: 'Within 1 working day' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Support = () => {
  useDocumentTitle('Support');

  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ name: '', email: '', topic: 'getting-started', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitted(false);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter your name.';
    if (!form.email.trim()) {
      next.email = 'Enter your email address.';
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.message.trim()) next.message = 'Tell us what you need help with.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) {
      setSubmitted(false);
      return;
    }
    // There is no contact endpoint on the API, so nothing is sent anywhere. The
    // confirmation below says exactly that rather than faking a delivery.
    setSubmitted(true);
    setForm({ name: '', email: '', topic: 'getting-started', message: '' });
  };

  // Filter across category titles, questions, and answers.
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return CATEGORIES;
    return CATEGORIES.map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(term) ||
          faq.a.toLowerCase().includes(term) ||
          category.title.toLowerCase().includes(term),
      ),
    })).filter((category) => category.faqs.length > 0);
  }, [query]);

  const matchCount = results.reduce((total, category) => total + category.faqs.length, 0);

  return (
    <div className="tn-fade-in">
      <section className="tn-hero">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <span className="tn-eyebrow mb-3">
                <i className="fa-solid fa-life-ring" aria-hidden="true" />
                Help centre
              </span>
              <h1 className="tn-display mb-3">How can we help?</h1>
              <p className="tn-lead mb-4">
                Search the answers below, or get in touch. Most questions about TradeNest come down to
                one thing: it is a demonstration platform running on simulated data.
              </p>

              <div className="row justify-content-center">
                <div className="col-md-8">
                  <label htmlFor="support-search" className="visually-hidden">
                    Search help articles
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
                    </span>
                    <input
                      id="support-search"
                      type="search"
                      className="form-control"
                      placeholder="Search for orders, funds, passwords…"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>
                  {query.trim() && (
                    <p className="small mt-2 mb-0" style={{ color: 'var(--tn-muted)' }} role="status">
                      {matchCount} {matchCount === 1 ? 'answer' : 'answers'} matching &ldquo;
                      {query.trim()}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tn-section tn-section-alt">
        <div className="container">
          {results.length === 0 ? (
            <div className="tn-empty">
              <div className="tn-empty-icon">
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              </div>
              <h2 className="h6 mb-2">No answers matched that search</h2>
              <p className="small mb-3" style={{ color: 'var(--tn-muted)' }}>
                Try a broader term, or send us a message using the form below.
              </p>
              <button type="button" className="btn btn-outline-primary" onClick={() => setQuery('')}>
                Clear search
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {results.map((category) => (
                <div className="col-12 col-lg-6" key={category.id}>
                  <Card className="h-100">
                    <CardBody>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="tn-feature-icon mb-0 flex-shrink-0">
                          <i className={`fa-solid ${category.icon}`} aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="h6 mb-1">{category.title}</h2>
                          <p className="small mb-0" style={{ color: 'var(--tn-muted)' }}>
                            {category.blurb}
                          </p>
                        </div>
                      </div>

                      <dl className="mb-0">
                        {category.faqs.map((faq) => (
                          <div className="mb-3" key={faq.q}>
                            <dt className="small fw-semibold" style={{ color: 'var(--tn-ink)' }}>
                              {faq.q}
                            </dt>
                            <dd className="small mb-0 mt-1" style={{ color: 'var(--tn-muted)' }}>
                              {faq.a}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="tn-section">
        <div className="container">
          <div className="row g-4 g-lg-5">
            <div className="col-lg-5">
              <h2 className="h3 mb-3">Get in touch</h2>
              <p className="mb-4" style={{ color: 'var(--tn-muted)' }}>
                If the answers above did not cover it, email is the most reliable way to reach a
                human.
              </p>

              <Card className="mb-4">
                <CardBody>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                    <li className="d-flex gap-3">
                      <i
                        className="fa-solid fa-envelope mt-1"
                        style={{ color: 'var(--tn-primary)' }}
                        aria-hidden="true"
                      />
                      <div>
                        <div className="small fw-semibold" style={{ color: 'var(--tn-ink)' }}>
                          Email
                        </div>
                        <a className="small" href="mailto:help@tradenest.app">
                          help@tradenest.app
                        </a>
                      </div>
                    </li>
                    <li className="d-flex gap-3">
                      <i
                        className="fa-solid fa-phone mt-1"
                        style={{ color: 'var(--tn-primary)' }}
                        aria-hidden="true"
                      />
                      <div>
                        <div className="small fw-semibold" style={{ color: 'var(--tn-ink)' }}>
                          Phone
                        </div>
                        <a className="small tn-num" href="tel:+9118002004000">
                          1800 200 4000
                        </a>
                        <div className="small" style={{ color: 'var(--tn-muted)' }}>
                          Mon–Fri, 9:00–18:00 IST
                        </div>
                      </div>
                    </li>
                    <li className="d-flex gap-3">
                      <i
                        className="fa-solid fa-location-dot mt-1"
                        style={{ color: 'var(--tn-primary)' }}
                        aria-hidden="true"
                      />
                      <div>
                        <div className="small fw-semibold" style={{ color: 'var(--tn-ink)' }}>
                          Office
                        </div>
                        <div className="small" style={{ color: 'var(--tn-muted)' }}>
                          Bengaluru, Karnataka, India
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardBody>
              </Card>

              <h3 className="h6 mb-3">Expected response times</h3>
              <div className="tn-table-wrap">
                <table className="tn-table">
                  <caption className="visually-hidden">Expected response times by channel</caption>
                  <thead>
                    <tr>
                      <th scope="col">Channel</th>
                      <th scope="col">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESPONSE_TIMES.map((row) => (
                      <tr key={row.channel}>
                        <th scope="row" className="fw-semibold">
                          <span className="d-inline-flex align-items-center gap-2">
                            <i
                              className={`fa-solid ${row.icon}`}
                              style={{ color: 'var(--tn-faint)' }}
                              aria-hidden="true"
                            />
                            <span>
                              <span className="tn-symbol">{row.channel}</span>
                              <span className="d-block fw-normal" style={{ color: 'var(--tn-muted)' }}>
                                {row.detail}
                              </span>
                            </span>
                          </span>
                        </th>
                        <td>{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-7">
              <Card>
                <CardBody className="p-4">
                  <h2 className="h5 mb-1">Send us a message</h2>
                  <p className="small mb-4" style={{ color: 'var(--tn-muted)' }}>
                    Fields marked with an asterisk are required.
                  </p>

                  {submitted && (
                    <div className="alert alert-success d-flex gap-3 small" role="status">
                      <i className="fa-solid fa-circle-info mt-1" aria-hidden="true" />
                      <div>
                        <strong className="d-block mb-1">
                          Your message was not actually sent.
                        </strong>
                        TradeNest is a demonstration project and has no contact endpoint behind this
                        form, so nothing was transmitted or stored. To reach a real person, email{' '}
                        <a href="mailto:help@tradenest.app">help@tradenest.app</a> directly — your
                        message would be very welcome there.
                      </div>
                    </div>
                  )}

                  <form onSubmit={submit} noValidate>
                    <div className="row">
                      <div className="col-md-6">
                        <FormField
                          label="Your name"
                          name="name"
                          value={form.name}
                          onChange={onChange}
                          error={errors.name}
                          autoComplete="name"
                          placeholder="Priya Sharma"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <FormField
                          label="Email address"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={onChange}
                          error={errors.email}
                          autoComplete="email"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <FormField label="Topic" name="topic">
                      <select
                        id="field-topic"
                        name="topic"
                        className="form-select"
                        value={form.topic}
                        onChange={onChange}
                      >
                        {CATEGORIES.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.title}
                          </option>
                        ))}
                        <option value="other">Something else</option>
                      </select>
                    </FormField>

                    <FormField
                      label="Message"
                      name="message"
                      error={errors.message}
                      hint="The more specific you are, the more useful the answer."
                      required
                    >
                      <textarea
                        id="field-message"
                        name="message"
                        rows={6}
                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                        value={form.message}
                        onChange={onChange}
                        placeholder="What can we help you with?"
                        aria-describedby={errors.message ? 'field-message-error' : 'field-message-hint'}
                        aria-invalid={Boolean(errors.message)}
                        required
                      />
                    </FormField>

                    <button type="submit" className="btn btn-primary btn-lg w-100 mt-2">
                      Send message
                    </button>
                  </form>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="tn-section tn-section-alt">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-7">
              <h2 className="h3 mb-3">Still curious?</h2>
              <p className="tn-lead mb-4">
                The fastest way to understand TradeNest is to use it. It is free and takes a minute.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Open a demo account
                </Link>
                <Link to="/about" className="btn btn-outline-primary btn-lg">
                  Read about the project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
