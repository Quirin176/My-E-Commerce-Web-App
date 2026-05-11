import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      {label && <span>{label}</span>}

      <div
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-green-500" : "bg-gray-400"
        }`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-6" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;