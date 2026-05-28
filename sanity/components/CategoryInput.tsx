import { useState, useEffect } from "react";
import { useClient } from "sanity";
import { set } from "sanity";
import type { ArrayOfPrimitivesInputProps } from "sanity";

export function CategoryInput(props: ArrayOfPrimitivesInputProps) {
  const { value, onChange } = props;
  const current = (value as string[]) ?? [];
  const client = useClient({ apiVersion: "2024-01-01" });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    client
      .fetch<string[]>(`array::unique(*[_type == "project"].categories[])`)
      .then((cats) => setSuggestions((cats ?? []).filter(Boolean).sort()))
      .catch(() => {});
  }, [client]);

  function add(cat: string) {
    if (!current.includes(cat)) onChange(set([...current, cat]));
  }

  const available = suggestions.filter((s) => !current.includes(s));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {available.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingBottom: 4 }}>
          {available.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => add(cat)}
              style={{
                padding: "3px 12px",
                borderRadius: 999,
                border: "1px solid #C8C3BD",
                background: "#F5F2EE",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "system-ui, sans-serif",
                color: "#555",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = "#E8E4DE")}
              onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.background = "#F5F2EE")}
            >
              + {cat}
            </button>
          ))}
        </div>
      )}
      {props.renderDefault(props)}
    </div>
  );
}
