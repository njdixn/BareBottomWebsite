import React from 'react';
import { Link } from 'react-router-dom';

export default function PricingCard({ plan }) {
  const shortName = plan.short_name || plan.plan_name?.split(' ')[0] || 'Plan';
  const showPrice = plan.show_price !== false;

  return (
    <div className={`plan ${plan.featured ? 'featured' : ''}`}>
      {plan.featured && <span className="badge">MOST POPULAR</span>}
      <h3>{plan.plan_name}</h3>

      {showPrice ? (
        <div className="price">
          ${Number(plan.price).toFixed(0)}
          <sub>{plan.price_suffix || '/mo'}</sub>
        </div>
      ) : (
        <div className="price-custom">
          <span>Contact for Custom Quote</span>
        </div>
      )}

      <ul>
        {plan.features?.map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>

      <Link to="/#quote" className="plan-btn">
        Choose {shortName}
      </Link>
    </div>
  );
}
