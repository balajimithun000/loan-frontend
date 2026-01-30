export default function Input({ label, type, value, onChange, ...props }) {
  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} {...props} />
    </div>
  );
}
