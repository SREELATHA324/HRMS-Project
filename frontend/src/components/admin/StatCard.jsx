function StatCard({
  title,
  value,
  description,
  icon,
  trend,
}) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-top">
        <div className="admin-stat-icon">
          {icon}
        </div>

        {trend && (
          <span className="admin-stat-trend">
            {trend}
          </span>
        )}
      </div>

      <span className="admin-stat-title">
        {title}
      </span>

      <strong className="admin-stat-value">
        {value}
      </strong>

      <span className="admin-stat-description">
        {description}
      </span>
    </div>
  );
}

export default StatCard;