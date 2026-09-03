import React, { useState } from 'react';
import { useLeads } from '../../hooks/useLeads';

export default function QuoteForm() {
  const { submitLead } = useLeads();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    size: 'Small (under 15k gal)',
    preferredDay: 'Tuesday',
    frequency: 'Weekly',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: '', type: '' });

    if (!formData.firstName.trim() || !formData.phone.trim()) {
      setStatus({
        message: 'Please add at least your first name and phone number.',
        type: 'error'
      });
      return;
    }

    setSubmitting(true);

    const leadPayload = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      pool_size: formData.size,
      preferred_day: formData.preferredDay,
      service_frequency: formData.frequency,
      notes: formData.notes.trim()
    };

    const res = await submitLead(leadPayload);

    if (res.success) {
      setStatus({
        message: "Thanks! We'll be in touch within one business day.",
        type: 'success'
      });
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        size: 'Small (under 15k gal)',
        preferredDay: 'Tuesday',
        frequency: 'Weekly',
        notes: ''
      });
    } else {
      setStatus({
        message: 'Something went wrong — please call or email us directly at (509) 201-3467.',
        type: 'error'
      });
    }

    setSubmitting(false);
  };

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div>
          <label htmlFor="qFirstName">First name *</label>
          <input
            id="qFirstName"
            name="firstName"
            type="text"
            placeholder="Jamie"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="qLastName">Last name</label>
          <input
            id="qLastName"
            name="lastName"
            type="text"
            placeholder="Rivera"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="qPhone">Phone *</label>
          <input
            id="qPhone"
            name="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="qEmail">Email</label>
          <input
            id="qEmail"
            name="email"
            type="email"
            placeholder="jamie@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row full">
        <div>
          <label htmlFor="qAddress">Service address</label>
          <input
            id="qAddress"
            name="address"
            type="text"
            placeholder="123 Main St, Cle Elum, WA"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="qSize">Pool and spa size</label>
          <select id="qSize" name="size" value={formData.size} onChange={handleChange}>
            <option>Small (under 15k gal)</option>
            <option>Medium (15k–25k gal)</option>
            <option>Large (25k+ gal)</option>
          </select>
        </div>
        <div>
          <label htmlFor="qDay">Preferred day</label>
          <select id="qDay" name="preferredDay" value={formData.preferredDay} onChange={handleChange}>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Friday</option>
            <option>No preference</option>
          </select>
        </div>
      </div>

      <div className="form-row full">
        <div>
          <label htmlFor="qFrequency">Service frequency</label>
          <select id="qFrequency" name="frequency" value={formData.frequency} onChange={handleChange}>
            <option>Weekly</option>
            <option>Bi-weekly</option>
          </select>
        </div>
      </div>

      <div className="form-row full">
        <div>
          <label htmlFor="qNotes">Anything we should know?</label>
          <textarea
            id="qNotes"
            name="notes"
            rows="3"
            placeholder="e.g. pool and spa haven't been serviced in 2 months, gate code, etc."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Request My Free Quote'}
      </button>

      {status.message && (
        <div className={`form-status ${status.type}`}>
          {status.message}
        </div>
      )}
    </form>
  );
}

