function KpiCard({ title, value, change}) {
    const isNegative = change && change.trim().startsWith('-');
    
    return (
        <div className="kpi-card">
            <h3 className="kpi-title">{title}</h3>
            <div className="kpi-value">{value}</div>
            <p className={`kpi-change ${isNegative ? 'negative' : ''}`}>
                {change}
            </p>
        </div>
    );
}

export default KpiCard;