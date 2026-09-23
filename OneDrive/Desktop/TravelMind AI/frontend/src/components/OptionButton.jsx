import React from 'react';
import { Check } from 'lucide-react';

const colorStyles = {
  orange: "bg-tourOrange text-white hover:bg-[#e07b15]",
  green: "bg-tourGreen text-white hover:bg-[#6cb122]",
  blue: "bg-tourBlue text-white hover:bg-[#3497c7]",
  pink: "bg-tourPink text-white hover:bg-[#d63573]",
  purple: "bg-tourPurple text-white hover:bg-[#9637bc]",
  cyan: "bg-tourCyan text-white hover:bg-[#259f9f]",
  gold: "bg-tourGold text-textBrown hover:bg-[#e8b543]",
  cream: "bg-cream-100 text-textBrown hover:bg-cream-200"
};

export const OptionButton = ({
  label,
  icon,
  color = "orange",
  isSelected = false,
  onClick,
  subLabel,
  className = ""
}) => {
  const chosenStyle = colorStyles[color] || colorStyles.orange;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-3d w-full p-4 text-center flex flex-col items-center justify-center relative transition-transform ${chosenStyle} ${
        isSelected ? 'ring-4 ring-textBrown scale-[1.02] !shadow-[0_8px_0_#5A2B15]' : ''
      } ${className}`}
    >
      {isSelected && (
        <div className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-white text-tourOrange border-2 border-borderBrown rounded-full flex items-center justify-center shadow-[0_2px_0_#5A2B15]">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
      )}

      {icon && <div className="text-2xl mb-1.5">{icon}</div>}
      <span className="font-bold text-base sm:text-lg leading-tight">{label}</span>
      {subLabel && <span className="text-xs opacity-90 mt-1 font-medium">{subLabel}</span>}
    </button>
  );
};
