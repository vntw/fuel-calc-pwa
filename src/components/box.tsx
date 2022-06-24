import { ComponentChildren } from 'preact';

type Props = {
  header?: ComponentChildren;
  footer?: ComponentChildren;
  secondary?: boolean;
  children: ComponentChildren;
};

export function Box({
  children,
  secondary = false,
  header = null,
  footer = null,
}: Props) {
  return (
    <div
      class={`flex flex-col border-t-3 ${
        secondary ? 'border-t-zinc-800' : 'border-t-red-900'
      }`}
    >
      {header && (
        <div class="bg-black px-4 py-2 text-center text-2xl font-bold uppercase">
          {header}
        </div>
      )}
      <div class="flex h-full flex-row items-center justify-center space-x-2 border-2 border-t-0 border-[#00000047] bg-[#0000004d] p-4">
        {children}
      </div>
      {footer && <div>{footer}</div>}
    </div>
  );
}
