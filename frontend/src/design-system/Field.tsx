import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";

interface FieldWrapperProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Field({ label, hint, error, required, children, className, id }: FieldWrapperProps) {
  const cls = [
    "ds-field",
    required ? "ds-field--required" : "",
    className || ""
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls}>
      {label ? (
        <label className="ds-field__label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      {children}
      {error ? <span className="ds-field__error">{error}</span> : null}
      {!error && hint ? <span className="ds-field__hint">{hint}</span> : null}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput(props, ref) {
    return <input ref={ref} type="text" {...props} />;
  }
);

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea(props, ref) {
  return <textarea ref={ref} {...props} />;
});

export const SelectInput = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function SelectInput(props, ref) {
    return <select ref={ref} {...props} />;
  }
);
