export function Header() {
    return (
        <box justifyContent="center" alignItems="flex-end">
            <box flexDirection="row" justifyContent="center" gap={1} alignItems="center">
                <ascii-font font="block" text="Dan" color="gray" />
                <ascii-font font="block" text="Code" />
            </box>
        </box>
    );
};