import React, { useState, useEffect } from 'react';
import { useLeads } from '../../hooks/useLeads';

export default function ScheduleForm({ availability = [], selectedDate = '', onClearDate }) {
  const { submitLead } = useLeads();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    requestedDay: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, requestedDay: selectedDate }));
    }
  }, [selectedDate]);

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
      preferred_day: formData.requestedDay || 'Any available',
      notes: `[Date Request: ${formData.requestedDay || 'Unspecified'}] ${formData.notes.trim()}`.trim()
    };

    const res = await submitLead(leadPayload);

    if (res.success) {
      setStatus({
        message: "Thanks! We've received your request and will confirm availability within one business day.",
        type: 'success'
      });
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        requestedDay: '',
        notes: ''
      });
      if (onClearDate) onClearDate();
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
      <h3>Request a Service Date</h3>
      <p>Select a date from the calendar or pick a day below, and we'll confirm it's open on our route.</p>

      <div className="form-row">
        <div>
          <label htmlFor="sFirstName">First name *</label>
          <input
            id="sFirstName"
            name="firstName"
            type="text"
            placeholder="Jamie"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="sLastName">Last name</label>
          <input
            id="sLastName"
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
          <label htmlFor="sPhone">Phone *</label>
          <input
            id="sPhone"
            name="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="sEmail">Email</label>
          <input
            id="sEmail"
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
          <label htmlFor="sAddress">Service address</label>
          <input
            id="sAddress"
            name="address"
            type="text"
            placeholder="123 Main St, Cle Elum, WA"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row full">
        <div>
          <label htmlFor="sDay">Requested Date / Day</label>
          <input
            id="sDay"
            name="requestedDay"
            type="text"
            placeholder="Click a date on the calendar or type e.g. Oct 15 / Tuesdays"
            value={formData.requestedDay}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row full">
        <div>
          <label htmlFor="sNotes">Anything we should know?</label>
          <textarea
            id="sNotes"
            name="notes"
            rows="2"
            placeholder="e.g. gate code, best time to reach you"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Request This Date'}
      </button>

      {status.message && (
        <div className={`form-status ${status.type}`}>
          {status.message}
        </div>
      )}
    </form>
  );
}
