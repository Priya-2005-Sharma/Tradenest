import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import { FormField } from '../ui/FormField.jsx';

export const ProfileDetailsForm = ({
  form,
  errors,
  onChange,
  onSubmit,
  onDiscard,
  saving,
  dirty,
}) => (
  <Card>
    <CardHeader title="Personal details" icon="fa-user" />
    <CardBody>
      <form onSubmit={onSubmit} noValidate>
        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <FormField
              label="Full name"
              name="name"
              value={form.name}
              onChange={onChange}
              error={errors.name}
              autoComplete="name"
              required
            />
          </div>
          <div className="col-12 col-sm-6">
            <FormField
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              error={errors.email}
              autoComplete="email"
              hint="Changing this changes how you sign in."
              required
            />
          </div>
          <div className="col-12 col-sm-6">
            <FormField
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={onChange}
              error={errors.phone}
              autoComplete="tel"
            />
          </div>
          <div className="col-12 col-sm-6">
            <FormField
              label="Avatar URL"
              name="profileImage"
              type="url"
              value={form.profileImage}
              onChange={onChange}
              error={errors.profileImage}
              placeholder="https://…"
              hint="Link to an image."
            />
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary" disabled={saving || !dirty}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </button>
          {dirty && (
            <button type="button" className="btn btn-light" onClick={onDiscard}>
              Discard
            </button>
          )}
        </div>
      </form>
    </CardBody>
  </Card>
);
