export function Header({ title = "Fresh Salad Bar", subtitle, right }) {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-2">
      <div>
        <h1 className="text-xl font-bold text-brand-dark leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-brand-green font-medium mt-0.5">{subtitle}</p>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
