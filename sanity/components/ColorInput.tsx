import { set } from "sanity";
import type { StringInputProps } from "sanity";

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

export function ColorInput(props: StringInputProps) {
  const { value, onChange } = props;
  const swatch = value && HEX_RE.test(value) ? value : "#000000";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <input
        type="color"
        value={swatch}
        onChange={(e) => onChange(set(e.currentTarget.value))}
        style={{
          width: 44,
          height: 36,
          padding: 2,
          border: "1px solid #C8C3BD",
          borderRadius: 6,
          background: "none",
          cursor: "pointer",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>{props.renderDefault(props)}</div>
    </div>
  );
}
