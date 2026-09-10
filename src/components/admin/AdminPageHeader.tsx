import { Button } from "@/components/ui/Button";

type AdminPageHeaderProps = {
  action?: {
    href: string;
    label: string;
  };
  children?: React.ReactNode;
  description?: string;
  title: string;
};

export function AdminPageHeader({
  action,
  children,
  description,
  title,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-prose text-sm text-muted">{description}</p>
        ) : null}
        {children}
      </div>
      {action ? (
        <Button href={action.href} className="min-h-10 px-4 text-xs">
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
