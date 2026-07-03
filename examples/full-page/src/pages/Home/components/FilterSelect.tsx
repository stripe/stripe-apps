import { Chip, Link, Menu, MenuItem } from "@stripe/ui-extension-sdk/ui";

export const DATE_RANGE_OPTIONS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "Last year", value: "365" },
];

type FilterSelectProps = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  const selectedLabel = value
    ? options.find((o) => o.value === value)?.label
    : undefined;

  const menuContent = options.map((opt) => (
    <MenuItem key={opt.value} id={opt.value}>
      {opt.label}
    </MenuItem>
  ));

  // No value: suggested chip (+ icon), clicking opens menu
  if (!value) {
    return (
      <Menu
        onAction={(key) => onChange(String(key))}
        trigger={
          <Link>
            <Chip label={label} />
          </Link>
        }
      >
        {menuContent}
      </Menu>
    );
  }

  // Has value: chip with X to clear
  return (
    <Chip label={label} value={selectedLabel} onClose={() => onChange("")} />
  );
}
