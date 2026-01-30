export default function Button({ children, type = "submit", ...props }) {
  return (
    <button type={type} className="button" {...props}>
      {children}
    </button>
  );
}
