export function PrimaryButton({ children, onClick, disabled, variant = "green", className = "" }) {
  const variants = {
    green: "bg-brand-green text-white active:bg-brand-dark",
    lime: "bg-brand-lime text-white active:bg-brand-green",
    gold: "bg-brand-gold text-brand-dark active:bg-yellow-500",
    orange: "bg-brand-orange text-white active:bg-orange-600",
    red: "bg-brand-red text-white active:bg-red-700",
    outline: "border-2 border-brand-green text-brand-green bg-white active:bg-brand-cream",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed select-none
        ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
