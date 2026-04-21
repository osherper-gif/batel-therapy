import { InputHTMLAttributes } from "react";
import { Icon } from "./Icon";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export function SearchInput({ wrapperClassName, placeholder = "חיפוש...", ...rest }: Props) {
  return (
    <div className={["ds-search", wrapperClassName || ""].filter(Boolean).join(" ")}>
      <span className="ds-search__icon">
        <Icon name="search" size={18} />
      </span>
      <input type="search" placeholder={placeholder} {...rest} />
    </div>
  );
}
