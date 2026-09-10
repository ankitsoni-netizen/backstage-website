import { Children, cloneElement, isValidElement } from "react";

export const controlClassName =
  "w-full min-h-11 border border-line bg-transparent px-3 py-2 text-base text-foreground placeholder:text-muted";

type FieldControlProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  className?: string;
  id?: string;
};

type FieldProps = {
  children: React.ReactElement<FieldControlProps>;
  error?: string;
  hint?: string;
  id: string;
  label: string;
};

export function Field({ children, error, hint, id, label }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const child = Children.only(children);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium tracking-[0.02em]">
        {label}
      </label>
      {isValidElement(child)
        ? cloneElement(child, {
            id,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
            className: [controlClassName, child.props.className]
              .filter(Boolean)
              .join(" "),
          })
        : children}
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-admin-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
