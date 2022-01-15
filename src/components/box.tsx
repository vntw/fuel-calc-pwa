import { ComponentChildren } from 'preact';

type Props = {
  header?: ComponentChildren;
  children: ComponentChildren;
  footer?: ComponentChildren;
};

export function Box({ children, header = null, footer = null }: Props) {
  return (
    <div class="flex flex-col border-t-3 border-t-red-900">
      {header && (
        <div class="px-4 py-2 font-bold text-2xl bg-black uppercase text-center">
          {header}
        </div>
      )}
      <div class="h-full flex flex-row space-x-2 items-center justify-center bg-[#0000004d] p-4 border-2 border-[#00000047] border-t-0">
        {children}
      </div>
      {footer && <div>{footer}</div>}
    </div>
  );
}
